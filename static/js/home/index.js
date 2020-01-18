    let xmlDoc = loadXMLDoc("../static/dlm-xml/blocklys.xml?" + Math.random()),
        demoWorksplace = Blockly.inject('dlm_blockly', {
            media: "../static/media/",
            collapse: false,
            toolbox: xmlDoc.firstChild,
            zoom: {
                controls: true,
                wheel: true
            }
        })

    // 页面加载完触发此事件
    $(function() {


        try {
            let changedXmlText = localStorage.getItem("changeXmlText"),
                changedXml = Blockly.Xml.textToDom(changedXmlText);
            Blockly.Xml.domToWorkspace(changedXml, demoWorksplace);
        } catch (err) {
            console.log(err)
        }



        // 积木发生变化时触发此事件
        demoWorksplace.addChangeListener(updateBlockly);

        function updateBlockly() {
            localGetBlock()
            showEditByCode()
        }

        function localGetBlock() {

            let changeXml = Blockly.Xml.workspaceToDom(demoWorksplace),
                changeXmlText = Blockly.Xml.domToText(changeXml);
            localStorage.setItem("changeXmlText", changeXmlText);
        }

        //加载本地xml作品
        var s = document.getElementById('dlm_wj_menu_box_loadhost')
        var c = document.getElementById('contained')
        s.onclick = function() {
            c.click()
        }
        var contained = document.querySelector("#contained");
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            Blockly.Xml.domToWorkspace(createXml(e.target.result).firstChild, demoWorksplace);
        }

        function handleUpload(e) {
            var file = e.target.files[0];

            fileReader.readAsText(file);
        }
        contained.addEventListener("change", handleUpload);

        // function runJS() {
        //     var code = Blockly.Generator.workspaceToCode('JavaScript');
        //     console.log(code)
        //     try {
        //         eval(code);
        //     } catch (e) {
        //         alert('Program error:\n' + e);
        //     }
        // }
    })