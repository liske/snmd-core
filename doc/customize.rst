.. _customize-style:

*****************
Customizing Style
*****************

The SNMD UI loads additional CSS definitions from :code:`css/local.css`. This allows customizing the layout of widgets using CSS selectors.

The following example uses the :code:`Class-Sate` widget type from the *snmd-widgets-nagios* library and changes the stroke color of the state :code:`OK` to blue:

.. code-block:: json
    :caption: *example widget configuration*

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
    :caption: :code:`css/local.css`

    .snmd-bcl-opacity-stroke.my-bcl-test.snmd-scl-0 {
        stroke: DarkBlue;
    }

.. hint::
    Remember that SVG elements have some custom CSS attributes. You need to use the :code:`stroke` and :code:`fill` properties to change their color, they
    do not have a :code:`color` or :code:`background` property. A overview of styling properties can be found in the *`Scalable Vector Graphs W3C Recommendation <https://www.w3.org/TR/SVG/styling.html>`_*.
