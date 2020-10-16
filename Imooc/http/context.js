// This上下文
//
var Dog = {
  words: "wangwang……",
  speak: function () {
    console.log(this.words);
    console.log(Dog === this);
  },
};
Dog.speak();

function Cat(words) {
  this.words = words;

  console.log(this.words);
  console.log(Cat === this); // 这里的this指向全局
  console.log(this === global);
}
Cat("miaomiao……");

function Pet(words) {
  this.words = words;
  this.speak = function () {
    console.log(this.words);
    console.log(this);
  };
}
var minCat = new Pet("Miao……");
minCat.speak();
