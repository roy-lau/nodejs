from aip import AipSpeech
APP_ID = '17694352'
API_KEY = 'ILpfxARSZCwBmoGyY5ciKMgp'
SECRET_KEY = 'z0fN2HeHlPcTaZg560rFU9vdZY6lSjY3'
def texttovoice(voiceString='我是迪乐姆',vocieChoose=3,filepath='output.mp3'):
    client = AipSpeech(APP_ID, API_KEY, SECRET_KEY)
    result  = client.synthesis(voiceString, 'zh', 1, {'vol': 15,'per':vocieChoose})
    if not isinstance(result, dict):
        with open(filepath, 'wb') as f:
            f.write(result)
    #time.sleep(0.5)
if __name__ == "__main__":
    voiceSring='hello Darling!,I want some drink,could you give me some,and I wants a piece of cake,thanks very much,'
    voiceChoose = 4
    filepath='output.mp3'
    texttovoice(voiceSring,voiceChoose,filepath)