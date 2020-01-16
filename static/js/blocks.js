'use strict';

goog.provide('Blockly.Python.loops');

goog.require('Blockly.Python');

//物联网-wifi信息
Blockly.Python.blynk_server = function() {
	var wifi_ssid = Blockly.Python.valueToCode(this, 'wifi_ssid', Blockly.Python.ORDER_ATOMIC);
	var wifi_pass = Blockly.Python.valueToCode(this, 'wifi_pass', Blockly.Python.ORDER_ATOMIC);
	var auth_key = Blockly.Python.valueToCode(this, 'auth_key', Blockly.Python.ORDER_ATOMIC);
	var server_add = Blockly.Python.valueToCode(this, 'server_add', Blockly.Python.ORDER_ATOMIC);
	Blockly.Python.definitions_.import_time = "import network,time,BlynkLib";
	var code;
	code="wlan = network.WLAN(network.STA_IF)\n";
	code+="wlan.active(True)\n";
	code+="if not wlan.isconnected():\n";
	code+="  print('connecting to network...')\n";
	code+= "  wlan.connect("+wifi_ssid+","+wifi_pass+")\n";
	code+= "  while not wlan.isconnected():\n";
	code+= "    pass\n";
	code+= "print('network config:', wlan.ifconfig())\n";
	code+= "BLYNK_AUTH='"+"auth_key"+"'\n";
	code+= "blynk = BlynkLib.Blynk(BLYNK_AUTH)\n"
	code+= "while True:\n"
	code+= "  blynk.run()\n"
	code+= "  pass\n"
	return code;
};

//物联网-wifi信息
Blockly.Python.blynk_iot_get_data = function() {
	var Vpin = this.getFieldValue('Vpin');
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
  	args[x] = Blockly.Python.valueToCode(this, 'ARG' + x,Blockly.Python.ORDER_NONE) || 'null';
  }
  var code =  '(a' + args.join(', ') + ');\n';
  var vartype="";
  var branch = Blockly.Python.statementToCode(this, 'STACK');
  if (Blockly.Python.INFINITE_LOOP_TRAP) {
  	branch = Blockly.Python.INFINITE_LOOP_TRAP.replace(/%1/g,'\'' + this.id + '\'') + branch;
  }
  var type=this.getFieldValue('TYPE');
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
  	args[x] = this.argumentstype_[x]+ ' '+ Blockly.Python.variableDB_.getName(this.arguments_[x],Blockly.Variables.NAME_TYPE);
  }
  var GetDataCode="";
  if(this.arguments_.length==1)
  {
  	GetDataCode=Blockly.Python.variableDB_.getName(this.arguments_[0],Blockly.Variables.NAME_TYPE);
  	if(this.argumentstype_[0]=="int")
  		GetDataCode+= "= param.asInt();\n"
  	else if(this.argumentstype_[0]=="String") 
  		GetDataCode+= "= param.asStr();\n"
  	else if(this.argumentstype_[0]=="long") 
  		GetDataCode+= "= param.asDouble();\n"
  	else if(this.argumentstype_[0]=="float") 
  		GetDataCode+= "= param.asFloat();\n"
  	else if(this.argumentstype_[0]=="boolean") 
  		GetDataCode+= "= param.asInt();\n"
  	else if(this.argumentstype_[0]=="byte") 
  		GetDataCode+= "= param.asStr();\n"
  	else if(this.argumentstype_[0]=="char") 
  		GetDataCode+= "= param.asStr();\n"
  }
  else
  {
  	for (var x = 0; x < this.arguments_.length; x++) {
  		args[x] = this.argumentstype_[x]+ ' '+ Blockly.Python.variableDB_.getName(this.arguments_[x],Blockly.Variables.NAME_TYPE);

  		GetDataCode+=Blockly.Python.variableDB_.getName(this.arguments_[x],Blockly.Variables.NAME_TYPE);
  		if(this.argumentstype_[x]=="int")
  			GetDataCode+= "= param["+x+"].asInt();\n"
  		else if(this.argumentstype_[x]=="String") 
  			GetDataCode+= "= param["+x+"].asStr();\n"
  		else if(this.argumentstype_[x]=="long") 
  			GetDataCode+= "= param["+x+"].asDouble();\n"
  		else if(this.argumentstype_[x]=="float") 
  			GetDataCode+= "= param["+x+"].asFloat();\n"
  		else if(this.argumentstype_[x]=="boolean") 
  			GetDataCode+= "= param["+x+"].asInt();\n"
  		else if(this.argumentstype_[x]=="byte") 
  			GetDataCode+= "= param["+x+"].asStr();\n"
  		else if(this.argumentstype_[x]=="char") 
  			GetDataCode+= "= param["+x+"].asStr();\n"
  	}	
  }

  if(this.arguments_.length>0)
  	Blockly.Python.definitions_[args] = args.join(';\n')+";";
  var code =' BLYNK_WRITE('+ Vpin+ ') {\n' +GetDataCode+
  branch + '}\n';
 // var code =  'BLYNK_WRITE(' + Vpin+ ') {\n'+variable+" = param.as"+datatype+"();\n"+branch+'}\n';
 code = Blockly.Python.scrub_(this, code);
 Blockly.Python.definitions_[Vpin] = code;
 return null;
};


'use strict';

goog.provide('Blockly.Python.communicate');
goog.require('Blockly.Python');

Blockly.Python.requests_get = function() {
  Blockly.Python.definitions_.import_requests = "import requests";
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  var str =Blockly.Python.valueToCode(this, 'DOMAIN', Blockly.Python.ORDER_ATOMIC) ;
  var code=varName+'= '+ 'requests.get(' + str + ')\n';

  return code;
 
};


Blockly.Python.requests_attribute = function() {
  Blockly.Python.definitions_.import_requests = "import requests";
  var varName = Blockly.Python.valueToCode(this, 'VAL', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var attr = this.getFieldValue('ATTR');
  var code=varName+"." + attr;
  return [code,Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.requests_method = function() {
  Blockly.Python.definitions_.import_requests = "import requests";    
    var method = this.getFieldValue('DIR');
  var str =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  var code="requests." + method + "(" +  str  + ')\n';
  return code;
};
'use strict';

goog.provide('Blockly.Python.loops');

goog.require('Blockly.Python');

Blockly.Python.base_setup = function () {
    var branch = Blockly.Python.statementToCode(this, 'DO');
    branch = branch.replace(/(^\s*)|(\s*$)/g, "").replace(/\n    /g, '\n');//去除两端空格
    if(branch.endsWith('\n')){
        Blockly.Python.setups_['setup_setup'] = branch;
    }
    else{
        Blockly.Python.setups_['setup_setup'] = branch + '\n';
    }
    return '';
};

//ok
Blockly.Python.controls_if = function (a) {
    var b = 0,
    c = "",
    d,
    e;
    do
        e = Blockly.Python.valueToCode(a, "IF" + b, Blockly.Python.ORDER_NONE) || "False", d = Blockly.Python.statementToCode(a, "DO" + b) || Blockly.Python.PASS, c += (0 == b ? "if " : "elif ") + e + ":\n" + d, ++b;
    while (a.getInput("IF" + b));
    a.getInput("ELSE") && (d = Blockly.Python.statementToCode(a, "ELSE") || Blockly.Python.PASS, c += "else:\n" + d);
    return c
};

Blockly.Python.controls_try_finally = function () {
    var n = 0;
    var argument = Blockly.Python.valueToCode(this, 'IF' + n,
        Blockly.Python.ORDER_NONE) || 'null';
    var branch = '';
    var t = Blockly.Python.statementToCode(this, 'try') || '    pass\n';
    var code = 'try:\n' + t;
    for (n = 1; n <= this.elseifCount_; n++) {
        argument = Blockly.Python.valueToCode(this, 'IF' + n,
          Blockly.Python.ORDER_NONE) || '';
        if (argument !== '')
            argument = ' ' + argument
        branch = Blockly.Python.statementToCode(this, 'DO' + n) || '    pass\n';
        code += 'except' + argument + ': \n' + branch;
    }
    if (this.elseCount_) {
        branch = Blockly.Python.statementToCode(this, 'ELSE') || '    pass\n';
        code += 'finally:\n' + branch;
    }
    // code += '}';
    return code;
};

//ok
Blockly.Python.controls_for = function (a) {
    var b = Blockly.Python.variableDB_.getName(a.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE),
    //var b = Blockly.Python.valueToCode(a, "VAR", Blockly.Python.ORDER_MEMBER) || "''",
    c = Blockly.Python.valueToCode(a, "FROM", Blockly.Python.ORDER_NONE) || "0",
    d = Blockly.Python.valueToCode(a, "TO", Blockly.Python.ORDER_NONE) || "0",
    e = Blockly.Python.valueToCode(a, "STEP", Blockly.Python.ORDER_NONE) || "1",
    f = Blockly.Python.statementToCode(a, "DO"),
    f = Blockly.Python.addLoopTrap(f, a.id) || Blockly.Python.PASS,
    g = "",
    h = function () {
        return Blockly.Python.provideFunction_("upRange",
            ["def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(start, stop, step):", "  while start <= stop:", "    yield start", "    start += abs(step)"])
    },
    k = function () {
        return Blockly.Python.provideFunction_("downRange", ["def " + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + "(start, stop, step):", "  while start >= stop:", "    yield start", "    start -= abs(step)"])
    };
    a = function (a, b, c) {
        return "(" + a + " <= " + b + ") and " + h() + "(" + a + ", " + b + ", " + c + ") or " + k() + "(" + a + ", " + b + ", " + c + ")"
    };
    if (Blockly.isNumber(c) && Blockly.isNumber(d) &&
        Blockly.isNumber(e))
        c = parseFloat(c), d = parseFloat(d), e = Math.abs(parseFloat(e)), 0 === c % 1 && 0 === d % 1 && 0 === e % 1 ? (c <= d ? (d++, a = 0 == c && 1 == e ? d : c + ", " + d, 1 != e && (a += ", " + e)) : (d--, a = c + ", " + d + ", -" + e), a = "range(" + a + ")") : (a = c < d ? h() : k(), a += "(" + c + ", " + d + ", " + e + ")");
    else {
        var l = function (a, c) {
            if (Blockly.isNumber(a))
                a = parseFloat(a);
            else if (a.match(/^\w+$/))
                a = a;
            else {
                var d = Blockly.Python.variableDB_.getDistinctName(b + c, Blockly.Variables.NAME_TYPE);
                g += d + " = " + a + "\n";
                a = d
            }
            return a
        },
        c = l(c, "_start"),
        d = l(d, "_end");
        l(e, "_inc");
        a = "number" == typeof c && "number" == typeof d ? c < d ? h(c, d, e) : k(c, d, e) : a(c, d, e)
    }
    return g += "for " + b + " in " + a + ":\n" + f
};

Blockly.Python.controls_for_range = function (block) {
    var iter = Blockly.Python.variableDB_.getName(block.getFieldValue("VAR"), Blockly.Variables.NAME_TYPE),
    from = Blockly.Python.valueToCode(block, "FROM", Blockly.Python.ORDER_NONE) || "0",
    end = Blockly.Python.valueToCode(block, "TO", Blockly.Python.ORDER_NONE) || "0",
    step = Blockly.Python.valueToCode(block, "STEP", Blockly.Python.ORDER_NONE) || "1",
    dostatement = Blockly.Python.statementToCode(block, "DO"),
    pass = Blockly.Python.addLoopTrap(dostatement, block.id) || Blockly.Python.PASS;
    Blockly.Python.setups_["dlm_range"] = "def dlm_range(start, stop, step):\n" +
                                            "    for i in range(start, stop + 1, step):\n" +
                                            "        yield i\n\n";
    return "for " + iter + " in dlm_range(" + from + ", " + end + ", " + step + "):\n" + pass;
};

//ok
Blockly.Python.controls_repeat = Blockly.Python.controls_repeat_ext;
Blockly.Python.controls_whileUntil = function (a) {
    var b = "UNTIL" == a.getFieldValue("MODE"),
    c = Blockly.Python.valueToCode(a, "BOOL", b ? Blockly.Python.ORDER_LOGICAL_NOT : Blockly.Python.ORDER_NONE) || "False",
    d = Blockly.Python.statementToCode(a, "DO"),
    d = Blockly.Python.addLoopTrap(d, a.id) || Blockly.Python.PASS;
    b && (c = "not " + c);
    return "while " + c + ":\n" + d
};

// Blockly.Python.controls_flow_statements = function () {
//     // Flow statements: continue, break.
//     switch (this.getFieldValue('FLOW')) {
//         case 'BREAK':
//             return 'break;\n';
//         case 'CONTINUE':
//             return 'continue;\n';
//     }
//     throw 'Unknown flow statement.';
// };

//ok
Blockly.Python.controls_flow_statements = function (a) {
    switch (a.getFieldValue("FLOW")) {
    case "BREAK":
        return "break\n";
    case "CONTINUE":
        return "continue\n"
    }
    throw "Unknown flow statement.";
};

//ok
Blockly.Python.controls_delay = function () {
    var delay_time = Blockly.Python.valueToCode(this, 'DELAY_TIME', Blockly.Python.ORDER_ATOMIC) || '1000'
    var code = 'sleep(' + delay_time + ')\n';
    return code;
};
//ok
Blockly.Python.Panic_with_status_code = function () {
    var status_code = Blockly.Python.valueToCode(this, 'STATUS_CODE', Blockly.Python.ORDER_ATOMIC) || '1000'
    var code = 'panic(' + status_code + ')\n';
    return code;
};
//ok
Blockly.Python.controls_millis = function () {
    Blockly.Python.definitions_.import_time = "import time";
    var code = 'time.time()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

//ok
Blockly.Python.reset = function () {
    Blockly.Python.definitions_['import_microbit'] = 'from microbit import *'
    return 'reset()\n';
};
Blockly.Python.controls_interrupts = function () {
    return 'interrupts();\n';
};

Blockly.Python.controls_nointerrupts = function () {
    return 'noInterrupts();\n';
};


Blockly.Python['controls_forEach'] = function(block) {
  // For each loop.
  var variable0 = Blockly.Python.valueToCode(this, 'VAR',Blockly.Python.ORDER_ATOMIC) || '\'\'';
  var argument0 = Blockly.Python.valueToCode(block, 'LIST',
      Blockly.Python.ORDER_RELATIONAL) || '[]';
  var branch = Blockly.Python.statementToCode(block, 'DO');
  branch = Blockly.Python.addLoopTrap(branch, block.id) ||
      Blockly.Python.PASS;
  var code = 'for ' + variable0 + ' in ' + argument0 + ':\n' + branch;
  return code;
};


Blockly.Python.controls_range = function () {
    var from = Blockly.Python.valueToCode(this, "FROM", Blockly.Python.ORDER_NONE) || "0";
    var end = Blockly.Python.valueToCode(this, "TO", Blockly.Python.ORDER_NONE) || "0";
    var step = Blockly.Python.valueToCode(this, "STEP", Blockly.Python.ORDER_NONE) || "1";
    var code = "range(" + from + ", " + end + ", " + step + ")";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.controls_lambda = function (a) {
    var c = Blockly.Python.valueToCode(a, "BOOL", Blockly.Python.ORDER_NONE) || "None",
    d = Blockly.Python.statementToCode(a, "DO") || "pass";
    var code = "lambda " + c + ": " + d;
    code = code.replace('\n','').replace('    ','')
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.time_sleep = function () {
    Blockly.Python.definitions_['import_time'] = 'import time';
    var delay_time = Blockly.Python.valueToCode(this, 'DELAY_TIME', Blockly.Python.ORDER_ATOMIC) || '1000'
    var code = 'time.sleep(' + delay_time + ')\n';
    return code;
};

Blockly.Python.controls_pass = function () {
    return 'pass\n';
};

Blockly.Python.controls_thread = function () {
   Blockly.Python.definitions_['import__thread'] = 'import _thread';
    var v = Blockly.Python.valueToCode(this, "VAR", Blockly.Python.ORDER_NONE) || "None";
    var callback = Blockly.Python.valueToCode(this, "callback", Blockly.Python.ORDER_NONE) || "None";
    var code = "_thread.start_new_thread("+ callback +", "+ v +")\n";
    return code;
};

Blockly.Python.base_type=Blockly.Python.controls_type;
Blockly.Python.controls_TypeLists=Blockly.Python.controls_typeLists;
'use strict';

goog.provide('Blockly.Python.data');

goog.require('Blockly.Python');


Blockly.Python.series_create = function() {
  Blockly.Python.definitions_.import_pandas = "import pandas";
  var dropdown_type = this.getFieldValue('TYPE');
  var varName1 = Blockly.Python.valueToCode(this, 'SER', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  var code=varName+' = ' + 'pandas.Series(' + varName1 + ')\n';
  return code;
 
};

Blockly.Python.series_create_from_index = function() {
  Blockly.Python.definitions_.import_pandas = "import pandas";
  var dropdown_type = this.getFieldValue('TYPE');
  var varName1 = Blockly.Python.valueToCode(this, 'SER', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var varName2 = Blockly.Python.valueToCode(this, 'INDEX',Blockly.Python.ORDER_ATOMIC) || '\'\'';
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  var code=varName+' = ' + 'pandas.Series('  + varName1 + ','  + 'index=' + varName2 + ')\n';
  return code;
 
};

Blockly.Python.dataframe_create = function() {
  Blockly.Python.definitions_.import_pandas = "import pandas";
  var dropdown_type = this.getFieldValue('TYPE');
  var varName1 = Blockly.Python.valueToCode(this, 'SER', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  var code=varName+' = ' + 'pandas.DataFrame(' + varName1 + ')\n';
  return code;
 
};

Blockly.Python.dataframe_create_from_index = function() {
  Blockly.Python.definitions_.import_pandas = "import pandas";
  var dropdown_type = this.getFieldValue('TYPE');
  var varName1 = Blockly.Python.valueToCode(this, 'SER', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var varName2 = Blockly.Python.valueToCode(this, 'INDEX_COLUMN',Blockly.Python.ORDER_ATOMIC) || '\'\'';
  var varName3 = Blockly.Python.valueToCode(this, 'INDEX_RAW',Blockly.Python.ORDER_ATOMIC) || '\'\'';  
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  var code=varName+' = ' + 'pandas.DataFrame('  + varName1 + ','  + 'columns=' + varName2 + ',index=' + varName3 + ')\n';
  return code;
 
};

Blockly.Python.dataframe_create_from_one_index = function() {
  Blockly.Python.definitions_.import_pandas = "import pandas";
  var dropdown_type = this.getFieldValue('TYPE');
  var name = this.getFieldValue('COLUMN_RAW');
  var varName1 = Blockly.Python.valueToCode(this, 'SER', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var varName2 = Blockly.Python.valueToCode(this, 'INDEX',Blockly.Python.ORDER_ATOMIC) || '\'\'';  
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  var code=varName+' = ' + 'pandas.DataFrame('  + varName1 + ','  + name + '=' + varName2  + ')\n';
  return code;
 
};

Blockly.Python.series_create_from_text = function() {
  Blockly.Python.definitions_.import_pandas = "import pandas";
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  
  var text=this.getFieldValue('TEXT');  
  var code = varName+' = '+ 'pandas.Series([' + text + '])\n';
  return code;
};

Blockly.Python.series_index_value = function() {
  Blockly.Python.definitions_.import_pandas = "import pandas";
  var varName = Blockly.Python.valueToCode(this, 'SERIES', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var name = this.getFieldValue('INDEX_VALUE');
  var code=varName+'.'+name;
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.series_get_num = function() {
  // Indexing into a list is the same as indexing into a string.
  var varName = Blockly.Python.valueToCode(this, 'SER', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument0 = Blockly.Python.valueToCode(this, 'AT',
    Blockly.Python.ORDER_ADDITIVE) || '1';
  
  var code=varName+'['+argument0+']';
  return [code,Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.pl_show = function(){
  Blockly.Python.definitions_.import_pylab = "import pylab";
  var code='pylab.show()\n';
  return code;
};

Blockly.Python.pl_plot = function(){
  Blockly.Python.definitions_.import_pylab = "import pylab";
  var line = this.getFieldValue('LINE');
  var color = this.getFieldValue('COLOR');
  var dot = this.getFieldValue('DOT');
  var varName = Blockly.Python.valueToCode(this, 'SER', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code='pylab.plot(' + varName + ",'" + dot + line  + color + "')\n";
  return code;
};

Blockly.Python.pl_legend = function(){
  Blockly.Python.definitions_.import_pylab = "import pylab";
  var code='pylab.legend()\n';
  return code;
};

Blockly.Python.pl_title = function(){
  Blockly.Python.definitions_.import_pylab = "import pylab";
  var a =  Blockly.Python.valueToCode(this, 'TITLE', Blockly.Python.ORDER_ATOMIC);
  var code='pylab.title(' + a + ')\n';
  return code;
};

Blockly.Python.pl_label = function(){
  Blockly.Python.definitions_.import_pylab = "import pylab";
  var direction = this.getFieldValue('DIR');
  var a =  Blockly.Python.valueToCode(this, 'LABEL', Blockly.Python.ORDER_ATOMIC) ;
  var code='pylab.' + direction + 'label(' + a + ')\n';
  return code;
};



/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Python for dictionary blocks.
 * @author acbart@vt.edu (Austin Cory Bart)
 */
'use strict';

goog.provide('Blockly.Python.dicts');

goog.require('Blockly.Python');

Blockly.Python['dict_get'] = function(block) {
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '___';
  var value = Blockly.Python.valueToCode(block, 'ITEM',
      Blockly.Python.ORDER_NONE) || '___';
  var code = dict + '[' + value + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.dicts_create_with = function() {
  // Create a list with any number of elements of any type.
  //var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  //var size=window.parseFloat(this.getFieldValue('SIZE'));
  var code = new Array(this.itemCount_);
  var default_value = '0';
  


  for (var n = 0; n < this.itemCount_; n++) {

  var keyName = this.getFieldValue('KEY' + n);
    
  code[n] = keyName+":"+(Blockly.Python.valueToCode(this, 'ADD' + n, Blockly.Python.ORDER_NONE) || default_value);
  }
  var code = varName+'= '+ '{' + code.join(', ') + '}\n';
  //var code =''+varName+'['+size+"]"+'='+ '{' + code.join(', ') + '};\n';
  //Blockly.Python.setups_['setup_lists'+varName] = code;
  return code;
};



Blockly.Python.dicts_keys = function() {
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+'.keys()';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.dicts_get = function() {
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  //var size=window.parseFloat(this.getFieldValue('SIZE'));
  var text = Blockly.Python.valueToCode(this, 'KEY', Blockly.Python.ORDER_ASSIGNMENT);
  // var text=this.getFieldValue('KEY');
  var code = varName+"[" + text + "]";
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.dicts_add_or_change = function(){
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || 'mydict';
  var text = Blockly.Python.valueToCode(this, 'KEY', Blockly.Python.ORDER_ASSIGNMENT);
  // var text=this.getFieldValue('KEY');
  var argument = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + "["  + text + "] = " + argument+'\n';
  return code;
};

Blockly.Python.dicts_delete = function() {
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || 'mydict';
  var text = Blockly.Python.valueToCode(this, 'KEY', Blockly.Python.ORDER_ASSIGNMENT);
  // var text=this.getFieldValue('KEY');
  var code= "del "+ varName+"[" + text + "]\n";
  return code;
};

Blockly.Python.dicts_update = function() {
 var varName2 = Blockly.Python.valueToCode(this, 'DICT2', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+'.update(' + varName2 +')\n';
  return code;
};

Blockly.Python.dicts_clear = function() {
 var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+'.clear()\n';
  return code;
};

Blockly.Python.dicts_items = function() {
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+'.items()';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.dicts_values = function() {
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+'.values()';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.dicts_length = function() {
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code='len(' +varName + ')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.dicts_deldict = function() {
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code='del ' + varName + '\n';
  return code;
};

Blockly.Python.dicts_add_change_del = function(block){
  var dict = Blockly.Python.valueToCode(block, 'DICT',
      Blockly.Python.ORDER_MEMBER) || '[]';
  var mode = block.getFieldValue('WHERE');
  var where = block.getFieldValue('OP');
  var KEY = Blockly.Python.valueToCode(this, 'KEY', Blockly.Python.ORDER_ASSIGNMENT);
  // var text=this.getFieldValue('KEY');
  
  

  switch (mode) {
    case 'INSERT':
      //var at2 = block.getFieldValue('AT2');
      var at2 = Blockly.Python.valueToCode(this, 'AT2', Blockly.Python.ORDER_ASSIGNMENT) || '0';
      var code = dict + "["  + KEY + "] = " + at2 + '\n'
      break;
    
    case 'DELETE':
      var code = 'del ' + dict + "["  + KEY + "]\n"
      break;
    default:
      throw 'Unhandled option (lists_setIndex2)';
  }
  return code;
};

Blockly.Python.dicts_pop = function(){
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var text = Blockly.Python.valueToCode(this, 'KEY', Blockly.Python.ORDER_ASSIGNMENT);
  // var text=this.getFieldValue('KEY');
  var code=varName + ".pop("  + text + ")";
  return [code, Blockly.Python.ORDER_ATOMIC];
}


Blockly.Python.dicts_setdefault = function() {
  var varName = Blockly.Python.valueToCode(this, 'DICT', Blockly.Python.ORDER_ASSIGNMENT) || 'mydict';
  var text = Blockly.Python.valueToCode(this, 'KEY', Blockly.Python.ORDER_ASSIGNMENT);
  // var text=this.getFieldValue('KEY');
  var argument = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code= varName + ".setdefault"+ "(" + text + "," + argument + ")\n";
  return code;
};

Blockly.Python.dicts_create_with_noreturn = function() {
  // Create a list with any number of elements of any type.
  // var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
  //  Blockly.Variables.NAME_TYPE);
  //var size=window.parseFloat(this.getFieldValue('SIZE'));
  var code = new Array(this.itemCount_);
  var default_value = '0';

  for (var n = 0; n < this.itemCount_; n++) {
    var keyName = this.getFieldValue('KEY' + n);
    code[n] = keyName+":"+(Blockly.Python.valueToCode(this, 'ADD' + n, Blockly.Python.ORDER_NONE) || default_value);
  }
 // if (this.itemCount_!=1){
//  Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ '(' + code.join(', ') + ')\n';}
 // else {
 // Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ '(' + code.join(', ') + ',)\n';}
 if (this.itemCount_!=1){
  var code = '{' + code.join(', ') + '}';}
 else {
  var code = '{' + code.join(', ') + ',}';}

  return [code, Blockly.Python.ORDER_ATOMIC];
};
'use strict';

goog.provide('Blockly.Python.factory');
goog.require('Blockly.Python');

Blockly.Python.factory_from_import = function() {
	var path = this.getFieldValue('path');
	var module = this.getFieldValue('module');
	Blockly.Python.definitions_['import_'+path+'_'+module] = 'from '+path+' import ' + module;	
	return '';
};

Blockly.Python.factory_import = function() {
	var module = this.getFieldValue('module');
	Blockly.Python.definitions_['import_'+module] = 'import ' + module;
	return '';
};

Blockly.Python.factory_function_noreturn = function() {
	var NAME = this.getFieldValue('NAME');
	var code = new Array(this.itemCount_);
	for (var n = 0; n < this.itemCount_; n++) {
		code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
			Blockly.Python.ORDER_NONE) || '';
	}
	return NAME+'('+code.join(', ')+')\n';
};

Blockly.Python.factory_function_return = function() {
	var NAME = this.getFieldValue('NAME');
	var code = new Array(this.itemCount_);
	for (var n = 0; n < this.itemCount_; n++) {
		code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
			Blockly.Python.ORDER_NONE) || '';
	}
	return [NAME+'('+code.join(', ')+')',Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.factory_declare = function() {
	var TYPE = this.getFieldValue('TYPE');
	var NAME = this.getFieldValue('NAME');
	return NAME+' = ' + TYPE + '()\n';

};

Blockly.Python.factory_callMethod_noreturn = function() {
	var NAME = this.getFieldValue('NAME');
	var METHOD = this.getFieldValue('METHOD');
	var code = new Array(this.itemCount_);
	for (var n = 0; n < this.itemCount_; n++) {
		code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
			Blockly.Python.ORDER_NONE) || '';
	}
	return NAME+'.'+METHOD+'('+code.join(', ')+')\n';
};

Blockly.Python.factory_callMethod_return = function() {
	var NAME = this.getFieldValue('NAME');
	var METHOD = this.getFieldValue('METHOD');
	var code = new Array(this.itemCount_);
	for (var n = 0; n < this.itemCount_; n++) {
		code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
			Blockly.Python.ORDER_NONE) || '';
	}
	return [NAME+'.'+METHOD+'('+code.join(', ')+')',Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.factory_block = function() {
	var VALUE = this.getFieldValue('VALUE');
	//if(!(VALUE.charAt(VALUE.length-1)==";")){
		//VALUE=VALUE+';';
	//}
	return VALUE+'\n';
};

Blockly.Python.factory_block_return = function() {
	var VALUE = this.getFieldValue('VALUE');
	return [VALUE,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.factory_block_with_textarea = function() {
	var VALUE = this.getFieldValue('VALUE');
	//if(!(VALUE.charAt(VALUE.length-1)==";")){
		//VALUE=VALUE+';';
	//}
	return VALUE+'\n';
};

Blockly.Python.factory_block_return_with_textarea = function() {
	var VALUE = this.getFieldValue('VALUE');
	return [VALUE,Blockly.Python.ORDER_ATOMIC];
};

'use strict';

goog.provide('Blockly.Python.hardware');

goog.require('Blockly.Python');

Blockly.Python.hardware_arduino_start=function(){
  Blockly.Python.definitions_['import_s4alib'] = 'import s4alib';
  var v = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
  // var code= v + '.start()\n';  
  var code = v + ' = s4alib.s4a_start("'+JSFuncs.getCom()+'")\n'; 
  return code;
};

Blockly.Python.inout_highlow = function () {
    // Boolean values HIGH and LOW.
    var code = (this.getFieldValue('BOOL') == 'HIGH') ? '1' : '0';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.hardware_arduino_digital_write = function () {
    Blockly.Python.definitions_['import_s4alib'] = 'import s4alib';
    var v = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var dropdown_pin = Blockly.Python.valueToCode(this, 'PIN', Blockly.Python.ORDER_ATOMIC);
    var dropdown_stat = Blockly.Python.valueToCode(this, 'STAT', Blockly.Python.ORDER_ATOMIC);
    var code = "";
    code += ''+v+'.digital_write('+dropdown_pin+','+ dropdown_stat +')\n'
    return code;
};

Blockly.Python.hardware_arduino_digital_read = function () {
    Blockly.Python.definitions_['import_s4alib'] = 'import s4alib';
    var v = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var dropdown_pin = Blockly.Python.valueToCode(this, 'PIN', Blockly.Python.ORDER_ATOMIC);
    var code = "";
    code =''+v+'.digital_read('+dropdown_pin+')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.hardware_arduino_analog_read = function () {
    Blockly.Python.definitions_['import_s4alib'] = 'import s4alib';
    var v = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var dropdown_pin = Blockly.Python.valueToCode(this, 'PIN', Blockly.Python.ORDER_ATOMIC);
    var code = "";
    code =''+v+'.analog_read('+dropdown_pin+')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.hardware_arduino_analog_write = function () {
    Blockly.Python.definitions_['import_s4alib'] = 'import s4alib';
    var v = Blockly.Python.valueToCode(this, 'SUB', Blockly.Python.ORDER_ATOMIC);
    var dropdown_pin = Blockly.Python.valueToCode(this, 'PIN', Blockly.Python.ORDER_ATOMIC);
    var value_num = Blockly.Python.valueToCode(this, 'NUM', Blockly.Python.ORDER_ATOMIC);
    var code = "";
    code += ''+v+'.analog_write('+dropdown_pin+','+ value_num +')\n'
    return code;
};

var profile = {
    hardware_arduino: {
        description: "hardware_arduino",
        analog_write: [["5", "5"], ["6", "6"], ["9", "9"]],
        analog_read: [["A0", "0"], ["A1", "1"], ["A2", "2"], ["A3", "3"], ["A4", "4"], ["A5", "5"]],
        digital_read: [["2", "2"], ["3", "3"]],
        digital_write: [["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"]],        
    }
};

profile["default"] = profile["hardware_arduino"];
'use strict';

goog.provide('Blockly.Python.base');

goog.require('Blockly.Python');
// ok


Blockly.Python.inout_input = function() {
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  return ['input(' + str+')', Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.inout_print = function() {
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  var code = "print("+str+")\n";
  return code;
};

Blockly.Python.inout_print_inline = function() {
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  var code = "print("+str+',end ="")\n';
  return code;
};

Blockly.Python.inout_print_end = function() {
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  var end = Blockly.Python.valueToCode(this, 'END', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  var code = "print("+str+',end =' + end + ')\n';
  return code;
};

Blockly.Python.inout_type_input = function() {
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  var type = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  if (type=='str') {var code = 'input(' + str +')'}
  	else if (type=='int') {var code = 'int(input(' + str +'))'}
  		else if (type=='float') {var code = 'float(input(' + str +'))'}
  //var code=varname+"." + type + "("   + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.inout_print_many = function() {
  
  var dropdown_type = this.getFieldValue('TYPE');
  
  var code = new Array(this.itemCount_);
  var default_value = '0';


  for (var n = 0; n < this.itemCount_; n++) {

  code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
    Blockly.Python.ORDER_NONE) || default_value;
  }

  var code = 'print(' + code.join(', ') + ')\n';
  return code;
};
'use strict';

goog.provide('Blockly.Python.lists');

goog.require('Blockly.Python');




Blockly.Python['lists_get_sublist'] = function(block) {
  // Get sublist.
  var list = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ADDITIVE) || 'mylist';
  var at1 =  Blockly.Python.valueToCode(this, 'AT1', Blockly.Python.ORDER_ADDITIVE) ;
  var at2 =  Blockly.Python.valueToCode(this, 'AT2', Blockly.Python.ORDER_ADDITIVE) ;
  var code = list + '[' + at1 + ' : ' + at2 + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};



Blockly.Python.lists_create_with = function() {
  // Create a list with any number of elements of any type.
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  //var size=window.parseFloat(this.getFieldValue('SIZE'));
  var code = new Array(this.itemCount_);
  var default_value = '0';


  for (var n = 0; n < this.itemCount_; n++) {

  code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
    Blockly.Python.ORDER_NONE) || default_value;
  }
  //Blockly.Python.setups_['var_declare'+varName] = varName+' = '+ '[' + code.join(', ') + ']\n';
  var code = varName+' = '+ '[' + code.join(', ') + ']\n';
  return code;
};
Blockly.Python.lists_create_with_text = function() {
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  //var size=window.parseFloat(this.getFieldValue('SIZE'));
  var text=this.getFieldValue('TEXT');
  // Blockly.Python.setups_['var_declare'+varName] = varName+' = '+ '[' + text + ']\n';
  var code = varName+' = '+ '[' + text + ']\n';
  return code;
};

Blockly.Python.lists_get_index = function() {
  // Indexing into a list is the same as indexing into a string.
  var list = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ADDITIVE) || 'mylist';
  var argument0 = Blockly.Python.valueToCode(this, 'AT', Blockly.Python.ORDER_ADDITIVE) || 0;
  var code = list +'['+argument0+']';
  return [code,Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.lists_set_index = function() {
  // Set element at index.
  var varName = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ADDITIVE) || 'mylist';
  var argument0 = Blockly.Python.valueToCode(this, 'AT',
    Blockly.Python.ORDER_ADDITIVE) || '0';
  var argument2 = Blockly.Python.valueToCode(this, 'TO',
    Blockly.Python.ORDER_ASSIGNMENT) || '0';
  // Blockly uses one-based indicies.
  return varName + '[' + argument0 + '] = ' + argument2 + '\n';
};

Blockly.Python.lists_append_extend = function(){
  var varName = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument = Blockly.Python.valueToCode(this, 'DATA', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var op = this.getFieldValue('OP');
  var code=varName + '.' + op + '('  + argument + ')\n';
  return code;
};

Blockly.Python.lists_get_random_item = function() {
  Blockly.Python.definitions_['import_random'] = 'import random';
  var varName = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ADDITIVE) || 'mylist';
  var code='random.choice(' +varName + ')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.lists_insert_value = function(){
  var varName = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var at = Blockly.Python.valueToCode(this, 'AT', Blockly.Python.ORDER_ADDITIVE) || '0';
  var VALUE = Blockly.Python.valueToCode(this, 'VALUE', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.insert('  + at + ', ' + VALUE + ')\n';  
  return code;
};


Blockly.Python.lists_reverse = function(){
  var varName = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.reverse()\n';
  return code;
}
Blockly.Python.lists_clear = function(){
  var varName = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.clear()\n';
  return code;
}

Blockly.Python.lists_find = function(){
  var op = this.getFieldValue('OP');
  var varName = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  if (op=='INDEX')
    var code = varName + '.index('  + argument + ')';
  else if (op=='COUNT')
    var code = varName + '.count('  + argument + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python.lists_remove_at = function(){
  var varName = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument = Blockly.Python.valueToCode(this, 'DATA', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var op = this.getFieldValue('OP');
  var code = "";
  if(op == "del"){
      code = 'del ' + varName + '['  + argument + ']\n';
  }else{
      code = varName + '.remove' + '('  + argument + ')\n';
  }
  return code;
};

Blockly.Python.lists_pop = function(){
  var varName = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ADDITIVE) || 'mylist';
  var argument = Blockly.Python.valueToCode(this, 'VALUE', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code = varName + '.pop('  + argument + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python.list_trig = function (a) {
  var b = a.getFieldValue("OP"), c;
  Blockly.Python.definitions_['import_math'] = "import math";
  a = Blockly.Python.valueToCode(a, 'data', Blockly.Python.ORDER_NONE) 
  switch (b) {
  case "LEN":
  c = "len(" + a + ")";
  break;
  case "SUM":
  c = "sum(" + a + ")";
  break;
  case "MIN":
  c = "min(" + a + ")";
  break;
  case "MAX":
  c = "max(" + a + ")";
  break;
  case 'AVERAGE':
  // Blockly.Python.definitions_['from_numbers_import_Number'] =
  //   'from numbers import Number';
  var functionName = Blockly.Python.provideFunction_(
    'math_mean',
    // This operation excludes null and values that aren't int or float:',
    // math_mean([null, null, "aString", 1, 9]) == 5.0.',
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(myList):',
     '  localList = [e for e in myList if type(e) == int or type(e) == float]',
     '  if not localList: return',
     '  return float(sum(localList)) / len(localList)']);
  c = functionName + '(' + a + ')';
  break;
case 'MEDIAN':
  // Blockly.Python.definitions_['from_numbers_import_Number'] =
  //   'from numbers import Numberd';
  var functionName = Blockly.Python.provideFunction_(
    'math_median',
    // This operation excludes null values:
    // math_median([null, null, 1, 3]) == 2.0.
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(myList):',
     '  localList = sorted([e for e in myList if type(e) == int or type(e) == float])',
     '  if not localList: return',
     '  if len(localList) % 2 == 0:',
     '    return (localList[len(localList) // 2 - 1] + ' +
       'localList[len(localList) // 2]) / 2.0',
     '  else:',
     '    return localList[(len(localList) - 1) // 2]']);
  c = functionName + '(' + a + ')';
  break;
case 'MODE':
  var functionName = Blockly.Python.provideFunction_(
    'math_modes',
    // As a list of numbers can contain more than one mode,
    // the returned result is provided as an array.
    // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(some_list):',
     '  modes = []',
     '  # Using a lists of [item, count] to keep count rather than dict',
     '  # to avoid "unhashable" errors when the counted item is ' +
       'itself a list or dict.',
     '  counts = []',
     '  maxCount = 1',
     '  for item in some_list:',
     '    found = False',
     '    for count in counts:',
     '      if count[0] == item:',
     '        count[1] += 1',
     '        maxCount = max(maxCount, count[1])',
     '        found = True',
     '    if not found:',
     '      counts.append([item, 1])',
     '  for counted_item, item_count in counts:',
     '    if item_count == maxCount:',
     '      modes.append(counted_item)',
     '  return modes']);
  c = functionName + '(' + a + ')';
  break;
case 'STD_DEV':
  Blockly.Python.definitions_['import_math'] = 'import math';
  var functionName = Blockly.Python.provideFunction_(
    'math_standard_deviation',
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(numbers):',
     '  n = len(numbers)',
     '  if n == 0: return',
     '  mean = float(sum(numbers)) / n',
     '  variance = sum((x - mean) ** 2 for x in numbers) / n',
     '  return math.sqrt(variance)']);
  c = functionName + '(' + a + ')';
  break;
  default:
  throw 'Unknown operator: ' + b;
  }
  if (c)
  return [c, Blockly.Python.ORDER_ATOMIC];
  
};


Blockly.Python['lists_sort'] = function(block) {
  // Block for sorting a list.
  var list = (Blockly.Python.valueToCode(block, 'LIST',
    Blockly.Python.ORDER_NONE) || '[]');
  var type = block.getFieldValue('TYPE');
  var reverse = block.getFieldValue('DIRECTION') === '1' ? 'False' : 'True';
  var sortFunctionName = Blockly.Python.provideFunction_('lists_sort',
  ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ +
    '(my_list, type, reverse):',
  '  def try_float(s):',
  '    try:',
  '      return float(s)',
  '    except:',
  '      return 0',
  '  key_funcs = {',
  '    "NUMERIC": try_float,',
  '    "TEXT": str,',
  '    "IGNORE_CASE": lambda s: str(s).lower()',
  '  }',
  '  key_func = key_funcs[type]',
  '  list_cpy = list(my_list)', // Clone the list.
  '  return sorted(list_cpy, key=key_func, reverse=reverse)'
  ]);

  var code = sortFunctionName +
    '(' + list + ', "' + type + '", ' + reverse + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.lists_change_to = function(){
  var op = this.getFieldValue('OP');
  var varName = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code = op + '(' + varName + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
}


Blockly.Python.list_many_input = function() {
  var text=this.getFieldValue('CONTENT');
  var code='['+text+']'
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.lists_create_with_noreturn = function() {
  // Create a list with any number of elements of any type.
  var code = new Array(this.itemCount_);
  var default_value = '0';
  for (var n = 0; n < this.itemCount_; n++) {
      code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
        Blockly.Python.ORDER_NONE) || default_value;
  }
  var code = '[' + code.join(', ') + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.lists_change_to_general = Blockly.Python.lists_change_to;

Blockly.Python.lists_del_general = function() {
  var varName = Blockly.Python.valueToCode(this, 'TUP', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code='del ' + varName + '\n';
  return code;
};



Blockly.Python['lists_create_with2'] = Blockly.Python['lists_create_with']
Blockly.Python['lists_create_with_text2'] = Blockly.Python['lists_create_with_text']
Blockly.Python['lists_getIndex3'] = Blockly.Python['lists_get_index']
Blockly.Python['lists_getSublist3'] = Blockly.Python['lists_get_sublist']
Blockly.Python['lists_setIndex3'] = Blockly.Python['lists_set_index']
Blockly.Python['lists_insert_value2'] = Blockly.Python['lists_insert_value']
Blockly.Python['lists_remove_at2'] = Blockly.Python['lists_remove_at']

Blockly.Python.lists_zip = function() {    
  var dropdown_type = this.getFieldValue('TYPE');  
  var code = new Array(this.itemCount_);
  var default_value = '[]';
  for (var n = 0; n < this.itemCount_; n++) {
     code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
    Blockly.Python.ORDER_NONE) || default_value;
  }
  var code = 'zip(' + code.join(', ') + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
'use strict';

goog.provide('Blockly.Python.logic');

goog.require('Blockly.Python');

Blockly.Python.logic_compare = function() {
  // Comparison operator.
  var mode = this.getFieldValue('OP');
  var operator = Blockly.Python.logic_compare.OPERATORS[mode];
  var order = (operator == '==' || operator == '!=') ?
      Blockly.Python.ORDER_EQUALITY : Blockly.Python.ORDER_RELATIONAL;
  var argument0 = Blockly.Python.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Python.valueToCode(this, 'B', order) || '0';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Python.logic_compare_continous = function() {
  // Comparison operator.
  var mode1 = this.getFieldValue('OP1');
  var operator1 = Blockly.Python.logic_compare.OPERATORS[mode1];
  var mode2 = this.getFieldValue('OP2');
  var operator2 = Blockly.Python.logic_compare.OPERATORS[mode2];  
  var argument0 = Blockly.Python.valueToCode(this, 'A', Blockly.Python.ORDER_RELATIONAL) || '0';
  var argument1 = Blockly.Python.valueToCode(this, 'B', Blockly.Python.ORDER_RELATIONAL) || '0';
  var argument2 = Blockly.Python.valueToCode(this, 'C', Blockly.Python.ORDER_RELATIONAL) || '0';
  var code = argument0 + ' ' + operator1 + ' ' + argument1 + ' ' + operator2 + ' ' + argument2;
  return [code, Blockly.Python.ORDER_RELATIONAL];
};

Blockly.Python.logic_compare.OPERATORS = {
  EQ: '==',
  NEQ: '!=',
  LT: '<',
  LTE: '<=',
  GT: '>',
  GTE: '>='
};

Blockly.Python.logic_operation = function() {
  // Operations 'and', 'or'.
  var operator = (this.getFieldValue('OP') == 'AND') ? 'and' : 'or';
  var order = (operator == '&&') ? Blockly.Python.ORDER_LOGICAL_AND :
      Blockly.Python.ORDER_LOGICAL_OR;
  var argument0 = Blockly.Python.valueToCode(this, 'A', order) || 'False';
  var argument1 = Blockly.Python.valueToCode(this, 'B', order) || 'False';
  var code = argument0 + ' ' + operator + ' ' + argument1;
  return [code, order];
};

Blockly.Python.logic_negate = function() {
  // Negation.
  var order = Blockly.Python.ORDER_UNARY_PREFIX;
  var argument0 = Blockly.Python.valueToCode(this, 'BOOL', order) || 'False';
  var code = 'not ' + argument0;
  return [code, order];
};

Blockly.Python.logic_boolean = function() {
  // Boolean values true and false.
  var code = (this.getFieldValue('BOOL') == 'TRUE') ? 'True' : 'False';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.logic_null = function() {
  var code = 'None';
  return [code ,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.logic_true_or_false = function() {
  var a = Blockly.Python.valueToCode(this, 'A',Blockly.Python.ORDER_ATOMIC) || 'False';
  var b = Blockly.Python.valueToCode(this, 'B',Blockly.Python.ORDER_ATOMIC) || 'False';
  var c = Blockly.Python.valueToCode(this, 'C',Blockly.Python.ORDER_ATOMIC) || 'False';
  var code=b+' if '+a+' else '+c;
  return [code ,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.logic_is_in = function() {
  var a = Blockly.Python.valueToCode(this, 'A',Blockly.Python.ORDER_ATOMIC) || '\'\'';
  var b = Blockly.Python.valueToCode(this, 'B',Blockly.Python.ORDER_ATOMIC) || '\'\'';
  var code=a+' in '+b;
  return [code ,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.logic_is = function() {
  var a = Blockly.Python.valueToCode(this, 'A',Blockly.Python.ORDER_ATOMIC) || '\'\'';
  var b = Blockly.Python.valueToCode(this, 'B',Blockly.Python.ORDER_ATOMIC) || '\'\'';
  var code=a+' is '+b;
  return [code ,Blockly.Python.ORDER_ATOMIC];
};
'use strict';

goog.provide('Blockly.Python.math');

goog.require('Blockly.Python');


// Blockly.Python.math_number = function() {
//   // Numeric value.
//   var code = (this.getFieldValue('NUM'));
//   // -4.abs() returns -4 in Dart due to strange order of operation choices.
//   // -4 is actually an operator and a number.  Reflect this in the order.
//   var order = code < 0 ?
//       Blockly.Python.ORDER_UNARY_PREFIX : Blockly.Python.ORDER_ATOMIC;
//   return [code, order];
// };

Blockly.Python.math = {};
Blockly.Python.addReservedWords("math,random,Number");
Blockly.Python.math_number = function () {
  // a = parseFloat(a.getFieldValue("NUM"));
  // var b;
  // Infinity == a ? (a = 'float("inf")', b = Blockly.Python.ORDER_FUNCTION_CALL) : -Infinity == a ? (a = '-float("inf")', b = Blockly.Python.ORDER_UNARY_SIGN) : b = 0 > a ? Blockly.Python.ORDER_UNARY_SIGN : Blockly.Python.ORDER_ATOMIC;
  // return [a, b]

  var code = this.getFieldValue('NUM');
  // -4.abs() returns -4 in Dart due to strange order of operation choices.
  // -4 is actually an operator and a number.  Reflect this in the order.
  var order = code < 0 ?
      Blockly.Python.ORDER_UNARY_PREFIX : Blockly.Python.ORDER_ATOMIC;
  return [code, order];
};

Blockly.Python.math_constant = function() {
  Blockly.Python.definitions_.import_math = "import math";
  var name = this.getFieldValue('CONSTANT');
  var code='math.'+name;
  return [code,Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.math_bit = function() {
  var operator = this.getFieldValue('OP');;
  var order = Blockly.Python.ORDER_ATOMIC;
  var argument0 = Blockly.Python.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Python.valueToCode(this, 'B', order) || '0';
  var code = '('+argument0 + operator + argument1+')';
  return [code, order];
};


Blockly.Python.math_arithmetic = function (a) {
  var b = {
    ADD : [" + ", Blockly.Python.ORDER_ADDITIVE],
    MINUS : [" - ", Blockly.Python.ORDER_ADDITIVE],
    MULTIPLY : [" * ", Blockly.Python.ORDER_MULTIPLICATIVE],
    DIVIDE : [" / ", Blockly.Python.ORDER_MULTIPLICATIVE],
    QUYU: [' % ', Blockly.Python.ORDER_MULTIPLICATIVE],//增加取余操作
    ZHENGCHU: [' // ', Blockly.Python.ORDER_MULTIPLICATIVE],//增加整除操作
    POWER : [" ** ", Blockly.Python.ORDER_EXPONENTIATION]
  }
  [a.getFieldValue("OP")],
  c = b[0],
  b = b[1],
  d = Blockly.Python.valueToCode(a, "A", b) || "0";
  a = Blockly.Python.valueToCode(a, "B", b) || "0";
  return [d + c + a, b]
};

Blockly.Python.math_selfcalcu = function (a) {    
  var argument0 = Blockly.Python.valueToCode(this, 'A', Blockly.Python.ORDER_RELATIONAL) || '0';
  var argument1 = Blockly.Python.valueToCode(this, 'B', Blockly.Python.ORDER_RELATIONAL) || '0';
  var operator = this.getFieldValue('OP');
  switch (operator){
    case 'ADD':var op = '+=';break;
    case 'MINUS':var op = '-=';break;
    case 'MULTIPLY':var op = '*=';break;
    case 'DIVIDE':var op = '/=';break;
    case 'QUYU':var op = '%=';break;
    case 'ZHENGCHU':var op = '//=';break;
    case 'POWER':var op = '**=';break;
  }
  var code = argument0 + ' ' + op + ' ' + argument1 + '\n';
  return code;
};



Blockly.Python.math_single = function (a) {
  var b = a.getFieldValue("OP"),
  c;
  if ("NEG" == b)
    return c = Blockly.Python.valueToCode(a, "NUM", Blockly.Python.ORDER_UNARY_SIGN) || "0", ["-" + c, Blockly.Python.ORDER_UNARY_SIGN];
  Blockly.Python.definitions_['import_math'] = "import math";
  a = "SIN" == b || "COS" == b || "TAN" == b ? Blockly.Python.valueToCode(a, "NUM", Blockly.Python.ORDER_MULTIPLICATIVE) || "0" : Blockly.Python.valueToCode(a, "NUM", Blockly.Python.ORDER_NONE) || "0";
  switch (b) {
  case "ABS":
    c = "math.fabs(" + a + ")";
    break;
  case "ROOT":
    c = "math.sqrt(" +
      a + ")";
    break;
  case "LN":
    c = "math.log(" + a + ")";
    break;
  case "LOG10":
    c = "math.log10(" + a + ")";
    break;
  case "EXP":
    c = "math.exp(" + a + ")";
    break;
  case "POW10":
    c = "math.pow(10," + a + ")";
    break;
  case "ROUND":
    c = "round(" + a + ")";
    break;
  case "ROUNDUP":
    c = "math.ceil(" + a + ")";
    break;
  case "ROUNDDOWN":
    c = "math.floor(" + a + ")";
    break;
  case "SIN":
    c = "math.sin(" + a + ")";
    break;
  case "COS":
    c = "math.cos(" + a + ")";
    break;
  case "TAN":
    c = "math.tan(" + a + ")";
    break;
  case "++":
    c = "++(" + a + ")";
    break;
  case "--":
    c = "--(" + a + ")";
    break;
  case "-":
    c = "-(" + a + ")";
    break;
  default:
  }
  if (c)
    return [c, Blockly.Python.ORDER_FUNCTION_CALL];
  switch (b) {
  case "ASIN":
    c = "math.degrees(math.asin(" + a + "))";
    break;
  case "ACOS":
    c = "math.degrees(math.acos(" + a + "))";
    break;
  case "ATAN":
    c = "math.degrees(math.atan(" + a + "))";
    break;

    throw "Unknown math operator: " + b;
  }
  return [c, Blockly.Python.ORDER_MULTIPLICATIVE]
};


Blockly.Python.math_trig = Blockly.Python.math_single;


Blockly.Python.math_to_int = function() {
  var argument0 = Blockly.Python.valueToCode(this, 'A',Blockly.Python.ORDER_NONE) || '0';
  var operator = this.getFieldValue('OP');
  var code = "";
  if(operator === "round"){
      code= operator+'('+argument0+')';
  }else{
      code= "math." + operator+'('+argument0+')';
      Blockly.Python.definitions_.import_math = "import math";
  }
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.math_max_min = function() {
  var a = Blockly.Python.valueToCode(this, 'A',Blockly.Python.ORDER_NONE) || '0';
  var b = Blockly.Python.valueToCode(this, 'B',Blockly.Python.ORDER_NONE) || '0';
  var operator = this.getFieldValue('OP');
  var code=operator+'('+a+', '+b+')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.math_random = function() {
  Blockly.Python.definitions_.import_random = "import random";
  // Random integer between [X] and [Y].
  var type = this.getFieldValue('TYPE');
  var argument0 = Blockly.Python.valueToCode(this, 'FROM',
      Blockly.Python.ORDER_NONE) || '0';
  var argument1 = Blockly.Python.valueToCode(this, 'TO',
      Blockly.Python.ORDER_NONE) || '0';
  if (type=='int'){
    var code = 'random.randint(' + argument0 +  ', ' + argument1 + ')';
  }else if (type=='float'){
    var code = 'random.uniform(' + argument0 +  ', ' + argument1 + ')';  
  }
  return [code, Blockly.Python.ORDER_UNARY_POSTFIX];
};


Blockly.Python.math_map = function() {
  var value_num = Blockly.Python.valueToCode(this, 'NUM', Blockly.Python.ORDER_NONE);
  var value_fl = Blockly.Python.valueToCode(this, 'fromLow', Blockly.Python.ORDER_ATOMIC);
  var value_fh = Blockly.Python.valueToCode(this, 'fromHigh', Blockly.Python.ORDER_ATOMIC);
  var value_tl = Blockly.Python.valueToCode(this, 'toLow', Blockly.Python.ORDER_ATOMIC);
  var value_th = Blockly.Python.valueToCode(this, 'toHigh', Blockly.Python.ORDER_ATOMIC);
  Blockly.Python.setups_["dlm_mapping"] = "def dlm_mapping(v, al, ah, bl, bh):\n" +
                                            "    return bl +  (bh - bl) * (v - al) / (ah - al)\n"
  var code = 'dlm_mapping('+value_num+', '+value_fl+', '+value_fh+', '+value_tl+', '+value_th+')';
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python.math_constrain = function() {
  // Constrain a number between two limits.
  var argument0 = Blockly.Python.valueToCode(this, 'VALUE',
      Blockly.Python.ORDER_NONE) || '0';
  var argument1 = Blockly.Python.valueToCode(this, 'LOW',
      Blockly.Python.ORDER_NONE) || '0';
  var argument2 = Blockly.Python.valueToCode(this, 'HIGH',
      Blockly.Python.ORDER_NONE) || '0';
  var code = 'min(max(' + argument0 + ', ' +  argument1 + '), ' +  argument2 + ')';
  return [code, Blockly.Python.ORDER_UNARY_POSTFIX];
};



Blockly.Python.math_number_base_conversion = function (a) {
  var c1 = a.getFieldValue("OP");
  var d = Blockly.Python.valueToCode(this, 'NUM',Blockly.Python.ORDER_NONE) || '0';
  var c2 = a.getFieldValue("OP2");
  Blockly.Python.definitions_['import_math'] = "import math";
  var param1 = "";
  var param2 = "10";
  if(c1 == "two"){
    param2 = '2';
  }else if(c1 == "eight"){
    param2 = '8'
  }else if(c1 == "ten"){
    param2 = '10'
  }else if(c1 == "sixteen"){
    param2 = '16'
  }

  if(c2 == "two"){
    param1 = 'bin';
  }else if(c2 == "eight"){
    param1 = 'oct'
  }else if(c2 == "ten"){
    param1 = ''
  }else if(c2 == "sixteen"){
    param1 = 'hex'
  }
  if(param1 == ""){
      var code = "int(str(" + d + "), " + param2 + ")";
  }else{
      var code = param1 + "(int(str(" + d + "), " + param2 + "))";

  }
  return [code, Blockly.Python.ORDER_ATOMIC];
  /*
  switch (c1) {
    case "two":
    switch (c2){
      case "two":
      var code = '\'{0:b}\''+ '.' + 'format' + '(' + '0b' + '('+d +')'+')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "eight":
      var code = '\'{0:o}\''+ '.' + 'format'+ '(' + '0b' +'('+d +')'+')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "ten":
      var code ='int'+  '(' + d +','+'2'+')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "sixteen":
      var code = '\'{0:x}\''+ '.' + 'format' + '(' + '0b' +'('+d +')'+')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
    }
    break;

    case "eight":
    switch (c2){
      case "two":
      var code = '\'{0:b}\''+ '.' + 'format' + '(' + '0o' + '('+d +')' +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "eight":
      var code = '\'{0:o}\''+ '.' + 'format'+ '(' + '0o' + '('+d +')' +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "ten":
      var code ='int'+  '(' +d +','+'8'+')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "sixteen":
      var code = '\'{0:x}\''+ '.' + 'format' + '(' + '0o' + '('+d +')' +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
    }
    break;

    case "ten":
    switch (c2){
      case "two":
      var code = '\'{0:b}\''+ '.' + 'format' + '('  + d  +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "eight":
      var code = '\'{0:o}\''+ '.' + 'format'+ '('  + d  +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "ten":
      var code ='int'+  '(' +d +','+'10'+')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "sixteen":
      var code = '\'{0:x}\''+ '.' + 'format' + '('  + d  +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
    }
    break;

    case "sixteen":
    switch (c2){
      case "two":
      var code = '\'{0:b}\''+ '.' + 'format' + '(' + '0x' + '('+d +')' +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "eight":
      var code = '\'{0:o}\''+ '.' + 'format'+ '(' + '0x' + '('+d +')' +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "ten":
      var code ='int'+  '(' +d +','+'16'+')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
      case "sixteen":
      var code = '\'{0:x}\''+ '.' + 'format' + '(' + '0x' + '('+d +')' +')';
      return [code, Blockly.Python.ORDER_ATOMIC];
      break;
    }
    break;

    default:
  }
  */
};

Blockly.Python.math_random_seed = function () {
    // Random integer between [X] and [Y].
    Blockly.Python.definitions_.import_random = "import random";
    var a = Blockly.Python.valueToCode(this, 'NUM',Blockly.Python.ORDER_NONE) || '0';
    var code = 'random.seed(' + a +  ');'+'\n';
    return code;
};

Blockly.Python.math_indexer_number = function () {
    var code = this.getFieldValue('NUM');
    // -4.abs() returns -4 in Dart due to strange order of operation choices.
    // -4 is actually an operator and a number.  Reflect this in the order.
    var order = code < 0 ?
        Blockly.Python.ORDER_UNARY_PREFIX : Blockly.Python.ORDER_ATOMIC;
    return [code, order];
}


Blockly.Python.base_map = Blockly.Python.math_map
'use strict';
goog.provide('Blockly.Python.pins');
goog.require('Blockly.Python');

Blockly.Python.pins_digital = function() {
  var code = this.getFieldValue('PIN');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.pins_digital_write=Blockly.Python.pins_digital;
Blockly.Python.pins_digital_read=Blockly.Python.pins_digital;
Blockly.Python.pins_analog_write=Blockly.Python.pins_digital;
Blockly.Python.pins_analog_read=Blockly.Python.pins_digital;
'use strict';

goog.provide('Blockly.Python.procedures');

goog.require('Blockly.Python');

Blockly.Python.procedures_defreturn = function() {
  // Define a procedure with a return value.
  var funcName = Blockly.Python.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var branch = Blockly.Python.statementToCode(this, 'STACK');
  if (Blockly.Python.INFINITE_LOOP_TRAP) {
    branch = Blockly.Python.INFINITE_LOOP_TRAP.replace(/%1/g,
        '\'' + this.id + '\'') + branch;
  }
  var returnValue = Blockly.Python.valueToCode(this, 'RETURN',
      Blockly.Python.ORDER_NONE) || '';
  //var type=this.getFieldValue('TYPE');
  if (returnValue) {
    returnValue = '    return ' + returnValue + '\n';
  }
  //var returnType = returnValue ? type : 'void';
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
      var varName = Blockly.Python.variableDB_.getName(this.arguments_[x], Blockly.Variables.NAME_TYPE);
    args[x] = varName;
  }
  var code = 'def ' + funcName + '(' + args.join(', ') + '):\n' +
      branch + returnValue + '\n';
  code = Blockly.Python.scrub_(this, code);
  Blockly.Python.setups_[funcName] = code;
  return null;
};

Blockly.Python.procedures_defnoreturn = Blockly.Python.procedures_defreturn;

Blockly.Python.procedures_callreturn = function() {
  // Call a procedure with a return value.
  var funcName = Blockly.Python.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Python.valueToCode(this, 'ARG' + x,
        Blockly.Python.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.Python.ORDER_UNARY_POSTFIX];
};

Blockly.Python.procedures_callnoreturn = function() {
  // Call a procedure with no return value.
  var funcName = Blockly.Python.variableDB_.getName(this.getFieldValue('NAME'),
      Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < this.arguments_.length; x++) {
    args[x] = Blockly.Python.valueToCode(this, 'ARG' + x,
        Blockly.Python.ORDER_NONE) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')\n';
  return code;
};

Blockly.Python.procedures_ifreturn = function() {
  // Conditionally return value from a procedure.
  var condition = Blockly.Python.valueToCode(this, 'CONDITION',
      Blockly.Python.ORDER_NONE) || 'False';
  var code = 'if (' + condition + ') :\n';
  if (this.hasReturnValue_) {
    var value = Blockly.Python.valueToCode(this, 'VALUE',
        Blockly.Python.ORDER_NONE) || 'None';
    code += '    return ' + value;
  } else {
    code += '    return None';
  }
  code += '\n';
  return code;
};

Blockly.Python.procedures_return = function() {
  // Conditionally return value from a procedure.
  var code=""
  if (this.hasReturnValue_) {
    var value = Blockly.Python.valueToCode(this, 'VALUE',
        Blockly.Python.ORDER_NONE) || 'None';
    code += 'return ' + value;
  } else {
    code += 'return None';
  }
  code += '\n';
  return code;
};
/*
Overrides for generic Python code generation.
*/
'use strict';

goog.provide('Blockly.Python');

goog.require('Blockly.Generator');


Blockly.Python = new Blockly.Generator('Python');
Blockly.Python.ORDER_ATOMIC = 0; // 0 "" ...
Blockly.Python.ORDER_UNARY_POSTFIX = 1; // expr++ expr-- () [] .
Blockly.Python.ORDER_UNARY_PREFIX = 2; // -expr !expr ~expr ++expr --expr
Blockly.Python.ORDER_EXPONENTIATION = 2.5;    // **
Blockly.Python.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Python.ORDER_ADDITIVE = 4; // + -
Blockly.Python.ORDER_SHIFT = 5; // << >>
Blockly.Python.ORDER_RELATIONAL = 6; // is is! >= > <= <
Blockly.Python.ORDER_EQUALITY = 7; // == != === !==
Blockly.Python.ORDER_BITWISE_AND = 8; // &
Blockly.Python.ORDER_BITWISE_XOR = 9; // ^
Blockly.Python.ORDER_BITWISE_OR = 10; // |
Blockly.Python.ORDER_LOGICAL_AND = 11; // &&
Blockly.Python.ORDER_LOGICAL_OR = 12; // ||
Blockly.Python.ORDER_CONDITIONAL = 13; // expr ? expr : expr
Blockly.Python.ORDER_ASSIGNMENT = 14; // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Python.ORDER_NONE = 99; // (...)

Blockly.Python.init = function(workspace) {
  /**
    * Empty loops or conditionals are not allowed in Python.
    */
  Blockly.Python.PASS = this.INDENT + 'pass\n';
  // Create a dictionary of definitions to be printed before the code.
  Blockly.Python.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.Python.functionNames_ = Object.create(null);
  Blockly.Python.setups_ = Object.create(null);

  if (!Blockly.Python.variableDB_) {
    Blockly.Python.variableDB_ =
        new Blockly.Names(Blockly.Python.RESERVED_WORDS_);
  } else {
    Blockly.Python.variableDB_.reset();
  }
}


Blockly.Python.finish = function(code) {
    // Convert the definitions dictionary into a list.
    if(code !== "") {
        code = '' + code.replace(/\n/g, '\n');
        code = code.replace(/\n\s+$/, '\n');
    }
    var definitions = [];
    for (var name in Blockly.Python.definitions_) {
        definitions.push(Blockly.Python.definitions_[name]);
    }
    var setups = [];
    for (var name in Blockly.Python.setups_) {
      setups.push(Blockly.Python.setups_[name]);
    }
    if(setups.length !== 0)
      setups.push('\n');
    // Clean up temporary data.
    //delete Blockly.Python.definitions_;
    //delete Blockly.Python.functionNames_;
    //Blockly.Python.variableDB_.reset();
    return definitions.join('\n\n') + '\n\n\n' + setups.join('\n') + code;

};


/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Python.scrubNakedValue = function(line) {
    return line + '\n';
};

/**
 * Encode a string as a properly escaped Python string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Python string.
 * @private
 */
Blockly.Python.quote_ = function(string) {
    // Can't use goog.string.quote since % must also be escaped.
    return "\"" + string + "\"";
};

/**
 * Common tasks for generating Python from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Python code created for this block.
 * @return {string} Python code with comments and subsequent blocks added.
 * @private
 */
Blockly.Python.scrub_ = function(block, code) {
    var commentCode = '';
    // Only collect comments for blocks that aren't inline.
    if (!block.outputConnection || !block.outputConnection.targetConnection) {
        // Collect comment for this block.
        var comment = block.getCommentText();
        comment = Blockly.utils.wrap(comment, Blockly.Python.COMMENT_WRAP - 3);
        if (comment) {
            if (block.getProcedureDef) {
                // Use a comment block for function comments.
                commentCode += '"""' + comment + '\n"""\n';
            } else {
                commentCode += Blockly.Python.prefixLines(comment + '\n', '# ');
            }
        }
        // Collect comments for all value arguments.
        // Don't collect comments for nested statements.
        for (var i = 0; i < block.inputList.length; i++) {
            if (block.inputList[i].type == Blockly.INPUT_VALUE) {
                var childBlock = block.inputList[i].connection.targetBlock();
                if (childBlock) {
                    var comment = Blockly.Python.allNestedComments(childBlock);
                    if (comment) {
                        commentCode += Blockly.Python.prefixLines(comment, '# ');
                    }
                }
            }
        }
    }
    var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
    var nextCode = Blockly.Python.blockToCode(nextBlock);
    return commentCode + code + nextCode;
};

/**
 * Gets a property and adjusts the value, taking into account indexing, and
 * casts to an integer.
 * @param {!Blockly.Block} block The block.
 * @param {string} atId The property ID of the element to get.
 * @param {number=} opt_delta Value to add.
 * @param {boolean=} opt_negate Whether to negate the value.
 * @return {string|number}
 */
Blockly.Python.getAdjustedInt = function(block, atId, opt_delta, opt_negate) {
    var delta = opt_delta || 0;
    if (block.workspace.options.oneBasedIndex) {
        /*delta--;*/   //Keep in line with Python
    }
    var defaultAtIndex = block.workspace.options.oneBasedIndex ? '1' : '0';
    var atOrder = delta ? Blockly.Python.ORDER_ADDITIVE :
        Blockly.Python.ORDER_NONE;
    var at = Blockly.Python.valueToCode(block, atId, atOrder) || defaultAtIndex;

    if (Blockly.isNumber(at)) {
        // If the index is a naked number, adjust it right now.
        at = parseInt(at, 10) + delta;
        if (opt_negate) {
            at = -at;
        }
    } else {
        // If the index is dynamic, adjust it in code.
        if (delta > 0) {
            at = 'int(' + at + ' + ' + delta + ')';
        } else if (delta < 0) {
            at = 'int(' + at + ' - ' + -delta + ')';
        } else {
            at = 'int(' + at + ')';
        }
        if (opt_negate) {
            at = '-' + at;
        }
    }
    return at;
};
'use strict';

goog.provide('Blockly.Python.set');
goog.require('Blockly.Python');

Blockly.Python.set_create_with = function() {
  
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  
  var code = new Array(this.itemCount_);
  var default_value = '0';


  for (var n = 0; n < this.itemCount_; n++) {

  code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
    Blockly.Python.ORDER_NONE) || default_value;
  }
  //Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ '{' + code.join(', ') + '}\n';
  code = varName+'= '+ '{' + code.join(', ') + '}\n';
  if (this.itemCount_==0) {code = varName+' = '+'set()\n'}
  return code;
};

Blockly.Python.set_length = function() {
  var varName = Blockly.Python.valueToCode(this, 'SET', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code='len(' +varName + ')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.set_get_remove_last = function(){
  var varName = Blockly.Python.valueToCode(this, 'SET', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.pop()';
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python.set_clear = function() {
  var varName = Blockly.Python.valueToCode(this, 'SET', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+'.clear()\n';
  return code;
};

Blockly.Python.set_operate = function() {
  var vars1 = Blockly.Python.valueToCode(this, 'SET1', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var vars2 = Blockly.Python.valueToCode(this, 'SET2', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var operate = this.getFieldValue('OPERATE');
  //var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=vars1+"." + operate+"(" +vars2+')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.set_operate_update = function() {
  var vars1 = Blockly.Python.valueToCode(this, 'SET1', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var vars2 = Blockly.Python.valueToCode(this, 'SET2', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var operate = this.getFieldValue('OPERATE');
  //var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=vars1+"." + operate+"(" +vars2+')\n';
  return code;
};

Blockly.Python.set_add_discard = function() {
  var vars1 = Blockly.Python.valueToCode(this, 'SET', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var operate = this.getFieldValue('OPERATE');
  var argument = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=vars1+"." + operate+"(" +argument+')\n';
  return code;
};

Blockly.Python.set_sub = function() {
  var vars1 = Blockly.Python.valueToCode(this, 'SET1', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var vars2 = Blockly.Python.valueToCode(this, 'SET2', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var operate = this.getFieldValue('OPERATE');
  //var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=vars1+"." + operate+"(" +vars2+')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.set_update = function(block) {

  var varName = Blockly.Python.valueToCode(this, 'SET', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var color =  Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  //var color = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+"." + 'update' + '(' + color + ')\n';
  return code;
};

// Blockly.Python.set_change_to = function(){
//   var op = this.getFieldValue('OP');
//   var varName = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
//   var code = op + '(' + varName + ')\n';
//   return [code, Blockly.Python.ORDER_ATOMIC];
// }
'use strict';

goog.provide('Blockly.Python.storage');

goog.require('Blockly.Python');

Blockly.Python['storage_fileopen'] = function(block) {
  // For each loop.
  var variable0 = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
  var fn = Blockly.Python.valueToCode(this, 'FILENAME', Blockly.Python.ORDER_ATOMIC);
  var mode = this.getFieldValue('MODE');
  var code = variable0 + ' = open(' + fn + ', \'' + mode +'\')\n';
  return code;
};

Blockly.Python.storage_file_write = function () {
    var data = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ATOMIC);
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    return file+".write(" + data + ")\n";
}

Blockly.Python.storage_get_contents = function () {
    var mode = this.getFieldValue('MODE');
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var size = Blockly.Python.valueToCode(this, 'SIZE', Blockly.Python.ORDER_ATOMIC);
    var code = file+'.'+mode+'(' + size + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.storage_get_a_line = function () {
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var size = Blockly.Python.valueToCode(this, 'SIZE', Blockly.Python.ORDER_ATOMIC);
    var code = file+".readline(" + size + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.storage_can_write_ornot = function () {
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var code = file+".writable()";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.storage_get_filename = function () {
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var code = file+".name()";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.storage_close_file = function () {
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var code = file+".close()\n";
    return code;
};

Blockly.Python.storage_list_all_files = function() {
  Blockly.Python.definitions_['import_os'] = 'import os';
  var code = 'os.listdir()';
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python.storage_delete_file = function () {
    Blockly.Python.definitions_['import_os'] = 'import os';
    var mode = this.getFieldValue('MODE');
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var code = "os."+mode+"("+file+")\n";
    return code;
};

Blockly.Python.storage_get_file_size = function () {
    Blockly.Python.definitions_['import_os'] = 'import os';
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var code = "os.size("+file+")";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.storage_file_tell = function () {
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var code = file+".tell()";
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.storage_file_seek = function () {
    var mode = this.getFieldValue('MODE');
    var mode_num = 0;
    if (mode == 'start'){
      mode_num = 0;}
    else if(mode == 'current'){
      mode_num = 1;
    }
    else{
      mode_num = 2;
    }
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var size = Blockly.Python.valueToCode(this, 'SIZE', Blockly.Python.ORDER_ATOMIC);
    var code = file+'.seek('+ size + ',' + mode_num + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.storage_change_dir = function () {
    Blockly.Python.definitions_['import_os'] = 'import os';
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var code = "os.chdir("+file+")\n";
    return code;
};

Blockly.Python.storage_get_current_dir = function() {
  Blockly.Python.definitions_['import_os'] = 'import os';
  var code = 'os.getcwd()';
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python.storage_make_dir = function () {
  Blockly.Python.definitions_['import_os'] = 'import os';
    var mode = this.getFieldValue('MODE');
    var path = Blockly.Python.valueToCode(this, 'PATH', Blockly.Python.ORDER_ATOMIC);
    var code = 'os.'+mode+'(' + path + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.storage_rename = function () {
    Blockly.Python.definitions_['import_os'] = 'import os';
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var file1 = Blockly.Python.valueToCode(this, 'NEWFILE', Blockly.Python.ORDER_ATOMIC);
    var code = "os.rename("+file+","+file1+")\n";
    return code;
};

Blockly.Python.storage_is_file = function () {
    Blockly.Python.definitions_['import_os'] = 'import os';
    var file = Blockly.Python.valueToCode(this, 'FILE', Blockly.Python.ORDER_ATOMIC);
    var mode = this.getFieldValue('MODE');
    var code = "os."+ mode + "(" + file + ")";
    return [code, Blockly.Python.ORDER_ATOMIC];
};
'use strict';

goog.provide('Blockly.Python.system');

goog.require('Blockly.Python');


Blockly.Python.controls_millis = function () {
    Blockly.Python.definitions_.import_time = "import time";
    var code = 'time.time()';
    return [code, Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.controls_end_program = function () {
    return 'exit()\n';
};

Blockly.Python.time_localtime= function() {
    Blockly.Python.definitions_.import_time = "import time";    
    var op=this.getFieldValue('op');
    var code="time.localtime()["+op+"]";
    switch (op) {    
    case "all":
       var code1 = "time.localtime()";
       return [code1, Blockly.Python.ORDER_ASSIGNMENT];
       break;
    default:
    	return [code, Blockly.Python.ORDER_ASSIGNMENT];
    	break;       
  }
}

Blockly.Python.system_eval = function(block) {  
  var codestr =  Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  var code="eval" +  '(' + codestr + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};
'use strict';

goog.provide('Blockly.Python.texts');

goog.require('Blockly.Python');


Blockly.Python.text = function() {
  // Text value.
    //var code = 'String('+Blockly.Python.quote_(this.getFieldValue('TEXT'))+')';
  var code =  Blockly.Python.quote_(this.getFieldValue('TEXT')) ;
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_textarea = function() {
  // Text value.
    //var code = 'String('+Blockly.Python.quote_(this.getFieldValue('TEXT'))+')';
  var code = "'''" + (this.getFieldValue('VALUE')) + "'''";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_char = function() {
  var code = '\''+this.getFieldValue('TEXT')+'\'';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_join = function() {
  // Text value.
    var a = Blockly.Python.valueToCode(this, 'A', Blockly.Python.ORDER_ATOMIC);
    var b = Blockly.Python.valueToCode(this, 'B', Blockly.Python.ORDER_ATOMIC);
    return [a  + ' + ' + b , Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_to_number = function() {
  var towhat = this.getFieldValue('TOWHAT');
  var str =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  if (towhat == 'b') return ['' +   str + '.encode("utf-8")', Blockly.Python.ORDER_ATOMIC];
  else return [towhat + "(" +  str  + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_to_number_skulpt = function() {
  var towhat = this.getFieldValue('TOWHAT');
  var str =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  if (towhat == 'b') return ['' +   str + '.encode("utf-8")', Blockly.Python.ORDER_ATOMIC];
  else return [towhat + "(" +  str  + ')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.ascii_to_char = function () {
    var asciivalue = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '0'
    return ['chr(' + asciivalue+')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.char_to_ascii = function () {
    var charvalue = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || 'a'; 
    return ['ord(' +charvalue +')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.number_to_text = function() {  
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '0'
  return ['str('+str+')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_length = function() {
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  return ['len(' + str+')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_char_at2 = function(a) {
    var b = a.getFieldValue("MODE") || "GET",
    c = a.getFieldValue("WHERE") || "FROM_START",
    str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
    switch (c) {
    case "FROM_START":
        a = Blockly.Python.getAdjustedInt(a, "AT");
        return [str + "[" + a + "]", Blockly.Python.ORDER_ATOMIC];
        break;
    case "FROM_END":
        a = Blockly.Python.getAdjustedInt(a, "AT", 1, !0);
        return [str + "[" + a + "]", Blockly.Python.ORDER_ATOMIC];
        break;
    case "RANDOM":
        Blockly.Python.definitions_.import_random = "import random";
        return ["random.choice(" + str + ")", Blockly.Python.ORDER_FUNCTION_CALL];
        break;
    }
    throw "Unhandled combination (lists_getIndex).";
};

Blockly.Python.text_char_at = function() {
    var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
    var at = Blockly.Python.valueToCode(this, 'AT', Blockly.Python.ORDER_ATOMIC) || 0;
    return [str + "[" + at + "]", Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python.text_random_char = function() {
    var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
    Blockly.Python.definitions_.import_random = "import random";
    return ["random.choice(" + str + ")", Blockly.Python.ORDER_FUNCTION_CALL];
}

Blockly.Python.text_equals_starts_ends = function() {
  var str1 = (Blockly.Python.valueToCode(this, 'STR1', Blockly.Python.ORDER_ATOMIC) || '\"\"');
  var str2 = (Blockly.Python.valueToCode(this, 'STR2', Blockly.Python.ORDER_ATOMIC) || '\"\"');
  var dowhat = this.getFieldValue('DOWHAT');
  if (dowhat === '===')
      return [str1+' == ' + str2, Blockly.Python.ORDER_ATOMIC];
  else
      return [str1+'.'+dowhat+'('+str2+')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_compare_to = function() {
  var str1 = (Blockly.Python.valueToCode(this, 'STR1', Blockly.Python.ORDER_ATOMIC) || '\"\"');
  var str2 = (Blockly.Python.valueToCode(this, 'STR2', Blockly.Python.ORDER_ATOMIC) || '\"\"');
  return ['cmp('+str1+','+str2+')', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['text_substring2'] = function(block) {
  // Get sublist.
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  switch (where1) {
    case 'FROM_START':
      var at1 = Blockly.Python.getAdjustedInt(block, 'AT1');
      if (at1 == '0') {
        at1 = '';
      }
      break;
    case 'FROM_END':
      var at1 = Blockly.Python.getAdjustedInt(block, 'AT1', 0, true);
      break;
    case 'FIRST':
      var at1 = '0';
      break;
    default:
      throw 'Unhandled option (lists_getSublist)';
  }
  switch (where2) {
    case 'FROM_START':
      var at2 = Blockly.Python.getAdjustedInt(block, 'AT2');
          at2 = at2;
      break;
    case 'FROM_END':
      var at2 = Blockly.Python.getAdjustedInt(block, 'AT2', 0, true);
      // Ensure that if the result calculated is 0 that sub-sequence will
      // include all elements as expected.
      if (!Blockly.isNumber(String(at2))) {
        Blockly.Python.definitions_['import_sys'] = 'import sys';
        at2 += ' or sys.maxsize';
      } else if (at2 == '0') {
        at2 = '';
      }
      break;
    case 'LAST':
      var at2 = '-1';
      break;
    default:
      throw 'Unhandled option (lists_getSublist)';
  }
  var code = str + '[' + at1 + ' : ' + at2 + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python['text_substring'] = function(block) {
    // Get sublist.
    var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
    var at1 = Blockly.Python.valueToCode(this, 'AT1', Blockly.Python.ORDER_ATOMIC);
    var at2 = Blockly.Python.valueToCode(this, 'AT2', Blockly.Python.ORDER_ATOMIC);
    var code = str + '[' + at1 + ' : ' + at2 + ']';
    return [code, Blockly.Python.ORDER_MEMBER];
}

Blockly.Python.text_capital = function() {
  var capital = this.getFieldValue('CAPITAL');
  var str =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  return [''+str+'.' + capital + '()', Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_center = function() {
  var center = this.getFieldValue('CENTER');
  var str =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var width =Blockly.Python.valueToCode(this, 'WID', Blockly.Python.ORDER_ATOMIC);
  var symbol =Blockly.Python.valueToCode(this, 'Symbol', Blockly.Python.ORDER_ATOMIC);
  return [''+str+'.'+center+'('+width+','+symbol+')' , Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_find = function() {
  var sentence =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var str=Blockly.Python.valueToCode(this, 'STR', Blockly.Python.ORDER_ATOMIC);
  return [''+sentence+'.find('+str+')' , Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_join_seq = function() {
  var sentence =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var varName = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  return [sentence+'.join('+varName+')' , Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_replace = function() {
  var sentence =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var str1=Blockly.Python.valueToCode(this, 'STR1', Blockly.Python.ORDER_ATOMIC);
  var str2=Blockly.Python.valueToCode(this, 'STR2', Blockly.Python.ORDER_ATOMIC);
  return [''+sentence+'.replace('+str1+','+str2+')' , Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.text_split = function() {
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  var argument = Blockly.Python.valueToCode(this, 'VAL', Blockly.Python.ORDER_ATOMIC) || '\"\"';
  var code = str + ".split(" + argument + ")";
  return [code, Blockly.Python.ORDER_ATOMIC];
};



Blockly.Python.text_strip = function() {
  var towhat = this.getFieldValue('TOWHAT');
  var str =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  var code = str + "." + towhat + "()";
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_format = function() {
  // Create a list with any number of elements of any type.
  var dropdown_type = this.getFieldValue('TYPE');
  var s = this.getFieldValue('VAR');
  var code = new Array(this.itemCount_);
  var default_value = '0';


  for (var n = 0; n < this.itemCount_; n++) {

  code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
    Blockly.Python.ORDER_NONE) || default_value;
  }

  var code = s +'.format(' + code.join(', ') + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_format_noreturn = function() {
  // Create a list with any number of elements of any type.
  var dropdown_type = this.getFieldValue('TYPE');
  var s =Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code = new Array(this.itemCount_);
  var default_value = '0';


  for (var n = 0; n < this.itemCount_; n++) {

  code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
    Blockly.Python.ORDER_NONE) || default_value;
  }

  var code = s +'.format(' + code.join(', ') + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.text_substring3 = Blockly.Python.text_substring 
Blockly.Python.text_compareTo = Blockly.Python.text_compare_to
Blockly.Python.text_char_at3 = Blockly.Python.text_char_at
'use strict';

goog.provide('Blockly.Python.tuple');

goog.require('Blockly.Python');

Blockly.Python.tuple_create_with = function() {
  // Create a list with any number of elements of any type.
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  //var size=window.parseFloat(this.getFieldValue('SIZE'));
  var code = new Array(this.itemCount_);
  var default_value = '0';


  for (var n = 0; n < this.itemCount_; n++) {

  code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
    Blockly.Python.ORDER_NONE) || default_value;
  }
 // if (this.itemCount_!=1){
//  Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ '(' + code.join(', ') + ')\n';}
 // else {
 // Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ '(' + code.join(', ') + ',)\n';}
 if (this.itemCount_!=1){
  var code = varName+'= '+ '(' + code.join(', ') + ')\n';}
 else {
  var code = varName+'= '+ '(' + code.join(', ') + ',)\n';}

  return code;
};

Blockly.Python.tuple_create_with_text2 = function() {
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  //var size=window.parseFloat(this.getFieldValue('SIZE'));
  var text=this.getFieldValue('TEXT');
  //Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ '(' + text + ')\n';
  var code = varName+'= '+ '(' + text + ')\n';
  return code;
};

Blockly.Python.tuple_create_with_text_return = function() {
  var text=this.getFieldValue('TEXT');
  var code = '(' + text + ')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.tuple_getIndex = function() {
  // Indexing into a list is the same as indexing into a string.
  var varName = Blockly.Python.valueToCode(this, 'TUP', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument0 = Blockly.Python.valueToCode(this, 'AT',
    Blockly.Python.ORDER_ADDITIVE) || '1';
  if (argument0.match(/^\d+$/)) {
  // If the index is a naked number, decrement it right now.
  argument0 = parseInt(argument0, 10);
  }
   // else {
  // If the index is dynamic, decrement it in code.
  // argument0;
  // }
  var code=varName+'['+argument0+']';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.tuple_length = function() {
  var varName = Blockly.Python.valueToCode(this, 'TUP', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code='len(' +varName + ')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.tuple_del = function() {
  var varName = Blockly.Python.valueToCode(this, 'TUP', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code='del ' + varName + '\n';
  return code;
};

Blockly.Python.tuple_join = function() {
  var varName1 =  Blockly.Python.valueToCode(this, 'TUP1', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var varName2 =  Blockly.Python.valueToCode(this, 'TUP2', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code = varName1 + "+" + varName2;
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.tuple_max = function() {
  var varname = Blockly.Python.valueToCode(this, 'TUP', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var maxmin = this.getFieldValue('DIR');
  var code= maxmin + "("  +varname + ')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.tuple_change_to = function(){
  var op = this.getFieldValue('OP');
  var varName = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code = op + '(' + varName + ')\n';
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python.tuple_find = function(){
  var op = this.getFieldValue('OP');
  var varName = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  if (op=='INDEX')
    var code = '(' + varName + '.index('  + argument + ') + 1)';
  else if (op=='COUNT')
    var code = varName + '.count('  + argument + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
}

Blockly.Python.tuple_trig = function (a) {
  var b = a.getFieldValue("OP"), c;
  Blockly.Python.definitions_['import_math'] = "import math";
  a = Blockly.Python.valueToCode(a, 'data', Blockly.Python.ORDER_NONE) 
  switch (b) {
  case "LEN":
  c = "len(" + a + ")";
  break;
  case "SUM":
  c = "sum(" + a + ")";
  break;
  case "MIN":
  c = "min(" + a + ")";
  break;
  case "MAX":
  c = "max(" + a + ")";
  break;
  case 'AVERAGE':
  // Blockly.Python.definitions_['from_numbers_import_Number'] =
  //   'from numbers import Number';
  var functionName = Blockly.Python.provideFunction_(
    'math_mean',
    // This operation excludes null and values that aren't int or float:',
    // math_mean([null, null, "aString", 1, 9]) == 5.0.',
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(myList):',
     '  localList = [e for e in myList if type(e) == int or type(e) == float]',
     '  if not localList: return',
     '  return float(sum(localList)) / len(localList)']);
  c = functionName + '(' + a + ')';
  break;
case 'MEDIAN':
  // Blockly.Python.definitions_['from_numbers_import_Number'] =
  //   'from numbers import Numberd';
  var functionName = Blockly.Python.provideFunction_(
    'math_median',
    // This operation excludes null values:
    // math_median([null, null, 1, 3]) == 2.0.
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(myList):',
     '  localList = sorted([e for e in myList if type(e) == int or type(e) == float])',
     '  if not localList: return',
     '  if len(localList) % 2 == 0:',
     '    return (localList[len(localList) // 2 - 1] + ' +
       'localList[len(localList) // 2]) / 2.0',
     '  else:',
     '    return localList[(len(localList) - 1) // 2]']);
  c = functionName + '(' + a + ')';
  break;
case 'MODE':
  var functionName = Blockly.Python.provideFunction_(
    'math_modes',
    // As a list of numbers can contain more than one mode,
    // the returned result is provided as an array.
    // Mode of [3, 'x', 'x', 1, 1, 2, '3'] -> ['x', 1].
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(some_list):',
     '  modes = []',
     '  # Using a lists of [item, count] to keep count rather than dict',
     '  # to avoid "unhashable" errors when the counted item is ' +
       'itself a list or dict.',
     '  counts = []',
     '  maxCount = 1',
     '  for item in some_list:',
     '    found = False',
     '    for count in counts:',
     '      if count[0] == item:',
     '        count[1] += 1',
     '        maxCount = max(maxCount, count[1])',
     '        found = True',
     '    if not found:',
     '      counts.append([item, 1])',
     '  for counted_item, item_count in counts:',
     '    if item_count == maxCount:',
     '      modes.append(counted_item)',
     '  return modes']);
  c = functionName + '(' + a + ')';
  break;
case 'STD_DEV':
  Blockly.Python.definitions_['import_math'] = 'import math';
  var functionName = Blockly.Python.provideFunction_(
    'math_standard_deviation',
    ['def ' + Blockly.Python.FUNCTION_NAME_PLACEHOLDER_ + '(numbers):',
     '  n = len(numbers)',
     '  if n == 0: return',
     '  mean = float(sum(numbers)) / n',
     '  variance = sum((x - mean) ** 2 for x in numbers) / n',
     '  return math.sqrt(variance)']);
  c = functionName + '(' + a + ')';
  break;
  default:
  throw 'Unknown operator: ' + b;
  }
  if (c)
  return [c, Blockly.Python.ORDER_FUNCTION_CALL];
  
};

Blockly.Python['tuple_getSublist'] = function(block) {
  // Get sublist.
  var list = Blockly.Python.valueToCode(block, 'LIST',
      Blockly.Python.ORDER_MEMBER) || '[]';
  var where1 = block.getFieldValue('WHERE1');
  var where2 = block.getFieldValue('WHERE2');
  switch (where1) {
    case 'FROM_START':
      var at1 = Blockly.Python.getAdjustedInt(block, 'AT1');
      if (at1 == '0') {
        at1 = '';
      }
      break;
    case 'FROM_END':
      var at1 = Blockly.Python.getAdjustedInt(block, 'AT1', 1, true);
      break;
    case 'FIRST':
      var at1 = '0';
      break;
    default:
      throw 'Unhandled option (lists_getSublist)';
  }
  switch (where2) {
    case 'FROM_START':
      var at2 = Blockly.Python.getAdjustedInt(block, 'AT2', 1);
          at2 = at2-1;
      break;
    case 'FROM_END':
      var at2 = Blockly.Python.getAdjustedInt(block, 'AT2', 1, true);
      // Ensure that if the result calculated is 0 that sub-sequence will
      // include all elements as expected.
      if (!Blockly.isNumber(String(at2))) {
        Blockly.Python.definitions_['import_sys'] = 'import sys';
        at2 += ' or sys.maxsize';
      } else if (at2 == '0') {
        at2 = '';
      }
      break;
    case 'LAST':
      var at2 = '-1';
      break;
    default:
      throw 'Unhandled option (lists_getSublist)';
  }
  var code = list + '[' + at1 + ' : ' + at2 + ']';
  return [code, Blockly.Python.ORDER_MEMBER];
};

Blockly.Python.tuple_create_with_noreturn = function() {
  // Create a list with any number of elements of any type.
  var dropdown_type = this.getFieldValue('TYPE');
  var code = new Array(this.itemCount_);
  var default_value = '0';


  for (var n = 0; n < this.itemCount_; n++) {

  code[n] = Blockly.Python.valueToCode(this, 'ADD' + n,
    Blockly.Python.ORDER_NONE) || default_value;
  }
 // if (this.itemCount_!=1){
//  Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ '(' + code.join(', ') + ')\n';}
 // else {
 // Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ '(' + code.join(', ') + ',)\n';}
 if (this.itemCount_!=1){
  var code = '(' + code.join(', ') + ')';}
 else {
  var code = '(' + code.join(', ') + ',)';}

  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['tuple_get_sublist'] = function(block) {
  // Get sublist.
  var list = Blockly.Python.valueToCode(this, 'LIST', Blockly.Python.ORDER_ADDITIVE) || '0';
  var at1 =  Blockly.Python.valueToCode(this, 'AT1', Blockly.Python.ORDER_ADDITIVE) || '0';
  var at2 =  Blockly.Python.valueToCode(this, 'AT2', Blockly.Python.ORDER_ADDITIVE) || '0';
  var code = list + '[' + at1 + ' : ' + at2 + ']';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.tuple_get_random_item = function() {
  Blockly.Python.definitions_['import_random'] = 'import random';
  var varName = Blockly.Python.valueToCode(this, 'TUP', Blockly.Python.ORDER_ADDITIVE) || 'mytup';
  var code='random.choice(' +varName + ')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};
'use strict';

goog.provide('Blockly.Python.turtle');
goog.require('Blockly.Python');

Blockly.Python.turtle_create = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var dropdown_type = this.getFieldValue('TYPE');
  var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
    Blockly.Variables.NAME_TYPE);
  //var size=window.parseFloat(this.getFieldValue('SIZE'));
  
  //Blockly.Python.definitions_['var_declare'+varName] = varName+'= '+ 'turtle.Turtle()\n';
  var code=varName+'= '+ 'turtle.Turtle()\n';
  return code;
 // return '';
};

Blockly.Python.turtle_done = function(){
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var code='turtle.done()\n';
  return code;
};

Blockly.Python.turtle_exitonclick = function(){
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var code='turtle.exitonclick()\n';
  return code;
};


Blockly.Python.turtle_move = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
    var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
    var direction = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+"." + direction + "(" +  num  + ')\n';
  return code;
};

Blockly.Python.turtle_rotate = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var direction = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+"." + direction + "(" +  num  + ')\n';
  return code;
};

Blockly.Python.turtle_setheading = function(){
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.setheading('  + argument + ')\n';
  return code;
};

Blockly.Python.turtle_screen_delay = function(){
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.screen.delay('  + argument + ')\n';
  return code;
};

Blockly.Python.turtle_goto = function(){
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var xnum = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var ynum = Blockly.Python.valueToCode(this, 'val', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.goto('  + xnum +','+ynum + ')\n';
  return code;
};


Blockly.Python.turtle_pos_shape = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var get = this.getFieldValue('DIR');
  var code=varName + '.' + get + '()';  
  return [code,Blockly.Python.ORDER_ATOMIC];
};


Blockly.Python.turtle_clear = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var clear = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+"." + clear + "("   + ')\n';
  return code;
};

Blockly.Python.turtle_penup = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var penup = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+"." + penup + "("   + ')\n';
  return code;
};

Blockly.Python.turtle_fill = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var penup = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+"." + penup + "_fill("   + ')\n';
  return code;
};

Blockly.Python.turtle_size_speed = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = this.getFieldValue('TUR');
  var size = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+"." + size + "(" +  num  + ')\n';
  return code;
};

Blockly.Python.turtle_size = function(){
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.pensize('  + argument + ')\n';
  return code;
};


Blockly.Python.turtle_speed = function(){
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var argument = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.speed('  + argument + ')\n';
  return code;
};

Blockly.Python.turtle_circle = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var circle = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+"." + circle + "(" +  num + ')\n';
  return code;
};

Blockly.Python.turtle_setxy = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var xy = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+".set" + xy + "(" +  num + ')\n';
  return code;
};

Blockly.Python.turtle_circle_advanced = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';  
  var argument = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+".circle (" +  num  +','+ argument+ ')\n';
  return code;
};


Blockly.Python.turtle_visible = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var visible = this.getFieldValue('DIR');
  var num = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC);
  var code=varName+"." + visible + "("   + ')\n';
  return code;
};

Blockly.Python.turtle_bgcolor = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var color = this.getFieldValue('FIELDNAME');
  var code="turtle." + 'bgcolor' + '("' + color + '")\n';
  return code;
};

Blockly.Python.turtle_pencolor = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var color = this.getFieldValue('FIELDNAME');
  var code=varName+"." + 'pencolor' + '("' + color + '")\n';
  return code;
};

Blockly.Python.turtle_fillcolor = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var color = this.getFieldValue('FIELDNAME');
  var code=varName+"." + 'fillcolor' + '("' + color + '")\n';
  return code;
};


Blockly.Python.turtle_clone = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName + '.clone()';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.turtle_bgcolor_hex = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var color =  Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  var code="turtle." + 'bgcolor' + '(' + color + ')\n';
  return code;
};

Blockly.Python.turtle_pencolor_hex = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var color =  Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  //var color = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+"." + 'pencolor' + '(' + color + ')\n';
  return code;
};

Blockly.Python.turtle_fillcolor_hex = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var color =  Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  var code=varName+"." + 'fillcolor' + '(' + color + ')\n';
  return code;
};

Blockly.Python.turtle_shape = function() {
  Blockly.Python.definitions_.import_turtle = "import turtle";
    var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
    var direction = this.getFieldValue('DIR');
  
  var code=varName+".shape('"  + direction + "')\n";
  return code;
};

Blockly.Python.turtle_textinput = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";  
  var title =  Blockly.Python.valueToCode(this, 'TITLE', Blockly.Python.ORDER_ATOMIC) ;
  var prompt =  Blockly.Python.valueToCode(this, 'PROMPT', Blockly.Python.ORDER_ATOMIC) ;  
  var code="turtle.textinput" + '(' + title + ',' + prompt + ')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.turtle_numinput = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";  
  var title =  Blockly.Python.valueToCode(this, 'TITLE', Blockly.Python.ORDER_ATOMIC) ;
  var prompt =  Blockly.Python.valueToCode(this, 'PROMPT', Blockly.Python.ORDER_ATOMIC) ;  
  var data = Blockly.Python.valueToCode(this, 'DEFAULT', Blockly.Python.ORDER_ATOMIC);
  var min = Blockly.Python.valueToCode(this, 'MIN', Blockly.Python.ORDER_ATOMIC);
  var max = Blockly.Python.valueToCode(this, 'MAX', Blockly.Python.ORDER_ATOMIC);
  var code="turtle.numinput" + '(' + title + ',' + prompt + "," + data + ',minval = ' + min + ',maxval = ' + max +')';
  return [code,Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.turtle_write = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var write =  Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  //var color = Blockly.Python.valueToCode(this, 'data', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var code=varName+"." + 'write' + '(' + write + ')\n';
  return code;
};

Blockly.Python.turtle_write_format = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var move = this.getFieldValue('MOVE');
  var align = this.getFieldValue('ALIGN');
  var fontname =  Blockly.Python.valueToCode(this, 'FONTNAME', Blockly.Python.ORDER_ATOMIC) ;
  var fontnum = Blockly.Python.valueToCode(this, 'FONTNUM', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var fonttype = this.getFieldValue('FONTTYPE');
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var write =  Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  var code=varName+"." + 'write' + '(' + write + ',' + move + ',align="' + align + '",font=(' + fontname + ',' + fontnum + ',"' + fonttype + '"))\n';
  return code;
};

Blockly.Python.turtle_write_format_skulpt = function(block) {
  Blockly.Python.definitions_.import_turtle = "import turtle";
  var move = this.getFieldValue('MOVE');
  var align = this.getFieldValue('ALIGN');
  var fontname =  Blockly.Python.valueToCode(this, 'FONTNAME', Blockly.Python.ORDER_ATOMIC) ;
  var fontnum = Blockly.Python.valueToCode(this, 'FONTNUM', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var fonttype = this.getFieldValue('FONTTYPE');
  var varName = Blockly.Python.valueToCode(this, 'TUR', Blockly.Python.ORDER_ASSIGNMENT) || '0';
  var write =  Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) ;
  var code=varName+"." + 'write' + '(' + write + ',' + move + ',align="' + align + '",font=(' + fontname + ',' + fontnum + ',"' + fonttype + '"))\n';
  return code;
};
/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Python for utility blocks.
 * @author acbart@vt.edu (Austin Cory Bart)
 */
'use strict';

goog.provide('Blockly.Python.utility');

goog.require('Blockly.Python');

Blockly.Python['raw_block'] = function(block) {
  var code = block.getFieldValue('TEXT')+"\n";
  return code;
};

Blockly.Python['raw_expression'] = function(block) {
  var code = block.getFieldValue('TEXT');
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['raw_empty'] = function(block) {
  var code = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_MEMBER) || '';
  return code+"\n";
};

Blockly.Python['raw_table'] = function(block) {
  //var code = block.getFieldValue('TEXT')+"\n";
  return '';//code;
};

Blockly.Python['type_check'] = function(block) {
  var value = Blockly.Python.valueToCode(block, 'VALUE',
      Blockly.Python.ORDER_MEMBER) || '___';
  var code = 'type('+value + ')';
  return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python['function_call'] = function(block) {
  var name = block.getFieldValue('NAME');
  var hasReturn = block.hasReturn_;
  var args = new Array(block.itemCount_);
  for (var n = 0; n < block.itemCount_; n++) {
    args[n] = Blockly.Python.valueToCode(block, 'ARGUMENT' + n,
        Blockly.Python.ORDER_NONE) || '___';
  }
  var code = name+ '(' + args.join(', ') + ')';
  if (hasReturn) {
      return [code, Blockly.Python.ORDER_ATOMIC];
  } else {
      return code+'\n';
  }
};

Blockly.Python['attribute_access'] = function(block) {
    var value_module = Blockly.Python.valueToCode(block, 'MODULE', Blockly.Python.ORDER_ATOMIC);
    var value_name = Blockly.Python.valueToCode(block, 'NAME', Blockly.Python.ORDER_ATOMIC);
    //去除掉两端的括号，如(val()) --> val()
    value_name = value_name.substring(1, value_name.length - 1);
    // TODO: Assemble JavaScript into code variable.
    var code = value_module+'.'+value_name;
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.Python.ORDER_NONE];
};

'use strict';

goog.provide('Blockly.Python.variables');

goog.require('Blockly.Python');


Blockly.Python.variables_get = function() {
  // Variable getter.
  var code = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  return [code, Blockly.Python.ORDER_ATOMIC];
};

// Blockly.Python.variables_declare = function() {
//   var dropdown_type = this.getFieldValue('TYPE');
//   var argument0;
//   //TODO: settype to variable
//   argument0 = Blockly.Python.valueToCode(this, 'VALUE',Blockly.Python.ORDER_ASSIGNMENT) ||  'None';
//   var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'),
//       Blockly.Variables.NAME_TYPE);
  
//   if (dropdown_type === 'number')
//       Blockly.Python.definitions_['var_declare' + varName] = 'let ' + ' ' + varName + ' = 0;';
//   else if(dropdown_type === 'string')
//       Blockly.Python.definitions_['var_declare' + varName] = 'let ' + ' ' + varName + ' = \'\';';
//   else if(dropdown_type === 'boolean')
//       Blockly.Python.definitions_['var_declare' + varName] = 'let ' + ' ' + varName + ' = true;';
//   else if(dropdown_type.startsWith('Array'))
//       Blockly.Python.definitions_['var_declare' + varName] = 'let ' + varName + ':' + dropdown_type + ' = [];';
  

//   if(Blockly.Python.setups_['var_declare' + varName] === undefined) {
//       Blockly.Python.setups_['var_declare' + varName] =  varName + ' = ' + argument0 + '\n';
//   }else {
//   }
//   return '';
// };

Blockly.Python.variables_set = function() {
  // Variable setter.
  if(this.getFieldValue('VAR')==""){
    return "  = None\n";
  }
  else{
    var argument0 = Blockly.Python.valueToCode(this, 'VALUE',
        Blockly.Python.ORDER_ASSIGNMENT) || 'None';
    var varName = Blockly.Python.variableDB_.getName(this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

    return varName + ' = ' + argument0 + '\n';
  }

};

Blockly.Python.variables_change = function () {
    // Variable setter.
    var operator = this.getFieldValue('OP');
    var varName = Blockly.Python.valueToCode(this, 'MYVALUE', Blockly.Python.ORDER_ASSIGNMENT);
    var code = operator + '(' + varName + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.variables_global = function() {
  var str = Blockly.Python.valueToCode(this, 'VAR', Blockly.Python.ORDER_ATOMIC) || 'None';
  var code = "global "+str+'\n';
  return code;
};


//ok
Blockly.Python.controls_type = function () {
    var data = Blockly.Python.valueToCode(this, 'DATA', Blockly.Python.ORDER_ATOMIC) || '1000'
    var code = 'type(' + data + ')';
    return [code, Blockly.Python.ORDER_ATOMIC];
};

Blockly.Python.controls_typeLists = function(){
    //Blockly.Python.definitions_['import_microbit_*'] = 'from microbit import *';
    var type = this.getFieldValue('type');
    // Blockly.Python.definitions_['func_type' + type] = code;
    return [type, Blockly.Python.ORDER_ATOMIC];
}