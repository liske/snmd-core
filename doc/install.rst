************
Installation
************

Prerequisites
=============

In order to rollout SNMD you require different components at you requirement.

MQTT message broker
-------------------

A MQTT v3.1 message broker with Web Socket support is required. The usage of `Mosquitto <https://mosquitto.org/>`_ is recommended. Rember enable Web Socket remote access in Mosqitto::

   listener 9001
   protocol websockets

MQTT publisher
--------------

Data need to be published on MQTT so it can be visualized with SNMD. Look at `nag2mqtt <https://github.com/liske/nag2mqtt/>`_ to publish Nagios state and performance data via MQTT.

Webserver deploying SNMD
------------------------

A simple web server publishing the SNMD files is required. To download SNMD a local installation of `bower <https://bower.io/>`_ is required.



Install & Setup
===============


Download SNMD
-------------


Customize Config
----------------


