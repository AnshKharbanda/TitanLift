import api from "./api";


export async function getExerciseProgress(
  exerciseId
) {
  const response = await api.get(
    `/progress/exercise/${exerciseId}`
  );

  return response.data;
}