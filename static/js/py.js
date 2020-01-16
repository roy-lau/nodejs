'use strict';

goog.provide('Blockly.Blocks.communicate');
goog.require('Blockly.Blocks');

Blockly.Blocks.communicate.HUE = 0//'#3288dd';

Blockly.Blocks['requests_get'] = {
  init: function() {
    this.setColour(Blockly.Blocks.communicate.HUE);
    this.appendValueInput("DOMAIN")
      .appendField(Blockly.Msg.DISPLAY_IMAGE_LET2)
      .setCheck(String);
  this.appendDummyInput("")
  
      .appendField(Blockly.blockpy_REQUESTS_GET)
      .appendField(new Blockly.FieldTextInput('response'), 'VAR')
                       
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  this.setTooltip(Blockly.blockpy_REQUESTS_GET_TOOLTIP);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
 
}


Blockly.Blocks['requests_attribute'] = {
  init: function() {
     this.appendValueInput('VAL')

  var attr =
        [[Blockly.blockpy_REQUESTS_GET_ATTR_STATUS_CODE, 'status_code'],[Blockly.blockpy_REQUESTS_GET_ATTR_TEXT, 'text']
        ,[Blockly.blockpy_REQUESTS_GET_ATTR_COOKIES, 'cookies'],[Blockly.blockpy_REQUESTS_GET_ATTR_CONTENT, 'content']];
    this.setColour(Blockly.Blocks.communicate.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_NOVA_GET_STAT)
        .appendField(new Blockly.FieldDropdown(attr), 'ATTR')
        

  this.setInputsInline(true);
   this.setOutput(true, String);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'clear': Blockly.DLMLY_TOOLTIP_TURTEL_CLEAR,
        'reset': Blockly.DLMLY_TOOLTIP_TURTEL_RESET,
        'home': Blockly.DLMLY_TOOLTIP_TURTEL_HOME
      };
      return TOOLTIPS[mode];
    });
  }
};



Blockly.Blocks['requests_method'] = {
  init: function() {
    this.appendValueInput("VAR")
      .appendField(Blockly.Msg.DISPLAY_IMAGE_LET2)
      .setCheck(String);
  var method =
        [['post', 'post'],['put', 'put'],
        ['delete', 'delete'],['head', 'head'],
        ['option', 'option']];
    this.setColour(Blockly.Blocks.communicate.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_CONDUCT)
        .appendField(new Blockly.FieldDropdown(method), 'DIR')
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_REQUESTS)    
        

  this.setInputsInline(true);
   this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'forward': Blockly.DLMLY_TOOLTIP_TURTEL_FORWARD,
        'backward': Blockly.DLMLY_TOOLTIP_TURTEL_BACKWARD
      };
      return TOOLTIPS[mode];
    });
  }
};
'use strict';

goog.provide('Blockly.Blocks.loops');

goog.require('Blockly.Blocks');


Blockly.Blocks.loops.HUE = 120;

Blockly.Blocks.base_setup = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
	    .appendField(Blockly.DLMLY_SETUP);
	this.appendStatementInput('DO')
        .appendField('');
	this.setTooltip(Blockly.DLMLY_TOOLTIP_CONTROL_SETUP);
  }
};


Blockly.Blocks.controls_end_program = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
	      .appendField(Blockly.DLMLY_CONTROL_END_PROGRAM);
	  this.setPreviousStatement(true);
    this.setTooltip(Blockly.DLMLY_DLMPY_CONTROL_END_TOOLTIP);
  }
};

Blockly.Blocks['controls_if'] = {
  /**
   * Block for if/elseif/else condition.
   * @this Blockly.Block
   */
  init: function() {
    //this.setHelpUrl(Blockly.Msg.CONTROLS_IF_HELPURL);
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendValueInput('IF0')
        .setCheck([Boolean,Number])
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendStatementInput('DO0')
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['controls_if_elseif',
                                         'controls_if_else']));
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      if (!thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_1;
      } else if (!thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_2;
      } else if (thisBlock.elseifCount_ && !thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_3;
      } else if (thisBlock.elseifCount_ && thisBlock.elseCount_) {
        return Blockly.Msg.CONTROLS_IF_TOOLTIP_4;
      }
      return '';
    });
    this.elseifCount_ = 0;
    this.elseCount_ = 0;
  },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    if (!this.elseifCount_ && !this.elseCount_) {
      return null;
    }
    var container = document.createElement('mutation');
    if (this.elseifCount_) {
      container.setAttribute('elseif', this.elseifCount_);
    }
    if (this.elseCount_) {
      container.setAttribute('else', 1);
    }
    return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
    for (var i = 1; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
          .setCheck([Boolean,Number])
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
      this.appendStatementInput('DO' + i)
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'controls_if_if');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = Blockly.Block.obtain(workspace, 'controls_if_elseif');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = Blockly.Block.obtain(workspace, 'controls_if_else');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.elseCount_) {
      this.removeInput('ELSE');
    }
    this.elseCount_ = 0;
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var i = this.elseifCount_; i > 0; i--) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
    }
    this.elseifCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          this.elseifCount_++;
          var ifInput = this.appendValueInput('IF' + this.elseifCount_)
              .setCheck([Boolean,Number])
              .appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSEIF);
          var doInput = this.appendStatementInput('DO' + this.elseifCount_);
          doInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_THEN);
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            ifInput.connection.connect(clauseBlock.valueConnection_);
          }
          if (clauseBlock.statementConnection_) {
            doInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        case 'controls_if_else':
          this.elseCount_++;
          var elseInput = this.appendStatementInput('ELSE');
          elseInput.appendField(Blockly.Msg.CONTROLS_IF_MSG_ELSE);
          // Reconnect any child blocks.
          if (clauseBlock.statementConnection_) {
            elseInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_if_elseif':
          var inputIf = this.getInput('IF' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'controls_if_else':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  }
};


Blockly.Blocks.controls_range = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendValueInput('FROM')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("range")
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_FROM);
    this.appendValueInput('TO')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_TO);
    this.appendValueInput('STEP')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.DLMLY_STEP);
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip(Blockly.DLMLY_PYTHON_CONTROLS_RANGE_TOOLTIP);
  }
};


Blockly.Blocks.controls_forEach = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendValueInput('LIST')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.CONTROLS_FOREACH_INPUT);
    this.appendValueInput('VAR')
        .appendField(Blockly.Msg.CONTROLS_FOREACH_INPUT_ITEM)
    //    .appendField(new Blockly.FieldTextInput('i'), 'VAR');
    this.appendStatementInput('DO')
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.CONTROLS_FOR_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};

Blockly.Blocks.controls_whileUntil = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendValueInput('BOOL')
        .setCheck([Boolean,Number])
        .appendField(Blockly.LANG_CONTROLS_WHILEUNTIL_TITLE_REPEAT)
        .appendField(new Blockly.FieldDropdown(this.OPERATORS), 'MODE');
    this.appendStatementInput('DO')
        .appendField(Blockly.LANG_CONTROLS_WHILEUNTIL_INPUT_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
	var thisBlock = this;
	this.setTooltip(function() {
      var op = thisBlock.getFieldValue('MODE');
      var TOOLTIPS = {
        'WHILE': Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_WHILE,
        'UNTIL': Blockly.Msg.CONTROLS_WHILEUNTIL_TOOLTIP_UNTIL
      };
      return TOOLTIPS[op];
    });
  }
};


Blockly.Blocks['controls_try_finally'] = {
    init: function() {
        this.setColour(Blockly.Blocks.loops.HUE);
        this.appendDummyInput()
            .appendField('try');
        this.appendStatementInput('try');
        this.appendValueInput('IF1')
            .appendField('except');
        this.appendStatementInput('DO1')
            .appendField('');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.Mutator(['controls_except',
            'controls_finally']));
        this.setTooltip(Blockly.DLMLY_DLMPY_CONTROL_TRY_TOOLTIP);
        this.elseifCount_ = 1;
        this.elseCount_ = 0;
    },
  /**
   * Create XML to represent the number of else-if and else inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
      if (!this.elseifCount_ && !this.elseCount_) {
          return null;
      }
      var container = document.createElement('mutation');
      if (this.elseifCount_) {
          container.setAttribute('elseif', this.elseifCount_);
      }
      if (this.elseCount_) {
          container.setAttribute('else', 1);
      }
      return container;
  },
  /**
   * Parse XML to restore the else-if and else inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10);
    this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10);
    for (var i = 2; i <= this.elseifCount_; i++) {
      this.appendValueInput('IF' + i)
          .appendField('except');
      this.appendStatementInput('DO' + i)
          .appendField('');
    }
    if (this.elseCount_) {
      this.appendStatementInput('ELSE')
          .appendField('finally');
    }
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = Blockly.Block.obtain(workspace, 'controls_try');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 1; i <= this.elseifCount_; i++) {
      var elseifBlock = Blockly.Block.obtain(workspace, 'controls_except');
      elseifBlock.initSvg();
      connection.connect(elseifBlock.previousConnection);
      connection = elseifBlock.nextConnection;
    }
    if (this.elseCount_) {
      var elseBlock = Blockly.Block.obtain(workspace, 'controls_finally');
      elseBlock.initSvg();
      connection.connect(elseBlock.previousConnection);
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Disconnect the else input blocks and remove the inputs.
    if (this.elseCount_) {
      this.removeInput('ELSE');
    }
    this.elseCount_ = 0;
    // Disconnect all the elseif input blocks and remove the inputs.
    for (var i = this.elseifCount_; i > 0; i--) {
      this.removeInput('IF' + i);
      this.removeInput('DO' + i);
    }
    this.elseifCount_ = 0;
    // Rebuild the block's optional inputs.
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_except':
          this.elseifCount_++;
          var ifInput = this.appendValueInput('IF' + this.elseifCount_)
              .setCheck([Number,Boolean])
              .appendField('except');
          var doInput = this.appendStatementInput('DO' + this.elseifCount_);
          doInput.appendField('');
          // Reconnect any child blocks.
          if (clauseBlock.valueConnection_) {
            ifInput.connection.connect(clauseBlock.valueConnection_);
          }
          if (clauseBlock.statementConnection_) {
            doInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        case 'controls_finally':
          this.elseCount_++;
          var elseInput = this.appendStatementInput('ELSE');
          elseInput.appendField('finally');
          // Reconnect any child blocks.
          if (clauseBlock.statementConnection_) {
            elseInput.connection.connect(clauseBlock.statementConnection_);
          }
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var clauseBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 1;
    while (clauseBlock) {
      switch (clauseBlock.type) {
        case 'controls_except':
          var inputIf = this.getInput('IF' + i);
          var inputDo = this.getInput('DO' + i);
          clauseBlock.valueConnection_ =
              inputIf && inputIf.connection.targetConnection;
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          i++;
          break;
        case 'controls_finally':
          var inputDo = this.getInput('ELSE');
          clauseBlock.statementConnection_ =
              inputDo && inputDo.connection.targetConnection;
          break;
        default:
          throw 'Unknown block type.';
      }
      clauseBlock = clauseBlock.nextConnection &&
          clauseBlock.nextConnection.targetBlock();
    }
  }
};


Blockly.Blocks.controls_flow_statements = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    var dropdown = new Blockly.FieldDropdown(this.OPERATORS);
    this.appendDummyInput()
        .appendField(dropdown, 'FLOW')
        .appendField(Blockly.LANG_CONTROLS_FLOW_STATEMENTS_INPUT_OFLOOP);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.DLMLY_PYTHON_CONTROLS_FLOW_STATEMENTS_TOOLTIP);
	var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('FLOW');
      var TOOLTIPS = {
        'BREAK': Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_BREAK,
        'CONTINUE': Blockly.Msg.CONTROLS_FLOW_STATEMENTS_TOOLTIP_CONTINUE
      };
      return TOOLTIPS[op];
    });
  },
  onchange: function() {
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    var legal = false;
    // Is the block nested in a control statement?
    var block = this;
    do {
      if (block.type == 'controls_repeat' ||
          block.type == 'controls_for' ||
          block.type == 'controls_forEach' ||
          block.type == 'controls_repeat_ext' ||
          block.type == 'controls_whileUntil') {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.LANG_CONTROLS_FLOW_STATEMENTS_WARNING);
    }
  }
};


Blockly.Blocks.controls_for = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_WITH)
        .appendField(new Blockly.FieldTextInput('i'), 'VAR');
    this.appendValueInput('FROM')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_FROM);
    this.appendValueInput('TO')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_TO);
    this.appendValueInput('STEP')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.DLMLY_STEP);
    this.appendStatementInput('DO')
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
	var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.Msg.CONTROLS_FOR_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};

Blockly.Blocks.controls_for_range = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_WITH)
        .appendField(new Blockly.FieldTextInput('i'), 'VAR');
    this.appendValueInput('FROM')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_FROM);
    this.appendValueInput('TO')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_TO);
    this.appendValueInput('STEP')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.DLMLY_STEP);
    this.appendStatementInput('DO')
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_DO);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
    var thisBlock = this;
    this.setTooltip(function() {
      return Blockly.DLMLY_PYTHON_CONTROLS_FOR_RANGE_TOOLTIP.replace('%1',
          thisBlock.getFieldValue('VAR'));
    });
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};


Blockly.Blocks.controls_whileUntil.OPERATORS =
    [[Blockly.LANG_CONTROLS_WHILEUNTIL_OPERATOR_WHILE, 'WHILE'],
     [Blockly.LANG_CONTROLS_WHILEUNTIL_OPERATOR_UNTIL, 'UNTIL']];



Blockly.Blocks.controls_flow_statements.OPERATORS =
    [[Blockly.LANG_CONTROLS_FLOW_STATEMENTS_OPERATOR_BREAK, 'BREAK'],
     [Blockly.LANG_CONTROLS_FLOW_STATEMENTS_OPERATOR_CONTINUE, 'CONTINUE']];



Blockly.Blocks['controls_if_if'] = {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_IF_TITLE_IF);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.CONTROLS_IF_IF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_elseif'] = {
  /**
   * Mutator bolck for else-if condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_ELSEIF_TITLE_ELSEIF);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSEIF_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_if_else'] = {
  /**
   * Mutator block for else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.CONTROLS_IF_ELSE_TITLE_ELSE);
    this.setPreviousStatement(true);
    this.setTooltip(Blockly.Msg.CONTROLS_IF_ELSE_TOOLTIP);
    this.contextMenu = false;
  }
};



Blockly.Blocks['controls_try'] = {
  /**
   * Mutator block for if container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
        .appendField('try');
    this.appendStatementInput('STACK');
    this.setPreviousStatement(true);
    this.setNextStatement(true);    
    this.contextMenu = false;
  }
};

Blockly.Blocks['controls_except'] = {
  /**
   * Mutator bolck for else-if condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
        .appendField('except');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
    this.setTooltip(Blockly.DLMLY_DLMPY_CONTROL_EXCEPT_TOOLTIP);
  }
};

Blockly.Blocks['controls_finally'] = {
  /**
   * Mutator block for else condition.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
        .appendField('finally');
    this.setPreviousStatement(true);
    this.contextMenu = false;
    this.setTooltip(Blockly.DLMLY_DLMPY_CONTROL_FINALLY_TOOLTIP);
  }
};



Blockly.Blocks['controls_repeat_ext'] = {
  /**
   * Block for repeat n times (external number).
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "message0": Blockly.Msg.CONTROLS_REPEAT_TITLE,
      "args0": [
        {
          "type": "input_value",
          "name": "TIMES",
          // "check": "Number"
        }
      ],
      "previousStatement": null,
      "nextStatement": null,
      "colour": Blockly.Blocks.loops.HUE,
      "tooltip": Blockly.Msg.CONTROLS_REPEAT_TOOLTIP,
      "helpUrl": Blockly.Msg.CONTROLS_REPEAT_HELPURL
    });
    this.appendStatementInput('DO')
        .appendField(Blockly.Msg.CONTROLS_REPEAT_INPUT_DO);
  }
};



Blockly.Blocks.controls_lambda = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendValueInput('BOOL')
        .appendField('lambda')
        //.appendField(new Blockly.FieldDropdown(this.OPERATORS), 'MODE');
    this.appendStatementInput('DO')
        .appendField(Blockly.DLMLY_STAT);
    this.setOutput(true);
    // this.setNextStatement(true);
  }
};

Blockly.Blocks.controls_pass = {
  init: function() {
    this.setColour(Blockly.Blocks.loops.HUE);
    this.appendDummyInput()
      .appendField('pass');
  this.setPreviousStatement(true);
  this.setNextStatement(true);
  this.setTooltip(Blockly.DLMLY_PYTHON_CONTROLS_PASS_TOOLTIP);
  }
};

Blockly.Blocks.controls_thread = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_PYTHON_CONTROLS_THREAD_START)
    this.appendValueInput('callback')
        .appendField(Blockly.DLMLY_PYTHON_CONTROLS_THREAD_USE)
    this.appendValueInput('VAR')
        .appendField(Blockly.DLMLY_PARAMS);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
    this.setTooltip(Blockly.DLMLY_PYTHON_CONTROLS_THREAD_TOOLTIP);
  }
};

Blockly.Blocks.base_type=Blockly.Blocks.controls_type;
Blockly.Blocks.controls_TypeLists=Blockly.Blocks.controls_typeLists
'use strict';

goog.provide('Blockly.Blocks.data');

goog.require('Blockly.Blocks');


Blockly.Blocks.data.HUE = 170//'#5ec73d'//195;


Blockly.Blocks['series_create'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
  this.appendDummyInput("")
  
      .appendField(Blockly.blockpy_series_create)
      .appendField(new Blockly.FieldTextInput('ser1'), 'VAR')
    this.appendValueInput('SER')  
        .appendField(Blockly.blockpy_series_via)              
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  this.setTooltip(Blockly.blockpy_series_create_TOOLTIP);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
 
}

Blockly.Blocks['series_create_from_index'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
    this.appendDummyInput("")
  
      .appendField(Blockly.blockpy_series_create)
      .appendField(new Blockly.FieldTextInput('ser1'), 'VAR')
    this.appendValueInput('SER')  
        .appendField(Blockly.blockpy_series_via)   
    this.appendValueInput('INDEX')
        .setCheck([String,'List'])
        .appendField(Blockly.blockpy_series_set_index)  
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  this.setTooltip(Blockly.blockpy_series_create_index_TOOLTIP);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
 
}

Blockly.Blocks['dataframe_create'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
  this.appendDummyInput("")
  
      .appendField(Blockly.blockpy_dataframe_create)
      .appendField(new Blockly.FieldTextInput('df1'), 'VAR')
    this.appendValueInput('SER')  
        .appendField(Blockly.blockpy_series_via)              
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  this.setTooltip(Blockly.blockpy_dataframe_create_TOOLTIP);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
 
}

Blockly.Blocks['dataframe_create_from_one_index'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
    var column_raw =
        [[Blockly.Msg.DATAFRAME_RAW, 'index'],[Blockly.Msg.DATAFRAME_COLUMN, 'columns']];
    this.appendDummyInput("")  
      .appendField(Blockly.blockpy_dataframe_create)
      .appendField(new Blockly.FieldTextInput('df1'), 'VAR')
    this.appendValueInput('SER')  
        .appendField(Blockly.blockpy_series_via)  
    this.appendDummyInput("")    
        .appendField(new Blockly.FieldDropdown(column_raw), 'COLUMN_RAW')  
    this.appendValueInput('INDEX')
        .setCheck([String,'List'])
        .appendField(Blockly.blockpy_series_set_index)          
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
  this.setTooltip(Blockly.blockpy_dataframe_create_index_TOOLTIP);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
 
}

Blockly.Blocks['dataframe_create_from_index'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
    this.appendDummyInput("")
  
      .appendField(Blockly.blockpy_dataframe_create)
      .appendField(new Blockly.FieldTextInput('df1'), 'VAR')
    this.appendValueInput('SER')  
        .appendField(Blockly.blockpy_series_via)   
    this.appendValueInput('INDEX_COLUMN')
        .setCheck([String,'List'])
        .appendField(Blockly.blockpy_dataframe_set_index_column)
    this.appendValueInput('INDEX_RAW')
        .setCheck([String,'List'])
        .appendField(Blockly.blockpy_dataframe_set_index_raw)      
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    //this.setInputsInline(true);
  this.setTooltip(Blockly.blockpy_dataframe_create_index_TOOLTIP);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
 
}



Blockly.Blocks['series_create_from_text'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
    this.appendDummyInput("")
  
        .appendField(new Blockly.FieldTextInput('ser1'), 'VAR')
        
        .appendField(' = [')
        .appendField(new Blockly.FieldTextInput('1,2,3'), 'TEXT')
        .appendField(']');
        
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_SERIES_CREATE_FROM_TEXT);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
  
}


Blockly.Blocks['series_index_value'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
    var index_value =
        [[Blockly.Msg.SERIES_INDEX, 'index'],[Blockly.Msg.SERIES_VALUE, 'value']];
    this.appendValueInput('SERIES')
        .setCheck('Series')
    this.appendDummyInput("")                
        .appendField(Blockly.Msg.SERIES_INDEX_VALUE)  
        .appendField(new Blockly.FieldDropdown(index_value), 'INDEX_VALUE')      
     
    this.setOutput(true, 'List');
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('INDEX_VALUE');
      var TOOLTIPS = {
        'index': Blockly.Msg.SERIES_INDEX_TOOLTIP,
        'value': Blockly.Msg.SERIES_VALUE_TOOLTIP
      };
      return TOOLTIPS[mode];
    });

  }
};

Blockly.Blocks.series_get_num = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
    //this.setOutput(true, Number);
    this.setOutput(true);
    this.appendValueInput('SER')
        .setCheck('Series')
    this.appendValueInput('AT')
        .setCheck(Number)    
        .appendField(Blockly.LANG_LISTS_GET_INDEX1);
    this.appendDummyInput("")
        .appendField(Blockly.LANG_LISTS_GET_INDEX2);
    this.setInputsInline(true);
    this.setTooltip(Blockly.TUPLE_GET_INDEX_TOOLTIP);
  }
};


Blockly.Blocks['pl_plot'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE); 
    var line_type =
        [[Blockly.blockpy_PYLAB_PLOT_LINE_SOLID, '-'],[Blockly.blockpy_PYLAB_PLOT_LINE_DOTTED, '--'],
        [Blockly.blockpy_PYLAB_PLOT_LINE_CHAIN, '-.'],[Blockly.blockpy_PYLAB_PLOT_LINE_POINT_DOTTED, ':']];
    var color_type =
        [[Blockly.Msg.COLOUR_RGB_BLUE, 'b'],[Blockly.Msg.COLOUR_RGB_GREEN, 'g'],
        [Blockly.Msg.COLOUR_RGB_RED, 'r'],[Blockly.Msg.COLOUR_CYAN, 'c'],
        [Blockly.Msg.COLOUR_MAGENTA, 'm'],[Blockly.Msg.COLOUR_YELLOW, 'y'],
        [Blockly.Msg.COLOUR_BLACK, 'k'],[Blockly.Msg.COLOUR_WHITE, 'w']
        ];
    var dot_type =
        [[Blockly.blockpy_PYLAB_PLOT_DOT_CIRCULAR, '.'],[Blockly.blockpy_PYLAB_PLOT_DOT_PIXEL, ','],[Blockly.blockpy_PYLAB_PLOT_DOT_LARGE_DOT, 'o'],[Blockly.blockpy_PYLAB_PLOT_DOT_TRIANGLE_DOWN, 'v'],
        [Blockly.blockpy_PYLAB_PLOT_DOT_TRIANGLE_UP, '^'],[Blockly.blockpy_PYLAB_PLOT_DOT_TRIANGLE_LEFT, '<'],[Blockly.blockpy_PYLAB_PLOT_DOT_TRIANGLE_RIGHT, '>'],[Blockly.blockpy_PYLAB_PLOT_DOT_TRIMARKER_UP, '1'],
        [Blockly.blockpy_PYLAB_PLOT_DOT_TRIMARKER_DOWN, '2'],[Blockly.blockpy_PYLAB_PLOT_DOT_TRIMARKER_LEFT, '3'],[Blockly.blockpy_PYLAB_PLOT_DOT_TRIMARKER_RIGHT, '4'],[Blockly.blockpy_PYLAB_PLOT_DOT_SQUARE, 's'],
        [Blockly.blockpy_PYLAB_PLOT_DOT_PENTAGON, 'p'],[Blockly.blockpy_PYLAB_PLOT_DOT_STAR, '*'],[Blockly.blockpy_PYLAB_PLOT_DOT_HEXAGON_VERTICAL, 'h'],[Blockly.blockpy_PYLAB_PLOT_DOT_HEXAGON_HORIZONTAL, 'H'],
        [Blockly.blockpy_PYLAB_PLOT_DOT_PLUS, '+'],[Blockly.blockpy_PYLAB_PLOT_DOT_CROSS, 'x'],[Blockly.blockpy_PYLAB_PLOT_DOT_DIAMOND, 'D'],[Blockly.blockpy_PYLAB_PLOT_DOT_DIAMOND_SMALL, 'd'],
        [Blockly.blockpy_PYLAB_PLOT_DOT_VERTICAL, '|'],[Blockly.blockpy_PYLAB_PLOT_DOT_HORIZONTAL, '_']
        ];        

    this.appendValueInput('SER')
        .setCheck('Series')
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_MAKE);   
    this.appendDummyInput()
        .appendField(Blockly.blockpy_PYLAB_PLOT); 
    this.appendDummyInput("")                
        .appendField(Blockly.blockpy_PYLAB_PLOT_DOT)  
        .appendField(new Blockly.FieldDropdown(dot_type), 'DOT')  
    this.appendDummyInput("")                
        .appendField(Blockly.blockpy_PYLAB_PLOT_LINE)  
        .appendField(new Blockly.FieldDropdown(line_type), 'LINE')  
    this.appendDummyInput("")                
        .appendField(Blockly.Msg.COLOUR_RGB_TITLE)  
        .appendField(new Blockly.FieldDropdown(color_type), 'COLOR')              
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['pl_show'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
    this.appendDummyInput()
          .appendField(Blockly.blockpy_PYLAB_SHOW);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


Blockly.Blocks['pl_legend'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);
    this.appendDummyInput()
          .appendField(Blockly.blockpy_PYLAB_LEGEND);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['pl_title'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE);    
    this.appendDummyInput()
        .appendField(Blockly.blockpy_PYLAB_TITLE);
    this.appendValueInput('TITLE')
        .setCheck(String);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['pl_label'] = {
  init: function() {
    this.setColour(Blockly.Blocks.data.HUE); 
    var xylabel =
        [[Blockly.Msg.PYLAB_LABEL_X, 'x'],[Blockly.Msg.PYLAB_LABEL_Y, 'y']];   
    this.appendDummyInput()
        .appendField(Blockly.blockpy_PYLAB_SET_LABEL)
        .appendField(new Blockly.FieldDropdown(xylabel), 'DIR');
    this.appendValueInput('LABEL')
        .appendField(Blockly.blockpy_PYLAB_LABEL)
        .setCheck(String);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // var thisBlock = this;
    // this.setTooltip(function() {
    //   var mode = thisBlock.getFieldValue('DIR');
    //   var TOOLTIPS = {
    //     'x': Blockly.DLMLY_TOOLTIP_TURTEL_FORWARD,
    //     'y': Blockly.DLMLY_TOOLTIP_TURTEL_BACKWARD
    //   };
    //   return TOOLTIPS[mode];
    // });
  }
};
/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Dictionary blocks for Blockly.
 * @author acbart@vt.edu (Austin Cory Bart)
 */
'use strict';

goog.provide('Blockly.Blocks.dicts');

goog.require('Blockly.Blocks');


Blockly.Blocks.dicts.HUE = 345;



Blockly.Blocks['dicts_create_with'] = {

    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */

    init: function () {
        this.setColour(Blockly.Blocks.dicts.HUE);
        this.appendDummyInput("")
            .appendField(new Blockly.FieldTextInput('mydict'), 'VAR')
            .appendField(new Blockly.FieldLabel(Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH), 'TIP')
        this.itemCount_ = 3;
        this.updateShape_();
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.Mutator(['dicts_create_with_item']));
        this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_TOOLTIP);
    },

    /**
     * Create XML to represent list inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */

    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },

    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */

    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },

    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */

    decompose: function (workspace) {
        var containerBlock =
            workspace.newBlock('dicts_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('dicts_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },

    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */

    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');

        // Count number of inputs.
        var connections = [];
        var i = 0;
        while (itemBlock) {
            connections[i] = itemBlock.valueConnection_;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
            i++;
        }

        this.itemCount_ = i;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('ADD' + i).connection.connect(connections[i]);
            }
        }
    },

    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */

    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
    },

    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */

    updateShape_: function () {
        // Delete everything.
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        }

        var keyNames = [];
        for (var i = 0; this.getInput('ADD' + i); i++) {
            //this.getInput('VALUE' + i).removeField("KEY"+i);
            keyNames.push(this.getFieldValue("KEY" + i))
            this.removeInput('ADD' + i);
        }
        // Rebuild block.
        if (this.itemCount_ == 0) {
            this.getField('TIP').setText(Blockly.Msg.DICTS_CREATE_EMPTY_TITLE);
        } else {
            this.getField('TIP').setText(Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH);
            for (var i = 0; i < this.itemCount_; i++) {
                this.appendValueInput('ADD' + i)
                    .setCheck(null)
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(
                        new Blockly.FieldTextInput(
                            keyNames.length > i
                                ? keyNames[i]
                                : (i == 0 ? '"key"' :'"key'+(i+1)+'"')),
                        'KEY'+i)
                    .appendField(":")
            }
        }
    }, getVars: function () {
        return [this.getFieldValue('VAR')];
    },
    renameVar: function (oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    }
};



Blockly.Blocks['dicts_create_with_container'] = {

  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['dicts_create_with_item'] = {
  /**
   * Mutator bolck for adding items.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['dicts_keys'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict')
    this.appendDummyInput("")        
        .appendField(Blockly.Msg.DICT_KEYS);  
    this.setTooltip(Blockly.Msg.DICTS_KEYS_TOOLTIP);      
    this.setOutput(true, 'List');
  }
};

Blockly.Blocks['dicts_get'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    // this.appendDummyInput("")
  
    //     .appendField(Blockly.Msg.DICTS_GET_FROM_DICTS)
        
    this.appendValueInput('DICT')
        .setCheck('Dict')    
    this.appendValueInput('KEY')
        .appendField(Blockly.Msg.DICTS_GET_IN)
    this.appendDummyInput("")   
        // .appendField(new Blockly.FieldTextInput('"key"'), 'KEY')
        .appendField(Blockly.Msg.DICTS_GET_VALUE);
       
    this.setOutput(true);
  this.setTooltip(Blockly.Msg.DICTS_GET_TOOLTIP);
  }
};

Blockly.Blocks['dicts_add_or_change'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .appendField(Blockly.Msg.DICTS_GET_FROM_DICTS)
    this.appendValueInput('KEY')
        .appendField(Blockly.Msg.DICTS_ADD)
        // .appendField(new Blockly.FieldTextInput('"key"'), 'KEY')
    this.appendDummyInput()
    this.appendValueInput('VAR')
        .appendField(Blockly.Msg.DICTS_ADD_VALUE);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.DICTS_ADD_OR_CHANGE_TOOLTIP);
  }
};


Blockly.Blocks['dicts_delete'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .appendField(Blockly.Msg.DICTS_GET_FROM_DICTS);
    this.appendValueInput('KEY')
        .appendField(Blockly.Msg.DICTS_DELETE_IN)
    this.appendDummyInput("")
        // .appendField(new Blockly.FieldTextInput('"key"'), 'KEY')
        .appendField(Blockly.Msg.DICTS_DELETE_VALUE);
       
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  this.setTooltip(Blockly.Msg.DICTS_DELETE_TOOLTIP);
  }
};


Blockly.Blocks['dicts_update'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT2')
        .setCheck('Dict')
        .appendField(Blockly.Msg.MAKE_DICT)      
    this.appendValueInput('DICT')
        .setCheck('Dict')
        .appendField(Blockly.Msg.DICT_UPDATE); 
    this.appendDummyInput("")        
        .appendField(Blockly.DLMLY_MID);    
    this.setTooltip(Blockly.Msg.DICTS_UPDATE_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['dicts_clear'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict')
    this.appendDummyInput("")        
        .appendField(Blockly.Msg.DICT_CLEAR);  
    this.setTooltip(Blockly.Msg.DICTS_CLEAR_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['dicts_items'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict')
  this.appendDummyInput("")        
        
        .appendField(Blockly.Msg.DICT_ITEMS);  
  this.setTooltip(Blockly.Msg.DICTS_ITEMS_TOOLTIP);      
  this.setOutput(true, 'List');
  }
};

Blockly.Blocks['dicts_values'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict')
  this.appendDummyInput("")        
        
        .appendField(Blockly.Msg.DICT_VALUES);  
  this.setTooltip(Blockly.Msg.DICTS_VALUES_TOOLTIP);      
  this.setOutput(true, 'List');
  }
};

Blockly.Blocks['dicts_length'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict')
  this.appendDummyInput("")
        .appendField(Blockly.Msg.LISTS_LENGTH_TITLE)
        
  this.setTooltip(Blockly.Msg.DICT_LENGTH_TOOLTIP);
  this.setOutput(true, Number);
  }
};

Blockly.Blocks['dicts_deldict'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict')
    this.appendDummyInput("")        
        
        .appendField(Blockly.Msg.DICT_DELDICT);  
    this.setTooltip(Blockly.Msg.DICTS_DEL_TOOLTIP);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

 Blockly.Blocks['dicts_add_change_del'] = {
  /**
   * Block for getting sublist.
   * @this Blockly.Block
   */
  init: function() {
   
    this['MODE'] =
        [[Blockly.Msg.DICTS_ADD_OR_CHANGE, 'INSERT'],
         
         [Blockly.DLMLY_MICROBIT_JS_DELETE_VAR, 'DELETE']];
    this.setHelpUrl(Blockly.Msg.LISTS_GET_SUBLIST_HELPURL);
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict')
    this.appendDummyInput('AT2')
    this.appendValueInput('KEY')
    this.appendDummyInput("")   
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_MAKE)
        // .appendField(new Blockly.FieldTextInput('"key"'), 'KEY')
        .appendField(Blockly.Msg.DICTS_ADD_VALUE);
    this.updateAt_(true);
    this.setInputsInline(true);
    this.setOutput(false);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    var b = this;
        this.setTooltip(function() {
            var e = b.getFieldValue("WHERE"),
                d = "";
            switch (e) {
            
            case "INSERT":
                d = Blockly.Msg.DICTS_ADD_TOOLTIP;
                break;
            case "DELETE":
                d = Blockly.Msg.DICTS_DELETE_TOOLTIP;
                break;
            
            }
            //if ("FROM_START" == e || "FROM_END" == e) d += "  " + Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP.replace("%1", Blockly.Blocks.ONE_BASED_INDEXING ? "#1": "#0");
            return d
        })
    
  },
  /**
   * Create XML to represent whether there are 'AT' inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var isAt = this.getInput('AT2').type == Blockly.INPUT_VALUE;
    container.setAttribute('at2', isAt);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var isAt = (xmlElement.getAttribute('at2') == 'true');
    this.updateAt_(isAt);
  },
  /**
   * Create or delete an input for a numeric index.
   * This block has two such inputs, independant of each other.
   * @param {number} n Specify first or second input (1 or 2).
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function(isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT2');
    this.removeInput('ORDINAL', true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT2').setCheck(Number);
    } else {
      this.appendDummyInput('AT2');
    }
    var menu = new Blockly.FieldDropdown(this['MODE'],
        function(value) {
          var newAt = (value == 'INSERT') ;
          // The 'isAt' variable is available due to this function being a
          // closure.
          if (newAt != isAt) {
            var block = this.sourceBlock_;
            block.updateAt_(newAt);
            // This menu has been destroyed and replaced.
            // Update the replacement.
            block.setFieldValue(value, 'WHERE');
            return null;
          }
          return undefined;
        });
    
    this.getInput('AT2')
        .appendField(menu, 'WHERE');

    // this.moveInputBefore('AT2','LIST');
  }
};

Blockly.Blocks['dicts_pop'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict')
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_DICT_POP)
    this.appendValueInput('KEY')
    this.appendDummyInput("")
        // .appendField(new Blockly.FieldTextInput('"key"'), 'KEY')
        .appendField(Blockly.Msg.DICTS_GET_VALUE);    
    this.setTooltip(Blockly.Msg.DICT_POP_TOOLTIP);
    this.setInputsInline(true);
    this.setOutput(true);
  }
};

Blockly.Blocks['dicts_setdefault'] = {
  init: function() {
    this.setColour(Blockly.Blocks.dicts.HUE);
    this.appendValueInput('DICT')
        .setCheck('Dict');
    this.appendValueInput('KEY')
        .appendField(Blockly.Msg.DICTS_SET_DEFAULT)
    this.appendDummyInput("")
        // .appendField(new Blockly.FieldTextInput('"key"'), 'KEY')
        .appendField(Blockly.Msg.DICTS_DEFAULT_VALUE);
    this.appendValueInput('VAR')    
       
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  this.setTooltip(Blockly.Msg.DICTS_SETDEFAULT_TOOLTIP);
  }
};

Blockly.Blocks['dicts_create_with_noreturn'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function () {
        this.setColour(Blockly.Blocks.dicts.HUE);
        this.appendDummyInput("")
        //    .appendField(new Blockly.FieldTextInput('mydict'), 'VAR')
            .appendField(new Blockly.FieldLabel(Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH), 'TIP')
        this.itemCount_ = 3;
        this.updateShape_();
        this.setOutput(true, "Dict")
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setMutator(new Blockly.Mutator(['dicts_create_with_item']));
        this.setTooltip(Blockly.Msg.DICTS_CREATE_WITH_TOOLTIP);
    },

    /**
     * Create XML to represent list inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */

    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },

    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */

    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },

    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */

    decompose: function (workspace) {
        var containerBlock =
            workspace.newBlock('dicts_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('dicts_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },

    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */

    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');

        // Count number of inputs.
        var connections = [];
        var i = 0;
        while (itemBlock) {
            connections[i] = itemBlock.valueConnection_;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
            i++;
        }

        this.itemCount_ = i;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('ADD' + i).connection.connect(connections[i]);
            }
        }
    },

    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */

    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
    },

    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */

    updateShape_: function () {
        // Delete everything.
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        }

        var keyNames = [];
        for (var i = 0; this.getInput('ADD' + i); i++) {
            //this.getInput('VALUE' + i).removeField("KEY"+i);
            keyNames.push(this.getFieldValue("KEY" + i))
            this.removeInput('ADD' + i);
        }
        // Rebuild block.
        if (this.itemCount_ == 0) {
            this.getField('TIP').setText(Blockly.Msg.DICTS_CREATE_EMPTY_TITLE);
        } else {
            this.getField('TIP').setText(Blockly.Msg.DICTS_CREATE_WITH_INPUT_WITH);
            for (var i = 0; i < this.itemCount_; i++) {
                this.appendValueInput('ADD' + i)
                    .setCheck(null)
                    .setAlign(Blockly.ALIGN_RIGHT)
                    .appendField(
                        new Blockly.FieldTextInput(
                            keyNames.length > i
                                ? keyNames[i]
                                : (i == 0 ? '"key"' :'"key'+(i+1)+'"')),
                        'KEY'+i)
                    .appendField(":")
            }
        }
    }, getVars: function () {
        return [this.getFieldValue('VAR')];
    },
    renameVar: function (oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    }
};
'use strict';

goog.provide('Blockly.Blocks.factory');
goog.require('Blockly.Blocks');
Blockly.Blocks.factory.HUE = "#777777"//65;

Blockly.Blocks.factory_from_import = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
        .appendField("from ")
        .appendField(new Blockly.FieldTextInput('ESP32'), 'path')
        .appendField(" import ")
        .appendField(new Blockly.FieldTextInput('*'), 'module');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.factory_import = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
        .appendField("import ")
        .appendField(new Blockly.FieldTextInput('module'), 'module');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.factory_function_noreturn = {
  init: function() {
    //console.log('init');
  this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextInput('my_function'), 'NAME');
  this.itemCount_ = 1;
  this.arguments_ = ['x'];//add
  this.updateShape_();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  this.setMutator(new Blockly.Mutator(['factory_create_with_item']));
  },
  mutationToDom: function() {
    //console.log('mutationToDom');
  var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
  //add
  for (var i = 0; i < this.arguments_.length; i++) {
      var parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      container.appendChild(parameter);
    }
    return container;
  },
  domToMutation: function(xmlElement) {
    //console.log('domToMutation');
  this.arguments_ = [];//add
  //add
  for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        this.arguments_.push(childNode.getAttribute('name'));
      }
    }
  this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  decompose: function(workspace) {
    //console.log('decompose');
  var containerBlock =
        Blockly.Block.obtain(workspace, 'factory_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'factory_create_with_item');
      itemBlock.initSvg();
    itemBlock.setFieldValue(this.arguments_[i], 'NAME');//add
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  compose: function(containerBlock) {
    //console.log('compose');
  this.arguments_ = [];//add
  var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
    this.arguments_.push(itemBlock.getFieldValue('NAME'));//add
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  saveConnections: function(containerBlock) {
    //console.log('saveConnections');
  var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  updateShape_: function() {
    //console.log('updateShape_');
  // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
  for (var i = 0; i < this.itemCount_; i++) {
    var input = this.appendValueInput('ADD' + i).setAlign(Blockly.ALIGN_RIGHT).appendField(this.arguments_[i]);
  }
  }
};

Blockly.Blocks['factory_create_with_container'] = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_PARAMS);
    this.appendStatementInput('STACK');
    this.contextMenu = false;
  }
};

Blockly.Blocks['factory_create_with_item'] = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE+':')
    .appendField(new Blockly.FieldTextInput('x'), 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.contextMenu = false;
  }
};

Blockly.Blocks.factory_function_return = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextInput('my_function'), 'NAME');
  this.itemCount_ = 1;
  this.arguments_ = ['x'];//add
  this.updateShape_();
    this.setOutput(true);
  this.setMutator(new Blockly.Mutator(['factory_create_with_item']));
  },
  mutationToDom: Blockly.Blocks.factory_function_noreturn.mutationToDom,
  domToMutation: Blockly.Blocks.factory_function_noreturn.domToMutation,
  decompose: Blockly.Blocks.factory_function_noreturn.decompose,
  compose: Blockly.Blocks.factory_function_noreturn.compose,
  saveConnections: Blockly.Blocks.factory_function_noreturn.saveConnections,
  updateShape_: Blockly.Blocks.factory_function_noreturn.updateShape_
};

Blockly.Blocks.factory_declare={
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextInput('test'), 'NAME')
    .appendField("=")
    .appendField(new Blockly.FieldTextInput('Test'), 'TYPE')
    .appendField("()");
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
}


Blockly.Blocks.factory_callMethod_noreturn = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextInput('test'), 'NAME')
    .appendField('.')
    .appendField(new Blockly.FieldTextInput('callMethod'), 'METHOD');
  this.itemCount_ = 1;
  this.arguments_ = ['x'];//add
  this.updateShape_();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  this.setMutator(new Blockly.Mutator(['factory_create_with_item']));
  },
  mutationToDom: Blockly.Blocks.factory_function_noreturn.mutationToDom,
  domToMutation: Blockly.Blocks.factory_function_noreturn.domToMutation,
  decompose: Blockly.Blocks.factory_function_noreturn.decompose,
  compose: Blockly.Blocks.factory_function_noreturn.compose,
  saveConnections: Blockly.Blocks.factory_function_noreturn.saveConnections,
  updateShape_: Blockly.Blocks.factory_function_noreturn.updateShape_
};

Blockly.Blocks.factory_callMethod_return = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextInput('test'), 'NAME')
    .appendField('.')
    .appendField(new Blockly.FieldTextInput('callMethod'), 'METHOD');
  this.itemCount_ = 1;
  this.arguments_ = ['x'];//add
  this.updateShape_();
    this.setOutput(true);
  this.setMutator(new Blockly.Mutator(['factory_create_with_item']));
  },
  mutationToDom: Blockly.Blocks.factory_function_noreturn.mutationToDom,
  domToMutation: Blockly.Blocks.factory_function_noreturn.domToMutation,
  decompose: Blockly.Blocks.factory_function_noreturn.decompose,
  compose: Blockly.Blocks.factory_function_noreturn.compose,
  saveConnections: Blockly.Blocks.factory_function_noreturn.saveConnections,
  updateShape_: Blockly.Blocks.factory_function_noreturn.updateShape_
};

Blockly.Blocks.factory_block = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextInput('display.scroll("Hello World!")'), 'VALUE');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.factory_block_return = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextInput('test'), 'VALUE');
    this.setOutput(true);
  }
};

Blockly.Blocks.factory_block_with_textarea = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextArea('display.scroll("Hello World!")\ndisplay.scroll("Hello Dlm!")'), 'VALUE');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.factory_block_return_with_textarea = {
  init: function() {
    this.setColour(Blockly.Blocks.factory.HUE);
  this.appendDummyInput("")
    .appendField(new Blockly.FieldTextArea('Hello\nDlm'), 'VALUE');
    this.setOutput(true);
  }
};
'use strict';

goog.provide('Blockly.Blocks.hardware');

goog.require('Blockly.Blocks');

Blockly.Blocks.hardware.HUE = 40

Blockly.Blocks.hardware_arduino_start = {
    init: function () {
        this.setColour(Blockly.Blocks.hardware.HUE);
        this.appendDummyInput("")
            .appendField(Blockly.DLMLY_HARDWARE)
        this.appendValueInput('SUB')
            .setCheck("var");
        this.appendDummyInput()
            .appendField(Blockly.DLMLY_HARDWARE_START)
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};

Blockly.Blocks['inout_highlow'] = {
   init: function() {
    this.setColour(Blockly.Blocks.hardware.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_HIGH, "HIGH"], [Blockly.DLMLY_LOW, "LOW"]]), 'BOOL')
    this.setOutput(true, Boolean);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_INOUT_HIGHLOW);
  }
};

Blockly.Blocks.hardware_arduino_digital_write = {
  init: function() {
    this.setColour(Blockly.Blocks.hardware.HUE);
    this.appendValueInput('SUB')
        .appendField(Blockly.DLMLY_HARDWARE)
        .setCheck("var");
    this.appendValueInput("PIN",Number)
        .appendField(Blockly.DLMLY_Digital_PINMODEOUT)
        .appendField(Blockly.DLMLY_PIN+"#")
        .setCheck(Number);
    this.appendValueInput("STAT")
        .appendField(Blockly.DLMLY_STAT)
        .setCheck([Number,Boolean]);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip(Blockly.LANG_INOUT_DIGITAL_WRITE_TOOLTIP);
  }
};

Blockly.Blocks.hardware_arduino_digital_read = {
  init: function() {
    this.setColour(Blockly.Blocks.hardware.HUE);
    this.appendValueInput('SUB')
        .appendField(Blockly.DLMLY_HARDWARE)
        .setCheck("var");
    this.appendValueInput("PIN", Number)
        .appendField(Blockly.DLMLY_Digital_PINMODEIN)
        .appendField(Blockly.DLMLY_PIN+"#")
        .setCheck(Number);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_ESP32_MACHINE_VALUE)
    this.setInputsInline(true);
    this.setOutput(true, [Boolean,Number]);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_INOUT_DIGITAL_READ);
  }
};

Blockly.Blocks.hardware_arduino_analog_write = {
  init: function() {
    this.setColour(Blockly.Blocks.hardware.HUE);
    this.appendValueInput('SUB')
        .appendField(Blockly.DLMLY_HARDWARE)
        .setCheck("var");
    this.appendValueInput("PIN",Number)
        .appendField(Blockly.DLMLY_Analog_PINMODEOUT)
        .appendField(Blockly.DLMLY_PIN+"#")
        .setCheck(Number);
    this.appendValueInput("NUM", Number)
        .appendField(Blockly.DLMLY_VALUE2)
        .setCheck(Number);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_INOUT_ANALOG_WRITE);
  }
};

Blockly.Blocks.hardware_arduino_analog_read = {
  init: function() {
    this.setColour(Blockly.Blocks.hardware.HUE);
    this.appendValueInput('SUB')
        .appendField(Blockly.DLMLY_HARDWARE)
        .setCheck("var");
    this.appendValueInput("PIN", Number)
        .appendField(Blockly.DLMLY_Analog_PINMODEIN)
        .appendField(Blockly.DLMLY_PIN+"#")
        .setCheck(Number);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_ESP32_MACHINE_VALUE)
    this.setInputsInline(true);
    this.setOutput(true, [Boolean,Number]);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_INOUT_ANALOG_READ);
  }
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

goog.provide('Blockly.Blocks.base');

goog.require('Blockly.Blocks');



Blockly.Blocks['inout_input']={
init: function() {
    this.setColour(20);
    this.appendValueInput("VAR")
        .appendField(Blockly.blockpy_inout_raw_input)
        .setCheck(String);
    this.setOutput(true);
        this.setTooltip(Blockly.Msg.INOUT_input_TOOLTIP);
  }
}

Blockly.Blocks['inout_print'] = {
  init: function() {
    this.setColour(20);
        this.appendValueInput("VAR")
        .appendField(Blockly.blockpy_inout_print);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.BLOCKPY_PRINT_TOOLTIP);
  }
};

Blockly.Blocks['inout_print_inline'] = {
  init: function() {
    this.setColour(20);
        this.appendValueInput("VAR")
        .appendField(Blockly.blockpy_inout_print_inline);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.TEXT_PRINT_INLINE_TOOLTIP);
  }
};

Blockly.Blocks['inout_print_end'] = {
  init: function() {
    this.setColour(20);
        this.appendValueInput("VAR")
            .appendField(Blockly.blockpy_inout_print_inline);
        this.appendValueInput("END")
            .appendField(Blockly.DLMLY_ENDSWITH);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setInputsInline(true);
        this.setTooltip(Blockly.DLMLY_PYTHON_INOUT_PRINT_END_TOOLTIP);
  }
};

Blockly.Blocks['inout_type_input'] = {
  init: function() {
    
  var input_type =
        [[Blockly.LANG_MATH_STRING, 'str'],[Blockly.LANG_MATH_INT, 'int']
        ,[Blockly.LANG_MATH_FLOAT, 'float']];
    this.setColour(20);
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET)
        .appendField(new Blockly.FieldDropdown(input_type), 'DIR')
    this.appendValueInput("VAR")
        .appendField(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE)
        .setCheck(String);    

  this.setInputsInline(true);
   this.setOutput(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'str': Blockly.DLMLY_DLMPY_INOUT_STR_INPUT_TOOLTIP,
        'int': Blockly.DLMLY_DLMPY_INOUT_INT_INPUT_TOOLTIP,
        'float': Blockly.DLMLY_DLMPY_INOUT_FLOAT_INPUT_TOOLTIP
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['inout_print_many'] = {
  
  init: function() {
    this.setColour(20);
    
    this.itemCount_ = 2;
    this.updateShape_();
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setInputsInline(true);
    this.setMutator(new Blockly.Mutator(['inout_print_item']));
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.DLMLY_DLMPY_INOUT_PRINT_MANY_TOOLTIP);
  },
  
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'inout_print_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'inout_print_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.DLMLY_DLMPY_INOUT_PRINT_EMPTY);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.blockpy_inout_print);
        }
      }
    }
  }
};
Blockly.Blocks['inout_print_container'] = {  
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendField(Blockly.blockpy_inout_print);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.DLMLY_DLMPY_INOUT_PRINT_MANY_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['inout_print_item'] = {
  init: function() {
    this.setColour(20);
    this.appendDummyInput()
        .appendField(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.DLMLY_DLMPY_INOUT_PRINT_MANY_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};
'use strict';

goog.provide('Blockly.Blocks.lists');

goog.require('Blockly.Blocks');


Blockly.Blocks.lists.HUE = 260//'#70b234'//260;


Blockly.Blocks.lists_get_index = {
    init: function () {
        this.setHelpUrl(Blockly.Msg.LISTS_GET_INDEX_HELPURL);
        this.setColour(Blockly.Blocks.lists.HUE);
        this.appendValueInput("LIST")
        this.appendValueInput("AT")
            .setCheck(Number)
            .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET + " " + Blockly.Msg.LISTS_GET_INDEX_FROM_START)
        this.appendDummyInput()
            .appendField(Blockly.Msg.TEXT_INDEXOF_TAIL);
        this.setInputsInline(true);
        this.setOutput(true);
        this.setTooltip(Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM);
    }
}


Blockly.Blocks['lists_get_sublist'] = {
    /**
     * Block for getting sublist.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(Blockly.Msg.LISTS_GET_SUBLIST_HELPURL);
        this.setColour(Blockly.Blocks.lists.HUE);
        this.appendValueInput('LIST')
        this.appendDummyInput('')
        this.appendValueInput('AT1')
            .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET + " " + Blockly.Msg.LISTS_GET_INDEX_FROM_START);
        this.appendValueInput('AT2')
            .appendField(Blockly.Msg.TEXT_INDEXOF_TAIL + " " + Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START);
        this.appendDummyInput()
            .appendField(Blockly.Msg.TEXT_INDEXOF_TAIL);
        this.setInputsInline(true);
        this.setOutput(true, 'List');
        this.setTooltip(Blockly.Msg.PYTHON_LISTS_GET_SUBLIST_TOOLTIP);
    }
}


Blockly.Blocks['lists_create_with'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
	this.appendDummyInput("")
  //don't need to specify the data type in Python
        // .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'Array<number>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_STRING, 'Array<string>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_BOOLEAN, 'Array<boolean>']]), 'TYPE')
        // .appendField(' ')
        .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
        .appendField('[')
        //.appendField(new Blockly.FieldTextInput('3',Blockly.FieldTextInput.math_number_validator), 'SIZE')
        .appendField(']');
    this.itemCount_ = 3;
    this.updateShape_();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_PYTHON_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'lists_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'lists_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.LISTS_CREATE_PYTHON_EMPTY_TITLE);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.blockpy_LISTS_CREATE_WITH_INPUT_WITH);
        }
      }
    }
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};


Blockly.Blocks['lists_create_with_text'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
  this.appendDummyInput("")
  //don't need to specify the data type in Python
        // .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'Array<number>']]), 'TYPE')
        // .appendField(' ')
    // .appendField(Blockly.blockpy_DLMLY_SPLITBYDOU)
        .appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
        //.appendField(new Blockly.FieldTextInput('3',Blockly.FieldTextInput.math_number_validator), 'SIZE')
      // .appendField(Blockly.DLMLY_MAKELISTFROM)
    // .appendField(this.newQuote_(true))
        .appendField(' = [')
        .appendField(new Blockly.FieldTextInput('0,0,0'), 'TEXT')
        .appendField(']');
        // .appendField(this.newQuote_(false))
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  this.setTooltip(Blockly.DLMLY_TOOLTIP_LISTS_CREATE_WITH_TEXT2);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
}


Blockly.Blocks['lists_create_with_container'] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_MICROBIT_TYPE_LIST);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['lists_create_with_item'] = {
  /**
   * Mutator bolck for adding items.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};


Blockly.Blocks.lists_set_index = {
    init: function() {
        this.setColour(Blockly.Blocks.lists.HUE);
        this.appendValueInput('LIST');
        this.appendValueInput('AT')
            .setCheck(Number)
            .appendField(Blockly.DLMLY_MICROBIT_LIST_ASSIGN_AT);
        this.appendValueInput('TO')
            .appendField(Blockly.DLMLY_MICROBIT_JS_LIST_VALUE);
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.LANG_LISTS_SET_INDEX_TOOLTIP);
    }
};

Blockly.Blocks['lists_append_extend'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this['TYPE'] =
        [[Blockly.DLMLY_blockpy_set_add, 'append'],
         [Blockly.DLMLY_MICROBIT_LIST_EXTEND, 'extend']];

    this.appendValueInput('LIST')
        .setCheck('List')
    this.appendValueInput('DATA')
        .appendField(new Blockly.FieldDropdown(this['TYPE']), 'OP')
        .appendField(Blockly.DLMLY_MICROBIT_LIST_A_ITEM)
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_MICROBIT_JS_LIST_TO_END);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'append': Blockly.DLMLY_TOOLTIP_LIST_APPEND,
        'extend': Blockly.Msg.LISTS_EXTEND_TOOLTIP

      };
      return TOOLTIPS[mode];
    });
  }

};

Blockly.Blocks['lists_get_random_item'] = {
  /**
   * Block for get a random item from list.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
  this.appendValueInput("LIST");
  this.appendDummyInput()
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET + " " + Blockly.Msg.LISTS_GET_INDEX_RANDOM)
  this.setTooltip(Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM);
  this.setOutput(true);
  }
};

Blockly.Blocks.lists_insert_value = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('LIST');
    this.appendValueInput('AT')
        .setCheck(Number)
        .appendField(Blockly.DLMLY_MICROBIT_JS_LIST_INSERT_AT);
    this.appendValueInput('VALUE')
        .appendField(Blockly.DLMLY_MICROBIT_JS_LIST_VALUE);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.LANG_LISTS_SET_INDEX_TOOLTIP);
    this.setTooltip(Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_INSERT);
  }
};

Blockly.Blocks['lists_reverse'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('VAR')
        .setCheck('List') //this.appendDummyInput("")
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_MICROBIT_JS_LIST_REVERSE)
        //.appendField(new Blockly.FieldTextInput('mylist'), 'VAR');
    this.setTooltip(Blockly.LANG_LISTS_CLEAR_TOOLTIP);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};
Blockly.Blocks['lists_clear'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('VAR')
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_MICROPYTHON_CLEAR)
        //.appendField(new Blockly.FieldTextInput('mylist'), 'VAR');
    this.setTooltip(Blockly.LANG_LISTS_REVERSE_TOOLTIP);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


Blockly.Blocks.lists_remove_at = {
    init: function() {
        this.setColour(Blockly.Blocks.lists.HUE);
        this['TYPE'] =
            [[Blockly.Msg.SERIES_INDEX, 'del'],
                [Blockly.DLMLY_MICROBIT_JS_I2C_VALUE, 'remove']];
        this.appendValueInput('LIST')
            .setCheck('List')
        this.appendValueInput('DATA')
            .appendField(Blockly.DLMLY_DLMPY_LISTS_REMOVE)
            .appendField(new Blockly.FieldDropdown(this['TYPE']), 'OP')
        this.setInputsInline(true);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        var thisBlock = this;
        this.setTooltip(function () {
            var mode = thisBlock.getFieldValue('OP');
            var TOOLTIPS = {
                'del': Blockly.Msg.LISTS_SET_INDEX_TOOLTIP_DELETE,
                'remove': Blockly.DLMLY_TOOLTIP_LIST_REMOVE
            };
            return TOOLTIPS[mode];
        });
    }
};
Blockly.Blocks.lists_pop = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('LIST');
    this.appendValueInput('VALUE')
        .appendField(Blockly.DLMLY_MICROBIT_LIST_POP);
    this.appendDummyInput()
        .appendField(Blockly.Msg.TEXT_INDEXOF_TAIL);
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM);
  }
};

Blockly.Blocks['lists_find'] = {
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.DLMLY_LIST_INDEX, 'INDEX'],
         [Blockly.Msg.DLMLY_LIST_COUNT, 'COUNT']
        ];
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('VAR')
        .setCheck('List')
    this.appendValueInput('data')
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET)
        .appendField(Blockly.DLMLY_I2C_VALUE)
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_DE)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        //.appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
    this.setInputsInline(true);
    this.setOutput(true, Number);
     var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'INDEX': Blockly.DLMLY_TOOLTIP_LIST_FIND_INDEX,
        'COUNT': Blockly.DLMLY_TOOLTIP_LIST_FIND_COUNT
        
      };
      return TOOLTIPS[mode];
    });  
  }
};
Blockly.Blocks['list_trig'] = {
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.DLMLY_LIST_LEN, 'LEN'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_SUM, 'SUM'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_MAX, 'MAX'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_MIN, 'MIN'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_AVERAGE, 'AVERAGE'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_MEDIAN, 'MEDIAN'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_MODE, 'MODE'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_STD_DEV, 'STD_DEV'],
        ];
    //this.setHelpUrl(Blockly.Msg.MATH_TRIG_HELPURL);
    this.setColour(Blockly.Blocks.lists.HUE);
    this.setOutput(true, Number);
    this.appendValueInput('data')
    this.appendDummyInput()
    .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'LEN': Blockly.Msg.LISTS_LENGTH_TOOLTIP,
        'SUM': Blockly.Msg.MATH_ONLIST_TOOLTIP_SUM,
        'MAX': Blockly.Msg.MATH_ONLIST_TOOLTIP_MAX,
        'MIN': Blockly.Msg.MATH_ONLIST_TOOLTIP_MIN,
        'AVERAGE': Blockly.Msg.MATH_ONLIST_TOOLTIP_AVERAGE,
        'MEDIAN': Blockly.Msg.MATH_ONLIST_TOOLTIP_MEDIAN,
        'MODE': Blockly.Msg.MATH_ONLIST_TOOLTIP_MODE,
        'STD_DEV': Blockly.Msg.MATH_ONLIST_TOOLTIP_STD_DEV
        
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['lists_sort'] = {
  /**
   * Block for sorting a list.
   * @this Blockly.Block
   */
  init: function() {
    this.jsonInit({
      "args0": [
        {
          "type": "input_value",
          "name": "LIST",
          "check": "List"
        },
        {
          "type": "field_dropdown",
          "name": "TYPE",
          "options": [
            [Blockly.Msg.LISTS_SORT_TYPE_NUMERIC, "NUMERIC"],
            [Blockly.Msg.LISTS_SORT_TYPE_TEXT, "TEXT"],
            [Blockly.Msg.LISTS_SORT_TYPE_IGNORECASE, "IGNORE_CASE"]
          ]
        },
        {
          "type": "field_dropdown",
          "name": "DIRECTION",
          "options": [
            [Blockly.Msg.LISTS_SORT_ORDER_ASCENDING, "1"],
            [Blockly.Msg.LISTS_SORT_ORDER_DESCENDING, "-1"]
          ]
        },
      ],
      "message0": Blockly.Msg.LISTS_SORT_TITLE,
      "inputsInline": true,
      "output": "List",
      "colour": Blockly.Blocks.lists.HUE,
      "tooltip": Blockly.Msg.LISTS_SORT_TOOLTIP,
      "helpUrl": Blockly.Msg.LISTS_SORT_HELPURL
    });
  }
};


Blockly.Blocks['lists_change_to'] = {
  init: function() {
    var OPERATORS =
        [[Blockly.DLMLY_MICROBIT_TYPE_TUPLE, 'tuple'],
         [Blockly.DLMLY_MICROBIT_TYPE_SETS, 'set']
        ];
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('VAR')
        .setCheck("List")
        // .appendField(Blockly.blockpy_USE_LIST);   
    this.appendDummyInput("")
        .appendField(Blockly.Msg.A_TO_B)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'tuple': Blockly.DLMLY_TOOLTIP_CONVERT_LIST_TO_TUPLE,
        'set': Blockly.DLMLY_TOOLTIP_CONVERT_LIST_TO_SET
        
      };
      return TOOLTIPS[mode];
    });    
    
    this.setInputsInline(true);
    this.setOutput(true);
  }
};

Blockly.Blocks['list_many_input']= {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput("")
        .appendField('[')
        .appendField(new Blockly.FieldTextInput('0,0,0'),"CONTENT")
        .appendField(']');
    this.setInputsInline(true);
    this.setOutput(true);
  }
};

Blockly.Blocks['lists_create_with_noreturn'] = {
    /**
     * Block for creating a list with any number of elements of any type.
     * @this Blockly.Block
     */
    init: function () {
        this.setColour(Blockly.Blocks.lists.HUE);
        this.itemCount_ = 3;
        this.updateShape_();
        this.setPreviousStatement(false);
        this.setNextStatement(false);
        this.setOutput(true, "List")
        this.setMutator(new Blockly.Mutator(['lists_create_with_item']));
        this.setTooltip(Blockly.Msg.LISTS_CREATE_WITH_PYTHON_TOOLTIP);
    },
    /**
     * Create XML to represent list inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function () {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function (workspace) {
        var containerBlock =
            Blockly.Block.obtain(workspace, 'lists_create_with_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = Blockly.Block.obtain(workspace, 'lists_create_with_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        var i = 0;
        while (itemBlock) {
            connections[i] = itemBlock.valueConnection_;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
            i++;
        }
        this.itemCount_ = i;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('ADD' + i).connection.connect(connections[i]);
            }
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD' + i);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            i++;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function () {
        // Delete everything.
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else {
            var i = 0;
            while (this.getInput('ADD' + i)) {
                this.removeInput('ADD' + i);
                i++;
            }
        }
        // Rebuild block.
        if (this.itemCount_ == 0) {
            this.appendDummyInput('EMPTY')
                .appendField(Blockly.Msg.LISTS_CREATE_PYTHON_EMPTY_TITLE);
        } else {
            for (var i = 0; i < this.itemCount_; i++) {
                var input = this.appendValueInput('ADD' + i);
                if (i == 0) {
                    input.appendField(Blockly.Msg.blockpy_LISTS_CREATE_WITH_INPUT_WITH);
                }
            }
        }
    },
    getVars: function () {
        return [this.getFieldValue('VAR')];
    },
    renameVar: function (oldName, newName) {
        if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
            this.setTitleValue(newName, 'VAR');
        }
    }
}

Blockly.Blocks['lists_change_to_general'] = {
  init: function() {
    var OPERATORS =
        [
         [Blockly.DLMLY_MICROBIT_TYPE_LIST, 'list'],
         [Blockly.DLMLY_MICROBIT_TYPE_TUPLE, 'tuple'],
         [Blockly.DLMLY_MICROBIT_TYPE_SETS, 'set']
        ];
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('VAR');
    this.appendDummyInput("")
        .appendField(Blockly.Msg.A_TO_B)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    var thisBlock = this;

    this.setInputsInline(true);
    this.setOutput(true);
  }
};

Blockly.Blocks['lists_del_general'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendValueInput('TUP')
    this.appendDummyInput("")
        .appendField(Blockly.Msg.OBJECT_DELETE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['lists_zip'] = {
    init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    
    this.itemCount_ = 2;
    this.updateShape_();
    this.setInputsInline(true);
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setOutput(true, "List")
    this.setMutator(new Blockly.Mutator(['lists_zip_item']));    
    this.setTooltip(Blockly.DLMLY_PYTHON_LISTS_ZIP_TOOLTIP);
  },
  
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },

  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },

  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'lists_zip_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'lists_zip_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },

  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },

  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },

  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.DLMLY_PYTHON_LISTS_ZIP);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.DLMLY_PYTHON_LISTS_ZIP);
        }
      }
    }
  }
};
Blockly.Blocks['lists_zip_container'] = {  
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_PYTHON_LISTS_ZIP)
        .appendField('[]');
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.DLMLY_DLMPY_INOUT_PRINT_MANY_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['lists_zip_item'] = {
  init: function() {
    this.setColour(Blockly.Blocks.lists.HUE);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_PYTHON_LISTS_ZIP_ITEM);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.DLMLY_PYTHON_LISTS_ZIP_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['lists_create_with2'] = Blockly.Blocks['lists_create_with']
Blockly.Blocks['lists_create_with_text2'] = Blockly.Blocks['lists_create_with_text']
Blockly.Blocks['lists_getIndex3'] = Blockly.Blocks['lists_get_index']
Blockly.Blocks['lists_getSublist3'] = Blockly.Blocks['lists_get_sublist']
Blockly.Blocks['lists_setIndex3'] = Blockly.Blocks['lists_set_index']
Blockly.Blocks['lists_insert_value2'] = Blockly.Blocks['lists_insert_value']
Blockly.Blocks['lists_remove_at2'] = Blockly.Blocks['lists_remove_at']



'use strict';

goog.provide('Blockly.Blocks.logic');

goog.require('Blockly.Blocks');


Blockly.Blocks.logic.HUE = 210;

Blockly.Blocks['logic_compare'] = {
  /**
   * Block for comparison operator.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS = Blockly.RTL ? [
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['>', 'LT'],
          ['\u2265', 'LTE'],
          ['<', 'GT'],
          ['\u2264', 'GTE']
        ] : [
          ['=', 'EQ'],
          ['\u2260', 'NEQ'],
          ['<', 'LT'],
          ['\u2264', 'LTE'],
          ['>', 'GT'],
          ['\u2265', 'GTE']
        ];
    //this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, Boolean);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'EQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_EQ,
        'NEQ': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_NEQ,
        'LT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LT,
        'LTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_LTE,
        'GT': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GT,
        'GTE': Blockly.Msg.LOGIC_COMPARE_TOOLTIP_GTE
      };
      return TOOLTIPS[op];
    });
    this.prevBlocks_ = [null, null];
  },
  /**
   * Called whenever anything on the workspace changes.
   * Prevent mismatched types from being compared.
   * @this Blockly.Block
   */
  /*onchange: function(e) {
    var blockA = this.getInputTargetBlock('A');
    var blockB = this.getInputTargetBlock('B');
    // Disconnect blocks that existed prior to this change if they don't match.
    if (blockA && blockB &&
        !blockA.outputConnection.checkType_(blockB.outputConnection)) {
      // Mismatch between two inputs.  Disconnect previous and bump it away.
      // Ensure that any disconnections are grouped with the causing event.
      Blockly.Events.setGroup(e.group);
      for (var i = 0; i < this.prevBlocks_.length; i++) {
        var block = this.prevBlocks_[i];
        if (block === blockA || block === blockB) {
          block.unplug();
          block.bumpNeighbours_();
        }
      }
      Blockly.Events.setGroup(false);
    }
    this.prevBlocks_[0] = blockA;
    this.prevBlocks_[1] = blockB;
  }*/
};

Blockly.Blocks['logic_compare_continous'] = {
  
  init: function() {
    var OPERATORS1 = Blockly.RTL ? [          
          ['>', 'LT'],
          ['\u2265', 'LTE'],
          ['<', 'GT'],
          ['\u2264', 'GTE']
        ] : [          
          ['<', 'LT'],
          ['\u2264', 'LTE'],
          ['>', 'GT'],
          ['\u2265', 'GTE']
        ];
    var OPERATORS2 = Blockly.RTL ? [          
          ['>', 'LT'],
          ['\u2265', 'LTE'],
          ['<', 'GT'],
          ['\u2264', 'GTE']
        ] : [          
          ['<', 'LT'],
          ['\u2264', 'LTE'],
          ['>', 'GT'],
          ['\u2265', 'GTE']
        ];    
    //this.setHelpUrl(Blockly.Msg.LOGIC_COMPARE_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, Boolean);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS1), 'OP1');
    this.appendValueInput('C')
        .appendField(new Blockly.FieldDropdown(OPERATORS2), 'OP2');    
    this.setInputsInline(true);    
    this.setTooltip(Blockly.DLMLY_PYTHON_LOGIC_COMPARE_CONTINOUS_TOOLTIP);
    
  }
};

Blockly.Blocks['logic_operation'] = {
  /**
   * Block for logical operations: 'and', 'or'.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.LOGIC_OPERATION_AND, 'AND'],
         [Blockly.Msg.LOGIC_OPERATION_OR, 'OR']];
    //this.setHelpUrl(Blockly.Msg.LOGIC_OPERATION_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, Boolean);
    this.appendValueInput('A')
        .setCheck([Boolean,Number]);
    this.appendValueInput('B')
        .setCheck([Boolean,Number])
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var op = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'AND': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_AND,
        'OR': Blockly.Msg.LOGIC_OPERATION_TOOLTIP_OR
      };
      return TOOLTIPS[op];
    });
  }
};

Blockly.Blocks['logic_negate'] = {
  /**
   * Block for negation.
   * @this Blockly.Block
   */
  init: function() {
    //this.setHelpUrl(Blockly.Msg.LOGIC_NEGATE_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, Boolean);
	this.appendValueInput('BOOL')
        .setCheck([Number,Boolean])
        .appendField(Blockly.Msg.LOGIC_NEGATE_TITLE);
    //this.interpolateMsg(Blockly.Msg.LOGIC_NEGATE_TITLE,
      //                  ['BOOL', Boolean, Blockly.ALIGN_RIGHT],
        //                Blockly.ALIGN_RIGHT);
    this.setTooltip(Blockly.Msg.LOGIC_NEGATE_TOOLTIP);
  }
};

Blockly.Blocks['logic_boolean'] = {
  /**
   * Block for boolean data type: true and false.
   * @this Blockly.Block
   */
  init: function() {
    var BOOLEANS =
        [[Blockly.Msg.LOGIC_BOOLEAN_TRUE, 'TRUE'],
         [Blockly.Msg.LOGIC_BOOLEAN_FALSE, 'FALSE']];
    //this.setHelpUrl(Blockly.Msg.LOGIC_BOOLEAN_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true, Boolean);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(BOOLEANS), 'BOOL');
    this.setTooltip(Blockly.Msg.LOGIC_BOOLEAN_TOOLTIP);
  }
};

Blockly.Blocks['logic_null'] = {
  /**
   * Block for null data type.
   * @this Blockly.Block
   */
  init: function() {
    //this.setHelpUrl(Blockly.Msg.LOGIC_NULL_HELPURL);
    this.setColour(Blockly.Blocks.logic.HUE);
    this.setOutput(true);
    this.appendDummyInput()
        .appendField(Blockly.Msg.LOGIC_NULL);
    this.setTooltip(Blockly.Msg.LOGIC_NULL_TOOLTIP);
  }
};


Blockly.Blocks['logic_true_or_false'] = {
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(Blockly.Msg.LOGIC_TERNARY_IF_TRUE);
	this.appendValueInput('C')
        .appendField(Blockly.Msg.LOGIC_TERNARY_IF_FALSE);
	this.setOutput(true);
    this.setInputsInline(true);
	this.setTooltip(Blockly.DLMLY_TOOLTIP_LOGIT_TRUEORFALSE);
  }
};

Blockly.Blocks['logic_is_in'] = {
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .setCheck([String,'List'])
        .appendField(Blockly.Msg.TEXT_APPEND_TO);
    this.appendDummyInput("")
        .appendField(Blockly.MICROBIT_LOGIC_IS_IN);
    this.setOutput(true, Boolean);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg_IN);
  }
};

Blockly.Blocks['logic_is'] = {
  init: function() {
    this.setColour(Blockly.Blocks.logic.HUE);
    this.appendValueInput('A');
    this.appendValueInput('B')
        .appendField(Blockly.DLMLY_PYTHON_LOGIC_IS);    
    this.setOutput(true, Boolean);
    this.setInputsInline(true);
    this.setTooltip(Blockly.DLMLY_PYTHON_LOGIC_IS_TOOLTIP);
  }
};
'use strict';

goog.provide('Blockly.Blocks.math');

goog.require('Blockly.Blocks');


Blockly.Blocks.math.HUE = 230//'#e49f16';

Blockly.FieldTextInput.math_number_validator = function(text) {
  //return window.isNaN(text) ? null : String(text);
  var pattern = /^-?(0X|0x|0O|0o|0B|0b)?[a-fA-F0-9]{1,}(\.[a-fA-F0-9]+)?$/;
  return pattern.test(text) ? String(text) : null;//校验，二 八 十 十六进制匹配
  // return String(text);//不再校验
};

Blockly.FieldTextInput.math_number_validator_include_blank = function(text) {
    if(text === ""){
        return "";
    }
    var pattern = /^-?(0X|0x|0O|0o|0B|0b)?[a-fA-F0-9]{1,}(\.[a-fA-F0-9]+)?$/;
    return pattern.test(text) ? String(text) : null;//校验，二 八 十 十六进制匹配
};



Blockly.Blocks['math_number'] = {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('0',
        Blockly.FieldTextInput.math_number_validator), 'NUM');
    this.setOutput(true, Number);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Blockly.Blocks['math_constant'] = {  
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    var constant =
        [['π', 'pi'],['e', 'e']];    
    this.appendDummyInput("")                
        .appendField(Blockly.DLMLY_PYTHON_MATH_CONSTANT)  
        .appendField(new Blockly.FieldDropdown(constant), 'CONSTANT')      
     
    this.setOutput(true, Number);
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('CONSTANT');
      var TOOLTIPS = {
        'pi': Blockly.DLMLY_PYTHON_MATH_CONSTANT_PI_TOOLTIP,
        'e': Blockly.DLMLY_PYTHON_MATH_CONSTANT_E_TOOLTIP
      };
      return TOOLTIPS[mode];
    });

  }
};

Blockly.Blocks['math_arithmetic'] = {
  /**
   * Block for basic arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [['+', 'ADD'],
         ['-', 'MINUS'],
         ['×', 'MULTIPLY'],
         ['÷', 'DIVIDE'],
		     ['%', 'QUYU'],
         ['//', 'ZHENGCHU'],
         ['**', 'POWER']];
    //this.setHelpUrl(Blockly.Msg.MATH_ARITHMETIC_HELPURL);
    this.setColour(Blockly.Blocks.math.HUE);
    this.setOutput(true);
    this.appendValueInput('A')
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'ADD': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        'MINUS': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        'MULTIPLY': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        'DIVIDE': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
		    'QUYU':Blockly.Msg.MATH_MODULO_TOOLTIP,
        'ZHENGCHU':Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
        'POWER': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_selfcalcu'] = {
  /**
   * Block for basic arithmetic operator.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [['+=', 'ADD'],
         ['-=', 'MINUS'],
         ['×=', 'MULTIPLY'],
         ['÷=', 'DIVIDE'],
         ['%=', 'QUYU'],
         ['//=', 'ZHENGCHU'],
         ['**=', 'POWER']];
    
    this.setColour(Blockly.Blocks.math.HUE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput('A')
    this.appendValueInput('B')
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'ADD': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_ADD,
        'MINUS': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MINUS,
        'MULTIPLY': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_MULTIPLY,
        'DIVIDE': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
        'QUYU':Blockly.Msg.MATH_MODULO_TOOLTIP,
        'ZHENGCHU':Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_DIVIDE,
        'POWER': Blockly.Msg.MATH_ARITHMETIC_TOOLTIP_POWER
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_bit'] = {
  init: function() {
    var OPERATORS =
        [['&', '&'],
         ['|', '|'],
         ['>>', '>>'],
         ['<<', '<<']];
    this.setColour(Blockly.Blocks.math.HUE);
    this.setOutput(true, Number);
    this.appendValueInput('A')
        .setCheck(Number);
    this.appendValueInput('B')
        .setCheck(Number)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
	this.setTooltip("位运算");
  }
};

Blockly.Blocks['math_trig'] = {
  /**
   * Block for trigonometry operators.
   * @this Blockly.Block
   */
  init: function() {
    var OPERATORS =
        [['sin', 'SIN'],
         ['cos', 'COS'],
         ['tan', 'TAN'],
         ['asin', 'ASIN'],
         ['acos', 'ACOS'],
         ['atan', 'ATAN'],
         ['-', '-'],
         ['ln', 'LN'],
         ['log10', 'LOG10'],
         ['e^', 'EXP'],
         ['10^', 'POW10']
        ];
    //this.setHelpUrl(Blockly.Msg.MATH_TRIG_HELPURL);
    this.setColour(Blockly.Blocks.math.HUE);
    this.setOutput(true, Number);
    this.appendValueInput('NUM')
        .setCheck(Number)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'SIN': Blockly.Msg.MATH_TRIG_TOOLTIP_SIN,
        'COS': Blockly.Msg.MATH_TRIG_TOOLTIP_COS,
        'TAN': Blockly.Msg.MATH_TRIG_TOOLTIP_TAN,
        'ASIN': Blockly.Msg.MATH_TRIG_TOOLTIP_ASIN,
        'ACOS': Blockly.Msg.MATH_TRIG_TOOLTIP_ACOS,
        'ATAN': Blockly.Msg.MATH_TRIG_TOOLTIP_ATAN,
        'LN': Blockly.Msg.MATH_SINGLE_TOOLTIP_LN
      };
      return TOOLTIPS[mode];
    });
  }
};

//取整等
Blockly.Blocks['math_to_int']= {
  init: function() {
	var OPERATORS =
        [[Blockly.LANG_MATH_TO_ROUND, 'round'],
         [Blockly.LANG_MATH_TO_CEIL, 'ceil'],
         [Blockly.LANG_MATH_TO_FLOOR, 'floor'],
		 [Blockly.Msg.MATH_ABS, 'fabs'],
         // [Blockly.Msg.MATH_SQ, 'pow'],
         [Blockly.Msg.MATH_SQRT, 'sqrt']];
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendValueInput('A')
        .setCheck(Number)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setOutput(true, Number);
	var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'sqrt': Blockly.Msg.MATH_SINGLE_TOOLTIP_ROOT,
        'fabs': Blockly.Msg.MATH_SINGLE_TOOLTIP_ABS,
        'sq': Blockly.Msg.MATH_SINGLE_TOOLTIP_SQ,
        'round': Blockly.Msg.MATH_SINGLE_TOOLTIP_ROUND,
        'ceil': Blockly.Msg.MATH_SINGLE_TOOLTIP_CEIL,
        'floor': Blockly.Msg.MATH_SINGLE_TOOLTIP_FLOOR
      };
      return TOOLTIPS[mode];
    });
  }
};
//最大最小值
Blockly.Blocks['math_max_min']= {
  init: function() {
	var OPERATORS =
        [[Blockly.DLMLY_MAX, 'max'],
		     [Blockly.DLMLY_MIN, 'min'],
        ];

    this.setColour(Blockly.Blocks.math.HUE);
    this.appendValueInput('A')
        .setCheck(Number)
		.setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP')
		.appendField('(');
	this.appendValueInput('B')
        .setCheck(Number)
		.setAlign(Blockly.ALIGN_RIGHT)
        .appendField(',');
	this.appendDummyInput('')
		.setAlign(Blockly.ALIGN_RIGHT)
		.appendField(')');
	this.setInputsInline(true);
    this.setOutput(true, Number);
	var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'max': Blockly.DLMLY_TOOLTIP_MATH_MAX,
        'min': Blockly.DLMLY_TOOLTIP_MATH_MIN
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['math_number_base_conversion'] = {
init: function() {
    var OPERATORS =[
         [Blockly.Msg.MATH_TWO, 'two'],
         [Blockly.Msg.MATH_EIGHT, 'eight'],
         [Blockly.Msg.MATH_TEN, 'ten'],
         [Blockly.Msg.MATH_SIXTEEN, 'sixteen']
         ];
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput('')
        .appendField(Blockly.Msg.MATH_BA)
    this.appendValueInput("NUM")
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP')
        .appendField(Blockly.Msg.MATH_JinZhi)
        .setCheck(Number);
    this.appendDummyInput("")
        .appendField(Blockly.Msg.MATH_ZHW)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP2')
        .appendField(Blockly.Msg.MATH_JinZhi);
    this.setFieldValue('ten','OP2')
    // this.setPreviousStatement(true, null);
    // this.setNextStatement(true, null);
    this.setOutput(true)
    this.setInputsInline(true);
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'two': Blockly.Msg.MATH_Before_two,
        'eight': Blockly.Msg.MATH_Before_eight,
        'ten': Blockly.Msg.MATH_Before_ten,
        'sixteen': Blockly.Msg.MATH_Before_sixteen,
      };
      var mode2 = thisBlock.getFieldValue('OP2');
      var TOOLTIPS2 = {
        'two': Blockly.Msg.MATH_Behind_two,
        'eight': Blockly.Msg.MATH_Behind_eight,
        'ten': Blockly.Msg.MATH_Behind_ten,
        'sixteen': Blockly.Msg.MATH_Behind_sixteen,
      };
      return TOOLTIPS[mode]+TOOLTIPS2[mode2];
    });
  }
};


Blockly.Blocks['math_random'] = {
    init: function() {
    var INT_FLOAT = [[Blockly.LANG_MATH_INT, 'int'],[Blockly.LANG_MATH_FLOAT, 'float']];
    this.setColour(Blockly.Blocks.math.HUE);
    this.setOutput(true, Number);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_MICROBIT_RANDOM)
        .appendField(new Blockly.FieldDropdown(INT_FLOAT), 'TYPE');
    this.appendValueInput('FROM')
        .setCheck(Number)
        .appendField(Blockly.LANG_CONTROLS_FOR_INPUT_FROM);
    this.appendValueInput('TO')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.LANG_MATH_RANDOM_INT_INPUT_TO);
    this.setInputsInline(true);
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('TYPE');
      var TOOLTIPS = {
        'int': Blockly.LANG_MATH_INT,
        'float':Blockly.LANG_MATH_FLOAT_RANDOM
      };
      return Blockly.Msg.MATH_RANDOM_INT_TOOLTIP + TOOLTIPS[mode];
    });
  }
};


Blockly.Blocks['math_constrain'] = {
  /**
   * Block for constraining a number between two limits.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    this.setOutput(true, Number);
    this.appendValueInput('VALUE')
        .setCheck(Number)
        .appendField(Blockly.LANG_MATH_CONSTRAIN_INPUT_CONSTRAIN);
    this.appendValueInput('LOW')
        .setCheck(Number)
        .appendField(Blockly.LANG_MATH_CONSTRAIN_INPUT_LOW);
    this.appendValueInput('HIGH')
        .setCheck(Number)
        .appendField(Blockly.LANG_MATH_CONSTRAIN_INPUT_HIGH);
    this.setInputsInline(true);
    this.setTooltip(Blockly.Msg.MATH_CONSTRAIN_TOOLTIP);
  }
};

Blockly.Blocks.math_map = {
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendValueInput("NUM", Number)
        .appendField(Blockly.DLMLY_MAP)
        .setCheck(Number);
    this.appendValueInput("fromLow", Number)
        .appendField(Blockly.DLMLY_MAP_FROM)
        .setCheck(Number);
    this.appendValueInput("fromHigh", Number)
        .appendField(",")
        .setCheck(Number);
    this.appendValueInput("toLow", Number)
        .appendField(Blockly.DLMLY_MAP_TO)
        .setCheck(Number);
    this.appendValueInput("toHigh", Number)
        .appendField(",")
        .setCheck(Number);
    this.appendDummyInput("")
	      .appendField("]");
    this.setInputsInline(true);
    this.setOutput(true);
	this.setTooltip(Blockly.DLMLY_TOOLTIP_MATH_MAP);
  }
};

Blockly.Blocks['math_indexer_number'] = {
  /**
   * Block for numeric value.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.math.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput('0', Blockly.FieldTextInput.math_number_validator_include_blank), 'NUM');
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.MATH_NUMBER_TOOLTIP);
  }
};

Blockly.Blocks['math_random_seed'] = {
    init: function () {
        this.setColour(Blockly.Blocks.math.HUE);
        this.appendValueInput('NUM')
            .setCheck(Number)
            .appendField(Blockly.LANG_MATH_RANDOM_SEED);
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setTooltip(Blockly.DLMLY_TOOLTIP_MATH_RANDOM_SEED);
    }
};

Blockly.Blocks.base_map = Blockly.Blocks.math_map
'use strict';
goog.provide('Blockly.Blocks.pins');
goog.require('Blockly.Blocks');
Blockly.Blocks.pins.HUE = 230;

Blockly.Blocks['pins_digital_write'] = {
   init: function() {
    this.setColour(Blockly.Blocks.pins.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown(profile.default.digital_write), 'PIN');
    this.setOutput(true);
  }
};

Blockly.Blocks['pins_digital_read'] = {
   init: function() {
    this.setColour(Blockly.Blocks.pins.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown(profile.default.digital_read), 'PIN');
    this.setOutput(true);
  }
};

Blockly.Blocks['pins_analog_write'] = {
   init: function() {
    this.setColour(Blockly.Blocks.pins.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown(profile.default.analog_write), 'PIN');
    this.setOutput(true);
  }
};

Blockly.Blocks['pins_analog_read'] = {
   init: function() {
    this.setColour(Blockly.Blocks.pins.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown(profile.default.analog_read), 'PIN');
    this.setOutput(true);
  }
};
/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Procedure blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.procedures');

goog.require('Blockly.Blocks');


/**
 * Common HSV hue for all blocks in this category.
 */
Blockly.Blocks.procedures.HUE = 290;

Blockly.Blocks['procedures_defnoreturn'] = {
  /**
   * Block for defining a procedure with no return value.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.procedures.HUE);
    var nameField = new Blockly.FieldTextInput(
        Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE,
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE)
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
    this.arguments_ = [];
    this.argumentstype_ = [];//新增
    this.setStatements_(true);
      this.statementConnection_ = null;
  },
  /**
   * Add or remove the statement block from this function definition.
   * @param {boolean} hasStatements True if a statement block is needed.
   * @this Blockly.Block
   */
  setStatements_: function(hasStatements) {
    if (this.hasStatements_ === hasStatements) {
      return;
    }
    if (hasStatements) {
      this.appendStatementInput('STACK')
          .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_DO);
      if (this.getInput('RETURN')) {
        this.moveInputBefore('STACK', 'RETURN');
      }
    } else {
      this.removeInput('STACK', true);
    }
    this.hasStatements_ = hasStatements;
  },
  /**
   * Update the display of parameters for this procedure definition block.
   * Display a warning if there are duplicately named parameters.
   * @private
   * @this Blockly.Block
   */
  updateParams_: function() {
    // Check for duplicated arguments.
    var badArg = false;
    var hash = {};
    for (var i = 0; i < this.arguments_.length; i++) {
      if (hash['arg_' + this.arguments_[i].toLowerCase()]) {
        badArg = true;
        break;
      }
      hash['arg_' + this.arguments_[i].toLowerCase()] = true;
    }
    if (badArg) {
      this.setWarningText(Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING);
    } else {
      this.setWarningText(null);
    }
    // Merge the arguments into a human-readable list.
    var paramString = '';
    if (this.arguments_.length) {
      paramString = Blockly.Msg.PROCEDURES_BEFORE_PARAMS +
          ' ' + this.arguments_.join(', ');
    }
    // The params field is deterministic based on the mutation,
    // no need to fire a change event.
    Blockly.Events.disable();
    this.setFieldValue(paramString, 'PARAMS');
    Blockly.Events.enable();
  },
  /**
   * Create XML to represent the argument inputs.
   * @param {=boolean} opt_paramIds If true include the IDs of the parameter
   *     quarks.  Used by Blockly.Procedures.mutateCallers for reconnection.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    for (var i = 0; i < this.arguments_.length; i++) {
      var parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      //parameter.setAttribute('vartype', this.argumentstype_[i]);//新增
      container.appendChild(parameter);
    }

    // Save whether the statement input is visible.
    if (!this.hasStatements_) {
      container.setAttribute('statements', 'false');
    }
    return container;
  },
  /**
   * Parse XML to restore the argument inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.arguments_ = [];
    this.argumentstype_ = [];//新增
    for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        this.arguments_.push(childNode.getAttribute('name'));
	//this.argumentstype_.push(childNode.getAttribute('vartype'));//新增
      }
    }
    this.updateParams_();
    Blockly.Procedures.mutateCallers(this);

    // Show or hide the statement input.
    this.setStatements_(xmlElement.getAttribute('statements') !== 'false');
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('procedures_mutatorcontainer');
    containerBlock.initSvg();

    // Check/uncheck the allow statement box.
    if (this.getInput('RETURN')) {
      containerBlock.setFieldValue(this.hasStatements_ ? 'TRUE' : 'FALSE',
                                   'STATEMENTS');
    } else {
      containerBlock.getInput('STATEMENT_INPUT').setVisible(false);
    }

    // Parameter list.
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.arguments_.length; i++) {
      var paramBlock = workspace.newBlock('procedures_mutatorarg');
      paramBlock.initSvg();
      paramBlock.setFieldValue(this.arguments_[i], 'NAME');
      //paramBlock.setFieldValue(this.argumentstype_[i], 'TYPEVAR');//新增
      // Store the old location.
      paramBlock.oldLocation = i;
      connection.connect(paramBlock.previousConnection);
      connection = paramBlock.nextConnection;
    }
    // Initialize procedure's callers with blank IDs.
    Blockly.Procedures.mutateCallers(this);
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Parameter list.
    this.arguments_ = [];
    this.paramIds_ = [];
    this.argumentstype_= [];//新增
    var paramBlock = containerBlock.getInputTargetBlock('STACK');
    while (paramBlock) {
      this.arguments_.push(paramBlock.getFieldValue('NAME'));
      //this.argumentstype_.push(paramBlock.getFieldValue('TYPEVAR'));//新增
      this.paramIds_.push(paramBlock.id);
      paramBlock = paramBlock.nextConnection &&
          paramBlock.nextConnection.targetBlock();
    }
    this.updateParams_();
    Blockly.Procedures.mutateCallers(this);

    // Show/hide the statement input.
    var hasStatements = containerBlock.getFieldValue('STATEMENTS');
    if (hasStatements !== null) {
      hasStatements = hasStatements == 'TRUE';
      if (this.hasStatements_ != hasStatements) {
        if (hasStatements) {
          this.setStatements_(true);
          // Restore the stack, if one was saved.
          Blockly.Mutator.reconnect(this.statementConnection_, this, 'STACK');
          this.statementConnection_ = null;
        } else {
          // Save the stack, then disconnect it.
          var stackConnection = this.getInput('STACK').connection;
          this.statementConnection_ = stackConnection.targetConnection;
          if (this.statementConnection_) {
            var stackBlock = stackConnection.targetBlock();
            stackBlock.unplug();
            stackBlock.bumpNeighbours_();
          }
          this.setStatements_(false);
        }
      }
    }
  },
  /**
   * Dispose of any callers.
   * @this Blockly.Block
   */
  dispose: function() {
    var name = this.getFieldValue('NAME');
    Blockly.Procedures.disposeCallers(name, this.workspace);
    // Call parent's destructor.
    this.constructor.prototype.dispose.apply(this, arguments);
  },
  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES NOT have a return value.
   * @this Blockly.Block
   */
  getProcedureDef: function() {
    return [this.getFieldValue('NAME'), this.arguments_, false];
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return this.arguments_;
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    var change = false;
    for (var i = 0; i < this.arguments_.length; i++) {
      if (Blockly.Names.equals(oldName, this.arguments_[i])) {
        this.arguments_[i] = newName;
        change = true;
      }
    }
    if (change) {
      this.updateParams_();
      // Update the mutator's variables if the mutator is open.
      if (this.mutator.isVisible()) {
        var blocks = this.mutator.workspace_.getAllBlocks();
        for (var i = 0, block; block = blocks[i]; i++) {
          if (block.type == 'procedures_mutatorarg' &&
              Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
            block.setFieldValue(newName, 'NAME');
          }
        }
      }
    }
  },
  /**
   * Add custom menu options to this block's context menu.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    // Add option to create caller.
    var option = {enabled: true};
    var name = this.getFieldValue('NAME');
    option.text = Blockly.Msg.PROCEDURES_CREATE_DO.replace('%1', name);
    var xmlMutation = goog.dom.createDom('mutation');
    xmlMutation.setAttribute('name', name);
    for (var i = 0; i < this.arguments_.length; i++) {
      var xmlArg = goog.dom.createDom('arg');
      xmlArg.setAttribute('name', this.arguments_[i]);
      //xmlArg.setAttribute('type', this.argumentstype_[i]);//新增
      xmlMutation.appendChild(xmlArg);
    }
    var xmlBlock = goog.dom.createDom('block', null, xmlMutation);
    xmlBlock.setAttribute('type', this.callType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);

    // Add options to create getters for each parameter.
    if (!this.isCollapsed()) {
      for (var i = 0; i < this.arguments_.length; i++) {
        var option = {enabled: true};
        var name = this.arguments_[i];
        option.text = Blockly.Msg.VARIABLES_SET_CREATE_GET.replace('%1', name);
        var xmlField = goog.dom.createDom('field', null, name);
        xmlField.setAttribute('name', 'VAR');
	xmlField.setAttribute('type', 'TYPEVAR');//新增
        var xmlBlock = goog.dom.createDom('block', null, xmlField);
        xmlBlock.setAttribute('type', 'variables_get');
        option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
        options.push(option);
      }
    }
  },
  callType_: 'procedures_callnoreturn'
};

Blockly.Blocks['procedures_defreturn'] = {
  /**
   * Block for defining a procedure with a return value.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.procedures.HUE);
    var nameField = new Blockly.FieldTextInput(
        Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE,
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_TITLE)
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    this.appendValueInput('RETURN')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
    this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
    this.arguments_ = [];
    this.setStatements_(true);
    this.statementConnection_ = null;
  },
  setStatements_: Blockly.Blocks['procedures_defnoreturn'].setStatements_,
  updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
  mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
  domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
  decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
  compose: Blockly.Blocks['procedures_defnoreturn'].compose,
  dispose: Blockly.Blocks['procedures_defnoreturn'].dispose,
  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES have a return value.
   * @this Blockly.Block
   */
  getProcedureDef: function() {
    return [this.getFieldValue('NAME'), this.arguments_, true];
  },
  getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
  renameVar: Blockly.Blocks['procedures_defnoreturn'].renameVar,
  customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu,
  callType_: 'procedures_callreturn'
};

Blockly.Blocks['procedures_mutatorcontainer'] = {
  /**
   * Mutator block for procedure container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE);
    this.appendStatementInput('STACK');
    this.appendDummyInput('STATEMENT_INPUT')
        .appendField(Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS)
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'STATEMENTS');
    this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['procedures_mutatorarg'] = {
  /**
   * Mutator block for procedure argument.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_MUTATORARG_TITLE)
		//.appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'number'], [Blockly.DLMLY_MICROBIT_JS_TYPE_STRING, 'string'], [Blockly.DLMLY_MICROBIT_JS_TYPE_BOOLEAN, 'boolean'], [Blockly.DLMLY_MICROBIT_JS_TYPE_ARRAY_NUMBER, 'Array<number>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_ARRAY_STRING, 'Array<string>']]), 'TYPEVAR')
        .appendField(new Blockly.FieldTextInput('x', this.validator_), 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP);
    this.contextMenu = false;
  },
  /**
   * Obtain a valid name for the procedure.
   * Merge runs of whitespace.  Strip leading and trailing whitespace.
   * Beyond this, all names are legal.
   * @param {string} newVar User-supplied name.
   * @return {?string} Valid name, or null if a name was not specified.
   * @private
   * @this Blockly.Block
   */
  validator_: function(newVar) {
    newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
    return newVar || null;
  }
};

Blockly.Blocks['procedures_callnoreturn'] = {
  /**
   * Block for calling a procedure with no return value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL);
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.appendDummyInput('TOPROW')
        .appendField(Blockly.Msg.PROCEDURES_CALLNORETURN_CALL)
        .appendField(this.id, 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    // Tooltip is set in renameProcedure.
    this.arguments_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
  },
  /**
   * Returns the name of the procedure this block calls.
   * @return {string} Procedure name.
   * @this Blockly.Block
   */
  getProcedureCall: function() {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ (this.getFieldValue('NAME'));
  },
  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this Blockly.Block
   */
  renameProcedure: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
      this.setFieldValue(newName, 'NAME');
      this.setTooltip(
          (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP :
           Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
          .replace('%1', newName));
    }
  },
  /**
   * Notification that the procedure's parameters have changed.
   * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
   * @param {!Array.<string>} paramIds IDs of params (consistent for each
   *     parameter through the life of a mutator, regardless of param renaming),
   *     e.g. ['piua', 'f8b_', 'oi.o'].
   * @private
   * @this Blockly.Block
   */
  setProcedureParameters_: function(paramNames, paramIds) {
    // Data structures:
    // this.arguments = ['x', 'y']
    //     Existing param names.
    // this.quarkConnections_ {piua: null, f8b_: Blockly.Connection}
    //     Look-up of paramIds to connections plugged into the call block.
    // this.quarkIds_ = ['piua', 'f8b_']
    //     Existing param IDs.
    // Note that quarkConnections_ may include IDs that no longer exist, but
    // which might reappear if a param is reattached in the mutator.
    var defBlock = Blockly.Procedures.getDefinition(this.getProcedureCall(),
        this.workspace);
    var mutatorOpen = defBlock && defBlock.mutator &&
        defBlock.mutator.isVisible();
    if (!mutatorOpen) {
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
    }
    if (!paramIds) {
      // Reset the quarks (a mutator is about to open).
      return;
    }
    if (goog.array.equals(this.arguments_, paramNames)) {
      // No change.
      this.quarkIds_ = paramIds;
      return;
    }
    if (paramIds.length != paramNames.length) {
      throw 'Error: paramNames and paramIds must be the same length.';
    }
    this.setCollapsed(false);
    if (!this.quarkIds_) {
      // Initialize tracking for this block.
      this.quarkConnections_ = {};
      if (paramNames.join('\n') == this.arguments_.join('\n')) {
        // No change to the parameters, allow quarkConnections_ to be
        // populated with the existing connections.
        this.quarkIds_ = paramIds;
      } else {
        this.quarkIds_ = [];
      }
    }
    // Switch off rendering while the block is rebuilt.
    var savedRendered = this.rendered;
    this.rendered = false;
    // Update the quarkConnections_ with existing connections.
    for (var i = 0; i < this.arguments_.length; i++) {
      var input = this.getInput('ARG' + i);
      if (input) {
        var connection = input.connection.targetConnection;
        this.quarkConnections_[this.quarkIds_[i]] = connection;
        if (mutatorOpen && connection &&
            paramIds.indexOf(this.quarkIds_[i]) == -1) {
          // This connection should no longer be attached to this block.
          connection.disconnect();
          connection.getSourceBlock().bumpNeighbours_();
        }
      }
    }
    // Rebuild the block's arguments.
    this.arguments_ = [].concat(paramNames);
    this.updateShape_();
    this.quarkIds_ = paramIds;
    // Reconnect any child blocks.
    if (this.quarkIds_) {
      for (var i = 0; i < this.arguments_.length; i++) {
        var quarkId = this.quarkIds_[i];
        if (quarkId in this.quarkConnections_) {
          var connection = this.quarkConnections_[quarkId];
          if (!Blockly.Mutator.reconnect(connection, this, 'ARG' + i)) {
            // Block no longer exists or has been attached elsewhere.
            delete this.quarkConnections_[quarkId];
          }
        }
      }
    }
    // Restore rendering and show the changes.
    this.rendered = savedRendered;
    if (this.rendered) {
      this.render();
    }
  },
  /**
   * Modify this block to have the correct number of arguments.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    for (var i = 0; i < this.arguments_.length; i++) {
      var field = this.getField('ARGNAME' + i);
      if (field) {
        // Ensure argument name is up to date.
        // The argument name field is deterministic based on the mutation,
        // no need to fire a change event.
        Blockly.Events.disable();
        field.setValue(this.arguments_[i]);
        Blockly.Events.enable();
      } else {
        // Add new input.
        field = new Blockly.FieldLabel(this.arguments_[i]);
        var input = this.appendValueInput('ARG' + i)
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(field, 'ARGNAME' + i);
        input.init();
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ARG' + i)) {
      this.removeInput('ARG' + i);
      i++;
    }
    // Add 'with:' if there are parameters, remove otherwise.
    var topRow = this.getInput('TOPROW');
    if (topRow) {
      if (this.arguments_.length) {
        if (!this.getField('WITH')) {
          topRow.appendField(Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS, 'WITH');
          topRow.init();
        }
      } else {
        if (this.getField('WITH')) {
          topRow.removeField('WITH');
        }
      }
    }
  },
  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('name', this.getProcedureCall());
    for (var i = 0; i < this.arguments_.length; i++) {
      var parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      container.appendChild(parameter);
    }
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var name = xmlElement.getAttribute('name');
    this.renameProcedure(this.getProcedureCall(), name);
    var args = [];
    var paramIds = [];
    for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        args.push(childNode.getAttribute('name'));
        paramIds.push(childNode.getAttribute('paramId'));
      }
    }
    this.setProcedureParameters_(args, paramIds);
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    for (var i = 0; i < this.arguments_.length; i++) {
      if (Blockly.Names.equals(oldName, this.arguments_[i])) {
        this.arguments_[i] = newName;
        this.getField('ARGNAME' + i).setValue(newName);
      }
    }
  },
  /**
   * Add menu option to find the definition block for this call.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    option.text = Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF;
    var name = this.getProcedureCall();
    var workspace = this.workspace;
    option.callback = function() {
      var def = Blockly.Procedures.getDefinition(name, workspace);
      def && def.select();
    };
    options.push(option);
  }
};

Blockly.Blocks['procedures_callreturn'] = {
  /**
   * Block for calling a procedure with a return value.
   * @this Blockly.Block
   */
  init: function() {
    this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL);
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.appendDummyInput('TOPROW')
        .appendField(Blockly.Msg.PROCEDURES_CALLRETURN_CALL)
        .appendField('', 'NAME');
    this.setOutput(true);
    // Tooltip is set in domToMutation.
    this.arguments_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
  },
  getProcedureCall: Blockly.Blocks['procedures_callnoreturn'].getProcedureCall,
  renameProcedure: Blockly.Blocks['procedures_callnoreturn'].renameProcedure,
  setProcedureParameters_:
      Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters_,
  updateShape_: Blockly.Blocks['procedures_callnoreturn'].updateShape_,
  mutationToDom: Blockly.Blocks['procedures_callnoreturn'].mutationToDom,
  domToMutation: Blockly.Blocks['procedures_callnoreturn'].domToMutation,
  renameVar: Blockly.Blocks['procedures_callnoreturn'].renameVar,
  customContextMenu: Blockly.Blocks['procedures_callnoreturn'].customContextMenu
};

Blockly.Blocks['procedures_ifreturn'] = {
  /**
   * Block for conditionally returning a value from a procedure.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.procedures.HUE);
    this.appendValueInput('CONDITION')
        .setCheck(Boolean)
        .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendValueInput('VALUE')
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP);
    this.hasReturnValue_ = true;
  },
  /**
   * Create XML to represent whether this block has a return value.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('value', Number(this.hasReturnValue_));
    return container;
  },
  /**
   * Parse XML to restore whether this block has a return value.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var value = xmlElement.getAttribute('value');
    this.hasReturnValue_ = (value == 1);
    if (!this.hasReturnValue_) {
      this.removeInput('VALUE');
      this.appendDummyInput('VALUE')
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
    }
  },
  /**
   * Called whenever anything on the workspace changes.
   * Add warning if this flow block is not nested inside a loop.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
  onchange: function(e) {
    var legal = false;
    // Is the block nested in a procedure?
    var block = this;
    do {
      if (this.FUNCTION_TYPES.indexOf(block.type) != -1) {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      // If needed, toggle whether this block has a return value.
      if (block.type == 'procedures_defnoreturn' && this.hasReturnValue_) {
        this.removeInput('VALUE');
        this.appendDummyInput('VALUE')
          .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
        this.hasReturnValue_ = false;
      } else if (block.type == 'procedures_defreturn' &&
                 !this.hasReturnValue_) {
        this.removeInput('VALUE');
        this.appendValueInput('VALUE')
          .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
        this.hasReturnValue_ = true;
      }
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.Msg.PROCEDURES_IFRETURN_WARNING);
    }
  },
  /**
   * List of block types that are functions and thus do not need warnings.
   * To add a new function type add this to your code:
   * Blockly.Blocks['procedures_ifreturn'].FUNCTION_TYPES.push('custom_func');
   */
  FUNCTION_TYPES: ['procedures_defnoreturn', 'procedures_defreturn']
};


Blockly.Blocks['procedures_return'] = {
  /**
   * Block for conditionally returning a value from a procedure.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.procedures.HUE);
    // this.appendValueInput('CONDITION')
    //     .setCheck(Boolean)
    //     .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
    this.appendValueInput('VALUE')
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP);
    this.hasReturnValue_ = true;
  },
  /**
   * Create XML to represent whether this block has a return value.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('value', Number(this.hasReturnValue_));
    return container;
  },
  /**
   * Parse XML to restore whether this block has a return value.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var value = xmlElement.getAttribute('value');
    this.hasReturnValue_ = (value == 1);
    if (!this.hasReturnValue_) {
      this.removeInput('VALUE');
      this.appendDummyInput('VALUE')
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
    }
  },
  /**
   * Called whenever anything on the workspace changes.
   * Add warning if this flow block is not nested inside a loop.
   * @param {!Blockly.Events.Abstract} e Change event.
   * @this Blockly.Block
   */
  onchange: function(e) {
    var legal = false;
    // Is the block nested in a procedure?
    var block = this;
    do {
      if (this.FUNCTION_TYPES.indexOf(block.type) != -1) {
        legal = true;
        break;
      }
      block = block.getSurroundParent();
    } while (block);
    if (legal) {
      // If needed, toggle whether this block has a return value.
      if (block.type == 'procedures_defnoreturn' && this.hasReturnValue_) {
        this.removeInput('VALUE');
        this.appendDummyInput('VALUE')
          .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
        this.hasReturnValue_ = false;
      } else if (block.type == 'procedures_defreturn' &&
                 !this.hasReturnValue_) {
        this.removeInput('VALUE');
        this.appendValueInput('VALUE')
          .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
        this.hasReturnValue_ = true;
      }
      this.setWarningText(null);
    } else {
      this.setWarningText(Blockly.Msg.PROCEDURES_IFRETURN_WARNING);
    }
  },
  /**
   * List of block types that are functions and thus do not need warnings.
   * To add a new function type add this to your code:
   * Blockly.Blocks['procedures_ifreturn'].FUNCTION_TYPES.push('custom_func');
   */
  FUNCTION_TYPES: ['procedures_defnoreturn', 'procedures_defreturn']
};
'use strict';

goog.provide('Blockly.Blocks.set');
goog.require('Blockly.Blocks');

Blockly.Blocks.set.HUE = 100;

Blockly.Blocks['set_create_with'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.set.HUE);
  this.appendDummyInput("")
  //don't need to specify the data type in Python
        // .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'Array<number>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_STRING, 'Array<string>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_BOOLEAN, 'Array<boolean>']]), 'TYPE')
        // .appendField(' ')
        .appendField(new Blockly.FieldTextInput('s1'), 'VAR')
       
    this.itemCount_ = 3;
    this.updateShape_();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['set_create_with_item']));
    this.setTooltip(Blockly.Msg.blockpy_SET_CREATE_WITH_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'set_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'set_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.blockpy_SET_CREATE_EMPTY_TITLE);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.blockpy_SET_CREATE_WITH_INPUT_WITH);
        }
      }
    }
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};

Blockly.Blocks['set_create_with_container'] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.set.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.blockpy_SET_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.blockpy_SET_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['set_create_with_item'] = {
  /**
   * Mutator bolck for adding items.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.set.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.blockpy_SET_VARIABLES_NAME);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.blockpy_SET_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['set_length'] = {
  
  init: function() {
    this.setColour(Blockly.Blocks.set.HUE);
  this.appendDummyInput("")
        .appendField(Blockly.Msg.LISTS_LENGTH_TITLE);        
  this.appendValueInput('SET');
  this.setInputsInline(true);
  this.setTooltip(Blockly.Msg.SET_LENGTH_TOOLTIP);
  this.setOutput(true, Number);
  }
};

Blockly.Blocks['set_get_remove_last'] = {
  init: function() {
    this.setColour(Blockly.Blocks.set.HUE);
    this.appendValueInput('SET')
        .setCheck('Set')
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_SET_GET_AND_REMOVE_LAST);
    this.setTooltip(Blockly.Msg.SET_POP_TOOLTIP);
    this.setInputsInline(true);
    this.setOutput(true);
  }
};

Blockly.Blocks['set_clear'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.set.HUE);
    this.appendValueInput('SET')
        .setCheck('Set')
    this.appendDummyInput("")        
        .appendField(Blockly.Msg.SET_CLEAR);  
    
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['set_operate'] = {
  init: function() {
    
    this.appendDummyInput("")
      .appendField(Blockly.blockpy_set)
    this.appendValueInput('SET1')
        .setCheck('Set')  
  var operate =
        [[Blockly.blockpy_set_union, 'union'],
        [Blockly.blockpy_set_intersection, 'intersection'],[Blockly.blockpy_set_difference, 'difference']];
    this.setColour(Blockly.Blocks.set.HUE);    
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_and_set)    
    this.appendValueInput('SET2')
        .setCheck('Set')       
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_set_get_operate)
        .appendField(new Blockly.FieldDropdown(operate), 'OPERATE')

    this.setInputsInline(true);
    this.setOutput(true, "set");
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OPERATE');
      var TOOLTIPS = {
        'union': Blockly.DLMLY_TOOLTIP_SET_UNION,
        'intersection': Blockly.DLMLY_TOOLTIP_SET_INTERSECTION,
        'difference': Blockly.DLMLY_TOOLTIP_SET_DIFFERENCE
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['set_operate_update'] = {
  init: function() {
    this.appendDummyInput("")
      .appendField(Blockly.blockpy_set)
      
    this.appendValueInput('SET1')
        .setCheck('Set')  
  var operate_update =
        [[Blockly.blockpy_set_union, 'update'],
        [Blockly.blockpy_set_intersection, 'intersection_update'],
        [Blockly.blockpy_set_difference, 'difference_update']];
    this.setColour(Blockly.Blocks.set.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_and_set)   
    this.appendValueInput('SET2')
        .setCheck('Set')      
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_set_get_operate)
        .appendField(new Blockly.FieldDropdown(operate_update), 'OPERATE')
         
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_set_update)  
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OPERATE');
      var TOOLTIPS = {
        'update': Blockly.DLMLY_TOOLTIP_SET_UPDATE,
        'intersection_update': Blockly.DLMLY_TOOLTIP_SET_INTERSECTION_UPDATE,
        'difference_update': Blockly.DLMLY_TOOLTIP_SET_DIFFERENCE_UPDATE
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['set_add_discard'] = {
  init: function() {
    this.appendDummyInput("")
      .appendField(Blockly.blockpy_set)
      
    this.appendValueInput('SET')
        .setCheck('Set')  
  var changenum =
        [[Blockly.DLMLY_blockpy_set_add, 'add'],[Blockly.DLMLY_blockpy_set_discard, 'discard']];
    this.setColour(Blockly.Blocks.set.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_MID)        
        .appendField(new Blockly.FieldDropdown(changenum), 'OPERATE')
    this.appendValueInput('data')
        .setCheck(Number)
        .appendField(Blockly.Msg.blockpy_SET_VARIABLES_NAME)    
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OPERATE');
      var TOOLTIPS = {
        'add': Blockly.Msg.SET_ADD_TOOLTIP,
        'discard': Blockly.Msg.SET_DISCARD_TOOLTIP,
        
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['set_sub'] = {
  init: function() {
     this.appendDummyInput("")
      .appendField(Blockly.blockpy_set)
      
    this.appendValueInput('SET1')
        .setCheck('Set') 
  var sub_super =
        [[Blockly.blockpy_set_sub, 'issubset'],
        [Blockly.blockpy_set_super, 'issuperset']];
    this.setColour(Blockly.Blocks.set.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_is_set) 
    this.appendValueInput('SET2')
        .setCheck('Set')       
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_set_of)
        .appendField(new Blockly.FieldDropdown(sub_super), 'OPERATE')
        

    this.setInputsInline(true);
    this.setOutput(true, Boolean);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OPERATE');
      var TOOLTIPS = {
        'issubset': Blockly.DLMLY_TOOLTIP_SET_SUB,
        'issuperset': Blockly.DLMLY_TOOLTIP_SET_SUPER
        
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['set_update'] = {
 init: function() {
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_set)
    this.appendValueInput('SET')
        .setCheck('Set')
    this.setColour(Blockly.Blocks.set.HUE);
    this.appendValueInput('VAR')
        .setCheck([String,'List'])
        .appendField(Blockly.blockpy_set_add_update);    
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.SET_UPDATE_TOOLTIP); 
  }
};

// Blockly.Blocks['set_change_to'] = {
//   init: function() {
//     var OPERATORS =
//         [[Blockly.DLMLY_MICROBIT_TYPE_LIST, 'list'],
//          [Blockly.DLMLY_MICROBIT_TYPE_TUPLE, 'tuple']
//         ];
//     this.setColour(Blockly.Blocks.set.HUE);
//     this.appendValueInput('VAR')
//         .setCheck("Set")
//         // .appendField(Blockly.blockpy_USE_LIST);   
//     this.appendDummyInput("")
//         .appendField(Blockly.Msg.A_TO_B)
//         .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
//     this.setInputsInline(true);
//     this.setOutput(true);
//     var thisBlock = this;
//     this.setTooltip(function() {
//       var mode = thisBlock.getFieldValue('OP');
//       var TOOLTIPS = {
//         'list': Blockly.Msg.SET_TO_LISTS,
//         'tuple': Blockly.Msg.SET_TO_TUPLE,
//       };
//       return TOOLTIPS[mode];
//     });
//   }
// };
'use strict';

goog.provide('Blockly.Blocks.storage');

goog.require('Blockly.Blocks');

Blockly.Blocks.storage.HUE = 0//'#5d69c5'//0;

Blockly.Blocks.storage_fileopen = {
  init: function() {
    this.setColour(Blockly.Blocks.storage.HUE);
    this.appendValueInput("FILENAME")
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_OPEN_FILE);
        //.appendField(new Blockly.FieldTextInput('filename.txt'), 'FILENAME');
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_MODE)
        .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_PY_STORAGE_READ, 'r'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_WRITE, 'w'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_BIT_READ, 'rb'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_BIT_WRITE, 'wb']]), 'MODE');
    this.appendValueInput("FILE")
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_AS);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setInputsInline(true);
     var thisBlock = this;
        this.setTooltip(function() {
        var mode = thisBlock.getFieldValue('MODE');
        var mode0 = Blockly.DLMLY_USE;
        var mode1 = Blockly.DLMLY_MICROBIT_PY_STORAGE_MODE;
        var mode2 = Blockly.DLMLY_MICROBIT_PY_STORAGE_OPEN_FILE;
        var mode3 =Blockly.DLMLY_BELONG;
        var TOOLTIPS = {
        'r': Blockly.DLMLY_MICROBIT_PY_STORAGE_READ,
        'w': Blockly.DLMLY_MICROBIT_PY_STORAGE_WRITE,
        'rb':Blockly.DLMLY_MICROBIT_PY_STORAGE_BIT_READ,
        'wb':Blockly.DLMLY_MICROBIT_PY_STORAGE_BIT_WRITE
      };
      return mode0 + TOOLTIPS[mode]+mode3+mode1+mode2;
    });
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};

Blockly.Blocks['storage_file_write'] = {
    init:function(){
        this.setColour(Blockly.Blocks.storage.HUE);
        this.appendValueInput('data')
            .setCheck(String)
            .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_MAKE);
        this.appendValueInput("FILE")
            .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_WRITE);
        //    .appendField(new Blockly.FieldTextInput('f'), 'FILE');
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setInputsInline(true);
        this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_MAKE+Blockly.DLMLY_MICROBIT_TYPE_STRING+Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_WRITE);
    }
}

 Blockly.Blocks['storage_get_contents'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .setCheck('Variable')
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_FROM_FILE);
     this.appendDummyInput()
         .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_PY_STORAGE_NO_MORE_THAN_SIZE,'read'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_ONE_LINE_NO_MORE_THAN_SIZE,'readline'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_ALL_LINES_NO_MORE_THAN_SIZE,'readlines']]),'MODE');
     this.appendValueInput("SIZE")
         .setCheck(Number);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CHARACTER);
     this.setInputsInline(true);
     this.setPreviousStatement(false); //in front of the block has something
     this.setNextStatement(false);  //beyond the ... has something
     this.setOutput(true, String);
     var thisBlock = this;
     this.setTooltip(function() {
        var mode = thisBlock.getFieldValue('MODE');
        var mode0 = Blockly.DLMLY_MICROBIT_PY_STORAGE_FROM_FILE;
        var mode2 = Blockly.DLMLY_MICROBIT_PY_STORAGE_CHARACTER;
        var TOOLTIPS = {
        'read': Blockly.DLMLY_MICROBIT_PY_STORAGE_NO_MORE_THAN_SIZE,
        'readline': Blockly.DLMLY_MICROBIT_PY_STORAGE_ONE_LINE_NO_MORE_THAN_SIZE,
        'readlines': Blockly.DLMLY_MICROBIT_PY_STORAGE_ALL_LINES_NO_MORE_THAN_SIZE
      };
      return mode0 + TOOLTIPS[mode]+'x'+mode2;
    });
   }
 };

 Blockly.Blocks['storage_get_a_line'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_FROM_FILE);
     this.setNextStatement(true);
     this.appendValueInput("SIZE")
         .setCheck(Number)
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_ONE_LINE_NO_MORE_THAN_SIZE);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CHARACTER);
     this.setInputsInline(true);
     this.setPreviousStatement(false);
     this.setNextStatement(false);
     this.setOutput(true, String);
     this.setTooltip(Blockly.MICROBIT_PYTHON_TYPE);
   }
 };

 Blockly.Blocks['storage_can_write_ornot'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CAN_WRITE_ORNOT);
     this.setInputsInline(true);
     this.setPreviousStatement(false);
     this.setNextStatement(false);
     this.setOutput(true, Boolean);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_CAN_WRITE_ORNOT1);
   }
 };

 Blockly.Blocks['storage_get_filename'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_FILENAME);
     this.setInputsInline(true);
     this.setPreviousStatement(false);
     this.setNextStatement(false);
     this.setOutput(true, String);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET_FILENAME);
   }
 };

 Blockly.Blocks['storage_close_file'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CLOSE_FILE);
     this.setInputsInline(true);
     this.setPreviousStatement(true);
     this.setNextStatement(true);
     this.setOutput(false);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_CLOSE_FILE);
   }
 };

 Blockly.Blocks['storage_list_all_files'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_LIST_ALL_FILES);
     this.setInputsInline(true);
     this.setPreviousStatement(false);
     this.setNextStatement(false);
     this.setOutput(true,'List');
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_LIST_ALL_FILES);
   }
 };
 Blockly.DLMLY_MICROBIT_PY_STORAGE_DELETE_FILE
 Blockly.Blocks['storage_delete_file'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendDummyInput()
         .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_PY_STORAGE_DELETE_FILE,'remove'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_DELETE_DIRS,'removedirs']]),'MODE');
     this.appendValueInput("FILE")
         .setCheck(String);
     this.setInputsInline(true);
     this.setPreviousStatement(true);
     this.setNextStatement(true);
     this.setOutput(false);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_DELETE_FILE);
   }
 };

 Blockly.Blocks['storage_get_file_size'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .setCheck(String)
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET_FILE_SIZE);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_SIZE);
     this.setInputsInline(true);
     this.setPreviousStatement(false);
     this.setNextStatement(false);
     this.setOutput(true, Number);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET_FILE_SIZE+Blockly.DLMLY_MICROBIT_PY_STORAGE_SIZE);
   }
 };

 Blockly.Blocks['storage_file_tell'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .setCheck(String)
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_RETURN_FILE);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_PRESENT_LOCATION);
     this.setInputsInline(true);
     this.setPreviousStatement(false);
     this.setNextStatement(false);
     this.setOutput(true, Number);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_TELL);
   }
 };

 Blockly.Blocks['storage_file_seek'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .setCheck('Variable')
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_SET_FILE_POSITION);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CURRENT_POSITION);
     this.appendDummyInput()
         .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_SEEK_START,'start'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_SEEK_CURRENT,'current'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_SEEK_END,'end']]),'MODE');
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_SEEK_OFFSET);
     this.appendValueInput("SIZE")
         .setCheck(Number);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CHARACTER);
     this.setInputsInline(true);
     this.setPreviousStatement(true); //in front of the block has something
     this.setNextStatement(true);  //beyond the ... has something
     var thisBlock = this;
     this.setTooltip(function() {
        var mode = thisBlock.getFieldValue('MODE');
        var mode0 = Blockly.DLMLY_MICROBIT_PY_STORAGE_SET_FILE_POSITION + Blockly.DLMLY_MICROBIT_PY_STORAGE_CURRENT_POSITION;
        var mode2 = Blockly.DLMLY_MICROBIT_PY_STORAGE_CHARACTER;
        var mode3 = Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_SEEK_OFFSET;
        var TOOLTIPS = {
        'start': Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_SEEK_START,
        'current': Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_SEEK_CURRENT,
        'end': Blockly.DLMLY_MICROBIT_PY_STORAGE_FILE_SEEK_END
      };
      return mode0 +" "+ TOOLTIPS[mode]+mode3+'x'+mode2;
    });
   }
 };

 Blockly.Blocks['storage_change_dir'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .setCheck(String)
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CHANGE_DIR);
     this.setInputsInline(true);
     this.setPreviousStatement(true);
     this.setNextStatement(true);
     this.setOutput(false);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_CHANGE_DIR);
   }
 };

 Blockly.Blocks['storage_get_current_dir'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET_CURRENT_DIR);
     this.setInputsInline(true);
     this.setPreviousStatement(false);
     this.setNextStatement(false);
     this.setOutput(true,'List');
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET_CURRENT_DIR);
   }
 };

 Blockly.Blocks['storage_make_dir'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("PATH")
         .setCheck(String)
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_PATH);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CREATE);
     this.appendDummyInput()
         .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_PY_STORAGE_MKDIR,'mkdir'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_MAKEDIRS,'makedirs']]),'MODE');
     this.setInputsInline(true);
     this.setPreviousStatement(true); //in front of the block has something
     this.setNextStatement(true);  //beyond the ... has something
     this.setOutput(false);
     var thisBlock = this;
     this.setTooltip(function() {
        var mode = thisBlock.getFieldValue('MODE');
        var mode0 = Blockly.DLMLY_MICROBIT_PY_STORAGE_PATH;
        var mode2 = Blockly.DLMLY_MICROBIT_PY_STORAGE_CREATE;
        var TOOLTIPS = {
        'mkdir': Blockly.DLMLY_MICROBIT_PY_STORAGE_MKDIR,
        'makedirs': Blockly.DLMLY_MICROBIT_PY_STORAGE_MAKEDIRS
      };
      return mode0 +'x'+ mode2 + TOOLTIPS[mode];
    });
   }
 };

 Blockly.Blocks['storage_rename'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .setCheck(String)
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_RENAME);
    this.appendValueInput("NEWFILE")
        .setCheck(String)
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_TO);
     this.setInputsInline(true);
     this.setPreviousStatement(true);
     this.setNextStatement(true);
     this.setOutput(false);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_RENAME);
   }
 };

 Blockly.Blocks['storage_change_dir'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .setCheck(String)
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_CHANGE_DIR);
     this.setInputsInline(true);
     this.setPreviousStatement(true);
     this.setNextStatement(true);
     this.setOutput(false);
     this.setTooltip(Blockly.DLMLY_MICROBIT_PY_STORAGE_CHANGE_DIR);
   }
 };

 Blockly.Blocks['storage_is_file'] = {
   init: function() {
     this.setColour(Blockly.Blocks.storage.HUE);
     this.appendValueInput("FILE")
         .setCheck(String)
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_THE_PATH);
     this.appendDummyInput()
         .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_IS_OR_NOT);
     this.appendDummyInput()
         .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_PY_STORAGE_IS_FILE,'isfile'],[Blockly.DLMLY_MICROBIT_PY_STORAGE_IS_DIR,'isdir']]),'MODE');
     this.setInputsInline(true);
     this.setPreviousStatement(false);
     this.setNextStatement(false);
     this.setOutput(true,Boolean);
      this.setTooltip(function() {
         var mode = thisBlock.getFieldValue('MODE');
         var mode0 = Blockly.DLMLY_MICROBIT_PY_STORAGE_THE_PATH;
         var mode2 = Blockly.DLMLY_MICROBIT_PY_STORAGE_IS_OR_NOT;
         var TOOLTIPS = {
         'isfile': Blockly.DLMLY_MICROBIT_PY_STORAGE_MKDIR,
         'isdir': Blockly.DLMLY_MICROBIT_PY_STORAGE_MAKEDIRS
       };
       return mode0 +'x'+ mode2 + TOOLTIPS[mode];
     });
   }
 };
'use strict';

goog.provide('Blockly.Blocks.system');

goog.require('Blockly.Blocks');


Blockly.Blocks.system.HUE = 120;


Blockly.Blocks.base_delay = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendValueInput("DELAY_TIME", Number)
        .appendField(Blockly.DLMLY_DELAY + '(' + Blockly.DLMLY_DELAY_MS + ')')
        .setCheck(Number);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_CONTROL_DELAY);
  }
};

Blockly.Blocks['system_eval'] = {
 init: function() {
    
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendValueInput('VAR')
        .setCheck(String)
        .appendField(Blockly.DLMLY_PYTHON_SYSTEM_EVAL);
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip(Blockly.DLMLY_PYTHON_SYSTEM_EVAL_TOOLTIP);
  }
};


Blockly.Blocks.controls_millis = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendDummyInput()
	    .appendField(Blockly.blockpy_time_time);
    this.setOutput(true, Number);
	this.setTooltip(Blockly.DLMLY_TOOLTIP_CONTROL_MILLIS);
  }
};

Blockly.Blocks['time_localtime'] = {
    init: function() {
        this.setColour(Blockly.Blocks.system.HUE);        
        this.appendDummyInput("")
            .appendField(Blockly.DLMLY_SYSTEM_TIME_LOCALTIME)
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_ALL, "all"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_YEAR, "0"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_MONTH, "1"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_DATE, "2"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_HOUR, "3"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_MINUTE, "4"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_SECOND, "5"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_INWEEK, "6"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_INYEAR, "7"],
                [Blockly.DLMLY_SYSTEM_TIME_LOCALTIME_DST, "8"]                
            ]), "op");
        this.setOutput(true);
        this.setInputsInline(true);
    }
};

Blockly.Blocks.Panic_with_status_code = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendValueInput("STATUS_CODE", Number)
        .appendField(Blockly.DLMLY_MICROBIT_Panic_with_status_code)
        .setCheck(Number);
    this.setPreviousStatement(true, null);
    // this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_CONTROL_DELAY);
  }
};

Blockly.Blocks.reset = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendDummyInput()
      .appendField(Blockly.DLMLY_MICROBIT_Reset_micro);
    this.setPreviousStatement(true);
    // this.setNextStatement(true);
  }
};



Blockly.Blocks.controls_mstimer2 = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
	this.appendValueInput('TIME')
        .setCheck(Number)
        .setAlign(Blockly.ALIGN_RIGHT)
		.appendField('MsTimer2')
        .appendField(Blockly.DLMLY_MSTIMER2_EVERY);
    this.appendDummyInput()
		.appendField('ms');
	this.appendStatementInput('DO')
        .appendField(Blockly.DLMLY_MSTIMER2_DO);
	this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.controls_mstimer2_start = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendDummyInput()
		.appendField('MsTimer2')
		.appendField(Blockly.DLMLY_MSTIMER2_START);
	this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks.controls_mstimer2_stop = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendDummyInput()
		.appendField('MsTimer2')
		.appendField(Blockly.DLMLY_MSTIMER2_STOP);
	this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


Blockly.Blocks.time_sleep = {
  init: function() {
    this.setColour(Blockly.Blocks.system.HUE);
    this.appendValueInput("DELAY_TIME", Number)
        .appendField(Blockly.DLMLY_DELAY)        
        .setCheck(Number);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_NOVA_RTC_SEC)
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_CONTROL_DELAY);
  }
};
'use strict';

goog.provide('Blockly.Blocks.texts');

goog.require('Blockly.Blocks');


Blockly.Blocks.texts.HUE = 160//'#9ec440'//160;

Blockly.Blocks['text'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function() {
    //this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput()
        .appendField(this.newQuote_(true))
        .appendField(new Blockly.FieldTextInput(''), 'TEXT')
        .appendField(this.newQuote_(false));
    this.setOutput(true, String);
    this.setTooltip(Blockly.Msg.TEXT_TEXT_TOOLTIP);
  },
  /**
   * Create an image of an open or closed quote.
   * @param {boolean} open True if open quote, false if closed.
   * @return {!Blockly.FieldImage} The field image of the quote.
   * @private
   */
  newQuote_: function(open) {
    if (open == this.RTL) {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
    } else {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
    }
    return new Blockly.FieldImage(file, 12, 12, '"');
  }
};

Blockly.Blocks['text_textarea'] = {
  /**
   * Block for text value.
   * @this Blockly.Block
   */
  init: function() {
    //this.setHelpUrl(Blockly.Msg.TEXT_TEXT_HELPURL);
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput()
        .appendField(this.newQuote_(true))
        .appendField(new Blockly.FieldTextArea('Hello\nDlm'), 'VALUE')
        // .appendField(new Blockly.FieldTextInput(''), 'TEXT')
        .appendField(this.newQuote_(false));
    this.setOutput(true, String);
    this.setTooltip(Blockly.Msg.TEXT_LINES_TOOLTIP);
  },
  /**
   * Create an image of an open or closed quote.
   * @param {boolean} open True if open quote, false if closed.
   * @return {!Blockly.FieldImage} The field image of the quote.
   * @private
   */
  newQuote_: function(open) {
    if (open == this.RTL) {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
    } else {
      var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
    }
    return new Blockly.FieldImage(file, 12, 12, '"');
  }
};

Blockly.FieldTextInput.char_validator = function(text) {
  if (text.length > 1){
	  if(text.charAt(0) === "\\"){
		  var charAtOne = text.charAt(1); 
		  if(charAtOne === "0" || 
		     charAtOne === "b" ||
		     charAtOne === "f" ||
		     charAtOne === "n" ||
		     charAtOne === "r" ||
		     charAtOne === "t" ||
		     charAtOne === "\\" ||
		     charAtOne === "'" ){
			 return String(text).substring(0, 2);
		  }else if(charAtOne === "x" && text.charAt(2) === "0" && text.charAt(3) === "B"){
			  return String(text).substring(0, 4);
		  } 
	  }
  }
  return String(text).substring(0, 1);
};

Blockly.Blocks['text_char'] = {
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput()
        .appendField(this.newQuote_(true))
        .appendField(new Blockly.FieldTextInput('',Blockly.FieldTextInput.char_validator), 'TEXT')
        .appendField(this.newQuote_(false));
    this.setOutput(true, Number);
    this.setTooltip(Blockly.Msg.TEXT_CHAR_TOOLTIP);
  },
  newQuote_: function(open) {
    if (open == true) {
      var file = '../blockly/media/quote2.png';//'../../media/quote2.png';
    } else {
      var file = '../blockly/media/quote3.png';//'../../media/quote3.png';
    }
    return new Blockly.FieldImage(file, 7, 12, '"');
  }
};


Blockly.Blocks['text_join'] = {
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendValueInput('A')
        .setCheck([String, Number]);
    this.appendValueInput('B')
        .setCheck([String,Number])
        .appendField(Blockly.DLMLY_TEXT_JOIN);
    this.setInputsInline(true);
	this.setOutput(true, String);
	this.setTooltip(Blockly.DLMLY_TOOLTIP_TEXT_JOIN);
  }
};

Blockly.Blocks['text_to_number'] = {
  init: function() {
	var TO_INT_FLOAT =
        [[Blockly.DLMLY_TO_INT, 'int'],[Blockly.DLMLY_TO_FLOAT, 'float'],[Blockly.DLMLY_TO_BITES, 'b']];
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendValueInput('VAR')
		.appendField(new Blockly.FieldDropdown(TO_INT_FLOAT), 'TOWHAT');
	this.setOutput(true, Number);
	var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('TOWHAT');
      var TOOLTIPS = {
        'int': Blockly.DLMLY_TOOLTIP_TEXT_TOINT,
        'float': Blockly.DLMLY_TOOLTIP_TEXT_TOFLOAT,
        'b': Blockly.DLMLY_TOOLTIP_TEXT_TOBYTE
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['text_to_number_skulpt'] = {
  init: function() {
  var TO_INT_FLOAT =
        [[Blockly.DLMLY_TO_INT, 'int'],[Blockly.DLMLY_TO_FLOAT, 'float']];
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendValueInput('VAR')
    .appendField(new Blockly.FieldDropdown(TO_INT_FLOAT), 'TOWHAT');
  this.setOutput(true, Number);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('TOWHAT');
      var TOOLTIPS = {
        'int': Blockly.DLMLY_TOOLTIP_TEXT_TOINT,
        'float': Blockly.DLMLY_TOOLTIP_TEXT_TOFLOAT
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['ascii_to_char'] = {
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendValueInput('VAR')
        .setCheck(Number)
		.appendField(Blockly.DLMLY_TOCHAR);
	this.setOutput(true, String);
	this.setTooltip(Blockly.DLMLY_TOOLTIP_TEXT_TOCHAR);
  }
};

Blockly.Blocks['char_to_ascii'] = {
    init: function () {
        this.setColour(Blockly.Blocks.texts.HUE);
        this.appendValueInput('VAR')
	        .setCheck(String)
	        .appendField(Blockly.DLMLY_TOASCII);
        this.setOutput(true, Number);
        this.setTooltip(Blockly.DLMLY_TOOLTIP_TEXT_TOASCII);
    }
};

Blockly.Blocks['number_to_text'] = {
    init: function () {
        this.setColour(Blockly.Blocks.texts.HUE);
        this.appendValueInput('VAR')
            .appendField(Blockly.DLMLY_TOSTRING);;
        this.setOutput(true, String);
        this.setTooltip(Blockly.DLMLY_TOOLTIP_TEXT_TOTEXT);
    }
};

Blockly.Blocks['text_length']={
init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
	this.appendValueInput("VAR")
        .appendField(Blockly.DLMLY_LENGTH);
	this.setOutput(true, Number);
  this.setTooltip(Blockly.DLMLY_TOOLTIP_TEXT_LENGTH);
  }
}



Blockly.Blocks['text_char_at2'] = {
    init: function() {
        this.WHERE_OPTIONS = [[Blockly.Msg.LISTS_GET_INDEX_FROM_START, "FROM_START"],
                              [Blockly.Msg.LISTS_GET_INDEX_FROM_END, "FROM_END"],
                              [Blockly.Msg.TEXT_GET_INDEX_RANDOM+1+Blockly.Msg.TEXT_CHARAT2, "RANDOM"]];
        this.setHelpUrl(Blockly.Msg.LISTS_GET_INDEX_HELPURL);
        this.setColour(Blockly.Blocks.texts.HUE);
        this.appendValueInput("VAR")
            .setCheck(String)
        //    .appendField(Blockly.DLMLY_MICROBIT_TYPE_LIST)
        this.appendValueInput("AT")
            .setCheck(Number)
        this.appendDummyInput()
            //.appendField(Blockly.DLMLY_MID)
            .appendField(Blockly.Msg.LISTS_GET_INDEX_GET, "MODE");
//            .appendField("", "SPACE");
        Blockly.Msg.LISTS_GET_INDEX_TAIL && this.appendDummyInput("TAIL").appendField(Blockly.Msg.LISTS_GET_INDEX_TAIL);
        // this.appendDummyInput().appendField(Blockly.DLMLY_DE);
        this.setInputsInline(!0);
        this.setOutput(!0);
        this.updateAt_(!0);
        var b = this;
        this.setTooltip(function() {
            var a = b.getFieldValue("MODE"),
                e = b.getFieldValue("WHERE"),
                d = "";
            switch (a + " " + e) {
            case "GET FROM_START":
            case "GET FROM_END":
                d = Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_FROM;
                break;
            case "GET RANDOM":
                d = Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM;
                break;
            case "GET_REMOVE FROM_START":
            case "GET_REMOVE FROM_END":
                d = Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_FROM;
                break;
            case "GET_REMOVE RANDOM":
                d = Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_REMOVE_RANDOM;
                break;
            }
            if ("FROM_START" == e || "FROM_END" == e) d += "  " + Blockly.Msg.LISTS_INDEX_FROM_START_TOOLTIP.replace("%1", Blockly.Blocks.ONE_BASED_INDEXING ? "#1": "#0");
            return d
        })
        var thisBlock = this;
        this.setTooltip(function() {
        var mode = thisBlock.getFieldValue('WHERE');
        var TOOLTIPS = {
        'FROM_START': Blockly.Msg.LISTS_GET_INDEX_FROM_START,
        'FROM_END': Blockly.Msg.LISTS_GET_INDEX_FROM_END,
        'RANDOM': Blockly.Msg.TEXT_GET_INDEX_RANDOM
      };
      return Blockly.Msg.PROCEDURES_DEFRETURN_RETURN+Blockly.DLMLY_MICROBIT_TYPE_STRING+TOOLTIPS[mode]+'n'+Blockly.Msg.TEXT_CHARAT2;
    });
    },
    mutationToDom: function() {
        var a = document.createElement("mutation");
        a.setAttribute("statement", !this.outputConnection);
        var b = this.getInput("AT").type == Blockly.INPUT_VALUE;
        a.setAttribute("at", b);
        return a
    },
    domToMutation: function(a) {
        var b = "true" == a.getAttribute("statement");
        this.updateStatement_(b);
        a = "false" != a.getAttribute("at");
        this.updateAt_(a)
    },
    updateStatement_: function(a) {
        a != !this.outputConnection && (this.unplug(!0, !0), a ? (this.setOutput(!1), this.setPreviousStatement(!0), this.setNextStatement(!0)) : (this.setPreviousStatement(!1), this.setNextStatement(!1), this.setOutput(!0)))
    },
    updateAt_: function(a) {
        this.removeInput("AT");
        this.removeInput("ORDINAL", !0);
        a ? (this.appendValueInput("AT").setCheck(Number), Blockly.Msg.TEXT_CHARAT2 && this.appendDummyInput("ORDINAL").appendField(Blockly.Msg.TEXT_CHARAT2)) : this.appendDummyInput("AT");
        var b = new Blockly.FieldDropdown(this.WHERE_OPTIONS,
        function(b) {
            var e = "FROM_START" == b || "FROM_END" == b;
            if (e != a) {
                var d = this.sourceBlock_;
                d.updateAt_(e);
                d.setFieldValue(b, "WHERE");
                return null
            }
        });
        this.getInput("AT").appendField(b, "WHERE");
        Blockly.Msg.LISTS_GET_INDEX_TAIL && this.moveInputBefore("TAIL", null)
    }
};


Blockly.Blocks['text_char_at'] = {
    init: function () {
        this.setHelpUrl(Blockly.Msg.LISTS_GET_INDEX_HELPURL);
        this.setColour(Blockly.Blocks.texts.HUE);
        this.appendValueInput("VAR")
            .setCheck(String);
        this.appendValueInput("AT")
            .setCheck(Number)
            .appendField(Blockly.Msg.LISTS_GET_INDEX_GET + " " + Blockly.Msg.LISTS_GET_INDEX_FROM_START);
        this.appendDummyInput()
            .appendField(Blockly.Msg.TEXT_CHARAT2);
        this.setOutput(true);
        this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN+Blockly.DLMLY_MICROBIT_TYPE_STRING+Blockly.Msg.LISTS_GET_INDEX_FROM_START+'n'+Blockly.Msg.TEXT_CHARAT2);
    }
}


Blockly.Blocks['text_random_char'] = {
    init: function () {
        this.setHelpUrl(Blockly.Msg.LISTS_GET_INDEX_HELPURL);
        this.setColour(Blockly.Blocks.texts.HUE);
        this.appendValueInput("VAR")
            .setCheck(String);
        this.appendDummyInput()
            .appendField(Blockly.Msg.TEXT_RANDOM_CHAR);
        this.setOutput(true);
        this.setTooltip(Blockly.Msg.TEXT_RANDOM_CHAR_TOOLTIP);
    }
}


Blockly.Blocks['text_substring2'] = {
  /**
   * Block for getting sublist.
   * @this Blockly.Block
   */
  init: function() {
    this['WHERE_OPTIONS_1'] =
        [[Blockly.Msg.LISTS_GET_INDEX_FROM_START, 'FROM_START'],
         [Blockly.Msg.LISTS_GET_INDEX_FROM_END, 'FROM_END'],
         [Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST, 'FIRST']];
    this['WHERE_OPTIONS_2'] =
        [[Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START, 'FROM_START'],
         [Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END, 'FROM_END'],
         [Blockly.Msg.LISTS_GET_SUBLIST_END_LAST, 'LAST']];
    this.setHelpUrl(Blockly.Msg.LISTS_GET_SUBLIST_HELPURL);
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendValueInput("VAR")
        .setCheck(String)
        //.appendField(Blockly.Msg.LISTS_GET_SUBLIST_TAIL)
    // if (Blockly.Msg.LISTS_GET_SUBLIST_TAIL) {
    //   this.appendDummyInput('TAIL')
    //       .appendField(Blockly.Msg.LISTS_GET_SUBLIST_TAIL);
    // }
    this.appendDummyInput('')
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET);
    this.appendDummyInput('AT1');
    this.appendDummyInput('AT2');
    this.setInputsInline(true);
    this.setOutput(true, 'List');
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly.Msg._GET_TEXT_SUBLIST_TOOLTIP);
  },
  /**
   * Create XML to represent whether there are 'AT' inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var isAt1 = this.getInput('AT1').type == Blockly.INPUT_VALUE;
    container.setAttribute('at1', isAt1);
    var isAt2 = this.getInput('AT2').type == Blockly.INPUT_VALUE;
    container.setAttribute('at2', isAt2);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var isAt1 = (xmlElement.getAttribute('at1') == 'true');
    var isAt2 = (xmlElement.getAttribute('at2') == 'true');
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },
  /**
   * Create or delete an input for a numeric index.
   * This block has two such inputs, independant of each other.
   * @param {number} n Specify first or second input (1 or 2).
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function(n, isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT' + n);
    this.removeInput('ORDINAL' + n, true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT' + n).setCheck(Number);
      if (Blockly.Msg.TEXT_CHARAT2) {
        this.appendDummyInput('ORDINAL' + n)
            .appendField(Blockly.Msg.TEXT_CHARAT2);
      }
    } else {
      this.appendDummyInput('AT' + n);
    }
    var menu = new Blockly.FieldDropdown(this['WHERE_OPTIONS_' + n],
        function(value) {
          var newAt = (value == 'FROM_START') || (value == 'FROM_END');
          // The 'isAt' variable is available due to this function being a
          // closure.
          if (newAt != isAt) {
            var block = this.sourceBlock_;
            block.updateAt_(n, newAt);
            // This menu has been destroyed and replaced.
            // Update the replacement.
            block.setFieldValue(value, 'WHERE' + n);
            return null;
          }
          return undefined;
        });
    this.getInput('AT' + n)
        .appendField(menu, 'WHERE' + n);
    if (n == 1) {
      this.moveInputBefore('AT1', 'AT2');
      if (this.getInput('ORDINAL1')) {
        this.moveInputBefore('ORDINAL1', 'AT2');
      }
    }
    // if (Blockly.Msg.LISTS_GET_SUBLIST_TAIL) {
    //   this.moveInputBefore('TAIL', null);
    // }
  }
};

Blockly.Blocks['text_substring'] = {
    /**
     * Block for getting sublist.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(Blockly.Msg.LISTS_GET_SUBLIST_HELPURL);
        this.setColour(Blockly.Blocks.texts.HUE);
        this.appendValueInput("VAR")
            .setCheck(String)
        this.appendValueInput('AT1')
            .appendField(Blockly.Msg.LISTS_GET_INDEX_GET + " " + Blockly.Msg.LISTS_GET_INDEX_FROM_START);
        this.appendValueInput('AT2')
            .appendField(Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START);
        this.appendDummyInput()
            .appendField(Blockly.Msg.TEXT_CHARAT2);
        this.setInputsInline(true);
        this.setOutput(true, ['List',String]);
        this.setTooltip(Blockly.Msg._GET_TEXT_SUBLIST_TOOLTIP);
    }
}

Blockly.Blocks['text_equals_starts_ends']={
init: function() {
	var TEXT_DOWHAT =
        [[Blockly.DLMLY_EQUALS, '==='],
        [Blockly.DLMLY_STARTSWITH, 'startswith'],
		[Blockly.DLMLY_ENDSWITH, 'endswith']];
    this.setColour(Blockly.Blocks.texts.HUE);
	this.appendValueInput("STR1")
        .setCheck(String);
	this.appendValueInput("STR2")
        .appendField(new Blockly.FieldDropdown(TEXT_DOWHAT), 'DOWHAT')
        .setCheck(String);
	this.setOutput(true, [Boolean,Number]);
	this.setInputsInline(true);
  }
}

Blockly.Blocks['text_compare_to']={
init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
	this.appendValueInput("STR1")
        .setCheck(String);
	this.appendValueInput("STR2")
        .appendField(Blockly.DLMLY_COMPARETO)
        .setCheck(String);
	this.setOutput(true, Number);
	this.setInputsInline(true);
	this.setTooltip(Blockly.DLMLY_COMPARETO_HELP);
  }
}

Blockly.Blocks['text_capital']={
init: function() {
    var TEXT_CAPITAL =
        [[Blockly.Msg.TEXT_TITLE, 'title'],[Blockly.Msg.TEXT_CAPITALIZE, 'capitalize'],[Blockly.Msg.TEXT_SWAPCASE, 'swapcase'],
        [Blockly.Msg.TEXT_LOWER, 'lower']];
  this.setColour(Blockly.Blocks.texts.HUE);
  this.appendValueInput("VAR")
      .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET)
      .appendField(new Blockly.FieldDropdown(TEXT_CAPITAL), 'CAPITAL')
      .setCheck(String);
  this.setOutput(true, String);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('CAPITAL');
      var TOOLTIPS = {
        'title': Blockly.DLMLY_DLMPY_TEXT_TITLE_TOOLTIP,
        'swapcase': Blockly.DLMLY_DLMPY_TEXT_SWAPCASE_TOOLTIP,
        'capitalize': Blockly.DLMLY_DLMPY_TEXT_CAPITALIZE_TOOLTIP,
        'lower': Blockly.DLMLY_DLMPY_TEXT_LOWER_TOOLTIP        
      };
      return TOOLTIPS[mode];
    });
  }
}

Blockly.Blocks['text_center']={
init: function() {
    var TEXT_CENTER =
        [[Blockly.Msg.TEXT_LJUST, 'ljust'],
        [Blockly.Msg.TEXT_CENTER, 'center'],
        [Blockly.Msg.TEXT_RJUST, 'rjust']];
  this.setColour(Blockly.Blocks.texts.HUE);
  this.appendValueInput("VAR")
      .appendField(new Blockly.FieldDropdown(TEXT_CENTER), 'CENTER')
      .setCheck(String);
  this.appendValueInput("WID")
      .appendField(Blockly.DLMLY_WIDTH)
      .setCheck(Number);
  this.appendValueInput("Symbol")
      .appendField(Blockly.DLMLY_RECT_Fill)
      .setCheck(String);
  this.setInputsInline(true);
  this.setOutput(true, String);
  this.setTooltip(Blockly.DLMLY_DLMPY_TEXT_CENTER_TOOLTIP);
  }
}

Blockly.Blocks['text_find']={
init: function() {
  this.setColour(Blockly.Blocks.texts.HUE);
  this.appendValueInput("VAR")
      .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET)
      .setCheck(String);
  this.appendValueInput("STR")
      .appendField(Blockly.DLMLY_MID+ Blockly.DLMLY_MICROBIT_PY_STORAGE_CHARACTER)
      .setCheck(String);
  this.appendDummyInput()
      .appendField(Blockly.Msg.DLMLY_LIST_INDEX);
  this.setInputsInline(true);
  this.setOutput(true, String);
  this.setTooltip(Blockly.DLMLY_DLMPY_TEXT_FIND_TOOLTIP);
  }
}

Blockly.Blocks['text_join_seq']={
init: function() {
  this.setColour(Blockly.Blocks.texts.HUE);
  this.appendValueInput("VAR")
      .appendField(Blockly.DLMLY_PYTHON_TEXT_JOIN_SEQ_USE_STR)
      .setCheck(String);
  this.appendValueInput('LIST')            
      .appendField(Blockly.DLMLY_PYTHON_TEXT_JOIN_SEQ_SEQ)
      .setCheck('List','Tuple','Set','Dict');
  this.appendDummyInput()
      .appendField(Blockly.DLMLY_PYTHON_TEXT_JOIN_SEQ_GET_STR);
  this.setInputsInline(true);
  this.setOutput(true, String);
  this.setTooltip(Blockly.DLMLY_PYTHON_TEXT_JOIN_SEQ_TOOLTIP);
  }
}

Blockly.Blocks['text_replace']={
init: function() {
  this.setColour(Blockly.Blocks.texts.HUE);
  this.appendValueInput("VAR")
      .setCheck(String);
  this.appendValueInput("STR1")
      .appendField(Blockly.DLMLY_DLMPY_REPLACE)
      .setCheck(String);
  this.appendValueInput("STR2")
      .appendField(Blockly.Msg.LISTS_SET_INDEX_INPUT_TO)
      .setCheck(String);
  this.setInputsInline(true);
  this.setOutput(true, String);
  this.setTooltip(Blockly.DLMLY_DLMPY_TEXT_REPLACE_TOOLTIP);
  }
}

Blockly.Blocks['text_split']={
init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
  this.appendValueInput("VAR");
  this.appendValueInput("VAL")
      .appendField(Blockly.Msg.LIST_SPLIT_AS);   
  this.appendDummyInput('')
      .appendField(Blockly.Msg.LIST_SPLIT);         
  this.setOutput(true, "List");
  this.setTooltip(Blockly.DLMLY_DLMPY_TEXT_SPLIT_TOOLTIP);
  this.setInputsInline(true);
  }
}

Blockly.Blocks['text_strip'] = {
  init: function() {
  var STRIP =
        [[Blockly.Msg.TEXT_TRIM_BOTH, 'strip'],[Blockly.Msg.TEXT_TRIM_LEFT, 'lstrip'],[Blockly.Msg.TEXT_TRIM_RIGHT, 'rstrip']];
    this.setColour(Blockly.Blocks.texts.HUE);    
    this.appendValueInput('VAR')
    this.appendDummyInput('')
        .appendField(Blockly.Msg.TEXT_STRIM);
    this.appendDummyInput('')    
        .appendField(new Blockly.FieldDropdown(STRIP), 'TOWHAT');  
    this.appendDummyInput('')
        .appendField(Blockly.Msg.TEXT_BLANK);      
    this.setOutput(true, String);
    this.setInputsInline(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('TOWHAT');
      var TOOLTIPS = {
        'strip': Blockly.Msg.TEXT_TRIM_BOTH_TOOLTIP,
        'lstrip': Blockly.Msg.TEXT_TRIM_LEFT_TOOLTIP,
        'rstrip': Blockly.Msg.TEXT_TRIM_RIGHT_TOOLTIP
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['text_format'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_MICROPYTHON_FORMAT)
  //don't need to specify the data type in Python
        // .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'Array<number>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_STRING, 'Array<string>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_BOOLEAN, 'Array<boolean>']]), 'TYPE')
        // .appendField(' ')
    this.appendDummyInput("")
        .appendField(new Blockly.FieldTextInput('str'), 'VAR');
    this.itemCount_ = 1;
    this.updateShape_();
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setInputsInline(true);
    this.setMutator(new Blockly.Mutator(['text_create_with_item']));
    this.setOutput(true);
    this.setTooltip(Blockly.DLMLY_DLMPY_TEXT_FORMAT_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'text_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'text_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField();
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.PROCEDURES_BEFORE_PARAMS);
        }
      }
    }
  },
  getVars: function() {
    if(this.getFieldValue('VAR') != null){
      if((this.getFieldValue('VAR').indexOf("'")==-1) && (this.getFieldValue('VAR').indexOf('"')==-1)){
        return [this.getFieldValue('VAR')];
      }
      else
        return [];}
  },
  renameVar: function(oldName, newName) {
      if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
        this.setTitleValue(newName, 'VAR');
    }

  }
};

Blockly.Blocks['text_create_with_container'] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.TUPLE_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['text_create_with_item'] = {
  /**
   * Mutator bolck for adding items.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.blockpy_SET_VARIABLES_NAME);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TUPLE_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['text_substring3'] = Blockly.Blocks['text_substring'] 
Blockly.Blocks['text_compareTo'] = Blockly.Blocks['text_compare_to']
Blockly.Blocks['text_char_at3'] = Blockly.Blocks['text_char_at']

Blockly.Blocks['text_format_noreturn'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.texts.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_MICROPYTHON_FORMAT)
  //don't need to specify the data type in Python
        // .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'Array<number>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_STRING, 'Array<string>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_BOOLEAN, 'Array<boolean>']]), 'TYPE')
        // .appendField(' ')
    this.appendValueInput("VAR")
        .setCheck(String);
    this.itemCount_ = 1;
    this.updateShape_();
    this.setPreviousStatement(false);
    this.setNextStatement(false);
    this.setInputsInline(true);
    this.setMutator(new Blockly.Mutator(['text_create_with_item']));
    this.setOutput(true);
    this.setTooltip(Blockly.DLMLY_DLMPY_TEXT_FORMAT_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'text_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'text_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField();
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.PROCEDURES_BEFORE_PARAMS);
        }
      }
    }
  }
};
'use strict';

goog.provide('Blockly.Blocks.tuple');

goog.require('Blockly.Blocks');


Blockly.Blocks.tuple.HUE = 195//'#5ec73d'//195;


Blockly.Blocks['tuple_create_with'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
  this.appendDummyInput("")
  //don't need to specify the data type in Python
        // .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'Array<number>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_STRING, 'Array<string>'], [Blockly.DLMLY_MICROBIT_JS_TYPE_BOOLEAN, 'Array<boolean>']]), 'TYPE')
        // .appendField(' ')
        .appendField(new Blockly.FieldTextInput('mytup'), 'VAR');
    this.itemCount_ = 3;
    this.updateShape_();
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setMutator(new Blockly.Mutator(['tuple_create_with_item']));
    this.setTooltip(Blockly.Msg.TUPLE_CREATE_WITH_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'tuple_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'tuple_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.TUPLE_CREATE_EMPTY_TITLE);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.TUPLE_CREATE_WITH_INPUT_WITH);
        }
      }
    }
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};

Blockly.Blocks['tuple_create_with_container'] = {
  /**
   * Mutator block for list container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.TUPLE_CREATE_WITH_CONTAINER_TITLE_ADD);
    this.appendStatementInput('STACK');
    this.setTooltip(Blockly.Msg.TUPLE_CREATE_WITH_CONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['tuple_create_with_item'] = {
  /**
   * Mutator bolck for adding items.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.blockpy_SET_VARIABLES_NAME);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TUPLE_CREATE_WITH_ITEM_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['tuple_create_with_text2'] = {
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
  this.appendDummyInput("")
  //don't need to specify the data type in Python
        // .appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'Array<number>']]), 'TYPE')
        // .appendField(' ')
    // .appendField(Blockly.blockpy_DLMLY_TUPLE_CREATE)
        .appendField(new Blockly.FieldTextInput('mytup'), 'VAR')
        //.appendField(new Blockly.FieldTextInput('3',Blockly.FieldTextInput.math_number_validator), 'SIZE')
      // .appendField(Blockly.DLMLY_MAKELISTFROM)
    // .appendField(this.newQuote_(true))
        .appendField(' = (')
        .appendField(new Blockly.FieldTextInput('0,0,0'), 'TEXT')
        .appendField(')');
        // .appendField(this.newQuote_(false))
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  this.setTooltip(Blockly.DLMPY_TOOLTIP_TUPLE_CREATE_WITH_TEXT);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
  // newQuote_: function(open) {
  //   if (open == this.RTL) {
  //     var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
  //   } else {
  //     var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
  //   }
  //   return new Blockly.FieldImage(file, 12, 12, '"');
  // }
}

Blockly.Blocks['tuple_create_with_text_return'] = {
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
  this.appendDummyInput("")
        .appendField('(')
        .appendField(new Blockly.FieldTextInput('0,0,0'), 'TEXT')
        .appendField(')');
        // .appendField(this.newQuote_(false))
  this.setOutput(true);
  this.setInputsInline(true);
  this.setTooltip(Blockly.DLMPY_TOOLTIP_TUPLE_CREATE_WITH_TEXT);
  // },
  // getVars: function() {
  //   return [this.getFieldValue('VAR')];
  // },
  // renameVar: function(oldName, newName) {
  //   if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
  //     this.setTitleValue(newName, 'VAR');
  //   }
  }
  // newQuote_: function(open) {
  //   if (open == this.RTL) {
  //     var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAqUlEQVQI1z3KvUpCcRiA8ef9E4JNHhI0aFEacm1o0BsI0Slx8wa8gLauoDnoBhq7DcfWhggONDmJJgqCPA7neJ7p934EOOKOnM8Q7PDElo/4x4lFb2DmuUjcUzS3URnGib9qaPNbuXvBO3sGPHJDRG6fGVdMSeWDP2q99FQdFrz26Gu5Tq7dFMzUvbXy8KXeAj57cOklgA+u1B5AoslLtGIHQMaCVnwDnADZIFIrXsoXrgAAAABJRU5ErkJggg==';
  //   } else {
  //     var file = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAKCAQAAAAqJXdxAAAAn0lEQVQI1z3OMa5BURSF4f/cQhAKjUQhuQmFNwGJEUi0RKN5rU7FHKhpjEH3TEMtkdBSCY1EIv8r7nFX9e29V7EBAOvu7RPjwmWGH/VuF8CyN9/OAdvqIXYLvtRaNjx9mMTDyo+NjAN1HNcl9ZQ5oQMM3dgDUqDo1l8DzvwmtZN7mnD+PkmLa+4mhrxVA9fRowBWmVBhFy5gYEjKMfz9AylsaRRgGzvZAAAAAElFTkSuQmCC';
  //   }
  //   return new Blockly.FieldImage(file, 12, 12, '"');
  // }
}

Blockly.Blocks.tuple_getIndex = {
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.setOutput(true);
    this.appendValueInput('TUP')
        .setCheck('Tuple')
    this.appendValueInput('AT')
        .setCheck(Number)
    
        .appendField(Blockly.LANG_LISTS_GET_INDEX1);
    this.appendDummyInput("")
        .appendField(Blockly.LANG_LISTS_GET_INDEX2);
    this.setInputsInline(true);
    this.setTooltip(Blockly.TUPLE_GET_INDEX_TOOLTIP);
  }
};

Blockly.Blocks['tuple_length'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.appendValueInput('TUP');
  this.appendDummyInput("")
        .appendField(Blockly.Msg.LISTS_LENGTH_TITLE);
        
  this.setTooltip(Blockly.Msg.TUPLE_LENGTH_TOOLTIP);
  this.setOutput(true, Number);
  }
};

Blockly.Blocks['tuple_del'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.appendValueInput('TUP')
        .setCheck('Tuple')
    this.appendDummyInput("")         
        .appendField(Blockly.Msg.TUPLE_DEL);  
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TUPLE_DEL_TOOLTIP);
  }
};

Blockly.Blocks['tuple_join'] = {
  /**
   * Block for list length.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
  this.appendValueInput('TUP1')
        .setCheck('Tuple')
  this.appendDummyInput("")
        .appendField(Blockly.Msg.TUPLE_JOIN)
  this.appendValueInput('TUP2')
        .setCheck('Tuple')
  this.setInputsInline(true);
  this.setTooltip(Blockly.Msg.TUPLE_JOIN_TOOLTIP);
  this.setOutput(true, "Tuple");
  }
};


Blockly.Blocks['tuple_max'] = {
  init: function() {
     this.appendValueInput('TUP')
        .setCheck('Tuple')
  var max_min =
        [[Blockly.blockpy_TUPLE_MAX, 'max'],[Blockly.blockpy_TUPLE_MIN, 'min'],[Blockly.Msg.MATH_ONLIST_OPERATOR_SUM,'sum']];
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_TUPLE_GET)
        .appendField(new Blockly.FieldDropdown(max_min), 'DIR')
        

  this.setInputsInline(true);
  this.setOutput(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'max': Blockly.DLMLY_TOOLTIP_TUPLE_MAX,
        'min': Blockly.DLMLY_TOOLTIP_TUPLE_MIN,
        'sum': Blockly.DLMLY_TOOLTIP_TUPLE_SUM
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['tuple_change_to'] = {
  init: function() {
    var OPERATORS =
        [[Blockly.DLMLY_MICROBIT_TYPE_LIST, 'list'],
         [Blockly.DLMLY_MICROBIT_TYPE_SETS, 'set']
        ];
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.appendValueInput('VAR')
        .setCheck("Tuple")
        // .appendField(Blockly.blockpy_USE_LIST);   
    this.appendDummyInput("")
        .appendField(Blockly.Msg.A_TO_B)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    this.setOutput(true);
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'list': Blockly.Msg.TUPLE_TO_LISTS,
        'set': Blockly.Msg.TUPLE_TO_SET,
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['tuple_find'] = {
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.DLMLY_LIST_INDEX, 'INDEX'],
         [Blockly.Msg.DLMLY_LIST_COUNT, 'COUNT']
        ];
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.appendValueInput('VAR')
        .setCheck('List')
    this.appendValueInput('data')
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET)
        .appendField(Blockly.DLMLY_I2C_VALUE)
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_DE)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
        //.appendField(new Blockly.FieldTextInput('mylist'), 'VAR')
    this.setInputsInline(true);
    this.setOutput(true, Number);
     var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'INDEX': Blockly.DLMLY_TOOLTIP_TUPLE_FIND_INDEX,
        'COUNT': Blockly.DLMLY_TOOLTIP_TUPLE_FIND_COUNT
        
      };
      return TOOLTIPS[mode];
    });  
  }
};

Blockly.Blocks['tuple_trig'] = {
  init: function() {
    var OPERATORS =
        [[Blockly.Msg.DLMLY_LIST_LEN, 'LEN'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_SUM, 'SUM'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_MAX, 'MAX'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_MIN, 'MIN'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_AVERAGE, 'AVERAGE'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_MEDIAN, 'MEDIAN'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_MODE, 'MODE'],
         [Blockly.Msg.MATH_ONLIST_OPERATOR_STD_DEV, 'STD_DEV'],
        ];
    //this.setHelpUrl(Blockly.Msg.MATH_TRIG_HELPURL);
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.setOutput(true, Number);
    this.appendValueInput('data')
        .setCheck('List')
    this.appendDummyInput()
    .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET)
        .appendField(new Blockly.FieldDropdown(OPERATORS), 'OP');
    this.setInputsInline(true);
    // Assign 'this' to a variable for use in the tooltip closure below.
    var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('OP');
      var TOOLTIPS = {
        'LEN': Blockly.Msg.TUPLE_LENGTH_TOOLTIP,
        'SUM': Blockly.Msg.MATH_ONLIST_TOOLTIP_TUPLE_SUM,
        'MAX': Blockly.Msg.MATH_ONLIST_TOOLTIP_TUPLE_MAX,
        'MIN': Blockly.Msg.MATH_ONLIST_TOOLTIP_TUPLE_MIN,
        'AVERAGE': Blockly.Msg.MATH_ONLIST_TOOLTIP_TUPLE_AVERAGE,
        'MEDIAN': Blockly.Msg.MATH_ONLIST_TOOLTIP_TUPLE_MEDIAN,
        'MODE': Blockly.Msg.MATH_ONLIST_TOOLTIP_TUPLE_MODE,
        'STD_DEV': Blockly.Msg.MATH_ONLIST_TOOLTIP_TUPLE_STD_DEV
        
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['tuple_getSublist'] = {
  /**
   * Block for getting sublist.
   * @this Blockly.Block
   */
  init: function() {
    this['WHERE_OPTIONS_1'] =
        [[Blockly.Msg.LISTS_GET_INDEX_FROM_START, 'FROM_START'],
         [Blockly.Msg.LISTS_GET_INDEX_FROM_END, 'FROM_END'],
         [Blockly.Msg.LISTS_GET_SUBLIST_START_FIRST, 'FIRST']];
    this['WHERE_OPTIONS_2'] =
        [[Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START, 'FROM_START'],
         [Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_END, 'FROM_END'],
         [Blockly.Msg.LISTS_GET_SUBLIST_END_LAST, 'LAST']];
    this.setHelpUrl(Blockly.Msg.LISTS_GET_SUBLIST_HELPURL);
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.appendValueInput('LIST')
        .setCheck('List')
        //.appendField(Blockly.Msg.LISTS_GET_SUBLIST_TAIL)
    // if (Blockly.Msg.LISTS_GET_SUBLIST_TAIL) {
    //   this.appendDummyInput('TAIL')
    //       .appendField(Blockly.Msg.LISTS_GET_SUBLIST_TAIL);
    // }
    this.appendDummyInput('')
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET);
    this.appendDummyInput('AT1');
    this.appendDummyInput('AT2');
    this.setInputsInline(true);
    this.setOutput(true, 'List');
    this.updateAt_(1, true);
    this.updateAt_(2, true);
    this.setTooltip(Blockly.Msg.PYTHON_TUPLE_GET_SUBLIST_TOOLTIP);
  },
  /**
   * Create XML to represent whether there are 'AT' inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    var isAt1 = this.getInput('AT1').type == Blockly.INPUT_VALUE;
    container.setAttribute('at1', isAt1);
    var isAt2 = this.getInput('AT2').type == Blockly.INPUT_VALUE;
    container.setAttribute('at2', isAt2);
    return container;
  },
  /**
   * Parse XML to restore the 'AT' inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var isAt1 = (xmlElement.getAttribute('at1') == 'true');
    var isAt2 = (xmlElement.getAttribute('at2') == 'true');
    this.updateAt_(1, isAt1);
    this.updateAt_(2, isAt2);
  },
  /**
   * Create or delete an input for a numeric index.
   * This block has two such inputs, independant of each other.
   * @param {number} n Specify first or second input (1 or 2).
   * @param {boolean} isAt True if the input should exist.
   * @private
   * @this Blockly.Block
   */
  updateAt_: function(n, isAt) {
    // Create or delete an input for the numeric index.
    // Destroy old 'AT' and 'ORDINAL' inputs.
    this.removeInput('AT' + n);
    this.removeInput('ORDINAL' + n, true);
    // Create either a value 'AT' input or a dummy input.
    if (isAt) {
      this.appendValueInput('AT' + n).setCheck(Number);
      if (Blockly.Msg.ORDINAL_NUMBER_SUFFIX) {
        this.appendDummyInput('ORDINAL' + n)
            .appendField(Blockly.Msg.ORDINAL_NUMBER_SUFFIX);
      }
    } else {
      this.appendDummyInput('AT' + n);
    }
    var menu = new Blockly.FieldDropdown(this['WHERE_OPTIONS_' + n],
        function(value) {
          var newAt = (value == 'FROM_START') || (value == 'FROM_END');
          // The 'isAt' variable is available due to this function being a
          // closure.
          if (newAt != isAt) {
            var block = this.sourceBlock_;
            block.updateAt_(n, newAt);
            // This menu has been destroyed and replaced.
            // Update the replacement.
            block.setFieldValue(value, 'WHERE' + n);
            return null;
          }
          return undefined;
        });
    this.getInput('AT' + n)
        .appendField(menu, 'WHERE' + n);
    if (n == 1) {
      this.moveInputBefore('AT1', 'AT2');
      if (this.getInput('ORDINAL1')) {
        this.moveInputBefore('ORDINAL1', 'AT2');
      }
    }
    // if (Blockly.Msg.LISTS_GET_SUBLIST_TAIL) {
    //   this.moveInputBefore('TAIL', null);
    // }
  }
};

Blockly.Blocks['tuple_create_with_noreturn'] = {
  /**
   * Block for creating a list with any number of elements of any type.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
    this.itemCount_ = 3;
    this.updateShape_();
    this.setPreviousStatement(false);
    this.setNextStatement(false);
	this.setOutput(true, "Tuple")
    this.setMutator(new Blockly.Mutator(['tuple_create_with_item']));
    this.setTooltip(Blockly.Msg.TUPLE_CREATE_WITH_TOOLTIP);
  },
  /**
   * Create XML to represent list inputs.
   * @return {Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('items', this.itemCount_);
    return container;
  },
  /**
   * Parse XML to restore the list inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
    this.updateShape_();
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock =
        Blockly.Block.obtain(workspace, 'tuple_create_with_container');
    containerBlock.initSvg();
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.itemCount_; i++) {
      var itemBlock = Blockly.Block.obtain(workspace, 'tuple_create_with_item');
      itemBlock.initSvg();
      connection.connect(itemBlock.previousConnection);
      connection = itemBlock.nextConnection;
    }
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    // Count number of inputs.
    var connections = [];
    var i = 0;
    while (itemBlock) {
      connections[i] = itemBlock.valueConnection_;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
      i++;
    }
    this.itemCount_ = i;
    this.updateShape_();
    // Reconnect any child blocks.
    for (var i = 0; i < this.itemCount_; i++) {
      if (connections[i]) {
        this.getInput('ADD' + i).connection.connect(connections[i]);
      }
    }
  },
  /**
   * Store pointers to any connected child blocks.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  saveConnections: function(containerBlock) {
    var itemBlock = containerBlock.getInputTargetBlock('STACK');
    var i = 0;
    while (itemBlock) {
      var input = this.getInput('ADD' + i);
      itemBlock.valueConnection_ = input && input.connection.targetConnection;
      i++;
      itemBlock = itemBlock.nextConnection &&
          itemBlock.nextConnection.targetBlock();
    }
  },
  /**
   * Modify this block to have the correct number of inputs.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    // Delete everything.
    if (this.getInput('EMPTY')) {
      this.removeInput('EMPTY');
    } else {
      var i = 0;
      while (this.getInput('ADD' + i)) {
        this.removeInput('ADD' + i);
        i++;
      }
    }
    // Rebuild block.
    if (this.itemCount_ == 0) {
      this.appendDummyInput('EMPTY')
          .appendField(Blockly.Msg.TUPLE_CREATE_EMPTY_TITLE);
    } else {
      for (var i = 0; i < this.itemCount_; i++) {
        var input = this.appendValueInput('ADD' + i);
        if (i == 0) {
          input.appendField(Blockly.Msg.TUPLE_CREATE_WITH_INPUT_WITH);
        }
      }
    }
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
};

Blockly.Blocks['tuple_get_sublist'] = {
    /**
     * Block for getting sublist.
     * @this Blockly.Block
     */
    init: function () {
        this.setHelpUrl(Blockly.Msg.LISTS_GET_SUBLIST_HELPURL);
        this.setColour(Blockly.Blocks.tuple.HUE);
        this.appendValueInput('LIST')
        this.appendDummyInput('')
        this.appendValueInput('AT1')
            .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET + " " + Blockly.Msg.LISTS_GET_INDEX_FROM_START);
        this.appendValueInput('AT2')
            .appendField(Blockly.Msg.TEXT_INDEXOF_TAIL + " " + Blockly.Msg.LISTS_GET_SUBLIST_END_FROM_START);
        this.appendDummyInput()
            .appendField(Blockly.Msg.TEXT_INDEXOF_TAIL);
        this.setInputsInline(true);
        this.setOutput(true, 'Tuple');
        this.setTooltip(Blockly.Msg.PYTHON_TUPLE_GET_SUBLIST_TOOLTIP);
    }
}

Blockly.Blocks['tuple_get_random_item'] = {  
  init: function() {
    this.setColour(Blockly.Blocks.tuple.HUE);
  this.appendValueInput("TUP");
  this.appendDummyInput()
        .appendField(Blockly.DLMLY_MICROBIT_PY_STORAGE_GET + " " + Blockly.Msg.LISTS_GET_INDEX_RANDOM)
  this.setTooltip(Blockly.Msg.LISTS_GET_INDEX_TOOLTIP_GET_RANDOM);
  this.setOutput(true);
  }
};

'use strict';

goog.provide('Blockly.Blocks.turtle');
goog.require('Blockly.Blocks');


Blockly.Blocks.turtle.HUE = 180;

Blockly.Blocks['turtle_create'] = {
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
  this.appendDummyInput("")
  
      .appendField(Blockly.blockpy_turtle_create)
      .appendField(new Blockly.FieldTextInput('xiaodi'), 'VAR')
                       
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  this.setTooltip(Blockly.blockpy_turtle_create_TOOLTIP);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setTitleValue(newName, 'VAR');
    }
  }
 
}

Blockly.Blocks['turtle_done'] = {
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput()
          .appendField(Blockly.blockpy_TURTLE_DONE);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_exitonclick'] = {
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput()
          .appendField(Blockly.DLMLY_PYTHON_TURTLE_EXITONCLICK);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_move'] = {
  init: function() {
     this.appendValueInput('TUR')
        .setCheck('Turtle')
  var front_back =
        [[Blockly.blockpy_forward, 'forward'],[Blockly.blockpy_backward, 'backward']];
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        // .setCheck(String)
        .appendField(Blockly.blockpy_turtle_move)
        .appendField(new Blockly.FieldDropdown(front_back), 'DIR')
        .appendField(Blockly.blockpy_turtle_move_num);

  this.setInputsInline(true);
   this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'forward': Blockly.DLMLY_TOOLTIP_TURTEL_FORWARD,
        'backward': Blockly.DLMLY_TOOLTIP_TURTEL_BACKWARD
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['turtle_rotate'] = {
  init: function() {
     this.appendValueInput('TUR')
        .setCheck('Turtle')
  var front_back =
        [[Blockly.blockpy_left, 'left'],[Blockly.blockpy_right, 'right']];
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        // .setCheck(String)
        .appendField(Blockly.blockpy_turtle_rotate)
        .appendField(new Blockly.FieldDropdown(front_back), 'DIR')
        .appendField(Blockly.blockpy_turtle_rotate_num);

  this.setInputsInline(true);
   this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'left': Blockly.DLMLY_TOOLTIP_TURTEL_LEFT,
        'right': Blockly.DLMLY_TOOLTIP_TURTEL_RIGHT
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['turtle_setheading'] = {
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.appendValueInput('data')
        .setCheck(Number)
        .appendField(Blockly.blockpy_setheading);
    this.appendDummyInput()
        .appendField(Blockly.blockpy_setheading_degree);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_screen_delay'] = {
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.appendValueInput('data')
        .setCheck(Number)
        .appendField(Blockly.DLMLY_TURTLE_SCREEN_DELAY);
    this.appendDummyInput()
        .appendField(Blockly.DLMLY_MILLIS);
    this.setTooltip(Blockly.DLMLY_TOOLTIP_TURTEL_SCREEN_DELAY);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_goto'] = {
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
      this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.appendValueInput('data')
        .setCheck(Number)
        
        .appendField(Blockly.blockpy_turtle_goto);
    this.appendValueInput('val')
        .setCheck(Number)
        .appendField(Blockly.blockpy_turtle_goto_y);
    this.appendDummyInput()
        .appendField(Blockly.blockpy_turtle_goto_position);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_setxy'] = {
    init: function() {
       this.appendValueInput('TUR')
          .setCheck('Turtle')
    var set_xy =
          [[Blockly.Msg.PYLAB_LABEL_X, 'x'],[Blockly.Msg.PYLAB_LABEL_Y, 'y']];
      this.setColour(Blockly.Blocks.turtle.HUE);
      this.appendValueInput('VAR')
          .appendField(new Blockly.FieldDropdown(set_xy), 'DIR')
          .appendField(Blockly.DLMLY_DLMPY_TURTLE_SETXY);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(Blockly.DLMLY_DLMPY_TURTLE_SETXY_TOOLTIP);
  }    
};

Blockly.Blocks['turtle_pos_shape'] = {
  
  init: function() {    
    this.setColour(Blockly.Blocks.turtle.HUE);
    var pos_shape =
        [[Blockly.Msg.TURTLE_POS, 'pos'],[Blockly.Msg.TURTLE_SHAPE, 'shape'],[Blockly.Msg.TURTLE_HEADING, 'heading'],[Blockly.DLMLY_DLMPY_TURTLE_WIDTH,'width']];
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.appendDummyInput("")
        .appendField(Blockly.Msg.TURTLE_POS_SHAPE)  
        .appendField(new Blockly.FieldDropdown(pos_shape), 'DIR')
    var thisBlock = this;
    this.setTooltip(function() {
    var mode = thisBlock.getFieldValue('DIR');
    var TOOLTIPS = {
        'pos': Blockly.DLMLY_TOOLTIP_TURTEL_POS,
        'shape': Blockly.DLMLY_TOOLTIP_TURTEL_SHAPE,
        'heading': Blockly.DLMLY_TOOLTIP_TURTEL_HEADING,
        'width': Blockly.DLMLY_TOOLTIP_TURTEL_WIDTH        
      };
      return TOOLTIPS[mode];
    });
    this.setOutput(true);
    this.setInputsInline(true);
  
  }
};


Blockly.Blocks['turtle_clear'] = {
  init: function() {
     this.appendValueInput('TUR')
        .setCheck('Turtle')
  var clear_reset =
        [[Blockly.blockpy_turtle_clear, 'clear'],[Blockly.blockpy_turtle_reset, 'reset']
        ,[Blockly.blockpy_turtle_home, 'home']];
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown(clear_reset), 'DIR')
        

  this.setInputsInline(true);
   this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'clear': Blockly.DLMLY_TOOLTIP_TURTEL_CLEAR,
        'reset': Blockly.DLMLY_TOOLTIP_TURTEL_RESET,
        'home': Blockly.DLMLY_TOOLTIP_TURTEL_HOME
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['turtle_penup'] = {
  init: function() {
    this.appendValueInput('TUR')
        .setCheck('Turtle')
  var penup_down =
        [[Blockly.blockpy_turtle_penup, 'penup'],[Blockly.blockpy_turtle_pendown, 'pendown']];
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown(penup_down), 'DIR')
        

  this.setInputsInline(true);
   this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'penup': Blockly.DLMLY_TOOLTIP_TURTEL_PENUP,
        'pendown': Blockly.DLMLY_TOOLTIP_TURTEL_PENDOWN
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['turtle_fill'] = {
  init: function() {
     this.appendValueInput('TUR')
        .setCheck('Turtle')
  var fill =
        [[Blockly.blockpy_turtle_beginfill, 'begin'],[Blockly.blockpy_turtle_endfill, 'end']];
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown(fill), 'DIR')
        

  this.setInputsInline(true);
   this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'begin': Blockly.DLMLY_TOOLTIP_TURTEL_BEGINFILL,
        'end': Blockly.DLMLY_TOOLTIP_TURTEL_ENDFILL
      };
      return TOOLTIPS[mode];
    });
  }
};


Blockly.Blocks['turtle_size_speed'] = {
  init: function() {
     this.appendDummyInput("")
      .appendField(new Blockly.FieldTextInput('xiaodi'), 'TUR')
  var size_speed =
        [[Blockly.blockpy_turtle_size, 'pensize'],[Blockly.blockpy_turtle_speed, 'speed']];
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        // .setCheck(String)
        .appendField(Blockly.blockpy_turtle_set)
        .appendField(new Blockly.FieldDropdown(size_speed), 'DIR')
        .appendField(Blockly.blockpy_turtle_set_num);

  this.setInputsInline(true);
   this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'pensize': Blockly.DLMLY_TOOLTIP_TURTEL_SIZE,
        'speed': Blockly.DLMLY_TOOLTIP_TURTEL_SPEED
      };
      return TOOLTIPS[mode];
    });
  }
};

Blockly.Blocks['turtle_size'] = {
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.appendValueInput('data')
        .setCheck(Number)
        .appendField(Blockly.blockpy_turtle_set_size);

    this.setTooltip(Blockly.DLMLY_TOOLTIP_TURTEL_SIZE);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};


Blockly.Blocks['turtle_speed'] = {
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.appendValueInput('data')
        .setCheck(Number)
        .appendField(Blockly.blockpy_turtle_set_speed);

    this.setTooltip(Blockly.DLMLY_TOOLTIP_TURTEL_SPEED);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_circle'] = {
    init: function() {
       this.appendValueInput('TUR')
          .setCheck('Turtle')
    var circle_dot =
          [[Blockly.blockpy_turtle_circle, 'circle'],[Blockly.blockpy_turtle_dot, 'dot']];
      this.setColour(Blockly.Blocks.turtle.HUE);
      this.appendValueInput('VAR')
          // .setCheck(String)
          .appendField(Blockly.blockpy_turtle_draw)
          .appendField(new Blockly.FieldDropdown(circle_dot), 'DIR')
          .appendField(Blockly.blockpy_turtle_radius);
      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      var thisBlock = this;
        this.setTooltip(function() {
          var mode = thisBlock.getFieldValue('DIR');
          var TOOLTIPS = {
            'circle': Blockly.DLMLY_TOOLTIP_TURTEL_CIRCLE,
            'dot': Blockly.DLMLY_TOOLTIP_TURTEL_DOT
          };
          return TOOLTIPS[mode];
        });
    }
};

Blockly.Blocks['turtle_circle_advanced'] = {
  init: function() {
     this.appendValueInput('TUR')
        .setCheck('Turtle')
      
      this.setColour(Blockly.Blocks.turtle.HUE);
      this.appendValueInput('VAR')
          // .setCheck(String)
          .appendField(Blockly.DLMLY_DLMPY_TURTLE_DRAW_CIRCLE)
          .appendField(Blockly.blockpy_turtle_radius);
      this.appendValueInput('data')
          .setCheck(Number)
          .appendField(Blockly.blockpy_turtle_angle);    

      this.setInputsInline(true);
      this.setPreviousStatement(true);
      this.setNextStatement(true);
      this.setTooltip(Blockly.DLMLY_TOOLTIP_TURTEL_CIRCLE);
    }
};

Blockly.Blocks['turtle_visible'] = {
  init: function() {
     this.appendValueInput('TUR')
        .setCheck('Turtle')
  var visible =
        [[Blockly.blockpy_turtle_hide, 'hideturtle'],[Blockly.blockpy_turtle_show, 'showturtle']];
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput("")
        .appendField(new Blockly.FieldDropdown(visible), 'DIR')
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  var thisBlock = this;
    this.setTooltip(function() {
      var mode = thisBlock.getFieldValue('DIR');
      var TOOLTIPS = {
        'hideturtle': Blockly.DLMLY_TOOLTIP_TURTEL_HIDE,
        'showturtle': Blockly.DLMLY_TOOLTIP_TURTEL_SHOW
      };
      return TOOLTIPS[mode];
    });
  }
};


Blockly.Blocks['turtle_bgcolor'] = {
 init: function() {
    
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput()
        .appendField(Blockly.blockpy_turtle_bgcolor)
        .appendField(new Blockly.FieldColour('#ff0000'), 'FIELDNAME');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_pencolor'] = {
 init: function() {
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput()
        .appendField(Blockly.blockpy_turtle_pencolor)
        .appendField(new Blockly.FieldColour('#ff0000'), 'FIELDNAME');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_fillcolor'] = {
 init: function() {
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput()
        .appendField(Blockly.blockpy_turtle_fillcolor)
        .appendField(new Blockly.FieldColour('#ff0000'), 'FIELDNAME');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_clone'] = {
  
  init: function() {
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('TUR')
        .setCheck('Turtle')
  this.appendDummyInput("")
        .appendField(Blockly.Msg.TURTLE_CLONE);
  this.setTooltip(Blockly.Msg.TURTLE_CLONE_TOOLTIP);
  this.setOutput(true);
  }
};

Blockly.Blocks['turtle_bgcolor_hex'] = {
 init: function() {
    
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        .setCheck(String)
        .appendField(Blockly.blockpy_turtle_bgcolor_hex);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_pencolor_hex'] = {
 init: function() {
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        .setCheck(String)
        .appendField(Blockly.blockpy_turtle_pencolor_hex);    
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_fillcolor_hex'] = {
 init: function() {
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        .setCheck(String)
        .appendField(Blockly.blockpy_turtle_fillcolor_hex);
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
  }
};

Blockly.Blocks['turtle_shape'] = {
  init: function() {
     this.appendValueInput('TUR')
        .setCheck('Turtle')
  var shape =
        [[Blockly.blockpy_turtle_shape_arrow, 'arrow'],[Blockly.blockpy_turtle_shape_turtle, 'turtle'],
        [Blockly.blockpy_turtle_shape_circle, 'circle'],[Blockly.blockpy_turtle_shape_square, 'square'],
        [Blockly.blockpy_turtle_shape_triangle, 'triangle'],[Blockly.blockpy_turtle_shape_classic, 'classic']];
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendDummyInput("")
        .appendField(Blockly.blockpy_turtle_shape)
        .appendField(new Blockly.FieldDropdown(shape), 'DIR');
        
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TURTLE_SHAPE_TOOLTIP);
  }
};

Blockly.Blocks['turtle_numinput'] = {
 init: function() {
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_DLMPY_TURTLE_NUMINPUT)
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('TITLE')
        .setCheck(String)
        .appendField(Blockly.DLMLY_DLMPY_TURTLE_TEXTINPUT_TITLE);
    this.appendValueInput('PROMPT')
        .setCheck(String)
        .appendField(Blockly.DLMLY_DLMPY_TURTLE_TEXTINPUT_PROMPT);
    this.appendValueInput('DEFAULT')
        .setCheck(Number)
        .appendField(Blockly.Msg.DICTS_DEFAULT_VALUE);
    this.appendValueInput('MIN')
        .setCheck(Number)
        .appendField(Blockly.Msg.MATH_ONLIST_OPERATOR_MIN);
    this.appendValueInput('MAX')
        .setCheck(Number)
        .appendField(Blockly.Msg.MATH_ONLIST_OPERATOR_MAX);                
    this.setInputsInline(true);
    this.setOutput(true,Number);
    this.setTooltip(Blockly.Msg.TURTLE_NUMINPUT_TOOLTIP);    
  }
};

Blockly.Blocks['turtle_textinput'] = {
 init: function() {
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_DLMPY_TURTLE_TEXTINPUT)
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('TITLE')
        .setCheck(String)
        .appendField(Blockly.DLMLY_DLMPY_TURTLE_TEXTINPUT_TITLE);
    this.appendValueInput('PROMPT')
        .setCheck(String)
        .appendField(Blockly.DLMLY_DLMPY_TURTLE_TEXTINPUT_PROMPT);    
    this.setInputsInline(true);
    this.setOutput(true,String);
    this.setTooltip(Blockly.Msg.TURTLE_TEXTINPUT_TOOLTIP);    
  }
};

Blockly.Blocks['turtle_write'] = {
 init: function() {
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        .setCheck(String)
        .appendField(Blockly.blockpy_turtle_write);    
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TURTLE_WRITE_TOOLTIP);    
  }
};

Blockly.Blocks['turtle_write_format'] = {
 init: function() {
    var move =
        [[Blockly.DLMLY_TURTLE_WRITE_MOVE_FALSE, 'False'],[Blockly.DLMLY_TURTLE_WRITE_MOVE_TRUE, 'True']];
    var align =
        [[Blockly.DLMLY_TURTLE_WRITE_ALIGN_LEFT, 'left'],[Blockly.DLMLY_TURTLE_WRITE_ALIGN_CENTER, 'center'],[Blockly.DLMLY_TURTLE_WRITE_ALIGN_RIGHT, 'right']];    
    var fonttype =
        [[Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE_NORMAL, 'normal'],[Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE_BOLD, 'bold'],[Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE_ITALIC, 'italic'],[Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE_BOLD_ITALIC, 'bold","italic']];
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        .setCheck(String)
        .appendField(Blockly.blockpy_turtle_write);  
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_TURTLE_WRITE_MOVE)
        .appendField(new Blockly.FieldDropdown(move), 'MOVE');
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_TURTLE_WRITE_ALIGN)
        .appendField(new Blockly.FieldDropdown(align), 'ALIGN');
    this.appendValueInput('FONTNAME')
        .setCheck(String)
        .appendField(Blockly.DLMLY_TURTLE_WRITE_FONT_NAME);
    this.appendValueInput('FONTNUM')
        .setCheck(Number)
        .appendField(Blockly.DLMLY_TURTLE_WRITE_FONT_NUM);
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE)
        .appendField(new Blockly.FieldDropdown(fonttype), 'FONTTYPE');                      
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TURTLE_WRITE_TOOLTIP);    
  }
};

Blockly.Blocks['turtle_write_format_skulpt'] = {
 init: function() {
    var move =
        [[Blockly.DLMLY_TURTLE_WRITE_MOVE_FALSE, 'False'],[Blockly.DLMLY_TURTLE_WRITE_MOVE_TRUE, 'True']];
    var align =
        [[Blockly.DLMLY_TURTLE_WRITE_ALIGN_LEFT, 'left'],[Blockly.DLMLY_TURTLE_WRITE_ALIGN_CENTER, 'center'],[Blockly.DLMLY_TURTLE_WRITE_ALIGN_RIGHT, 'right']];    
    var fonttype =
        [[Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE_NORMAL, 'normal'],[Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE_BOLD, 'bold'],[Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE_ITALIC, 'italic']];
    this.appendValueInput('TUR')
        .setCheck('Turtle')
    this.setColour(Blockly.Blocks.turtle.HUE);
    this.appendValueInput('VAR')
        .setCheck(String)
        .appendField(Blockly.blockpy_turtle_write);  
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_TURTLE_WRITE_MOVE)
        .appendField(new Blockly.FieldDropdown(move), 'MOVE');
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_TURTLE_WRITE_ALIGN)
        .appendField(new Blockly.FieldDropdown(align), 'ALIGN');
    this.appendValueInput('FONTNAME')
        .setCheck(String)
        .appendField(Blockly.DLMLY_TURTLE_WRITE_FONT_NAME);
    this.appendValueInput('FONTNUM')
        .setCheck(Number)
        .appendField(Blockly.DLMLY_TURTLE_WRITE_FONT_NUM);
    this.appendDummyInput("")
        .appendField(Blockly.DLMLY_TURTLE_WRITE_FONT_TYPE)
        .appendField(new Blockly.FieldDropdown(fonttype), 'FONTTYPE');                      
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.TURTLE_WRITE_TOOLTIP);    
  }
};
/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Utility blocks for Blockly.
 * @author acbart@vt.edu (Austin Cory Bart)
 */
'use strict';

goog.provide('Blockly.Blocks.utility');

goog.require('Blockly.Blocks');


Blockly.Blocks.utility.HUE = 160;

Blockly.Blocks['raw_table'] = {
  // Container.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField('Tabular Abstraction:');
    this.appendDummyInput()
        .appendField(new Blockly.FieldTable(''), 'TEXT');
  }
};

Blockly.Blocks['raw_block'] = {
  // Container.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendDummyInput()
        .appendField('Code Block:');
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextArea(''), 'TEXT');
  }
};

Blockly.Blocks['raw_expression'] = {
  // Container.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.appendDummyInput()
        .appendField('Code Expression:');
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextArea(''), 'TEXT');
    this.setOutput(true);
  }
};

Blockly.Blocks['raw_empty'] = {
  // Container.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.appendValueInput('VALUE')
        .appendField('');
    this.setInputsInline(false);
  }
};

Blockly.Blocks['text_comment'] = {
  // Text value.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.appendDummyInput()
        .appendTitle('Comment:')
        .appendTitle(new Blockly.FieldTextInput(''), 'TEXT');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('This comment will be ignored by Python');
  }
};

Blockly.Blocks['type_check'] = {
  // Set element at index.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.appendValueInput('VALUE')
        .appendField(Blockly.Msg.TYPE_CHECK);
    this.setInputsInline(false);
    this.setOutput(true, 'Type');
    //this.setPreviousStatement(true);
    //this.setNextStatement(true);
  }
};


Blockly.Blocks['text_print_multiple'] = {
    /**
     * Block for printing multiple things (including nothing)
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(Blockly.Blocks.utility.HUE);
        this.itemCount_ = 1;
        this.updateShape_();
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.Mutator(['text_print_multiple_item']));
        this.setTooltip(Blockly.Msg.TEXT_PRINT_TOOLTIP);
  },
    /**
     * Create XML to represent print inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function(workspace) {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
        var containerBlock = Blockly.Block.obtain(workspace,
                                 'text_print_multiple_container');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.itemCount_; x++) {
          var itemBlock = Blockly.Block.obtain(workspace, 'text_print_multiple_item');
          itemBlock.initSvg();
          connection.connect(itemBlock.previousConnection);
          connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        var i = 0;
        while (itemBlock) {
            connections[i] = itemBlock.valueConnection_;
            itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
            i++;
        }
        this.itemCount_ = i;
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('PRINT' + i).connection.connect(connections[i]);
            }
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
        // Store a pointer to any connected child blocks.
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 0;
        while (itemBlock) {
            var input = this.getInput('PRINT' + x);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            x++;
            itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
        // Delete everything.
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else {
            var i = 0;
            while (this.getInput('PRINT' + i)) {
                this.removeInput('PRINT' + i);
                i++;
            }
        }
    
        // Rebuild block.
        if (this.itemCount_ == 0) {
            this.appendDummyInput('EMPTY')
                .appendField("print");
        } else {
            for (var i = 0; i < this.itemCount_; i++) {
                var input = this.appendValueInput('PRINT' + i);
                if (i == 0) {
                    input.appendField("print");
                }
            }
        }
    }
};

Blockly.Blocks['text_print_multiple_container'] = {
  // Container.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.appendDummyInput()
        .appendField('print');
    this.appendStatementInput('STACK');
    this.setTooltip('');
    this.contextMenu = false;
  }
};
Blockly.Blocks['text_print_multiple_item'] = {
  // Add items.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.appendDummyInput()
        .appendField('item');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.contextMenu = false;
  }
};

Blockly.Blocks['function_call'] = {
    /**
     * Block for printing multiple things (including nothing)
     * @this Blockly.Block
     */
    init: function() {
        this.setColour(Blockly.Blocks.utility.HUE);
        this.itemCount_ = 1;
        this.hasReturn_ = false;
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("str"), 'NAME');
        this.updateShape_();
        this.setMutator(new Blockly.Mutator(['function_call_item']));
        this.setTooltip("Can be used to call any function");
  },
    /**
     * Create XML to represent print inputs.
     * @return {Element} XML storage element.
     * @this Blockly.Block
     */
    mutationToDom: function(workspace) {
        var container = document.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        container.setAttribute('hasReturn', this.hasReturn_ ? "TRUE": "FALSE");
        return container;
    },
    /**
     * Parse XML to restore the list inputs.
     * @param {!Element} xmlElement XML storage element.
     * @this Blockly.Block
     */
    domToMutation: function(xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items'), 10);
        this.hasReturn_ = xmlElement.getAttribute('hasReturn') === "TRUE";
        this.updateShape_();
    },
    /**
     * Populate the mutator's dialog with this block's components.
     * @param {!Blockly.Workspace} workspace Mutator's workspace.
     * @return {!Blockly.Block} Root block in mutator.
     * @this Blockly.Block
     */
    decompose: function(workspace) {
        var containerBlock = Blockly.Block.obtain(workspace,
                                 'function_call_container');
        containerBlock.initSvg();
        
        containerBlock.setFieldValue(this.hasStatements_ ? 'TRUE' : 'FALSE',
                                   'RETURN');
        
        var connection = containerBlock.getInput('STACK').connection;
        for (var x = 0; x < this.itemCount_; x++) {
          var itemBlock = Blockly.Block.obtain(workspace, 'function_call_item');
          itemBlock.initSvg();
          connection.connect(itemBlock.previousConnection);
          connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },
    /**
     * Notification that the procedure's return state has changed.
     * @param {boolean} returnState New return state
     * @this Blockly.Block
     */
    setReturn: function(returnState) {
        this.unplug(true, true);
        this.setOutput(returnState);
        this.setPreviousStatement(!returnState);
        this.setNextStatement(!returnState);
        if (this.rendered) {
            this.render();
        }
    },
    /**
     * Reconfigure this block based on the mutator dialog's components.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    compose: function(containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        // Count number of inputs.
        var connections = [];
        var i = 0;
        while (itemBlock) {
            connections[i] = itemBlock.valueConnection_;
            itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
            i++;
        }
        this.itemCount_ = i;
        
        this.hasReturn_ = containerBlock.getFieldValue("RETURN") === "TRUE";
        
        this.updateShape_();
        // Reconnect any child blocks.
        for (var i = 0; i < this.itemCount_; i++) {
            if (connections[i]) {
                this.getInput('ARGUMENT' + i).connection.connect(connections[i]);
            }
        }
    },
    /**
     * Store pointers to any connected child blocks.
     * @param {!Blockly.Block} containerBlock Root block in mutator.
     * @this Blockly.Block
     */
    saveConnections: function(containerBlock) {
        // Store a pointer to any connected child blocks.
        var itemBlock = containerBlock.getInputTargetBlock('STACK');
        var x = 0;
        while (itemBlock) {
            var input = this.getInput('ARGUMENT' + x);
            itemBlock.valueConnection_ = input && input.connection.targetConnection;
            x++;
            itemBlock = itemBlock.nextConnection &&
                        itemBlock.nextConnection.targetBlock();
        }
    },
    /**
     * Modify this block to have the correct number of inputs.
     * @private
     * @this Blockly.Block
     */
    updateShape_: function() {
        // Delete everything.
        if (this.getInput('EMPTY')) {
            this.removeInput('EMPTY');
        } else {
            var i = 0;
            while (this.getInput('ARGUMENT' + i)) {
                this.removeInput('ARGUMENT' + i);
                i++;
            }
        }
    
        // Rebuild block.
        for (var i = 0; i < this.itemCount_; i++) {
            var input = this.appendValueInput('ARGUMENT' + i);
        }
        
        // Set whether returns anything
        this.setReturn(this.hasReturn_);
    }
};

Blockly.Blocks['function_call_container'] = {
  // Container.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.appendDummyInput()
        .appendField('Arguments');
    this.appendStatementInput('STACK');
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField('has return')
        .appendField(new Blockly.FieldCheckbox('TRUE'),
                     'RETURN');
    this.setTooltip('');
    this.contextMenu = false;
  }
};
Blockly.Blocks['function_call_item'] = {
  // Add items.
  init: function() {
    this.setColour(Blockly.Blocks.utility.HUE);
    this.appendDummyInput()
        .appendField('argument');
    this.setInputsInline(true);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('');
    this.contextMenu = false;
  }
};

Blockly.Blocks['attribute_access'] = {
    init: function() {
        this.appendValueInput("MODULE")
            .setCheck(null);
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField(".");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(230);
        this.setTooltip('');
        this.setHelpUrl('');
    }
};

'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');


Blockly.Blocks.variables.HUE = 330//'#af5180'//330;

// ************************************************************************
// THIS SECTION IS INSERTED INTO BLOCKLY BY BLOCKLYDUINO.
//  Blockly.Blocks['variables_declare'] = {
//  // Variable setter.
//   init: function() {
//     this.setColour(Blockly.Blocks.variables.HUE);
//     this.appendValueInput('VALUE', null)
//         .appendField(Blockly.DLMLY_DECLARE)
//         .appendField(new Blockly.FieldTextInput(''), 'VAR')
//         //.appendField(Blockly.DLMLY_AS)
//         //.appendField(new Blockly.FieldDropdown([[Blockly.DLMLY_MICROBIT_JS_TYPE_NUMBER, 'number'], [Blockly.DLMLY_MICROBIT_JS_TYPE_STRING, 'string'], [Blockly.DLMLY_MICROBIT_JS_TYPE_BOOLEAN, 'boolean']]), 'TYPE')
// 	    .appendField(Blockly.DLMLY_VALUE);
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setTooltip(Blockly.DLMLY_TOOLTIP_VARIABLES_DECLARE);
//   },
//   getVars: function() {
//     return [this.getFieldValue('VAR')];
//   },
//   renameVar: function(oldName, newName) {
//     if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
//       this.setTitleValue(newName, 'VAR');
//     }
//   }
// };
// ************************************************************************

Blockly.Blocks['variables_get'] = {
  init: function() {
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldTextInput(''), 'VAR')
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
  },
  getVars: function() {
    return [this.getFieldValue('VAR')];
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  }/*,
  onchange: function() {
	  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'),Blockly.Variables.NAME_TYPE);
	  if(Blockly.Arduino.definitions_['var_declare'+varName]){
		  this.setWarningText(null);
	  }else{
		  this.setWarningText(Blockly.DLMLY_WARNING_NOT_DECLARE);
	  }
  }*/
};

// Blockly.Blocks['variables_set'] = {
//   init: function() {
//     this.setColour(Blockly.Blocks.variables.HUE);
//     this.appendValueInput('VALUE')
//         .appendField(new Blockly.FieldTextInput(''), 'VAR')
// 		.appendField(Blockly.LANG_VARIABLES_SET_TITLE);
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
//   },
//   getVars: function() {
//     return [this.getFieldValue('VAR')];
//   },
//   renameVar: function(oldName, newName) {
//     if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
//       this.setFieldValue(newName, 'VAR');
//     }
//   }/*,
//   onchange: function() {
// 	  var varName = Blockly.Arduino.variableDB_.getName(this.getFieldValue('VAR'),Blockly.Variables.NAME_TYPE);
// 	  if(Blockly.Arduino.definitions_['var_declare'+varName]){
// 		  this.setWarningText(null);
// 	  }else{
// 		  this.setWarningText(Blockly.DLMLY_WARNING_NOT_DECLARE);
// 	  }
//   }*/
// };
Blockly.Blocks['variables_set'] = {
   init: function() {
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendValueInput('VALUE')
        .appendField(new Blockly.FieldTextInput(''), 'VAR')
		.appendField(Blockly.LANG_VARIABLES_SET_TITLE);
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
  },
  getVars: function() {
    var varValue = this.getFieldValue('VAR');
    if(varValue == null){
      return [];
    }
    return varValue.split(",");
  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
      this.setFieldValue(newName, 'VAR');
    }
  }
};
/**
  * Block for basic data type change.
  * @this Blockly.Block
  */
Blockly.Blocks['variables_change'] = {
    init: function () {
        this.setColour(Blockly.Blocks.variables.HUE);
        var DATATYPES =
         [
          [Blockly.LANG_MATH_INT, "int"],
          [Blockly.LANG_MATH_FLOAT, "float"],
          [Blockly.LANG_MATH_BOOLEAN, "bool"],
          // [Blockly.DLMLY_MICROPYTHON_TYPE_COMPLEX, "complex"],
          [Blockly.LANG_MATH_STRING, "str"],
          [Blockly.DLMLY_MICROBIT_TYPE_LIST, "list"],
          [Blockly.DLMLY_MICROBIT_TYPE_TUPLE, "tuple"],
          [Blockly.DLMLY_MICROBIT_TYPE_DICT,"dict"],
          [Blockly.DLMLY_MICROBIT_TYPE_SETS,"set"]
          ];
        this.appendValueInput('MYVALUE')
            .appendField(new Blockly.FieldDropdown(DATATYPES), 'OP');
        // Assign 'this' to a variable for use in the tooltip closure below.
        this.setOutput(true);
        // this.setInputsInline(true);
       
    }
};


Blockly.Blocks['variables_global'] = {
  init: function() {
    this.setColour(Blockly.Blocks.variables.HUE);
        this.appendValueInput("VAR")
        .appendField(Blockly.DLMLY_PYTHON_GLOBAL)
        .setCheck("var");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setTooltip(Blockly.Msg.TEXT_PRINT_INLINE_TOOLTIP);
  }
};


Blockly.Blocks.controls_type = {
  init: function() {
    this.setColour(Blockly.Blocks.variables.HUE);
    this.appendValueInput("DATA")
        .appendField(Blockly.MICROBIT_PYTHON_TYPE);
    // this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip(Blockly.MICROBIT_PYTHON_TYPE);
  }
};


Blockly.Blocks.controls_typeLists = {
    init: function() {
        this.setColour(Blockly.Blocks.variables.HUE);
        this.appendDummyInput()
            .appendField(Blockly.DLMLY_MICROBIT_PY_CONTORL_GET_TYPE)
            .appendField(new Blockly.FieldDropdown([
              [Blockly.DLMLY_MICROBIT_TYPE_INT, "int"],
              [Blockly.DLMLY_MICROBIT_TYPE_FLOAT, "float"],
              [Blockly.DLMLY_MICROBIT_TYPE_STRING, "str"],
              [Blockly.DLMLY_MICROBIT_TYPE_LIST, "list"],
              [Blockly.DLMLY_MICROBIT_TYPE_TUPLE, "tuple"],
              [Blockly.DLMLY_MICROBIT_TYPE_DICT,"dict"],
              [Blockly.DLMLY_MICROBIT_TYPE_SETS,"set"],
              // [Blockly.DLMLY_MICROBIT_TYPE_IMAGE,"image"],
              [Blockly.DLMLY_MICROBIT_TYPE_NONE,"NoneType"]]), "type");
            //整数、浮点数、字符串、列表、元组、字典、集合、图像不太对, unfinished
        this.setInputsInline(true);
        this.setOutput(true);
        var thisBlock = this;
        this.setTooltip(function() {
        var mode = thisBlock.getFieldValue('type');
        var mode0 = Blockly.MICROBIT_controls_TypeLists;
        var TOOLTIPS = {
        'int': Blockly.DLMLY_MICROBIT_TYPE_INT,
        'float': Blockly.DLMLY_MICROBIT_TYPE_FLOAT,
        'str': Blockly.DLMLY_MICROBIT_TYPE_STRING,
        'list': Blockly.DLMLY_MICROBIT_TYPE_LIST,
        'tuple':Blockly.DLMLY_MICROBIT_TYPE_TUPLE,
        'dict': Blockly.DLMLY_MICROBIT_TYPE_DICT,
        'set': Blockly.DLMLY_MICROBIT_TYPE_SETS,
        'image':Blockly.DLMLY_MICROBIT_TYPE_IMAGE,
        'NoneType': Blockly.DLMLY_MICROBIT_TYPE_NONE
      };
      return mode0 + TOOLTIPS[mode];
    });
    }
};