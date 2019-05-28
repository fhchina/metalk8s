Requirements
============

In order to build MetalK8s we rely and third-party tools, some of them are
mandatory, others are optional.

Mandatory
---------

- `Python <https://www.python.org/>`_ 3.6 or higher: our buildchain is
  Python-based
- `docker <https://www.docker.com/>`_: to build some images locally
- `skopeo <https://github.com/containers/skopeo>`_, 0.1.19 or higher: to save
  local and remote images
- `hardlink <https://jak-linux.org/projects/hardlink/>`_: to de-duplicate images
  layers
- mkisofs: to create the MetalK8s ISO

Optional
--------

- `git <https://git-scm.com/>`_: to add the Git reference in the build metadata
- `Vagrant <https://www.vagrantup.com/>`_, 1.8 or higher: to spawn a local
  cluster
- `VirtualBox <https://www.virtualbox.org>`_: to spawn a local cluster
- `tox <https://pypi.org/project/tox>`_: to run the linters

Development
-----------

If you want to develop on the buildchain, you can add the development
dependencies with ``pip install -r requirements/build-dev-requirements.txt``.
