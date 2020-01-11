from aip import AipSpeech
import time
import pyaudio
import wave
import os
import sys
from pixel_ring import pixel_ring
from gpiozero import LED

os.close(sys.stderr.fileno())

CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000
RECORD_SECONDS = 5

WAVE_OUTPUT_FILENAME = "src.wav"
APP_ID = '17694352'
API_KEY = 'ILpfxARSZCwBmoGyY5ciKMgp'
SECRET_KEY = 'z0fN2HeHlPcTaZg560rFU9vdZY6lSjY3'


def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()


def switch_lan(lan):
    if lan == 'en':
        return 1737
    elif lan == 'mandarin':
        return 1537
    elif lan == 'cantonese':
        return 1637
    elif lan == 'sichuan':
        return 1837
    else:
        return 1536


# 褰曢煶
def recordVoice(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK,
                path=WAVE_OUTPUT_FILENAME):
    #os.close(sys.stderr.fileno())
    p = pyaudio.PyAudio()
    stream = p.open(format=format, channels=channels, rate=rate, input=input, frames_per_buffer=frames_per_buffer)
    frames = []
    print("recording...")
    power = LED(5)

    power.on()

    pixel_ring.set_brightness(100)
    pixel_ring.set_color(rgb=None, r=0, g=255, b=0)

    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)
    print("rec-done")
    pixel_ring.off()
    power.off()
    stream.stop_stream()
    stream.close()
    p.terminate()
    wf = wave.open(path, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
    return path


def voiceTotext(appId=APP_ID, apiKey=API_KEY, secretKey=SECRET_KEY, lan='ch', path=WAVE_OUTPUT_FILENAME):
    client = AipSpeech(appId, apiKey, secretKey)
    lan_id = switch_lan(lan)
    start_time = time.time()
    try:
        ret = client.asr(get_file_content(path), 'pcm', 16000, {'dev_pid': lan_id,

                                                                })