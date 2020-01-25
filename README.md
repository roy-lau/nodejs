<<<<<<< HEAD
# nodejs
node一小步，前端一大步！

npm是什么
----------http://www.cnblogs.com/PeunZhang/p/5553574.html------

NPM的全称是Node Package Manager，是随同NodeJS一起安装的包管理和分发工具，它很方便让JavaScript开发者下载、安装、上传以及管理已经安装的包。
## npm install 安装模块
    -S, --save 安装包信息将加入到dependencies（生产阶段的依赖）
    -D, --save-dev 安装包信息将加入到devDependencies（开发阶段的依赖），所以开发阶段一般使用它
    -O, --save-optional 安装包信息将加入到optionalDependencies（可选阶段的依赖）
    -E, --save-exact 精确安装指定模块版本

    npm init 在项目中引导创建一个package.json文件
    npm help 查看某条命令的详细帮助 
    npm root 查看包的安装路径

    npm ls -g --depth=0 查看全局安装的模块，向下寻路0

1. npm adduser 创建用户<br> 
    npm login   登陆用户 <br>
2. npm publish 发布模块 <br>

#### npm access 在发布的包上设置访问级别
    npm access public [<package>]
    npm access restricted [<package>]
    npm access grant <read-only|read-write> <scope:team> [<package>]
    npm access revoke <scope:team> [<package>]
    npm access ls-packages [<user>|<scope>|<scope:team>]
    npm access ls-collaborators [<package> [<user>]]
    npm access edit [<package>]

### npm config 管理npm的配置路径
    npm config set <key> <value> [-g|--global]
    npm config get <key>
    npm config delete <key>
    npm config list -l 
    npm config edit
    npm get <key>
    npm set <key> <value> [-g|--global]
    
### npm 模块
    npm uninstall 卸载模块 
    npm update 更新模块
    npm outdated 检查模块是否已经过时
    npm start 启动模块
    npm stop 停止模块
    npm restart 重新启动模块
    npm test 测试模块
    npm version 查看模块版本
    npm view 查看模块的注册信息
    npm remove <name>移除
    npm search 搜索模块

### npm cache 管理模块的缓存
    npm cache add <tarball file>
    npm cache add <folder>
    npm cache add <tarball url>
    npm cache add <name>@<version>
    npm cache ls [<path>]
    npm cache clean [<path>]
    npm cache clean 最常用命令无非清除npm本地缓存
=======
# harsom


## 简介（迪乐姆）

> 一个树莓派项目

- 运行环境： Debian10

- 技术站：
	客户端：
		nodejs
		electron-builder
		blockly
	后台：
		python3.7
		flask
		baidu-aip
		flask-socketio

- 项目目录
	.
	├── README.md    	介绍
	├── app.js 			electron 启动目录
	├── flaskserver.py 	flask 启动目录
	├── output.mp3
	├── package.json 	nodejs 包管理目录
	├── interfacepy 	Python 接口文件夹
	├── static 			静态文件存放目录
	│   ├── MP3 		音频文件保存目录
	│   ├── css 		样式文件目录
	│   ├── dlm-xml 	迪乐姆 xml 存储目录
	│   ├── font 		字体图标
	│   ├── img 		图片文件
	│   ├── js 			js 脚本文件
	│	│   ├── libs 	第三方模块
	│	│   ├── home    主页要用到的 js
	│	│   └── ……    	其他页面要用到的 js（以后还有其他页面都可以写在这里）
	│   └── media 		媒体资源文件夹（为什么要把图片也放在这里？）
	└── templates 		模板目录
	    └── index.html  主页 HTML



## python setup

### 安装所需的包
```
pip install flask baidu-aip flask-socketio flask_cors
```


### 启动
```
python flaskserver.py
```




## electron setup

### 安装依赖包

```
yarn install
```

### run（开发启动）

```
yarn dev
```

### build(打包)

```
yarn build
yarn build:linux
yarn build:mac
```



社区:
- [electron-builder](https://www.electron.build)

>>>>>>> a689badc717b47679396d7e302876fd8ebd8f865
