const WS_BASE_URL = "ws://127.0.0.1:8000/cv/ws";


export function createCVSocket() {
  const token =
    localStorage.getItem("access_token");

  if (!token) {
    throw new Error(
      "You must be logged in to use AI Analysis."
    );
  }

  const url =
    `${WS_BASE_URL}?token=${encodeURIComponent(
      token
    )}`;

  return new WebSocket(url);
}


export function startCVSession(
  socket,
  exercise,
  side
) {
  if (
    !socket ||
    socket.readyState !== WebSocket.OPEN
  ) {
    throw new Error(
      "CV WebSocket is not connected."
    );
  }

  socket.send(
    JSON.stringify({
      type: "start",
      exercise,
      side,
    })
  );
}


export function sendCVFrame(
  socket,
  frame
) {
  if (
    !socket ||
    socket.readyState !== WebSocket.OPEN
  ) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "frame",
      frame,
    })
  );

  return true;
}


export function stopCVSession(socket) {
  if (
    !socket ||
    socket.readyState !== WebSocket.OPEN
  ) {
    return false;
  }

  socket.send(
    JSON.stringify({
      type: "stop",
    })
  );

  return true;
}


export function closeCVSocket(socket) {
  if (!socket) {
    return;
  }

  if (
    socket.readyState === WebSocket.OPEN ||
    socket.readyState === WebSocket.CONNECTING
  ) {
    socket.close();
  }
}