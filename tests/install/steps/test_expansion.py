import pathlib
import string

from pytest_bdd import scenario, then, parsers, when
import testinfra
import kubernetes as k8s
import yaml

# Scenarios
@scenario('../features/expansion.feature', 'Add one node to the cluster')
def test_cluster_expansion(host):
    pass

# When {{{

@when(parsers.parse('we declare a new node on host "{hostname}"'))
def declare_node(request, k8s_client, hostname):
    """Declare the given node in Kubernetes."""
    ssh_config = request.config.getoption('--ssh-config')
    node_ip = get_node_ip(hostname, ssh_config)
    node_manifest = get_node_manifest(node_ip)
    k8s_client.create_node(body=node_from_manifest(node_manifest))

# }}}
# Then {{{

@then(parsers.parse('node "{hostname}" is registered in Kubernetes'))
def check_node_is_registered(k8s_client, hostname):
    """Check if the given node is registered in Kubernetes."""
    selector = 'metadata.name=={}'.format(hostname)
    nodes = k8s_client.list_node(field_selector=selector).items
    assert len(nodes) <= 1, 'too many nodes with hostname `{}`'.format(hostname)
    assert len(nodes) == 1, '`{}` not registered in Kubernetes'.format(hostname)


# }}}
# Helpers {{{

def get_node_ip(hostname, ssh_config):
    """Return the IP of the node `hostname`.

    We have to jump through hoops because `testinfra` does not provide a simple
    way to get this information…
    """
    infra_node = testinfra.get_host(hostname, ssh_config=ssh_config)
    return infra_node.backend.client.get_transport().getpeername()[0]


def get_node_manifest(node_ip):
    """Return the YAML to declare a node with the specified IP."""
    filepath = (pathlib.Path(__file__)/'..'/'files'/'node.yaml.tpl').resolve()
    manifest = filepath.read_text(encoding='utf-8')
    return string.Template(manifest).substitute(node_ip=node_ip)

def node_from_manifest(manifest):
    """Create V1Node object from a YAML manifest."""
    manifest = yaml.safe_load(manifest)
    manifest['api_version'] = manifest.pop('apiVersion')
    return k8s.client.V1Node(**manifest)

# }}}
