import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./login";
import Dashboard from "./Dashboard";

const code = new URLSearchParams(window.location.search).get("code");

//when login pressed, code will appear in window, does it constantly check??? if so where
function App() {
  return code ? <Dashboard code={code} /> : <Login />;
}

export default App;
