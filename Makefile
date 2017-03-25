
DISTS:= \
	dist/js/Core.js \
	dist/js/GUI.js \
	dist/js/HTML.js \
	dist/js/Main.js \
	dist/js/MQTT.js \
	dist/js/Polyfills.js \
	dist/js/Sound.js \
	dist/js/SVG.js \
	dist/js/SVGWidget.js \
	dist/js/SVGImpl/Chart.js \
	dist/js/SVGImpl/Class.js \
	dist/js/SVGImpl/Gauge.js \
	dist/js/SVGImpl/Gradient.js \
	dist/js/SVGImpl/StrokeWidth.js \
	dist/js/SVGImpl/Text.js \
	dist/js/SVGImpl/Transform.js

all: $(DISTS) dist/lib/svg-1.5.0/jquery.svg.css

dist/js/%.js: js/%.js
	uglifyjs \
	    --output $@ \
	    --source-map $(subst .js,.map,$@) \
	    --compress \
	    --mangle \
	    --lint \
	    --stats \
	    -- $+

dist/lib/svg-1.5.0/jquery.svg.css: lib/svg-1.5.0/jquery.svg.css
	uglifycss $+ > $@

clean:
	rm -f dist/js/*.js dist/js/*.map dist/js/SVGImpl/*.js dist/js/SVGImpl/*.map dist/lib/svg-1.5.0/jquery.svg.css
