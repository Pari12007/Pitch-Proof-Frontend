import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getIdeas } from "../services/idea.services";


const ProfilePage = () => {

    const { isLoggedIn, user, logout } = useContext(AuthContext);

    const [ myIdeas, setMyIdeas ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
    const fetchMyIdeas = async () => {
      try {
        const response = await getIdeas();

        const filteredIdeas = response.data.filter(
          (idea) =>
            idea.createdBy?._id === user?._id ||
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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDeleteAccount = () => {
    alert("Delete account feature will be connected next.");
  };

  if (loading) {
    return <p className="loading-text">Loading profile...</p>;
  }

  if (!isLoggedIn) {
    return (
      <div className="empty-message">
        <h3>You need to log in</h3>
        <p>Please log in to view your profile.</p>
      </div>
    );
  }

    return (
        <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar">
          {user?.name ? user.name[0].toUpperCase() : "U"}
        </div>

        <div className="profile-info">
          <h2>My Profile</h2>
          <p><strong>Name:</strong> {user?.name}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Status:</strong> Active user</p>
        </div>
      </div>

      <div className="profile-actions">
        <button className="profile-btn logout-profile-btn" onClick={handleLogout}>
          Logout
        </button>

        <button className="profile-btn delete-account-btn" onClick={handleDeleteAccount}>
          Delete Account
        </button>
      </div>

      <div className="profile-ideas-section">
        <div className="section-heading">
          <h2>My Posted Ideas</h2>
          <p>All startup ideas posted from your account.</p>
        </div>

        {myIdeas.length === 0 ? (
          <div className="empty-message">
            <h3>No ideas posted yet</h3>
            <p>You haven’t posted any ideas yet.</p>
          </div>
        ) : (
          <div className="ideas-grid">
            {myIdeas.map((idea) => (
              <Link to={`/ideas/${idea._id}`} key={idea._id} className="idea-link">
                <div className="idea-card">
                  <div className="idea-card-top">
                    <h3>{idea.title}</h3>
                    <span className="idea-category">{idea.category}</span>
                  </div>

                  <p className="idea-description">{idea.idea}</p>

                  <div className="idea-footer">
                    <span>Click to view details</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
    );
}

export default ProfilePage