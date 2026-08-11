import cv2

class Camera:
    def __init__(self,camera_id:int =0):
        self.cap=cv2.VideoCapture(camera_id)
        
        if not self.cap.isOpened():
            raise RuntimeError("Could not open Webcam")
        
    def read_frame(self):
        ret,frame=self.cap.read()
        
        if not ret:
            raise RuntimeError("Failed to read frame")
        
        return frame
    
    def release(self):
        self.cap.release()