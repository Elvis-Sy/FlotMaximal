import CreativeFlow from "./pages/CreativeFlow";
import AssistedFlow from "./pages/AssistedFlow";
import LandingPage from "./pages/LandingPage";
import { Routes, Route } from "react-router-dom";

function App() {

  return (
    
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/creative" element={<CreativeFlow />} />
      <Route path="/assisted" element={<AssistedFlow />} />
    </Routes>
    
  );
} 

export default App;