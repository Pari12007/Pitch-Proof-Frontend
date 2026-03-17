import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import IdeasPage from "./pages/IdeasPage";
import IdeaDetailsPage from "./pages/IdeaDetailsPage";
import CreateIdeaPage from "./pages/CreatedIdeaPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Navbar from "./components/Navbar";
import "./App.css"


const App = () => {
  return (
    <>
    
    <Navbar/>

    <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/ideas/:ideaId" element={<IdeaDetailsPage />} />
        <Route path="/create-idea" element={<CreateIdeaPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </>
  )
}

export default App