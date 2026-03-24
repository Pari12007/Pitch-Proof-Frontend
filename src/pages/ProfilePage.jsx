import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getIdeas } from "../services/idea.services";
import { deleteAccount } from "../services/auth.services";


const ProfilePage = () => {
    const { user, isLoggedIn, logout } = useContext(AuthContext);
    const [ myIdeas, setMyIdeas ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    const nav = useNavigate();

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


    const handleLogout = () => {
        logout();
        nav("/", { replace: true })
    };

    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete you account? This will also delete your ideas and reviews."
        );

        if(!confirmDelete) return;
        
        try {
            await deleteAccount();

            
            localStorage.removeItem("authToken")
            logout();
                
            window.location.replace("/");
        } catch (error) {
            console.log("Error deleting account:", error);
            console.log(error.response?.data);
        }    
    }

    if(loading) {
        return <p className="loading-text">Loading profile...</p>
    }

    if (!isLoggedIn) {
        return (
            <div className="empty-message">
                <h3>Your need to log in</h3>
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
                    <p className="profile-eyebrow">Account overview</p>
                    <h2>My Profile</h2>
                    <div className="profile-meta-grid">
                        <div className="profile-meta-card">
                            <span>Name</span>
                            <strong>{user?.name || "Unknown user"}</strong>
                        </div>

                        <div className="profile-meta-card">
                            <span>Email</span>
                            <strong>{user?.email || "No email available"}</strong>
                        </div>

                        <div className="profile-meta-card">
                            <span>Ideas posted</span>
                            <strong>{myIdeas.length}</strong>
                        </div>
                    </div>
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
                <div className="profile-section-heading">
                    <p className="profile-eyebrow">Your content</p>
                    <h2>My Posted Ideas</h2>
                    <p>All startup ideas posted from your account in one place.</p>
                </div>

                {myIdeas.length === 0 ? (
                    <div className="profile-empty-state">
                        <h3>No ideas posted yet</h3>
                        <p>You haven't posted any ideas yet. Start sharing your first startup concept.</p>
                        <Link to="/create-idea" className="profile-create-link">
                            Create your first idea
                        </Link>
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
    )

}

export default ProfilePage
