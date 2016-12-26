
DISTS:= \
	dist/Core.js \
	dist/GUI.js \
	dist/HTML.js \
	dist/Main.js \
	dist/MQTT.js \
	dist/SVG.js \
	dist/SVGWidget.js \
	dist/SVGImpl/Chart.js \
	dist/SVGImpl/Class.js \
	dist/SVGImpl/Gauge.js \
	dist/SVGImpl/Gradient.js \
	dist/SVGImpl/StrokeWidth.js \
	dist/SVGImpl/Text.js \
	dist/SVGImpl/Transform.js


all: $(DISTS)

dist/%.js: js/%.js
	uglifyjs \
	    --output $@ \
	    --source-map $(subst .js,.map,$@) \
	    --compress \
	    --mangle \
	    --lint \
	    --stats \
	    -- $+

clean:
	rm -f dist/*.js dist/*.map dist/SVGImpl/*.js dist/SVGImpl/*.map
