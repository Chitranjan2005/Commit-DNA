
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import About from "./pages/About";
import Dashboard from './pages/Dashboard/Dashboard';
import ResultPage from "./pages/result";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/result" element={<ResultPage />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}

      </Routes>
    </BrowserRouter>

  );
}

export default App;