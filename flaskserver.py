from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import sys
from flask_cors import CORS
class redirect:
    def write(self,str1):
        if str1!='\n':
            emit('my response', {'data': str1})
    def flush(self):
        pass
app = Flask(__name__)
CORS(app)
socketio = SocketIO(app,cors_allowed_origins='*')
r = redirect()
sys.stdout = r
    
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