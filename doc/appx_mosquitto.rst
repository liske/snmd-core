.. _appx-mosquitto:

*************************
Appendix: Mosquitto Setup
*************************

Installation
============

Take a look at the `Mosquitto Downloads <https://mosquitto.org/download/>`_ page to find out howto install *Mosquitto*
on your system.


Configuration
=============

It is recommended to enable authentication

 Rember you need to explicitly enable web socket access in *Mosqitto*::

   listener 9001
   protocol websockets



**TODO**
