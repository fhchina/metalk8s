{%- from "metalk8s/map.jinja" import repo with context %}

{%- macro pkg_installed(name='') -%}
  {%- set package = repo.packages[name] | default({}) %}
  pkg.installed:
    - name: {{ name }}
    - fromrepo: {{ repo.repositories.keys() | join(',') }}
    {%- if package.version | default(None) %}
    - version: {{ package.version }}
    - hold: True
    - update_holds: True
    {%- endif %}
{%- endmacro -%}
