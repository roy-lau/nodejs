var express = require("express"),
  app = express(),
  router = require("./routes");

app.use("/api", router);

app.listen(6962, function (err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log("listen at API http://localhost:6962/api");
});
