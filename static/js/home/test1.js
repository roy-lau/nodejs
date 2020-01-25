$(document).ready(function(){
    var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
    socket.on('my response', function(msg) {
        $('#log').append('<p>Received: ' + msg.data + '</p>');
    });
    $('#emit').click(function(event) {
        socket.emit('myevent', {data: $('#emit_data').text()});
        return false;
    });
});