
LIBS:=lib/svg-1.5.0/jquery.svg.min.js \
    lib/svg-1.5.0/jquery.svggraph.min.js \
    lib/svgpathdata-1.0.3/SVGPathData.js \
    lib/paho.javascript-1.0.2/mqttws31-min.js

all: dist/snmd-core.min.js
	@for lib in $(LIBS) $+; do \
	    echo $$lib; \
	done > js.min.inc

dist/snmd-core.min.js: src/*.js src/SVGImpl/*.js
	@for lib in $(LIBS) $+; do \
	    echo $$lib; \
	done > js.dev.inc
	uglifyjs \
	    --output $@ \
	    --source-map dist/snmd-core.min.map \
	    --compress \
	    --mangle \
	    --lint \
	    --stats \
	    -- $+

clean:
	rm -f js.min.inc js.dev.inc dist/snmd-core.min.js dist/snmd-core.min.map
