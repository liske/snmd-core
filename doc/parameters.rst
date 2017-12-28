.. _url-parameters:

**************
URL Parameters
**************

By default the SNMD UI loads the default :ref:`terminal-config` and uses default UI settings. You change the terminal config name
and the UI settings using the following URL query parameters.

List of parameters
==================

    **config**

        The name of terminal configuration (default: :code:`default`).

    **3d**

        UI setting: *toggle 3D view*

        - :code:`0` Disable 3D view (increases performance).
        - :code:`1` Enable 3D view (decreased performance).

    **solarized**

        UI setting: Switch solarized theme.

        - :code:`0` Switch theme to solarized dark.
        - :code:`1` Switch theme to solarized light.

    **volume**

        UI setting: Toggle alert sounds.

        - :code:`0` Enable notification sounds.
        - :code:`1` Disable notification sounds.

    **notify**

        UI setting: Toggle browser notifications.

        - :code:`0` Enable desktop notifications.
        - :code:`1` Disable desktop notifications.

    **rotate**

        UI setting: Toggle interval or continuous view rotation.

        - :code:`0` Rotate view after activity timeout.
        - :code:`1` Keep current view.
        - :code:`2` Continuous view rotation.

    **follow**

        UI setting: Toggle current view follows state changes.

        - :code:`0` Switch to views if there state changes at least warning.
        - :code:`1` Do not switch to views due to state changes.

Example
-------

To load the terminal config :code:`wall` and change the *rotate* setting to mode :code:`2`:

.. code::

    http://snmd.foo.lan/?config=wall&rotate=2


Fragment identifier
===================

The view which should be shown initially when the SNMD UI is loading can be specified. The URL needs to be sufffixed by a hash mark :code:`#` and the view's ID.
The first view has the ID :code:`1` and the IDs are counted from left-to-right.

Example
-------

To initially load the second view:

.. code::

    http://snmd.foo.lan/?config=rpi#2
