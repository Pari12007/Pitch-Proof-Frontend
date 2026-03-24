import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getIdea, deleteIdea } from "../services/idea.services";
import { getReviews, deleteReview } from "../services/review.services";
import { createReview } from "../services/review.services";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const IdeaDetailsPage = () => {

  const { user } = useContext(AuthContext);

  const { ideaId } = useParams();
  const nav = useNavigate();

  const [ idea, setIdea ] = useState(null);
  const [ reviews, setReviews ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const [ comment, setComment ] = useState("");
  const [ rating, setRating ] = useState("");

  useEffect(() => {
    const fetchIdeaDetails = async () => {
      try{
        const ideaResponse = await getIdea(ideaId);
        const reviewsResponse = await getReviews(ideaId);

        setIdea(ideaResponse.data)
        setReviews(reviewsResponse.data)
      } catch (error) {
        console.log("Error fetching idea details", error)
      } finally {
        setLoading(false);
      }
    };

    fetchIdeaDetails();
  }, [ideaId]);

  
  
  const handleReview = async (e) => {
    e.preventDefault();
    console.log("Token in Storage:", localStorage.getItem("authToken"));
    
    try {
      await createReview(ideaId, {
        comment,
        rating: Number(rating)
      });
      
      // refresh reviews
      const reviewsResponse = await getReviews(ideaId);
      setReviews(reviewsResponse.data);
      
      // reset form
      setComment("");
      setRating("");
      
    } catch (error) {
      console.log("Error creating review:", error);
      console.log("Backend error:", error.response?.data);
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    try{
      await deleteReview(reviewId)
      
      const reviewResponse = await getReviews(ideaId);
      setReviews(reviewResponse.data);    
    } catch(error){
      console.log("Error deleting review:", error);
      console.log(error.response?.data);
    }
  }
  
  const handleDeleteIdea = async () => {
    try {
      await deleteIdea(ideaId);
      nav("/ideas");
    }catch (error) {
      console.log("Error deleting idea:", error);
      console.log(error.response?.data);
    }
  };
  
  
  const renderStars = (rating) => {
  const num = Number(rating);
  const fullStars = "★".repeat(num);
  const emptyStars = "☆".repeat(5 - num);
  return fullStars + emptyStars;
};

const calculateAIScore = () => {
  if(!idea) return 0;

  let score = 0;

  if (idea.title && idea.title.length >= 10) score += 20;
  if (idea.idea && idea.idea.length >= 30) score += 20;
  if (idea.problem && idea.problem.length >= 20) score += 20;
  if (idea.solution && idea.solution.length >= 20) score += 20;
  if (idea.category) score += 10;
  if (reviews.length > 0) score += 10;

  return score;
};

const getAIScoreMessage = (score) => {
  if (score >= 85) return "Excellent potential. This idea is well-defined and promising.";
  if (score >= 70) return "Strong idea. A bit more refinement could make it even better.";
  if (score >= 50) return "Good start. Try improving the problem and solution clarity.";
  return "Needs more detail. Strengthen the concept before validation.";
};

const aiScore = idea? calculateAIScore() : 0;
const aiMessage = getAIScoreMessage(aiScore);


  if(loading) {
    return <p>Loading idea details..</p>
  };

  if(!idea) {
    return <p>Idea not found</p>
  };





  return (
    <div className="idea-details-page">
      <div className="idea-hero-card">
        <div className="idea-hero-copy">
          <p className="idea-details-eyebrow">Startup idea overview</p>
          <h2>{idea.title}</h2>
          <div className="idea-meta-row">
            <span className="idea-meta-pill">{idea.category}</span>
            <span className="idea-meta-text">
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </span>
          </div>
        </div>

        <div className="idea-actions">
          {user && idea.createdBy?._id === user._id && (
            <button className="delete-button" onClick={handleDeleteIdea}>
              Delete Idea
            </button>
          )}

          {user &&
            (idea.createdBy?._id === user?._id || idea.createdBy === user?._id) && (
              <Link to={`/ideas/${idea._id}/edit`} className="edit-button">
                Edit Idea
              </Link>
          )}
        </div>
      </div>

      <div className="idea-details-grid">
        <div className="idea-content-stack">
          <section className="idea-content-card">
            <h3>Idea</h3>
            <p>{idea.idea}</p>
          </section>

          <section className="idea-content-card">
            <h3>Problem</h3>
            <p>{idea.problem}</p>
          </section>

          <section className="idea-content-card">
            <h3>Solution</h3>
            <p>{idea.solution}</p>
          </section>
        </div>

        <aside className="idea-sidebar">
          <div className="ai-score-box">
            <h3>AI Validation Score</h3>
            <p className="ai-score-number">{aiScore}/100</p>
            <p className="ai-score-message">{aiMessage}</p>
          </div>
        </aside>
      </div>


      <div className="reviews-section">
        <h3>Reviews</h3>

        {reviews.length === 0 ? (
          <div className="reviews-empty-state">
            <p>No reviews yet. Be the first to leave feedback on this idea.</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <p className="review-rating">
                <strong>Rating:</strong> 
                {renderStars(review.rating)} ({review.rating}/5)
              </p>
              
              <p>{review.comment}</p>
              
              {user && review.user?._id  === user._id && (
              <button className="delete-button" onClick={ () => handleDeleteReview(review._id)}>
                Delete review
              </button>
              )}
            </div>
          ))
        )}
      </div>
        <div className="review-form">
          <h3>Add Review</h3>

          <form onSubmit={handleReview}>

            <input
            type="number"
            value={rating}
            placeholder="Rating (1-5)"
            min="1"
            max="5"
            onChange={(e) => setRating(e.target.value)}
            />

            <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            />

            <button type="submit">
              Submit Review
            </button>
          </form>
        </div>
      </div>
  );
}

export default IdeaDetailsPage
