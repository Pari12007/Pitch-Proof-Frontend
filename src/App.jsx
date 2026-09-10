import { BrowserRouter, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import IdeasPage from "./pages/IdeasPage";
import IdeaDetailsPage from "./pages/IdeaDetailsPage";
import CreateIdeaPage from "./pages/CreatedIdeaPage";
import MyIdeasPage from "./pages/MyIdeasPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import EditIdeaPage from "./pages/EditIdeaPage";
import PricingPage from "./pages/PricingPage";
import PaymentSuccessPage from "./pages/PaymentSuccessPage";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AIValidatorPage from "./pages/AiPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { useState } from "react";

// REMOVE ALL CATEGORY SECENE FROM THE IDEAS SHOWN BY CATEGORIES WHICH IS IN THE NAVBAR ONLY SHOW THE CHOOSEN CATEGORY IDEA

// AFTER SIGN-UP/LOGIN DONT SHOW THE HOME PAGE INSTEAD OF CREATE ANOTHR DASHBOARD/HOMEPAGE FOR USERS

// AFTER SUCCESSFUL PAYMENT IT LOGS OUT THE USER AND REDIRECTS TO THE REAL NETLIFYAPP NOT THE LOCALHOST AND NETLIFY DOES NOT RECOGNIZES THE LOCAL HOST ACCOUNT SO IT FAILS TO LOGIN 

// I GUESS THE PAYMENT IS ALSO NOT WORKING PROPERLY GOTTA CHECK THAT TO

// AI VALIDATION IS NOT WORKING, IT IS EXPIRED THE SECRET KEY


const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div></div>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={<HomePage />} />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/ideas/:ideaId" element={<IdeaDetailsPage />} />

        <Route
          path="/create-idea"
          element={
            <ProtectedRoute>
              <CreateIdeaPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-validator"
          element={
            <ProtectedRoute>
              <AIValidatorPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-ideas"
          element={
            <ProtectedRoute>
              <MyIdeasPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ideas/:ideaId/edit"
          element={
            <ProtectedRoute>
              <EditIdeaPage />
            </ProtectedRoute>
          }
        />

        <Route path="pricing" element={<PricingPage />} />

        <Route path="/payment-success" element={<PaymentSuccessPage />} />
      </Routes>
    </>
  );
};

export default App;
