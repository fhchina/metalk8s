import json


def get_pods(
    k8s_client, label, node='bootstrap', namespace='default', state='Running'
):
    """Return the pod `component` from the specified node"""
    field_selector = 'spec.nodeName={},status.phase={}'.format(node, state)
    return k8s_client.list_namespaced_pod(
        namespace, field_selector=field_selector, label_selector=label
    ).items
