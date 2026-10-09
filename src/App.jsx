import { useLanguage } from "./context/languageStore";
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
import WorkspacesPage from "./pages/WorkspacesPage";
import CreateWorkspacePage from "./pages/CreateWorkspacePage";
import WorkspaceDetailsPage from "./pages/WorkspaceDetailsPage";
import EditWorkspacePage from "./pages/EditWorkspacePage";
import NotFoundPage from "./pages/NotFoundPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AIValidatorPage from "./pages/AiPage";
import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";


//RE-DESIGN THE PROFILE PAGE.
//ADD THE AI-MENTOR CHAT-BOT, LIKE SMALL ROUND IN RIGHT SIDE OF CORNER OF EVERYPAGE AND GIVE THE OPTION TO DELETE IT WITH CROSS SIGN.
//UPDATE MAIN HOMEPAGE WITH NEW FEATURES ADDED.

//ADD LIMIT IN THE FRONTEND TO SHOW THE REVIEW IN THE USERS DASHBOARD.
//MAKE THE ALL START-UP IDEAS BOX SMALLER.
//REDEFINE THE CATEGORIES BOX.
//ADD HOVER OVER FEATURE IN THE ACCOUNT OVERVIEW EN EACH ELEMENT: (BUSINESS, TASK ...ETC).
//THE MAIN HOMEPAGE NAVBAR HAS DIFFERENT FONTS.
//FORGORT PASSWORD FUCTION.
//ADD THE AUTOMATED (WELCOME) EMAIL WHILE SOMEONE LOG'S IN TO MY WEBSITE.
//NEW USER SHOULD GET WELCOME AND OLD USER SHOULD GET WELCOME BACK.
const App = () => {
  const { t } = useLanguage();

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
        <Route  path="*" element={<NotFoundPage />}/>

        <Route path="/" element={
          isLoading ? (<p role="status">{t("Loading your account...")}</p>) : isLoggedIn ? (<Navigate to="/dashboard" replace /> ) : (<HomePage />)
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

        <Route path="/workspaces" element={<ProtectedRoute><WorkspacesPage /></ProtectedRoute>} />


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

        <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
        <Route path="/reset-password" element={<ResetPasswordPage />} />


      </Routes>
    </>
  );
};

export default App;
