************
Installation
************

Prerequisites
=============

In order to rollout SNMD you require different components at the target environment.

MQTT message broker
-------------------

A MQTT v3.1 message broker with web socket support is required. The usage of `Mosquitto <https://mosquitto.org/>`_ is recommended. Rember you need to explicitly enable web socket access in Mosqitto::

   listener 9001
   protocol websockets

MQTT publishing
---------------

Data needs to be published on MQTT so it can be visualized by SNMD. Look at `nag2mqtt <https://github.com/DE-IBH/nag2mqtt/>`_ to publish Nagios performance data to MQTT.

Web server for SNMD
-------------------

A simple web server publishing the static SNMD files is sufficiant. To download SNMD an installation of `bower <https://bower.io/>`_ is required.



Install & Setup
===============


Download SNMD
-------------


Customize Config
----------------


