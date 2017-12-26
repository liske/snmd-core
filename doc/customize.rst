****************
Customize Layout
****************

The SNMD UI loads additional CSS definitions from :code:`css/local.css`. This allows customizing the layout of widgets using CSS selectors.

The following example uses the :code:`Class-Sate` widget type from the *snmd-widgets-nagios* library and changes the stroke color of the state :code:`OK` to blue:

.. code-block:: json
    :caption: `widget description`

    {
        "type": "Nagios:Class-State",
        "bcls": [
            "snmd-bcl-opacity-stroke", "my-bcl-test"
        ],
        "clrsty": [
            "stroke"
        ],
        "topics": [
            "nagios/checks/foo.demo.lan/Service Test"
        ]
    }

.. code-block:: css
    :caption: `:code:`css/local.css``

    .snmd-bcl-opacity-stroke.my-bcl-test.snmd-scl-0 {
        stroke: DarkBlue;
    }
