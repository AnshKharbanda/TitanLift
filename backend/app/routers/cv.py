from fastapi import APIRouter, WebSocket
import cv2
import numpy as np


cv = APIRouter()


@cv.get("/")
def root():
    return {"message": "TitanLift backend running"}


@cv.websocket("/ws/cv")
async def cv_websocket(websocket: WebSocket):

    await websocket.accept()

    print("CV client connected")

    try:

        while True:

            data = await websocket.receive_bytes()

            print(f"Received frame: {len(data)} bytes")

            # JPEG bytes → NumPy array
            image_array = np.frombuffer(
                data,
                dtype=np.uint8
            )

            # NumPy array → OpenCV frame
            frame = cv2.imdecode(
                image_array,
                cv2.IMREAD_COLOR
            )

            if frame is None:
                print("Could not decode frame")
                continue

            print(
                f"Frame received: "
                f"{frame.shape[1]}x{frame.shape[0]}"
            )

            # For now just confirm that the backend
            # successfully received the frame.

            await websocket.send_json({
                "status": "received",
                "width": frame.shape[1],
                "height": frame.shape[0]
            })

    except Exception as e:

        print("WebSocket disconnected:", e)