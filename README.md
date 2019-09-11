## 文件说明：
1. webdebug.html  

	此文件用于cgi接口的调试；放在控制板的/nandflash/webserver/thttpd/www文件夹中；  
	只保留读写属性，chmod 666 webdebug.html;  
	使用时，修改文件中指定的cgi名称为调试目标cgi名；  
	在网页中，"query"为查询使用的接口数据发送；“update”为设置使用的接口数据发送；  
	cgi返回，是标准json数据，IE会直接打印数据显示


2. dist/

	这个目录下的文件在打包前都需要拷贝到WEB/thttpd/www/下,拷贝过程通过makefile进行

---

## 编译说明

APP/thttpd-web/www中的makefile支持三种条件编译,通过`WWW-BUILD-TARGET`控制
1. 编译所有(默认选项)
	```
	make WWW-BUILD-TARGET=all
	```
	这个编译过程将通过`npm install`和`npm run build`,编译得到目标网页(dist/目录下)
2. 仅拷贝debugweb到预定目录
	```
	make WWW-BUILD-TARGET=debug
	```

3. 仅拷贝dist/下的文件到预定目录
	```
	make WWW-BUILD-TARGET=copyweb
	```
4. 编译网页,并拷贝生成文件到预定目录
	```
	make WWW-BUILD-TARGET=web
	```

以上编译选项可以在此目录的makefile使用,也可以在仓库顶层makefile使用
# liguo34fd

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

