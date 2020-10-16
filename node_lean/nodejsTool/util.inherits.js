/* util.inherits(constructor, superConstructor)��һ��ʵ�ֶ����ԭ�ͼ̳� �ĺ�����

JavaScript ��������������ǻ���ԭ�͵ģ��볣���Ļ�����Ĳ�ͬ��JavaScript û�� �ṩ����̳е����Լ������ԣ�����ͨ��ԭ�͸�����ʵ�ֵġ�
*/
var util = require("util");

function Base() {
  this.name = "base";
  this.base = 1994;
  this.sayHello = function () {
    console.log("hello", this.name);
  };
}

Base.prototype.showName = function () {
  console.log(this.name);
};

function Sub() {
  this.name = "sub";
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
