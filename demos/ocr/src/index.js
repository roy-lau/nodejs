// http://ai.baidu.com/docs#/OCR-API/top
var client = require("./AipSpeechClient.js");
var fs = require("fs");

/*
	title： 识别图片上的文本
 */

var image = fs.readFileSync("assets/images/example.jpg").toString("base64");

// 调用通用文字识别, 图片参数为本地图片
client
  .generalBasic(image)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

// 如果有可选参数
var options = {};
options["language_type"] = "CHN_ENG";
options["detect_direction"] = "true";
options["detect_language"] = "true";
options["probability"] = "true";

// 带参数调用通用文字识别, 图片参数为本地图片
client
  .generalBasic(image, options)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

var imageUrl = "https//www.x.com/sample.jpg";

// 调用通用文字识别, 图片参数为远程url图片
client
  .generalBasicUrl(imageUrl)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

// 带参数调用通用文字识别, 图片参数为远程url图片
client
  .generalBasicUrl(imageUrl, options)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

/*
	身份证识别
	http://ai.baidu.com/docs#/OCR-Node-SDK/139e29cb
 */

var idCardImg = fs.readFileSync("assets/images/example.jpg").toString("base64");
var idCardSide = "back";

// 调用身份证识别
client
  .idcard(idCardImg, idCardSide)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

// 如果有可选参数
var idCardOpt = {};
idCardOpt["detect_direction"] = "true";
idCardOpt["detect_risk"] = "false";

// 带参数调用身份证识别
client
  .idcard(idCardImg, idCardSide, idCardOpt)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

/*
	银行卡识别
 */

var bankCardImg = fs.readFileSync("assets/example.jpg").toString("base64");

// 调用银行卡识别
client
  .bankcard(bankCardImg)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

/*
	驾驶证识别

 */
var drivingLicenseImg = fs
  .readFileSync("assets/example.jpg")
  .toString("base64");

// 调用驾驶证识别
client
  .drivingLicense(drivingLicenseImg)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

/*
	行驶证识别

 */

var vehicleLicenseImg = fs
  .readFileSync("assets/example.jpg")
  .toString("base64");

// 调用行驶证识别
client
  .vehicleLicense(vehicleLicenseImg)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

/* 如果有可选参数
	detect_direction	否	string	true
false
false	是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:
- true：检测朝向；
- false：不检测朝向。
accuracy	否	string	normal - 使用快速服务
normal 使用快速服务，1200ms左右时延；缺省或其它值使用高精度服务，1600ms左右时延

*/
var vehicleLicenseOpt = {};
vehicleLicenseOpt["detect_direction"] = "true";
vehicleLicenseOpt["accuracy"] = "normal";

// 带参数调用行驶证识别
client
  .vehicleLicense(vehicleLicenseImg, vehicleLicenseOpt)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

/*
	如果有可选参数

	是否检测图像朝向，默认不检测，即：false。朝向是指输入图像是正常方向、逆时针旋转90/180/270度。可选值包括:
	- true：检测朝向；
	- false：不检测朝向。
*/
var options = {};
options["detect_direction"] = "true";

// 带参数调用驾驶证识别
client
  .drivingLicense(drivingLicenseImg, options)
  .then(function (result) {
    console.log(JSON.stringify(result));
  })
  .catch(function (err) {
    // 如果发生网络错误
    console.log(err);
  });

/*
	title： 语音识别
	function: recognize
	params: {
		voiceBuffer: 建立包含语音内容的Buffer对象, 语音文件的格式，pcm 或者 wav 或者 amr。不区分大小写,
		format: 语音文件的格式，pcm 或者 wav 或者 amr。不区分大小写。推荐pcm文件,
		rate:采样率，16000，固定值,
		{ dev_pid： 默认1537（普通话 输入法模型），
		  cuid: 	用户唯一标识，用来区分用户，填写机器 MAC 地址或 IMEI 码，长度为60以内,
		  ptc: 1
		  }
	}
 */

let voice = fs.readFileSync("assets/voice/16k_test.pcm");

let voiceBuffer = new Buffer(voice);

// 识别本地文件（http://ai.baidu.com/docs#/ASR-Online-Node-SDK/top）
client.recognize(voiceBuffer, "pcm", 16000).then(
  function (result) {
    console.log("<recognize>: " + JSON.stringify(result));
  },
  function (err) {
    console.log(err);
  }
);

// 识别本地文件，附带参数
client
  .recognize(voiceBuffer, "pcm", 16000, {
    dev_pid: "1536",
    cuid: Math.random(),
  })
  .then(
    function (result) {
      console.log("<recognize>: " + JSON.stringify(result));
    },
    function (err) {
      console.log(err);
    }
  );
