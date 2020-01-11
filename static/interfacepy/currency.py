from aip import AipImageClassify

""" 你的 APPID AK SK """
APP_ID = '17812097'
API_KEY = 'jaQAc7nFlzyWyGs4gWWN7PrY'
SECRET_KEY = 'QobjmyAN8doXeI9ybnqyEcAZX1dToC38'

#client = AipImageClassify(APP_ID, API_KEY, SECRET_KEY)

def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()

""" 调用通用物体识别 """


""" 如果有可选参数 """
optionsde = {}
optionsde["baike_num"] = 0

""" 带参数调用通用物体识别 """

def commonReg(app_id=APP_ID,api_key=API_KEY, secret_key=SECRET_KEY,filepath='example.jpg',options = optionsde,APIselect='advancedGeneral'):
    client = AipImageClassify(app_id,api_key, secret_key)
    image = get_file_content(filepath)
    #exp='client.'+ APIselect+'(image)'
    #client.advancedGeneral(image)
    exp = 'client.' + APIselect + '(image, options)'
    #return client.advancedGeneral(image, options)
    return eval(exp)



if __name__=='__main__':
    print(commonReg(filepath='/tmp/pycharm_project_466/trybest/example.jpg',APIselect='currency'))