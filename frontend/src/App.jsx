import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Dashboard from "./pages/Dashboard";
import Workouts from "./pages/Workouts";
import Exercises from "./pages/Exercises";
import AIAnalysis from "./pages/AIAnalysis";
import AICoach from "./pages/AICoach";
import Progress from "./pages/Progress";
import Settings from "./pages/Settings";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/workouts"
          element={<Workouts />}
        />

        <Route
          path="/exercises"
          element={<Exercises />}
        />

        <Route
          path="/ai-analysis"
          element={<AIAnalysis />}
        />

        <Route
         path="/progress"
         element={<Progress />}
        />

        <Route
           path="/coach"
           element={<AICoach/>}
        />

        <Route
          path="/settings"
          element={<Settings />}
        />

        {/* Keep this LAST */}
        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;