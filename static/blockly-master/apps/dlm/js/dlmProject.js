var DlmpyProject = function(){
	this.initProject();		
}

DlmpyProject.prototype.initProject = function(){
	this.fileD = {};
	this.MAINF = 'main.py'
	this.fileD[this.MAINF] = ["", true, 1];
	this.selectFile = this.MAINF;
} 

DlmpyProject.prototype.add = function(file, filecontent, filetype){
	if(this.exist(file)){
		console.log("Warning:file already in project");
		return ;
	}
	this.fileD[file] = [filecontent, false, filetype];
}

DlmpyProject.prototype.delete = function(file){
	delete this.fileD[file];
	this.selectFile = undefined;
}
DlmpyProject.prototype.getProject = function(){
	return  Object.keys(this.fileD);
}

DlmpyProject.prototype.getUploadFileList = function(){
	var fileNameList = Object.keys(this.fileD);
	var ret = [];
	for(var i in fileNameList){
		if(this.fileD[fileNameList[i]][2] === 2)
			ret.push(fileNameList[i]);
	}
	return ret;
}

DlmpyProject.prototype.getNewFileList= function(){
	var fileNameList = Object.keys(this.fileD);
	var ret = [];
	for(var i in fileNameList){
		if(this.fileD[fileNameList[i]][2] === 1)
			ret.push(fileNameList[i]);
	}
	return ret;

}

DlmpyProject.prototype.isSelect = function(f){
	return this.fileD[f][1];
}

DlmpyProject.prototype.select = function(f){
	if(this.selectFile !== undefined){
		this.modify(this.selectFile, dlmjs.getCodeContent());
		this.fileD[this.selectFile][1] = false;	
	}
	this.fileD[f][1] = true;
	this.selectFile = f;
	var suffix = dlmjs.getFileSuffix(f);
	var textFileSuffix = ["py", "txt", "csv", "xml"];
	if(textFileSuffix.indexOf(suffix) !== -1){
		tabClick('arduino');
		dlmjs.renderIno(this.fileD[f][0]);
	}else{
		var base64str = 'data:image/' + suffix + ';base64,' + this.fileD[f][0];
		$('#dlm_show_image').attr('src', base64str);
		dlmjs.renderIno(this.fileD[f][0]);
		tabClick('image');

		var $imageA = $('#dlm_link_image'); 
		$imageA.attr('href', base64str);
		$imageA.attr('download', f);
	}
}

DlmpyProject.prototype.getFileNum = function(f){
	var files = Object.keys(this.fileD);
	return files.length;
}
DlmpyProject.prototype.getFileContent = function(f){
	return this.fileD[f][0];
}
DlmpyProject.prototype.getFileType= function(f){
	return this.fileD[f][2];
}
DlmpyProject.prototype.modify = function(f, content){
	this.fileD[f][0] = content;
}

DlmpyProject.prototype.exist = function(f){
	return f in this.fileD;
}
