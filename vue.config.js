module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                "appId": "com.electron.harsom",
                "productName": "harsom", //项目名，也是生成的安装文件名，即harsom.exe
                "copyright": "Copyright © 2020", //版权信息
                "directories": {
                    "output": "./dist" //输出文件路径
                }
            }
        }

    }
}