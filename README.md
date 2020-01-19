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

