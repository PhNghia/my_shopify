import './App.css';
import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./Home"
import About from "./About"

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
