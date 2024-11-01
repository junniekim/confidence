import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./homePage/home";
import Navigation from "./navigation/navigation";
function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" Component={HomePage} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
