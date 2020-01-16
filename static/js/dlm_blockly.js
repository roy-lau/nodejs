var run = false
var boxid = []

$(document).ready(function(){
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    socket.on('my response', function(msg) {
        if(msg.data=='bf'){
            player()
            return false
        }
        if(msg.data=='cc'){
            window.open("static/out.jpg?" + Math.random())
            return false
        }
        $('#dlm_code').append('<p>' + msg.data + '</p>');
    });
    $('#dlm_runbtn').click(function(event) {
        socket.emit('myevent', {data: $('#dlm_code').text()});
        $('#dlm_code').text('')
        return false;
    });
});
function player(){
    
    var audio= new Audio("static/MP3/output.mp3"+'?' + Math.random());//这里的路径写上mp3文件在项目中的绝对路径
    
    audio.play();
}
function dlm_menu_btn(a) {
    switch (a.id) {
        case 'dlm_menu_icon_0':
            document.getElementById('dlm_subject').style.display='block'
            document.getElementById('dlm_Sample').style.display='none'
            document.getElementById('dlm_yh').style.display='none'
            break;
        case 'dlm_menu_icon_1':
            pushpop('dlm_wj_menu')
            break;
        case 'dlm_menu_icon_2':
            document.getElementById('dlm_subject').style.display='none'
            break;
        case 'dlm_menu_icon_3':
            pushpop('dlm_zy_menu')
            break;
        case 'dlm_menu_icon_4':

            break;
        case 'dlm_menu_icon_5':

            break;
        case 'dlm_menu_icon_6':
            document.getElementById('dlm_subject').style.display='none'
            document.getElementById('dlm_Sample').style.display='block'
            document.getElementById('dlm_yh').style.display='none'
            break;
        case 'dlm_menu_icon_7':
            document.getElementById('dlm_subject').style.display='none'
            break;
        case 'dlm_menu_icon_8':
            document.getElementById('dlm_subject').style.display='none'
            break;
        case 'dlm_menu_icon_9':
            pushpop('dlm_yh_menu')
            break;
    }
}

function pushpop(a) {
    if (run) {
        for (var i = 0; i < boxid.length; i++) {
            if(boxid[i]!=a){
                document.getElementById(boxid[i]).style.display = 'none'
            }
        }
        run = false
    }
    if (document.getElementById(a).style.display == 'none') {
        document.getElementById(a).style.display = 'block'
        run = true
        boxid.push(a)
        event.stopPropagation()
    } else {
        document.getElementById(a).style.display = 'none'
        run = false
        for (var i = 0; i < boxid.length; i++) {
            if (boxid[i] == a) {
                boxid.splice(i, 1)
            }
        }
    }
}
document.body.onclick = function () {
    if (run) {
        for (var i = 0; i < boxid.length; i++) {
            document.getElementById(boxid[i]).style.display = 'none'
        }
        run = false
    }
}

function dlmmenuboxclick(a) {
    document.getElementById('dlm_subject').style.display='none'
    document.getElementById('dlm_Sample').style.display='none'
    document.getElementById('dlm_yh').style.display='block'
    switch (a.innerHTML) {
        case '创建':
            break;
        case '打开云端项目':
            break;
        case '打开本地项目':
            break;
        case '保存到云端':
            break;
        case '保存到本地':
            break;
        case '图片库':
            break;
        case '音频库':
            break;
        case '文件库':
            break;
        case '我的作品':
            document.getElementById('dml_yh_zp').style.display='block'
            dlm_asmple_menu_pushpop('dml_yh_zp')
            console.log('asd')
            break;
        case '我的班级':
            document.getElementById('dml_yh_bj').style.display='block'
            dlm_asmple_menu_pushpop('dml_yh_bj')
            break;
        case '我的贴子':
            document.getElementById('dml_yh_tz').style.display='block'
            dlm_asmple_menu_pushpop('dml_yh_tz')
            break;
        case '我的收藏':
            document.getElementById('dml_yh_sc').style.display='block'
            dlm_asmple_menu_pushpop('dml_yh_sc')
            break;
        case '我的关注':
            document.getElementById('dml_yh_gz').style.display='block'
            dlm_asmple_menu_pushpop('dml_yh_gz')
            break;
        case '我的消息':
            document.getElementById('dml_yh_xx').style.display='block'
            dlm_asmple_menu_pushpop('dml_yh_xx')
            break;
        case '退出登录':
            break;
    }
}
function dlm_asmple_menu_click(a){
    console.log(a)
    switch (a.id) {
        case 'dlm_asmple_menu_1':
            document.getElementById('dlm_asmple_menu_1_block').style.display='block'
            document.getElementById('dlm_asmple_menu_2_block').style.display='none'
            document.getElementById('dlm_asmple_menu_3_block').style.display='none'
            break;
        case 'dlm_asmple_menu_2':
            document.getElementById('dlm_asmple_menu_1_block').style.display='none'
            document.getElementById('dlm_asmple_menu_2_block').style.display='block'
            document.getElementById('dlm_asmple_menu_3_block').style.display='none'
            break;
        case 'dlm_asmple_menu_3':
            document.getElementById('dlm_asmple_menu_1_block').style.display='none'
            document.getElementById('dlm_asmple_menu_2_block').style.display='none'
            document.getElementById('dlm_asmple_menu_3_block').style.display='block'
            break;
    }

}
function dlm_asmple_menu_pushpop(a){
    var s = document.getElementsByClassName('dml_yh_block')
    for(var i=0;i<s.length;i++){
        if(s[i].id!=a){
            s[i].style.display='none'
        }
    }
}
function dlm_yh_box_click(a,b){
    var s =document.getElementsByClassName(a)
    b = document.getElementById(b)
    for(var i=0;i<s.length;i++){
        s[i].style.display='none'
    }
    b.style.display='block'
}

function dlm_yx_asd(){
    var s = document.getElementById('dlm_code')

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
//             document.getElementById('dlm_code').innerHTML=req

//         },
//         complete:function(){
//             //请求完成的处理
//         },
//         error:function(req){
//             //请求出错处理
//         }
//     });
// }


function cclear(){
    var s = document.getElementById('dlm_code')
    s.innerHTML=''
}


