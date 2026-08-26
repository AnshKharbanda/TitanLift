import api from "./api";

function getAuthConfig() {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}


// Get all exercises
export async function getExercises() {
  const response = await api.get(
    "/exercise/",
    getAuthConfig()
  );

  return response.data;
}


// Create exercise
export async function createExercise(data) {
  const response = await api.post(
    "/exercise/",
    data,
    getAuthConfig()
  );

  return response.data;
}


// Delete exercise
export async function deleteExercise(id) {
  const response = await api.delete(
    `/exercise/${id}`,
    getAuthConfig()
  );

  return response.data;
}