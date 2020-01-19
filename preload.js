// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
//
const fs = require("fs"),
    path = require("path")


window.addEventListener('DOMContentLoaded', () => {
    // console.log(1)
    // console.log($)
    // console.log(fs)
    // console.log(Blockly)

    // 点击保存文件到本地按钮
    $("#dlm_wj_menu_box_savrhost").click(saveFileXml);
})


// 点击保存文件到本地按钮,保存文件到本地
function saveFileXml() {
    const fileName = true // electron 里不能用 prompt，TODO……
    if (fileName) {

        let changeXml = Blockly.Xml.workspaceToDom(demoWorksplace),
            changeXmlText = Blockly.Xml.domToText(changeXml);

        // 保存 xml 文件数据
        saveFile(changeXmlText,Date.now())
    } else { alert("文件名不能为空") }
}





/**
 * 保存文件
 * @param  {[type]} name 文件名
 * @param  {[type]} type 文件类型
 * @return {[type]}      [description]
 */
function saveFile(data, name = "tmp", type = ".xml") {
    const dirName = path.join(__dirname, "static/worksplace"),
        fileName = path.join(dirName, name + type)

    /**
     * 文件夹存在，创建文件并保存数据
     * 文件夹不存在，创建文件夹后创建文件并保存数据
     */
    if (fs.existsSync(dirName)) {
        fs.writeFile(fileName, data, err => {
            if (err) return console.log(err);
            alert('保存成功！')
        })
    } else {
        fs.mkdirSync(dirName);
        fs.writeFile(fileName, data, err => {
            if (err) return console.log(err);
            alert('保存成功！')
        })
    }
}