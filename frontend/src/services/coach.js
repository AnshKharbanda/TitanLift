import api from "./api";

export async function sendCoachMessage(message) {
  const response = await api.post("/coach/chat", {
    message,
  });

  return response.data;
}