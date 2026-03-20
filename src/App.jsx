import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import IdeasPage from "./pages/IdeasPage";
import IdeaDetailsPage from "./pages/IdeaDetailsPage";
import CreateIdeaPage from "./pages/CreatedIdeaPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AIValidatorPage from "./pages/AiPage";

import "./App.css"
import { useState } from "react";


const App = () => {
    const [isSidebarOpen, setIsSidebarOpen ] = useState(false);

  return (
    <>
    
    <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)}/>

      <Sidebar 
      isOpen={isSidebarOpen}
      onClose={() => setIsSidebarOpen(false)}
      />

    <div></div>

    <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/ideas/:ideaId" element={<IdeaDetailsPage />} />
        <Route path="/create-idea" element={<CreateIdeaPage />} />
        <Route path="/ai-validator" element={<AIValidatorPage />}/>
      </Routes>
    </>
  )
}

export default App