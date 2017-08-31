.. _appx-nag2mqtt:

************************
Appendix: nag2mqtt Setup
************************

About
=====

nag2mqtt consists of a *Nagios Event Broker* (NEB) module and a small perl daemon. The NEB module
publishes all check results in the local filesystem (using tmpfs is highly recommended).
These file are than publish by the perl daemon to a MQTT broker.

By publishing the check results via MQTT it is possible to visualize the Nagios check states and performance data
in SNMD using the `snmd-widgets-nagios <http://snmd.readthedocs.io/projects/snmd-widgets-nagios/en/latest/>`_ widgets.


Prerequisites
=============

You need a running `Nagios Core <https://www.nagios.org/projects/nagios-core/>`_ setup or an extension like
`Check_MK <https://mathias-kettner.de/check_mk.html>`_.


Installation
============

To install nag2mqtt on *Debian GNU/Linux* it is recommended to use the prebuild packages. For non-Debian
systems you need to build nag2mqtt from the sources.


Perl
----

Debian has no package for the Perl module ``AnyEvent::MQTT`` available. You can build them by using *dh-make-perl*:

- install packages *libanyevent-perl* and *dh-make-perl* to build the missing Debian packages from CPAN modules
.. code-block:: console

    # apt-get install libanyevent-perl dh-make-perl

- build Net::MQTT required for AnyEvent::MQTT
.. code-block:: console

    $ cpan2deb Net::MQTT --version 1.163170

- install Net::MQTT
.. code-block:: console

    # dpkg -i libnet-mqtt-perl_1.163170_all.deb
 
- build AnyEvent::MQTT
.. code-block:: console

    $ cpan2deb AnyEvent::MQTT --depends libnet-mqtt-perl

- install AnyEvent::MQTT
.. code-block:: console

    # dpkg -i libanyevent-mqtt-perl_1.172121-1_all.deb


nag2mqtt
--------

Download the lae



Configuration
=============
