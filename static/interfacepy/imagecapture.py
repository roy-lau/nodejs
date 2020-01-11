import os


def imagcapture(camid=0, filepath='/tmp/pycharm_project_466/trybest/example.jpg'):
    try:
        id = camid * 2
        os.system("fswebcam -d /dev/video" + str(id) + " -q --no-banner -r 640x480 " + filepath)
        return (filepath)
    except Exception as e:
        print('false,拍照失败')


if __name__ == "__main__":
    print(imagcapture(camid=0))