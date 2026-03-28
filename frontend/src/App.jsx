
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home';

import Dashboard from './pages/Dashboard/Dashboard';
import ResultPage from "./pages/result";





function App() {
  return (
    <BrowserRouter>
      <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/result" element={<ResultPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;