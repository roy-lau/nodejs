from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from static.interfacepy.voiceChoose import *
app = Flask(__name__)
socketio = SocketIO(app)
def print(s):
    emit('my response', {'data': s})
@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('myevent', namespace='/test')
def test_message(message):
    exec(message['data'])
@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': 'Connected'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app,debug=True,host='0.0.0.0',port=5000)