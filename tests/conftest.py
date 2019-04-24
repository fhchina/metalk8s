import pathlib

import pytest
from pytest_bdd import given, then


# Pytest command-line options
def pytest_addoption(parser):
    parser.addoption(
        "--iso-root",
        action="store",
        default="_build/root",
        type=pathlib.Path,
        help="Root of the ISO file tree."
    )

# Given {{{

@given("the Kubernetes API is available")
def check_service(host):
    _verify_kubeapi_service(host)


# }}}
# Then {{{

@then("the Kubernetes API is available")
def verify_kubeapi_service(host):
    _verify_kubeapi_service(host)

# }}}
# Helpers {{{

def _verify_kubeapi_service(host):
    """Verify that the kubeapi service answer"""
    with host.sudo():
        cmd = "kubectl --kubeconfig=/etc/kubernetes/admin.conf cluster-info"
        retcode = host.run(cmd).rc
        assert retcode == 0


# }}}
