function divEscapedContentElement(message) {
  return $("<div></div>").text(message);
}
// 显示系统创建的授信内容（类似公告）
function divSystemContentElement(message) {
  return $("<div></div>").html("<i>" + message + "</i>");
}

/*
 * 处理原始用户的输入
 */
function processUserInput(chatApp, socket) {
  var message = $("#end-message").val();
  var systemMessage;

  // 如果用户输入的内容以反斜杠（/）开头，将其作为聊天命令
  if (message.charAt(0) == "/") {
    systemMessage = chatApp.processCommand(message);
    if (systemMessage) {
      $("#message").append(divSystemContentElement(systemMessage));
    }
  } else {
    chatApp.sendMessage($("#room").text(), message); // 将非命令输入广播给其他用户
    $("#message").append(divEscapedContentElement(message));
    $("#message").scrollTop($("#message").prop("scrollHeight"));
  }
  $("#send-message").val(" ");
}

/*
 * 客户端程序初始化逻辑
 */
var socket = io.connect();

$(document).ready(function () {
  var chatApp = new Chat(socket);

  socket.on("nameResult", function (result) {
    var message;

    if (result.success) {
      message = "You are now known as " + result.name + ".";
    } else {
      message = result.message;
    }
    $("#message").append(divSystemContentElement(message));
  });

  // 显示房间变更结果
  socket.on("joinResult", function (result) {
    $("#room").text(result.room);
    $("#message").append(divSystemContentElement("Room changed"));
  });

  // 显示接收到的消息
  socket.on("message", function (message) {
    var newElement = $("<div></div>").text(message.text);
    $("message").append(newElement);
  });

  // 显示可用房间列表
  socket.on("rooms", function (rooms) {
    $("#room-list").empty();

    for (var room in rooms) {
      room = room.substring(1, room.length);
      if (room != "") {
        $("#room-list").append(divEscapedContentElement(room));
      }
    }
    // 点击房间名可以换到哪个房间中
    $("#room-list div").click(function () {
      chatApp.processCommand("/join" + $(this).text());
      $("#send-message").focus();
    });
  });
  // 定期请求可用房间列表房间
  setInterval(function () {
    socket.emit("rooms");
  }, 1000);
  $("#send-message").focus();
  // 提交表单可以发送聊天消息
  $("#send-form").submit(function () {
    processUserInput(chatApp, socket);
    return false;
  });
});
