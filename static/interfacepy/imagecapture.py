import os
import cv2

 
def camer():
    path = 'static/out.jpg'
    if(os.path.exists(path)):
        os.remove(path)
    cap = cv2.VideoCapture(0)
    ret, frame = cap.read()
    cv2.imshow('cap', frame)
    flag = cv2.waitKey(1)
    cv2.imwrite("static\out.jpg", frame)
    return '拍照结束'

# def imagcapture(camid=0, filepath='/tmp/pycharm_project_466/trybest/example.jpg'):
#     try:
#         id = camid * 2
#         os.system("fswebcam -d /dev/video" + str(id) + " -q --no-banner -r 640x480 " + filepath)
#         return (filepath)
#     except Exception as e:
#         print('false,拍照失败')


if __name__ == "__main__":
#     print(imagcapture(camid=0))
    camer()
# 
