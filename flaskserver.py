from flask import Flask, render_template
from flask_socketio import SocketIO, emit
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins='*')

def print(s):
    emit('my response', {'data': s})
@app.route('/')
def index():
    return render_template('index.html')
@socketio.on('myevent', namespace='/test')
def test_message(message):
    if message['data']=='kill':
        return
    try:
        exec(message['data'])
    except Exception as r:
        print('错误:'+repr(r))

@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my response', {'data': '客户端准备就绪'})

@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app,debug=True,host='0.0.0.0',port=5000)