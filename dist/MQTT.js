define(["jquery","paho"],function(t,n){"use strict";var e=null,i=function(){if(null!==e)throw new Error("Cannot instantiate more than one instance, use getInstance()!");this.client=void 0,this.flashTO=void 0,this.reconnTO=void 0,this.topics={}};return i.getInstance=function(){return null===e&&(e=new i),e},i.prototype.srReconnect=function(){console.debug("Reconnecting..."),this.srConnect()},i.prototype.srRegisterTopic=function(t,n){"undefined"==typeof this.topics&&(this.topics={}),"undefined"==typeof this.topics[t]?(this.topics[t]=[n],"undefined"!=typeof this.client&&this.client.isConnected()&&this.client.subscribe(t)):this.topics[t].push(n)},i.prototype.srStatus=function(n){t("#snmd-hb").css("background",n)},i.prototype.srConnect=function(){this.srStatus("yellow"),console.debug("Connecting to MQTT broker "+this.broker_host+":"+this.broker_port+"..."),this.client=new n.MQTT.Client(this.broker_host,this.broker_port,"",this.clientId),this.client.disconnect=function(){console.error("Disconnected"),this.srStatus("#7f0000")}.bind(this),this.client.onConnectionLost=function(t){this.srStatus("#ff0000"),console.error("Connection Lost: "+t.errorMessage),this.reconnTO&&clearTimeout(this.reconnTO),this.srStatus("orange"),this.reconnTO=setTimeout(this.srConnect.bind(this),5e3)}.bind(this),this.client.onMessageArrived=function(t){if(this.srStatus("#00ff00"),setTimeout(function(){this.srStatus("#007f00")}.bind(this),100),"undefined"!=typeof this.topics[t.destinationName]){var n;for(n=0;n<this.topics[t.destinationName].length;n++){var e=this.topics[t.destinationName][n];try{e.handleUpdate.call(e,t.destinationName,t.payloadString)}catch(n){return console.error("Failure handling update on '"+t.destinationName+"' in class '"+e.constructor.name+": "+n.message),void console.warn(n.stack)}}}else console.warn("Received MQTT message for unknown topic "+t.destinationName+"!");return 1}.bind(this);this.client.connect({onSuccess:function(){console.info("Connected to mqtt://"+this.broker_host+":"+this.broker_port),this.srStatus("#7f0000");var t;for(t in this.topics)this.client.subscribe(t)}.bind(this),onFailure:function(t){this.reconnTO&&clearTimeout(this.reconnTO),this.srStatus("orange"),this.reconnTO=setTimeout(this.srConnect.bind(this),5e3)}.bind(this)})},i.prototype.srInit=function(t,n,e){"undefined"==typeof e&&(e="RND"+Math.floor(16777215*Math.random()).toString(16)),console.debug("MQTT broker = "+t+":"+n),console.debug("MQTT clientId = "+e),this.broker_host=t,this.broker_port=Number(n),this.clientId=e,this.srConnect()},i.getInstance()});
//# sourceMappingURL=dist/MQTT.map