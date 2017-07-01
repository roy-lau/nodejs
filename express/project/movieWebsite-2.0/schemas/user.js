// user模式
var mongoose = require('mongoose')
var bcrypt = require('bcrypt') // 用来给密码加密
var SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema({
    name: { 		// 用户名
        unique: true,
        type: String
    },
    password: { 	// 密码
        unique: true,
        type: String
    },
    meta: { 		// 更新日期
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
})

// ========保存===========

UserSchema.pre('save', function(next) {
	var user = this;
    // 判断数据是否是新添加的
    if (this.isNew) {
        // 如果是新添加的就将创建的时间和更新的时间设置为当前时间
        this.meta.createAt = this.meta.updateAt = Date.now()
    } else {
        // 如果数据已经有了，就将更新时间设置为当前时间
        this.meta.updateAt = Date.now()
    }
    // 生成随机的盐
    // 加盐级别：SALT_WORK_FACTOR/10
    bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
    	if (err) return next(err)
    	// 哈希---传入三个参数 1.要hash的数据，2.盐，3.回调函数
    	bcrypt.hash(user.password,salt,function(err,hash){
	    	if (err) return next(err)
	    	// 将加盐哈希后的数据保存到user.password中
	    	user.password = hash;
	    	next()
    	})
    });
    next()
})

UserSchema.statics = {
    // fatch: 这个方法用来取出数据库内所有的数据
    // 将数据内的数据按照更新时间排序
    fetch: function(cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    // findById: 查找一条数据
    findById: function(id, cb) {
        return this
            .findOne({ _id: id })
            .exec(cb)
    }
}
module.exports = UserSchema
