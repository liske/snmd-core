.. _appx-nginx:

*********************
Appendix: Nginx Setup
*********************

It is recommended to use a reverse proxy to publish SNMD and the MQTT websockets. This enables you to protect the site by
*https* and use HTTP basic authentication.


Installation
============

You need to install *nginx* - on *Debian GNU/Linux* use:

.. code-block:: console

    # apt-get install nginx


Configuration
=============

The following example configuration for *Nginx* publishes SNMD at ``http://HOSTNAME/snmd/``:

.. code-block:: nginx
    :caption: ``/etc/nginx/site-enabled/default.conf``

    # Mosquitto websocket upstream
    upstream be-mqtt-ws {
            ip_hash;
            server 127.0.0.1:9001;
    }

    # configuration of the server
    server {
        # the port your site will be served on
        listen      80 default_server;

        charset     utf-8;

        # optional: enable HTTP basic auth (Https is recommended!) 
        #auth_basic "SNMD";
        #auth_basic_user_file /etc/nginx/snmd.htpasswd;

        # forward MQTT-via-Websocket to Mosquitto
        location /snmd/mqtt {
            proxy_http_version 1.1;
            proxy_cache_bypass 1;
            proxy_no_cache 1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_pass http://be-mqtt-ws/;
        }

        # local SNMD styles, configs, svg files and views
        location /snmd/css/local.css {
            alias /opt/snmd-local/css/local.css;
        }
        location /snmd/configs {
            alias /opt/snmd-local/configs/;
        }
        location /snmd/svg {
            alias /opt/snmd-local/svg/;
        }
        location /snmd/views {
            alias /opt/snmd-local/views/;
        }

        # vanilla SNMD sources
        location /snmd {
            alias /opt/snmd/;
        }
    }

You need to configure SNMD to use the correct URL to acess the published MQTT websocket. The terminal configuration
requires the ``mqttws_uri`` option:

.. code-block:: json
    :caption: ``configs/default.json``
    
    {
        "mqttws_uri": "ws://HOSTNAME/snmd/mqtt",
        "view": {
            "title" : "Default",
            "json" : "views/default.json"
        }
    }


.. hint::
  If *https* is used the protocol of the MQTT uri (``mqttws_uri``) needs to be changed to ``wss://``!
