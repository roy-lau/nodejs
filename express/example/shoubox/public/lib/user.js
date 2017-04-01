var redis = require('redis'),
    bcrypt = require('bcrypt'),
    db = redis.createClient();

module.exports = User;

function User(obj) {
    for (var k in obj) {
        this[k] = obj[k];
    }
}
User.prototype.save = function(fn) {
    if (this.id) { 		// 用户已存在
        this.updata(fn)
    } else {
        var user = this;
        db.incr('user:ids', function(err, id) { 		// 创建唯一ID
            if (err) return fn(err);
            user.id = id; 		// 设定ID,以便保存
            user.hashPassword(function(err) { 		// 密码哈希
                if (err) return fn(err);
                user.update(fn); 		// 保存用户属性
            })
        })
    }
}
User.prototype.updata = function(fn) {
    var user = this;
    var id = user.id;
    db.set('user:id' + user.name, id, function(err) { 		// 用名称索引用户ID
        if (err) return fn(err);
        db.hmset('user:' + id, user, function(err) { 		// 用Radis哈希存储数据
            fn(err);
        })
    })
}
User.prototype.hashPassword = function(fn) {
    var user = this;
    bcrypt.genSalt(12, function(err, salt) { 		// 生成有12个字符的盐
        if (err) return fn(err);
        user.salt = salt; 		// 设定加盐以便保存
        bcrypt.hash(user.pass, salt, function(err, hash) { 		// 生成哈希
            if (err) return fn(err);
            user.pass = hash; 		// 设定哈希以便保存
            fn();
        })
    })
}

		// 创建用户
var tobi = new User({
    name: 'Tobi',
    pass: 'im a ferret',
    age: '2'
});

		// 保存用户
tobi.save(function(err) {
    if (err) return console.error(err);
    console.log('user id %d', tobi.id)
})

User.getByName = function(name, fn) {
    User.getId(name, function(err, id) { 		// 根据名称查找用户ID
        if (err) return fn(err);
        User.get(id, fn) 		// 用ID抓取用户
    })
}

User.getId = function(name, fn) {
    db.get('user:id' + name, fn); 		// 取得由名称索引的ID
}

User.get = function(id, fn) {
    db.hgetall('user:' + id, function(err, user) { 		// 获取普通对象哈希
        if (err) return fn(err);
        fn(null, new User(user)) 		// 将普通对象转化为新的User对象
    })
}

/*
 *用户名和密码认证
 */
User.authenticate = function(name, pass, fn) {
    User.getByName(name, function(err, user) { 		// 通过名称查找用户
        if (err) return fn(err);
        if (!user.id) return fn(); 		// 用户不存在
        bcrypt.hash(pass, user.salt, function(err, hash) { 		// 对给出的密码做哈希处理
            if (err) return fn(err);
            if (hash == user.pass) return fn(null, user); 		// 匹配发现项
            fn();
        })
    })
}
