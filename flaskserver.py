from static.interfacepy.flaskIndex import *
from flask import Flask, render_template
from flask_socketio import SocketIO, emit
import sys
import threading
import time
class redirect:
    def write(self,str1):
        emit('my response', {'data': str1})
    def flush(self):
        pass
app = Flask(__name__)
socketio = SocketIO(app)
rp = redirect()
sys.stdout = rp
#主页
@app.route('/')
def index():
    return render_template('index.html')

#代码执行
@socketio.on('myevent', namespace='/test')
def test_message(message):
    try:
        exec(message['data'])
        emit('my response', {'data': 'over'})
    except Exception as r:
        emit('my response', {'data': '错误:'+repr(r)})

#重启
@socketio.on('restart', namespace='/test')
def test_restart(message):
    emit('my response', {'data': '程序正在重启'})
    restart_program()

@socketio.on('exec', namespace='/test')
def test_save(message):
    with open(r'./static/worksplace/'+message['name']+'.xml.a','w') as f:
        f.write(message['data'])

#连接
@socketio.on('connect', namespace='/test')
def test_connect():
    emit('my connect', {'data': '客户端准备就绪\n'})

#连接断开
@socketio.on('disconnect', namespace='/test')
def test_disconnect():
    print('Client disconnected')

if __name__ == '__main__':
    socketio.run(app,debug=True,host='0.0.0.0',port=5000)