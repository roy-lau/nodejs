/* util.inherits(constructor, superConstructor)是一个实现对象间原型继承 的函数。

JavaScript 的面向对象特性是基于原型的，与常见的基于类的不同。JavaScript 没有 提供对象继承的语言级别特性，而是通过原型复制来实现的。
*/
var util = require('util');

function Base(){
	this.name = 'base';
	this.base = 1994;
	this.sayHello = function(){
	console.log('hello' , this.name);
	};
}

Base.prototype.showName = function(){
	console.log(this.name);
	};

function Sub(){
	this.name = 'sub';
	}


  util.inherits(Sub, Base);
  var objBase = new Base();
  objBase.showName();
  objBase.sayHello();
  console.log(objBase);

  var objSub = new Sub();
  objSub.showName();
  // objSub.sayHello();
  console.log(objSub);

