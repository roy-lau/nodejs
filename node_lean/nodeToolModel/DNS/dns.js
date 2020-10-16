var dns = require("dns");

dns.lookup("www.github.com", function onLookup(err, address, family) {
  console.log("IP 地址:", address);
  dns.reverse(address, function (err, hostnames) {
    if (err) {
      console.error(err.stack);
    }
    console.log("反向解析" + address + ":" + JSON.stringify(hostnames));
  });
});
