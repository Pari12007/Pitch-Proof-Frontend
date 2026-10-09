import { useLanguage } from "../context/languageStore";
import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getIdeas } from "../services/idea.services";
import { deleteAccount, editProfile } from "../services/auth.services";
import { getWorkspaces } from "../services/workspace.services";


const ProfilePage = () => {
  const { t , tError, validateField, clearFieldValidity } = useLanguage();

    const { user, isLoggedIn, logout, setUser } = useContext(AuthContext);
    const [ myIdeas, setMyIdeas ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const [ isEditing, setIsEditing] = useState(false);
    const [ editName, setEditName] = useState("");
    const [ editEmail, setEditEmail] = useState("");
    const [ profileMessage, setProfileMessage] = useState("");

    const [ myBusinesses, setMyBusinesses ] = useState([]);
    const [ businessesLoading, setBusinessesLoading ] = useState(true);
    const [ businessesError, setBusinessesError ] = useState("");  
    const [ deleteError, setDeleteError ] = useState("");
    const [ deleting, setDeleting ] = useState(false);

    const nav = useNavigate();

    useEffect (() => {
        if(user) {
            setEditName(user.name || "");
            setEditEmail(user.email || "")
        }
    }, [user]);

    useEffect (() => {
        const fetchMyIdeas = async () => {
            try {
                const response = await getIdeas(); 

                const filteredIdeas = response.data.filter(
                    (idea) => 
                        idea.createdBy?._id == user?._id ||
                        idea.createdBy === user?._id
                );

                setMyIdeas(filteredIdeas);
            } catch (error) {
                console.log("Error fetching profile ideas:", error);
            } finally {
                setLoading(false);
            }
        };

        if (isLoggedIn && user?._id) {
            fetchMyIdeas();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, user]);


    useEffect (() => {
      let active = true;

      const fetchBusinesses = async () => {
        setBusinessesLoading(true);
        setBusinessesError("");
        setMyBusinesses([]);

        try {
          const response = await getWorkspaces();

          if(active) {
            setMyBusinesses(response.data);
          }
        } catch (error) {
          if(active) {
            setBusinessesError(error.response?.data?.message || "Unable to load your businesses");
          }
        }finally {
          if(active) setBusinessesLoading(false);
        }
      };

      if(isLoggedIn && user?._id) {
        fetchBusinesses();
      } else {
        setMyBusinesses([]);

        setBusinessesLoading(false);
      }

      return () => {
        active = false;
      };
    }, [isLoggedIn, user?._id]);


    const handleLogout = () => {
        logout();
        nav("/", { replace: true })
    };

    const handleDeleteAccount = async () => {
        if(deleting) return;

        const confirmed = window.confirm(t("Delete your account permanently? This will also delete your associated data."));

        if(!confirmed) return;

        setDeleteError("");
        setDeleting(true);

        try {
          await deleteAccount();
          logout();
          nav("/", { replace: true })
        } catch (error) {
          setDeleteError(error.response?.data?.message || "Unable to delete your account. Please try again.");
        } finally {
          setDeleting(false);
        }
    }

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        setProfileMessage("");

        try {
            const response = await editProfile({
                name: editName,
                email: editEmail,
            });
            setUser(response.data)
            setIsEditing(false);
            setProfileMessage("Profile updated successfully");
        } catch (error) {
            console.log("Error updating profile:", error);
            setProfileMessage(
                error.response?.data?.message || "Failed to update profile."
            );
        }
    };

    const stageLabels = { 
      idea: t("Idea"),
      customer_research:t("Customer research"),
      testing_demand: t("Testing demand"),
      building: t("Building"),
      launched: t("Launched"),
    }
    if(loading) {
        return <p className="loading-text">{t("Loading profile...")}</p>
    }

    if (!isLoggedIn) {
        return (
            <div className="empty-message">
                <h3>{t("Your need to log in")}</h3>
                <p>{t("Please log in to view your profile.")}</p>
            </div>
        );
    }


    return (
      <main className="profile-page profile-redesign">
        <header className="profile-top">
          <div className="profile-identify">
            <div className="profile-avatar" aria-hidden="true">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>

            <div>
              <span className="ws-eyebrow">{t("Your account")}</span>
              <h1>{user?.name || t("My profile")}</h1>
              <p>{user?.email}</p>

              <div className="profile-plan">
                <span>{user?.isPro ? t("Pro plan") : t("Free plan")}</span>

                {!user?.isPro && (
                  <Link to="/pricing">{t("Upgrade to pro")}</Link>
                )}
              </div>
            </div>
          </div>

          <button
          type="button"
          className="ws-button ws-secondary"
          disabled={isEditing}
          aria-expanded={isEditing}
          aria-control="profile-edit-panel"
          onClick={() => {
            setProfileMessage("");
            setDeleteError("");
            setIsEditing(true);
          }}
          > {t("Edit profile")} </button>
        </header>

        {profileMessage && (
          <p className="profile-message" role="status">
            {t(profileMessage)}
          </p>
        )}

        {isEditing && (
          <section id="profile-edit-panel" className="profile-panel" aria-labelledby="profile-edit-heading">
            <h2 id="profile-edit-heading">{t("Edit your profile")}</h2>

            <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={handleProfileUpdate} className="profile-edit-fields">
              <label htmlFor="profile-name">{t("Name")}</label>

              <input
              id="profile"
              type="text"
              autoComplete="name"
              placeholder={t("Your name")}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              disabled={deleting}
              required
              />

              <label htmlFor="profile-email">{t("Email")}</label>
              <input 
              id="profile"
              type="email"
              autoComplete="email"
              placeholder={t("you@example.com")}
              value={editEmail}
              onchange={(e) => setEditEmail(e.target.value)}
              disabled={deleting}
              required
              />

              <div className="profile-edit-buttons">
                <button type="submit" className="ws-button" disabled={deleting}> {t("Save changes")} </button>

                <button type="button" className="ws-button ws-secondary" disabled={deleting} onClick={() => {
                  setIsEditing(false);
                  setEditName(user?.name || "");
                  setEditEmail(user?.email || "");
                  setProfileMessage("");
                }}> {t("Cancel")} </button>
              </div>
            </form>

            <div className="profile-delete-section">
              <div>
                <h3>{t("Delete account")}</h3>

                <p>{t("This permanently deletes yoour account and its associated data.")}</p>
              </div>

              <button
              type="button"
              className="ws-button ws-danger"
              onClick={handleDeleteAccount}
              disabled={deleting}>
                {deleting ? t("Deleting...") : t("Delete Account")}
              </button>

              {deleteError && <p role="alert">{tError(deleteError)}</p>}
            </div>
          </section>
        )}

        <div className="profile-columns">
          <section className="profile-panel" aria-labelledby="profile-businesses-heading">
            <div className="profile-panel-title">
              <h2 id="profile-businesses-heading">{t("My businesses")}</h2>
              <Link to="/workspaces">{t("View all →")}</Link>
            </div>

            {businessesLoading ? (
              <p role="status">{t("Loading your businesses...")}</p>
            ) : businessesError ? (
              <p role="alert">{tError(businessesError)}</p>
            ) : myBusinesses.length === 0 ? (
              <div className="profile-empty">
                <p>{t("No businesses yet. Create your first workspace.")}</p>
                <Link to="/workspaces/new" className="ws-button ws-secondary"> {t("Create Business")} </Link>
              </div>
            ) : (
              <ul className="profile-entry-list">
                {myBusinesses.map((business) => (
                  <li key={business._id}>
                    <Link to={`/workspaces/${business._id}`} className="profile-entry">
                      <div className="profile-entry-title">
                        <h3>{business.name}</h3>
                        <span>{stageLabels[business.stage] || t("Idea")}</span>
                      </div>

                      <p>{business.summary}</p>

                      <span className="profile-entry-action">{t("Open business →")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="profile-panel" aria-labelledby="profile-ideas-heading">
            <div className="profile-panel-title">
              <h2 id="profile-ideas-heading"> {t("My Posted Ideas")} </h2>

              <Link to="/my-ideas"> {t("View all →")} </Link>
            </div>

            {myIdeas.length === 0 ? (
              <div className="profile-empty">
                <p>{t("You haven't posted any ideas yet.")}</p>

                <Link to="/create-idea" className="ws-button ws-secondary"> {t("Posted your Idea")} </Link>
              </div>
            ) : (
              <ul className="profile-entry-list">
                {myIdeas.map((idea) => (
                  <li kry={idea._id}>
                    <Link to={`/ideas/${idea._id}`} className="profile-entry">
                      <div className="profile-entry-titel">
                        <h3>{idea.title}</h3>
                        <span>{t(idea.category)}</span>
                      </div>

                      <p>{idea.idea}</p>
                      <span className="profile-entry-action">{t("View idea →")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <footer className="profile-bottom">
          <button type="button" className="ws-button ws-secondary" onClick={handleLogout} disabled={deleting}> {t("Logout")} </button>
        </footer>
      </main>
    )

}

export default ProfilePage
