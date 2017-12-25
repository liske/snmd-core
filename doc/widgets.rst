****************
Widget Libraries
****************


Usage
=====

Widget libraries can be added by installing them (i.e. using *bower*) and configure *SNMD* to load them using a namespace of your choice. The libraries need to be added to the *snmd_widgets* option within the global *config.json* file:

.. code:: json

   {
       /* ... */
   
       /* Load widget packages
          Each entry requires a prefix and a library value:
          - prefix: string used in SVG to reference a widget of this library
          - package: the bower package name
       */
       "snmd_widgets": [
           {
               "prefix": "Nagios",
               "package": "snmd-widgets-nagios"
           }
       ]
   }

The example will load the bootstrap code of the package *snmd-widgets-nagios* and make it's widgets available under the namespace ``Nagios``. They can be referenced in views using
the following notation for the `type` parameter:

* ``Nagios:Chart-IfBw``
* ``Nagios:Chart-DiskTp``
* ``Nagios:Text-PerfData``
* ...

Available Libraries
===================

The following libraries are available:

* `snmd-widgets-nagios <http://snmd.readthedocs.io/projects/snmd-widgets-nagios/en/latest/>`_ - visualize state and performance data from *nagios* and *Check_MK*
