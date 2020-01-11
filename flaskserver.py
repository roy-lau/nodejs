from flask import Flask,request
from flask import render_template
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources=r'/*')
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/recv',methods={"POST","GET"})
def recv():
    code = request.get_data()
    str1 = 'asd'
    return str1

if __name__ =='__main__':
    app.run()