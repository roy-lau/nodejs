var socketio = require('socket.io');

var io;
var guestNumber = 1;
var nickNaems = {};
var namesUsed = [];
var currentRoom = {};

/*
 * 这部分主要定义了用户链接处理逻辑
 */
exports.listen = function(server){
	// 启动Socket.IO服务器允许他搭载在已有的HTTP服务器上
	io = socketio.listen(server);		
	io.set('log level', 1);
	// 定义每个用户链接的处理逻辑
	io.sockets.on('connection', function(socket){	
		guestNumber = assignGuestName(socket, guestNumber, nickNaems, namesUsed)	// 在连接上来是赋予其一个访客名
		// 在用户链接上来时，把用户放入聊天室Lobby里
		jionRoom(socket, 'Lobby');		
		// 处理用户的消息，更名，以及聊天室的创建和变更
		handleMessageBroadcadcasting(socket, nickNaems);
		handleNameChangeAttempts(socket,nickNaems,namesUsed);
		handleRoomJoining(socket);
		// 用户发出请求是，向其提供已被占用的聊天室的列表
		socket.on('rooms',function(){
			socket.emit('rooms', io.sockets.manager.rooms);
		});
		// 定义用户断开连接后的清除逻辑
		handleClientDisconnection(socket,nickNaems,namesUsed)
	});
};

/*
 * 这部分主要用于处理程序场景及事件
 */

 //- 1.分配用户昵称(assignGuestName)
 function assignGuestName(socket, guestNumber, nickNaems, namesUsed){
 	// 生成新的昵称
 	var name = 'Guest' + guestNumber;
 	// 把用户昵称跟客户端链接ID关联上
 	nickNaems[socket.id] = name;
 	// 让用户知道他们的昵称
 	socket.emit('nameResult', {
 		success: true,
 		name: name
 	});
 	// 存放已被占用的昵称
 	namesUsed.push(name);
 	// 增加用来生成昵称的计数器
 	return guestNumber + 1;
 }

 //- 2.进入聊天室(joinRoom)
 function joinRoom(socket, room){
 	// 让用户进入房间
 	socket.jion(room);
 	// 记录用户的当前房间
 	currentRoom[socket.id] = room;
 	// 让用户知道他们进入新的房间
 	socket.emit('joinResult', {room: room});
 	// 让房间里的新用户知道有用户进入了房间
 	socket.broadcast.to(room).emit('emit',{
 		text: nickNaems[socket.id] + ' has joined ' + room + '！'
 	});

 	// 确定都有哪些用户在这个房间
 	var usersInRoom = io.sockets.clients(room);
 	// 如果进入房间的用户不止一个，汇总下都是谁
 	if (usersInRoom.length > 1) {
 		var usersInRoomSummary = 'Users currently in ' + room + ':';
 		for(var index in usersInRoom){
 			var userSocketId = usersInRoom[index].id;
 			if (userSocketId != socket.id) {
 				if (index > 0) {
 					usersInRoomSummary += ',';
 				}
 				usersInRoomSummary += nickNaems[userSocketId];
 			}
 		}
 		// 将房间用户的汇总发送给这个用户
 		usersInRoomSummary += '.';
 		socket.emit('message', {text: usersInRoomSummary});
 	}
 }

//- 3.处理昵称变更请求
 function handleNmaeChangeAttempts(socket, nickNaems, namesUsed){
 	// 添加nameAttempt事件的监听器
 	socket.on('nameAttempt', function(name){
 		//  昵称不能以Guest开头
 		if (name.indexOf('Guest') == 0) {
 			socket.emit('nameResult',{
 				success: false,
 				message: '您的名字不能以"Guest"开头.'
 			});
 		}else{
 			if (namesUsed.indexOf(name) == -1) {
 				// 如果昵称还没注册就注册上
 				var previousName = nickNaems[socket.id];
 				var previousNameIndex = namesUsed.indexOf(previousName);
 				namesUsed.push(name);
 				nickNaems[socket.id] = name;
 				// 删除掉之前用的昵称，让其他用户可以使用
 				delete namesUsed[previousNameIndex];
 			socket.emit('nameResult', {
 				success: true,
 				name: name
 			});
 			socket.broadcast.to(currentRoom[socket.id]).emit('message', {
 				text: previousName + 'is now known as ' + name + '.'
 			});
 			}else{
 				// 如果名字已经被占用，给客户端发送错诶消息！
 				socket.emit('nameResult', {
 					success: false,
 					message: '这个用户名已经被占用！'
 				});
 			}
 		}
 	});
 }

//- 4.发送聊天消息(handleMessageBrodcasting)
 function handleMessageBrodcasting(socket){
 	socket.on('message', function(message){
 		socket.broadcast.to(message.room).emit('message',{
 			text:nickNaems[socket.id] + ':' + message.text
 		});
 	});
 }

//- 5.创建房间
 function handleRoomJoining(socket){
 	socket.on('join', function (room) {
 		socket.level(currentRoom[socket.id]);
 		joinRoom(socket, room.newRoom);
 	});
 }

//- 6.用户断开连接
 function handleClienDisconnection(socket){
 	socket.on('disconnect', function(){
 		var nameIndex = namesUsed.indexOf(nickNaems[socket.id]);
 		delete namesUsed[nameIndex];
 		delete nickNaems[socket.id];
 	});
 }
