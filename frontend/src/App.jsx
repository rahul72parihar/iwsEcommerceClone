import "../styles/App.css";

import { Routes, Route } from "react-router-dom";

import Homepage from "../pages/Homepage";
import Cartpage from "../pages/Cartpage";
import CategoryPage from "../pages/CategoryPage";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/cartpage" element={<Cartpage />} />
        <Route path="/men" element={<CategoryPage />} />
        <Route path="/women" element={<CategoryPage />} />
        <Route path="/shoes" element={<CategoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
