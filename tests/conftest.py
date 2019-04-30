import pathlib

import kubernetes as k8s
import pytest
from pytest_bdd import given, parsers, then
import yaml

from tests import kube_utils
from tests import utils


# Pytest command-line options
def pytest_addoption(parser):
    parser.addoption(
        "--iso-root",
        action="store",
        default="_build/root",
        type=pathlib.Path,
        help="Root of the ISO file tree."
    )

# Fixtures {{{

@pytest.fixture(scope="module")
def version(request, host):
    iso_root = request.config.getoption("--iso-root")
    product_path = iso_root / "product.txt"
    with host.sudo():
        return host.check_output(
            'source %s && echo $SHORT_VERSION', str(product_path)
        )

@pytest.fixture(scope="module")
def kubeconfig_data(request, host):
    """Fixture to generate a kubeconfig file for remote usage."""
    with host.sudo():
        kubeconfig_file = host.file('/etc/kubernetes/admin.conf')
        if not kubeconfig_file.exists:
            pytest.skip(
                "Must be run on bootstrap node, or have an existing file at "
                "/etc/kubernetes/admin.conf"
            )
        return yaml.safe_load(kubeconfig_file.content_string)


@pytest.fixture
def kubeconfig(kubeconfig_data, tmp_path):
    kubeconfig_path = tmp_path / "admin.conf"
    kubeconfig_path.write_text(yaml.dump(kubeconfig_data), encoding='utf-8')
    return str(kubeconfig_path)  # Need Python 3.6 to open() a Path object


@pytest.fixture
def k8s_client(kubeconfig):
    k8s.config.load_kube_config(config_file=kubeconfig)
    return k8s.client.CoreV1Api()


# }}}
# Given {{{

@given("the Kubernetes API is available")
def check_service(host):
    _verify_kubeapi_service(host)


# }}}
# Then {{{

@then("the Kubernetes API is available")
def verify_kubeapi_service(host):
    _verify_kubeapi_service(host)


@then(parsers.parse(
    "we have {pods_count:d} running pod labeled '{label}' on node '{node}'"
))
def count_running_pods(k8s_client, pods_count, label, node):
    def _check_pods_count():
        pods = kube_utils.get_pods(
            k8s_client, label, node, namespace="kube-system", state="Running",
        )
        assert len(pods) == pods_count

    utils.retry(_check_pods_count, times=10, wait=3)


# }}}
# Helpers {{{

def _verify_kubeapi_service(host):
    """Verify that the kubeapi service answer"""
    with host.sudo():
        cmd = "kubectl --kubeconfig=/etc/kubernetes/admin.conf cluster-info"
        retcode = host.run(cmd).rc
        assert retcode == 0


# }}}
