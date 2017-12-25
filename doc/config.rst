*************
Configuration
*************

.. hint::
    It is strongly recommended to *not* touch or add any files in the source directory of SNMD. Instead you should configure your web server to
    redirect files access to another directory (see also :ref:`appx-nginx`) where you keep your local stuff.

Three different JSON files are used to configure SNMD's behavior.

.. hint::
  C-like comments within the JSON config files are stripped using `JSON.minify <https://github.com/getify/JSON.minify/tree/javascript>`_
  before the files are parsed. No other deviations from the JSON
  specification is allowed and will result in a fatal parsing error.


Global config
=============

The SNMD configuration file ``config.json`` configures the included snmd widget
library packages and some global configurations.

.. code:: json

   {
       /* Enable development mode.
          FALSE
            - use minified js files (snmd-core and widgets)
            - set loglevel to info
            - allow js caching by using a version depending
              urlArgs parameter (requirejs)
          TRUE
            - use non-minified js files (snmd-core and widgets)
            - set loglevel to debug
            - prevent any caching by using a full dynamic urlArgs
              parameter (requirejs)
       */
       "snmd_devel": false,
   
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


Terminal config
===============

While loading SNMD a terminal name can be passed using the ``terminal`` URL parameter. SNMD will try to load the terminal's
configuration from ``configs/${TERMINAL}.json``. SNMD will fallback to ``configs/default.json`` if it is unable to load
the terminal file or no parameter has been passed. Terminal names can be used to load a predefined views configuration
without user interaction.

.. code:: json

    {
        "view": {
            "title" : "Monitoring",
            "json" : "views/view1.json"
        },
        "vlinks": [
            {
                "name": "terminal1",
                "title": "NOC"
            },
            {
                "name": "terminal2",
                "title": "Bathroom"
            }
        ]
    }

The terminal configuration is a object with the following keys:

* **view** (required) - A object configuring the path to the views config *json* and the *title* shown in the UI.
* **vlinks** (optional) - An array of objects which are added as hyperlinks so the user can switch to alternative terminal configs.


Views configuration
===================

The views configuration referenced by terminal configurations are a JSON structures defining the views
visible at the SNMD UI. These views configs are located in the ``views/`` directory.

.. code:: json

   [
    { "title": "Check_MK", "url": "/cmk-rproxy/dashboard.py?name=snmd", "render": "html", "reload": 300 },
    { "title": "Core",     "url": "svg/LAN-Core.svg" },
    { "title": "Distri",   "url": "svg/LAN-Distri.svg" },
    { "title": "Access",   "url": "svg/LAN-Access.svg" }
   ]

The JSON structure is an array of objects with the following keys:

* **title** (required) - The label of the view used for the navigation bar.
* **render** (optional) - The rendering type of the view. Defaults to 'svg'. The 'html' renderer will load
  a html site in an *iframe* to embed arbitrary websites into the SNMD UI. Could be used to embed
  a state or event dashboard of your network monitoring system.
* **url** (required) - URL to load the content of the renderer (i.e. path to the SVG file).
* **reload** (html; optional) - Reload the *iframe* content periodically (value in seconds).

.. hint::
  If you want to embed the nagios or Check_MK dashboard you might want to use a reverse proxy to inject
  an HTTP authentication header for read-only access to your monitoring dashboard with-out any user query
  (i.e. digital signage).
