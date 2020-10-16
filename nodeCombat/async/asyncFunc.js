function asyncFunc(cb) {
  setTimeout(cb, 200); // 异步(blue)
  //  cb();            // 同步(green)
}
var color = "blue";
asyncFunc(function () {
  console.log("This color is:" + color);
});

color = "green";
