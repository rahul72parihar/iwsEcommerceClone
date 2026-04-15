import "../styles/App.css";

import { Routes, Route } from "react-router-dom";

import Homepage from "../pages/Homepage";
import Cartpage from "../pages/Cartpage";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/cartpage" element={<Cartpage />} />
      </Routes>
    </div>
  );
}

export default App;
