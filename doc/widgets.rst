****************
Widget Libraries
****************

Available libraries
===================

The following libraries are public available:

* `snmd-widgets-nagios <http://snmd.readthedocs.io/projects/snmd-widgets-nagios/en/latest/>`_ - visualize state and performance data from *nagios*


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
               "package": "snmd-widgets-nagios",
               "prefix": "Nagios"
           }
       ]
   }

This example will load the bootstrap code of the package *snmd-widgets-nagios* and make any widgets of the library available under the namespace ``Nagios``:

* ``Nagios:Chart-IfBw``
* ``Nagios:Chart-DiskTp``
* ``Nagios:Text-PerfData``
* ...
