import api from "./api";

function getAuthConfig() {
  const token = localStorage.getItem("access_token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}


// Dashboard statistics
export async function getDashboardStats() {
  const response = await api.get(
    "/u/stats",
    getAuthConfig()
  );

  return response.data;
}


// Dashboard summary
export async function getDashboardSummary() {
  const response = await api.get(
    "/u/",
    getAuthConfig()
  );

  return response.data;
}


// Current workout streak
export async function getWorkoutStreak() {
  const response = await api.get(
    "/u/streak",
    getAuthConfig()
  );

  return response.data;
}


// Longest workout streak
export async function getLongestStreak() {
  const response = await api.get(
    "/u/longest-streak",
    getAuthConfig()
  );

  return response.data;
}


// Weight progress
export async function getWeightProgress() {
  const response = await api.get(
    "/u/weight-progress",
    getAuthConfig()
  );

  return response.data;
}


// Muscle distribution
export async function getMuscleDistribution() {
  const response = await api.get(
    "/u/muscle-distribution",
    getAuthConfig()
  );

  return response.data;
}