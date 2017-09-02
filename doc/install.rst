************
Installation
************

Prerequisites
=============

In order to rollout SNMD you require different components at the target environment.

MQTT message broker
-------------------

A MQTT v3.1 message broker with **web socket support** is required. The usage of `Mosquitto <https://mosquitto.org/>`_ is recommended.
More details on deploying *Mosquitto* can be found in :ref:`appx-mosquitto`.


MQTT publishing
---------------

Data needs to be published on MQTT so it can be visualized by SNMD. Look at `nag2mqtt <https://github.com/DE-IBH/nag2mqtt/>`_ to publish Nagios performance data to MQTT.

More details on deploying *nag2mqtt* can be found in the `nag2mqtt docs <http://snmd.readthedocs.io/projects/nag2mqtt/en/latest/>`_.


Web server for SNMD
-------------------

A web server publishing the static SNMD files is required. For more advanced setups using *https* and *HTTP Basic Authentication* the use of `nginx <>` is recommended.

More details on deploying *nginx* can be found in :ref:`appx-nginx`.


Bower
-----

To download the external JavaScript dependencies of SNMD the installation of `bower <https://bower.io/>`_ is required.



Installation
============

Preparation
-----------

Install *git*, *nodejs*, *npm* and *bower* on the web server. On *Debian GNU/Linux* use:

.. code-block:: console

  # apt-get install git nodejs nodejs-legacy npm
  # npm install --global bower

.. hint::
  The package *nodejs-legacy* is required as the *bower* command uses
  the legacy shebang ``/usr/bin/env node`` to run *nodejs*.


Download or clone SNMD
----------------------

Download the latest `release archive <https://github.com/DE-IBH/snmd/releases>`_ or clone the development repository using *git*:

.. code-block:: console

  $~/ git clone https://github.com/liske/snmd.git

You need to pull the *bower* dependencies in your local SNMD directory:

.. code-block:: console

  $~/snmd/ bower update

This will download the *snmd-core* and *snmd-widgets-nagios* components including any 3rd party libraries required by them.
