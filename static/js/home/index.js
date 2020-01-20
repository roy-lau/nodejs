    let xmlDoc = loadXMLDoc("http://129.204.163.41:60006/static/dlm-xml/blocklys.xml?" + Math.random()),
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
        function showEditByCode() {
            Blockly.Python.addReservedWords('code');

            let editor = ace.edit("dlm_edit");
            editor.setTheme("ace/theme/monokai");
            // editor.setTheme("ace/theme/xcode");
            editor.getSession().setMode("ace/mode/python");
            editor.setFontSize(17);
            editor.setShowPrintMargin(false);
            editor.setReadOnly(true);
            editor.setScrollSpeed(0.05);

            let code = Blockly.Python.workspaceToCode(demoWorksplace) || '';
            let chinese_code = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function(s) { return decodeURIComponent(s.replace(/_/g, '%')); });
            editor.setValue(chinese_code, -1);
        }

        //加载本地xml作品
        var s = document.getElementById('dlm_wj_menu_box_loadhost')
        var c = document.getElementById('contained')
        s.onclick = function(){
            c.click()
        }
        var contained = document.querySelector("#contained");
        var fileReader = new FileReader();
        fileReader.onload = function(e){
            Blockly.Xml.domToWorkspace(createXml(e.target.result).firstChild, demoWorksplace);
        }
        function handleUpload(e) {
            var file = e.target.files[0];

            fileReader.readAsText(file);
        }
        contained.addEventListener("change", handleUpload);
        function createXml(str){
            if(document.all){
            　　var xmlDom=new ActiveXObject("Microsoft.XMLDOM")
            　　xmlDom.loadXML(str)
            　　return xmlDom
        　　}
        　　else
        　　    return new DOMParser().parseFromString(str, "text/xml")
        　　}
        // 清除代码/积木
        $("#dlm_clear_btn").click(function() {
            // console.log(Blockly.Xml)
        })


        /**
         * 下面是原 dlm_blockly.js 文件的代码，处理头部菜单的代码被我整理成 header.js 文件了
         */
        var socket = io.connect('ws://127.0.0.1:5000/test');

        socket.on('my response', function(msg) {
            if (msg.data == 'bf') {
                player()
                return false
            }
            if (msg.data == 'cc') {
                window.open("static/out.jpg?" + Math.random())
                return false
            }
            let chinese_code = msg.data.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function(s) { return decodeURIComponent(s.replace(/_/g, '%')); });
            let editor = ace.edit("dlm_edit");
            editor.setValue(chinese_code, -1);
        });
        $('#dlm_run_stop_btn').click(function(event) {
            socket.emit('myevent', { data: Blockly.Python.workspaceToCode(demoWorksplace) });
            return false;
        });

        function player() {

            var audio = new Audio("static/MP3/output.mp3" + '?' + Math.random()); //这里的路径写上mp3文件在项目中的绝对路径

            audio.play();
        }

        // function ajaxtj(e){
        //     Blockly.Python.addReservedWords('code');
        //     var code = Blockly.Python.workspaceToCode(demoWorksplace);
        //     // JSON.stringify(s)
        //     $.ajax({
        //         url:"http://127.0.0.1:5000/recv",    //请求的url地址
        //         dataType:"text",   //返回格式为json
        //         async:true,//请求是否异步，默认为异步，这也是ajax重要特性
        //         data:code,    //参数值
        //         type:"POST",   //请求方式
        //         beforeSend:function(){
        //         //         
        //         },
        //         success:function(req){
        //             // req = JSON.parse(req)
        //             $('#dlm_code').innerHTML=req

        //         },
        //         complete:function(){
        //             //请求完成的处理
        //         },
        //         error:function(req){
        //             //请求出错处理
        //         }
        //     });
        // }


    })