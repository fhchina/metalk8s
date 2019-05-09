'''
A renderer for Kubernetes YAML manifests

Given a Kubernetes YAML file (which may be a stream of objects, i.e. YAML
snippets separated by `---` lines), this will render an SLS which calls Salt
`*_present` states for every such object.

To use it, add a shebang like `#!kubernetes` as the first line of your manifests
SLS file. Optionally, you can use rendering pipelines (if templating is
required), e.g. `#!jinja | kubernetes`.
'''

import yaml

import salt.utils.yaml
from salt.utils.odict import OrderedDict

from salt.ext import six

__virtualname__ = 'kubernetes'


def __virtual__():
    return __virtualname__


def _step_name(obj):
    namespace = obj['metadata'].get('namespace')

    if namespace:
        name = '{}/{}'.format(
            namespace,
            obj['metadata']['name'],
        )
    else:
        name = obj['metadata']['name']

    return "Apply {}/{} '{}'".format(
        obj['apiVersion'],
        obj['kind'],
        name,
    )


_HANDLERS = {}

def handle(api_version, kind):
    '''
    Register a 'handler' (object -> state mapping) for `apiVersion` and `kind`
    '''
    tag = (api_version, kind)

    def register(f):
        assert tag not in _HANDLERS

        _HANDLERS[tag] = f

        return f

    return register


@handle('v1', 'ServiceAccount')
def _handle_v1_serviceaccount(obj):
    return {
        'metalk8s_kubernetes.serviceaccount_present': [
            {'name': obj['metadata']['name']},
            {'namespace': obj['metadata']['namespace']},
        ],
    }


del handle


def _step(obj):
    '''
    Handle a single Kubernetes object, rendering it into a state 'step'
    '''
    name = _step_name(obj)
    api_version = obj['apiVersion']
    kind = obj['kind']

    handler = _HANDLERS.get((api_version, kind))
    if not handler:
        raise ValueError('No handler for {}/{}'.format(api_version, kind))

    state = handler(obj)

    return (name, state)


def render(yaml_data, saltenv='', sls='', **kwargs):
    if not isinstance(yaml_data, six.string_types):
        yaml_data = yaml_data.read()

    data = yaml.load_all(yaml_data, Loader=salt.utils.yaml.SaltYamlSafeLoader)

    return OrderedDict(_step(obj) for obj in data if obj)