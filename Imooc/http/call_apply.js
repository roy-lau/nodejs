var cat = {
  words: "miao",
  speak: function (say) {
    console.log(say + "" + this.words);
  },
};

cat.speak("Speak");

var dog = {
  words: "wang",
};

cat.speak.call(dog, "Speak"); //.call可以改变this的指向
