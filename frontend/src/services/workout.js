import api from "./api";

function getAuthConfig() {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export async function getWorkouts() {
  const response = await api.get(
    "/workout/",
    getAuthConfig()
  );

  return response.data;
}

export async function getWorkout(id) {
  const response = await api.get(
    `/workout/${id}`,
    getAuthConfig()
  );

  return response.data;
}

export async function createWorkout(data) {
  const response = await api.post(
    "/workout/",
    data,
    getAuthConfig()
  );

  return response.data;
}

export async function updateWorkout(id, data) {
  const response = await api.patch(
    `/workout/${id}`,
    data,
    getAuthConfig()
  );

  return response.data;
}

export async function deleteWorkout(id) {
  const response = await api.delete(
    `/workout/${id}`,
    getAuthConfig()
  );

  return response.data;
}

export async function getWorkoutExercises(
  workoutId
) {
  const response = await api.get(
    `/workout/exercise/${workoutId}`,
    getAuthConfig()
  );

  return response.data;
}

export async function addExerciseToWorkout(
  workoutId,
  data
) {
  const response = await api.post(
    `/workout/exercise/${workoutId}`,
    data,
    getAuthConfig()
  );

  return response.data;
}

export async function deleteExerciseFromWorkout(
  workoutId,
  exerciseId
) {
  const response = await api.delete(
    `/workout/exercise/${workoutId}/${exerciseId}`,
    getAuthConfig()
  );

  return response.data;
}

export async function getExercises() {
  const response = await api.get(
    "/exercise/",
    getAuthConfig()
  );

  return response.data;
}

export async function updateExerciseInWorkout(
  workoutId,
  exerciseId,
  data
) {
  const response = await api.patch(
    `/workout/exercise/${workoutId}/${exerciseId}`,
    data,
    getAuthConfig()
  );

  return response.data;
}
