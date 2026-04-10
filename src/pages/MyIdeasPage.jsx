import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getIdeas, deleteIdea } from "../services/idea.services";

const MyIdeasPage = () => {
    const { user, isLoggedIn } = useContext(AuthContext)

    const [ myIdeas, setMyIdeas ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect (() => {
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
                console.log("Error fetching my ideas:" , error);
            } finally {
                setLoading(false);
            }
        };

        if(isLoggedIn && user?._id) {
            fetchMyIdeas();
        } else {
            setLoading(false);
        }
    }, [isLoggedIn, user]);


    const handleDeleteIdea = async (ideaId) => {
        try {
            await deleteIdea(ideaId);

            setMyIdeas((prevIdeas) => 
            prevIdeas.filter((idea) => idea._id !== ideaId)
        );
        } catch (error) {
            console.log("Error deleting idea:" , error)
            console.log(error.reponse?.data)  
        }
    };

    if(loading) {
        return <p className="loading-text">Loading your ideas...</p>
    }

    if(!isLoggedIn) {
        return (
            <div className="empty-message">
                <h3>You need to log in</h3>
                <p>Please log in to see your idea.</p>
            </div>
        );
    }

    return (
        <div className="ideas-page">

            <div className="ideas-header">
                <h2>My ideas</h2>
                <p>Manage the startup ideas you have posted.</p>
            </div>


            {myIdeas.length === 0 ? (
                <div className="empty=message">
                    <h3>No ideas yet</h3>
                    <p>Post your first idea</p>
                </div>
            ) : (

                <div className="ideas-grid">
                    {myIdeas.map((idea) => (
                        <div className="idea-card" key={idea._id}>
                            <Link to={`/ideas/${idea._id}`} className="idea-link">
                                <div className="idea-card-top">
                                    <h3>{idea.title}</h3>
                                    <span className="idea-category">{idea.category}</span>
                                </div>

                                <p className="idea-description">{idea.idea}</p>

                                <div className="idea-footer">
                                    <span>Click to view details</span>
                                </div>
                            </Link>

                            <button
                            className="delete-button"
                            onClick={() => handleDeleteIdea(idea._id)}
                            >
                                Delete ideas
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
};
export default MyIdeasPage;
