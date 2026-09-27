import {Navigate, Routes, Route } from "react-router-dom";

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
import WorkSpacesPage from "./pages/WorkSpacesPage";
import CreateWorkspacePage from "./pages/CreateWorkspacePage";
import WorkspaceDetailsPage from "./pages/WorkspaceDetailsPage";
import EditWorkspacePage from "./pages/EditWorkspacePage";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AIValidatorPage from "./pages/AiPage";
import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";


// ADD THE USER HOMEPAGE, WHEN LOGGED IN USER SHOULD REDIRECT THEIR AND THE PATHWAY TO MAIN HOMEPAGE SHOULD BE DENIED.STYLE IT
// WE NEED PLACEHOLDERS IN THE FORMS

// STYLE THE WORKSPACEDETAIL PAGE HOW YOU IMAGINED 
// STYLE PROFILE PAGE, ORDER: PROFILE DETAILS, USER IDEAS, USER BUSINESSES, LOGOUT AND DELETE ACC BUTTONS ETC....
// SIDEBAR ORDER: HOME, IDEAS, POST YOUR IDEA, MY IDEAS, CREATE BUSINESS, MY BUSINESSES, AI VALIDATOR.
// NAVBAR ORDER: IDEA, CATEGORIES, POST YOUR IDEA, MY BUSINESS
// SOLVE WORKSPACES CHAT ERROR (503)
//MISSING ERROR IN THE POST YOUR IDEA PAGE.
// REMOVE "ALL CATEGORY" SECENE FROM THE IDEAS SHOWN BY CATEGORIES WHICH IS IN THE NAVBAR ONLY SHOW THE CHOOSEN CATEGORY IDEA

const App = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  return (
    <>
      <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div></div>

      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/" element={
          isLoading ? (<p role="status">Loading your account...</p>) : isLoggedIn ? (<Navigate to="/dashboard" replace /> ) : (<HomePage />)
        } />

        <Route path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
        />
        <Route path="/ideas" element={<IdeasPage />} />
        <Route path="/ideas/category/:category" element={<IdeasPage />}/>
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

        <Route path="/workspaces" element={<ProtectedRoute><WorkSpacesPage /></ProtectedRoute>} />


        <Route
          path="/workspaces/new"
          element={
            <ProtectedRoute>
              <CreateWorkspacePage/>
            </ProtectedRoute> 
        }
        />

        <Route 
        path="/workspaces/:workspaceId"
        element={
          <ProtectedRoute>
            <WorkspaceDetailsPage />
          </ProtectedRoute>
        }
        />

        <Route
        path="/workspaces/:workspaceId/edit"
        element={
          <ProtectedRoute>
            < EditWorkspacePage />
          </ProtectedRoute>
        }
        
        />


      </Routes>
    </>
  );
};

export default App;
