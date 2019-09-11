
WWW-BUILD-TARGET?=all


ifeq ($(WWW-BUILD-TARGET),all)
TARGET=web-page  debug-page
else ifeq ($(WWW-BUILD-TARGET),debug)
TARGET=debug-page
else ifeq ($(WWW-BUILD-TARGET),web)
TARGET=web-page
else ifeq ($(WWW-BUILD-TARGET),copyweb)
TARGET=cp-web-page
endif


all:$(TARGET)
	@echo "$(TARGET)"

clean:
	@echo "make clean"
	

web-page:dist
	npm install
	npm run build
	cp dist/* ../../../WEB/thttpd/www/ -rf
dist:
	mkdir -p dist/

debug-page:webdebug.html
	cp webdebug.html ../../../WEB/thttpd/www/

cp-web-page:
	cp dist/* ../../../WEB/thttpd/www/ -rf

