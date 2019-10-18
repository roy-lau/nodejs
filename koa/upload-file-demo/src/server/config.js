module.exports = {
	// 主机地址
	get host(){
		return process.env.HOST || 'localhost'
	},
	// 端口地址
	get port(){
		return process.env.PORT || '3008'
	},
	// 文件上传存放的位置
	get uploadHost(){
		return `http://${this.host}:${this.port}/uploads/`
	}
}