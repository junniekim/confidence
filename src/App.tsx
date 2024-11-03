import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./homePage/home";
import AuthenticatePage from "./authenticatePage/authenticatePage";
import Navigation from "./navigation/navigation";
import ProfilePage from "./profilePage/profilePage";
import WorkoutListPage from "./workoutListPage/workoutListPage";
function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" Component={HomePage} />
          <Route path="/authenticate" Component={AuthenticatePage} />
          <Route path="/profile" Component={ProfilePage} />
          <Route path="/workout" Component={WorkoutListPage} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
