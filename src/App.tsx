import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./homePage/home";
import AuthenticatePage from "./authenticatePage/authenticatePage";
import Navigation from "./navigation/navigation";
import ProfilePage from "./profilePage/profilePage";
import WorkoutListPage from "./workoutListPage/workoutListPage";
import Footer from "./footer/footer";
import WorkoutLogPage from "./workoutLogPage/workoutLogPage";
import ProgressPage from "./progressPage/progressPage";
import ProtectedRoute from "./Shared/titleHeader/protectedRoutes";
import { useUser } from "./SesssionManager/session";
function App() {
  const { user } = useUser();
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/authenticate" element={<AuthenticatePage />} />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={!!user?.id}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/workout"
            element={
              <ProtectedRoute isAuthenticated={!!user?.id}>
                <WorkoutListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/log"
            element={
              <ProtectedRoute isAuthenticated={!!user?.id}>
                <WorkoutLogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute isAuthenticated={!!user?.id}>
                <ProgressPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
