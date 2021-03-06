.. _appx-mosquitto:

*************************
Appendix: Mosquitto Setup
*************************


Installation
============

Take a look at the `Mosquitto Downloads <https://mosquitto.org/download/>`_ page to find out howto install *Mosquitto*
on your system. On *Debian GNU/Linux* it is sufficient to install *Mosquitto* via *apt*:

.. code-block:: console

    # apt-get install mosquitto mosquitto-clients

The *mosquitto-clients* package is optional but helps debugging by subscribing to MQTT topics. 


Configuration
=============

You need to explicitly enable web socket access in *Mosqitto* and allowing anonymous MQTT (read) access is recommended:

.. code-block:: none
    :caption: /etc/mosquitto/conf.d/mosquitto.conf

    allow_anonymous true
    password_file /etc/mosquitto/users.pw
    acl_file /etc/mosquitto/users.acl
    listener 1883                                                                    
    listener 9001
    protocol websockets

.. hint::
    If SNMD is exposed to the internet you should setup a reverse proxy which enforces authentication
    (see also :ref:`appx-nginx`) and prevent direct MQTT access.


The ACL file ``/etc/mosquitto/users.acl`` defines subscribe and publishing access on MQTT topics. The following example
allows anonymous subscribe access to all topics and publishing access for the ``nag2mqtt`` user to all topics below ``nagios/``.

.. code-block:: none
    :caption: /etc/mosquitto/users.acl

    topic read #
    user nag2mqtt
    topic readwrite nagios/#

The users password file can be created using ``mosquitto_passwd`` command:

.. code-block:: console

    # touch /etc/mosquitto/users.pw
    # mosquitto_passwd /etc/mosquitto/users.pw nag2mqtt
