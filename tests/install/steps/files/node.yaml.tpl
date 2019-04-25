apiVersion: v1
kind: Node
metadata:
  name: node1
  annotations:
    metalk8s.scality.com/ssh-user: vagrant
    metalk8s.scality.com/ssh-port: "22"
    metalk8s.scality.com/ssh-host: $node_ip
    metalk8s.scality.com/ssh-key-path: /etc/metalk8s/pki/preshared_key_for_k8s_nodes
    metalk8s.scality.com/ssh-sudo: "true"
