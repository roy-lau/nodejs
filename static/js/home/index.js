    let xmlDoc = loadXMLDoc("/static/dlm-xml/blocklys.xml?" + Math.random()),
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
            // 从缓存中读取积木，并放到工作区
            let changedXmlText = localStorage.getItem("changeXmlText"),
                changedXml = Blockly.Xml.textToDom(changedXmlText);
            Blockly.Xml.domToWorkspace(changedXml, demoWorksplace);
        } catch (err) {
            console.log(err)
        }

        // 积木发生变化时触发此事件
        demoWorksplace.addChangeListener(function() {
            localGetBlock()
            showEditByCode() // 将积木生成的代码放到编辑器中
        });

        /**
         * 每次 积木变化 将积木写入缓存
         * @return {[type]} [description]
         */
        function localGetBlock() {

            let changeXml = Blockly.Xml.workspaceToDom(demoWorksplace),
                changeXmlText = Blockly.Xml.domToText(changeXml);
            localStorage.setItem("changeXmlText", changeXmlText);
        }
        /**
         * 设置编辑器
         * 每次 积木变化 将 blockly 生成的 Python 代码放到右侧编辑器里
         */
        let editor = ace.edit("dlm_edit");
        editor.setTheme("ace/theme/monokai");
        // editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/python");
        editor.setFontSize(17);
        editor.setShowPrintMargin(false);
        editor.setReadOnly(true);
        editor.setScrollSpeed(0.05);

        function showEditByCode() {
            Blockly.Python.addReservedWords('code');
            let code = Blockly.Python.workspaceToCode(demoWorksplace) || '';
            setEditCode(code)
        }
        /**
         * 设置编辑器的代码
         * @param {[type]} code 代码
         */
        function setEditCode(code) {
            let chinese_code = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function(s) { return decodeURIComponent(s.replace(/_/g, '%')); });
            editor.setValue(chinese_code, -1);
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

        function createXml(str) {
            if (document.all) {
                var xmlDom = new ActiveXObject("Microsoft.XMLDOM")
                xmlDom.loadXML(str)
                return xmlDom
            } else
                return new DOMParser().parseFromString(str, "text/xml")
        }
        // 清除代码/积木
        $("#dlm_clear_btn").click(function() {
            $("#code_result").hide() // 隐藏程序运行结果区
            $("#code_result").text() // 程序运行结果区置空
            setEditCode("")
        })


        /*
         * 下面是原 dlm_blockly.js 文件的代码，处理头部菜单的代码被我整理成 header.js 文件了
         */

        var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');

        socket.on('my response', function(msg) {
            if (msg.data == 'bf') {
                player()
                return false
            }
            if (msg.data == 'cc') {
                window.open("static/out.jpg?" + Math.random())
                return false
            }
            if (msg.data == 'over') {

                $('#dlm_run_stop_btn').text('运 行')
                return false
            }
            let editor = ace.edit("dlm_edit");
            let str1 = editor.getValue()
            let str2 = str1 + msg.data
            setEditCode(str2)

        });
        socket.on('my connect', function(msg) {
            $('#dlm_run_stop_btn').text('运 行')
            let editor = ace.edit("dlm_edit");
            let str1 = editor.getValue()
            let str2 = str1 + msg.data
            setEditCode(str2)
        });
        $('#dlm_run_stop_btn').click(function(event) {
            $("#code_result").show() // 显示程序运行结果区
            $("#code_result").text("开始安装\n开始运行\n长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长超长\n\n\n") // 程序运行结果区设置值
            if ($('#dlm_run_stop_btn').text() == '停 止') {
                socket.emit('restart', { data: 'ting' });
            } else {
                $('#dlm_run_stop_btn').text('停 止')
                socket.emit('myevent', { data: Blockly.Python.workspaceToCode(demoWorksplace) });
                return false;
            }

        });

        $('#dlm_wj_menu_box_savrhost').click(function(event) {
            var s = prompt('输入文件名!')
            let changeXml = Blockly.Xml.workspaceToDom(demoWorksplace),
                changeXmlText = Blockly.Xml.domToText(changeXml);
            exportRaw(s + '.xml', changeXmlText)
            return false;
        });

        $('#dlm_run_shutdown_btn').click(function(event) {
            socket.emit('exec', { data: 'shutdown -h now' });
            $(this).text("关闭启动").width(60)
        });
        $('#dlm_run_restart_btn').click(function(event) {
            socket.emit('exec', { data: 'shutdown -r now' });
            return false;
        });
        $('#dlm_run_exec_btn').click(function(event) {
            socket.emit('exec', { data: a });
            return false;
        });

        function player() {

            var audio = new Audio("static/MP3/output.mp3" + '?' + Math.random()); //这里的路径写上mp3文件在项目中的绝对路径

            audio.play();
        }

        function fakeClick(obj) {
            var ev = document.createEvent("MouseEvents");
            ev.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            obj.dispatchEvent(ev);
        }

        function exportRaw(name, data) {
            var urlObject = window.URL || window.webkitURL || window;
            var export_blob = new Blob([data]);
            var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
            save_link.href = urlObject.createObjectURL(export_blob);
            save_link.download = name;
            fakeClick(save_link);
        }

    })