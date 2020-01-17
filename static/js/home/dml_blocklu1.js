function loadXMLDoc(dname)
{
    if (window.XMLHttpRequest)
    {
        xhttp=new XMLHttpRequest();
    }
    else
    {
        xhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xhttp.open("GET",dname,false);
    xhttp.send();
    return xhttp.responseXML;
}

Blockly.Blocks['texttovoice'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck("String")
            .appendField("语音转文字");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
    this.setTooltip("语音转文");
    this.setHelpUrl("");
    }
};
Blockly.Blocks['currency'] = {
    init: function() {
      this.appendValueInput("NAME")
          .setCheck("String")
          .appendField("图像识别");
      this.setInputsInline(true);
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(330);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};

Blockly.Blocks['imagecapture'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("摄像头");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};
Blockly.Python['imagecapture'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code ="from static.interfacepy.imagecapture import *\n" +'print(camer())\n'+"print('cc')";
    return code;
};
Blockly.Blocks['voicetext'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("语音识别");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    }
};
Blockly.Python['voicetext'] = function(block) {
    // TODO: Assemble Python into code variable.
    var code ="from static.interfacepy.voicetext import *\n"+"ans,ret=voiceTotext()\n"+'print("ret:{}".format(ret))\n'+"print(ans)\n"+'print("used time: {}s".format(round(time.time() - start_time, 2)))';
    return code;
};
Blockly.Python['texttovoice'] = function(block) {
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    // TODO: Assemble Python into code variable.
    var code ="from static.interfacepy.voiceChoose import *\n"+'voiceSring="'+value_name+'"\n'+'voiceChoose = 4\n'+'filepath="static/MP3/output.mp3"\n'+'texttovoice(voiceSring,voiceChoose,filepath)\n'+'print("语音生成成功")\n'+'print("bf")'
    return code;
};



