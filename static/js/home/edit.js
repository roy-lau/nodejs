function showEditByCode() {
    console.log("demoWorksplace:", demoWorksplace)
    console.log("ace edit:", ace)
    Blockly.Python.addReservedWords('code');


    let editor = ace.edit("dlm_code");
    // editor.setTheme(window.conf.lastEditorTheme);
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/python");
    editor.setFontSize(17);
    editor.setShowPrintMargin(false);
    editor.setReadOnly(true);
    editor.setScrollSpeed(0.05);

    let code = Blockly.Python.workspaceToCode(demoWorksplace) || '';
    let chinese_code = code.replace(/(_[0-9A-F]{2}_[0-9A-F]{2}_[0-9A-F]{2})+/g, function(s) { return decodeURIComponent(s.replace(/_/g, '%')); });
    editor.setValue(chinese_code, -1);
    // $('#aceTheme').val("ace/theme/xcode");
}