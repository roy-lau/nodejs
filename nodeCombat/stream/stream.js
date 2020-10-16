var fs = require("fs");
var stream = fs.createReadStream("./input.txt");
stream.on("data", function (chunk) {
  console.log(chunk);
});
stream.on("end", function () {
  console.log("finished...");
});
