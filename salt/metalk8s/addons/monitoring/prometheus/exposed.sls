{%- set kubeconfig = "/etc/kubernetes/admin.conf" %}
{%- set context = "kubernetes-admin@kubernetes" %}

Expose Prometheus:
  metalk8s_kubernetes.service_present:
    - name: prometheus-nodeport
    - namespace: monitoring
    - kubeconfig: {{ kubeconfig }}
    - context: {{ context }}
    - metadata:
        labels:
          run: prometheus-nodeport
          prometheus: k8s
        name: prometheus-nodeport
    - spec:
        ports:
        - port: 9090
          protocol: TCP
          targetPort: 9090
        selector:
          app: prometheus
          prometheus: k8s
        type: NodePort
  require:
    - pkg: Install Python Kubernetes client
    - salt: metalk8s.addons.monitoring.prometheus.deployed
