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
import ModerationPage from "./pages/ModerationPage";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import AIValidatorPage from "./pages/AiPage";
import DashboardPage from "./pages/DashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";
import { useState, useContext } from "react";
import { AuthContext } from "./context/AuthContext";

// Your Pre-Pitch Emergency Checklist (Fix These First):

// The Live Health Check: Verify that Render is successfully talking to MongoDB Atlas. Clear all browser cookies, go to your live Netlify URL, sign up as a brand-new user, test the dashboard, and trigger an AI validation.

// Fix Password Recovery: Get basic transactional email working so password resets don't dead-end. Even a reliable SMTP relay (like SendGrid, Resend, or Postmark) is faster to configure than fighting the Gmail API authorization loop.

// Transition Stripe to Subscriptions: If PitchProof is a software workspace, switch your Stripe implementation from a one-time charge to a recurring subscription product (price_... with recurring interval) so you can pitch a SaaS model.

// Clean Up the Domain Optics: Ensure your Netlify app doesn't look like a default deployment template. Add professional OpenGraph metadata so when you drop the link in Slack, Discord, or Twitter, it has a clean preview card and logo.



// 3. How to Position PitchProof in a Pitch Deck
// When you present PitchProof to investors, frame it around the problem of wasted founder capital:

// The Problem: Aspiring founders waste months and thousands of dollars building products nobody wants because they skip validation.

// The Solution (PitchProof): A platform that combines community wisdom with structured AI validation to kill bad ideas early and give promising ones a roadmap.

// The Traction Metric to Track: Instead of vanity metrics, pitch "Completed Validations" or "Active Workspaces Created." Show that users aren't just signing up—they are actively moving from the Idea stage to Customer Research.


const App = () => {
  const { t } = useLanguage();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isLoggedIn, isLoading } = useContext(AuthContext);

  return (
    <>
      <Navbar onMenuClick={() => setIsSidebarOpen((prev) => !prev)} />

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

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

        <Route
          path="/my-ideas/:ideaId"
          element={
            <ProtectedRoute>
              <IdeaDetailsPage 
              ownerView/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/moderation"
          element={
            <ProtectedRoute>
              <ModerationPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
