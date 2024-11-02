import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { UserProvider } from "./SesssionManager/session.tsx";
createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <App />
  </UserProvider>
);
