import { useLanguage } from "../context/languageStore";
import { useContext, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getIdea, getOwnerIdea, deleteIdea } from "../services/idea.services";
import { getReviews, getOwnerReviews, deleteReview, createReview } from "../services/review.services";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import ReportButton from "../components/ReportButton";

const IdeaDetailsPage = ({ ownerView = false }) => {
  const {t , tError, validateField, clearFieldValidity, formatNumber, formatDate, } = useLanguage();


  const { user, isLoggedIn, logout } = useContext(AuthContext);

  const { ideaId } = useParams();
  const nav = useNavigate();

  const [ loadError, setLoadError ] = useState("");
  const fetchReviews = ownerView ? getOwnerReviews : getReviews;

  const [ idea, setIdea ] = useState(null);
  const [ reviews, setReviews ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  const [ comment, setComment ] = useState("");
  const [ rating, setRating ] = useState("");
  const [ reviewErrorMessage, setReviewErrorMessage ] = useState("");

  useEffect(() => {
    let active = true;

    const fetchIdeaDetails = async () => {
      setLoading(true);
      setLoadError("");
      setIdea(null);
      setReviews([]);
      
      try {
        const fetchIdea = ownerView ? getOwnerIdea : getIdea;

        const [ ideaResponse, reviewsResponse ] = await Promise.all([fetchIdea(ideaId),
          fetchReviews(ideaId),
        ]);

        if (!active) return;

        setIdea(ideaResponse.data);
        setReviews(reviewsResponse.data);
      } catch (error) {
        if(!active) return;

        setLoadError(error.response?.data?.message || "Unable to load idea details.");
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchIdeaDetails();

    return () => {
      active = false;
    };
  }, [ideaId, ownerView, fetchReviews, user?._id]);

  
  
  const handleReview = async (e) => {
    e.preventDefault();

    if(!idea || !["public", "summary"].includes(idea.visibility)) {
      setReviewErrorMessage("Reviews can only be added to public ideas.");
      return;
    }

    if (!isLoggedIn) {
      setReviewErrorMessage("Please log in to submit a review.");
      return;
    }

    if (!comment.trim() || !rating) {
      setReviewErrorMessage("Please add a rating and a short review.");
      return;
    }

    setReviewErrorMessage("");
    
    try {
      await createReview(ideaId, {
        comment: comment.trim(),
        rating: Number(rating),
        reviewEpoch: idea.reviewEpoch,
      });
      
      // refresh reviews
      const reviewsResponse = await fetchReviews(ideaId);
      setReviews(reviewsResponse.data);
      
      // reset form
      setComment("");
      setRating("");
      setReviewErrorMessage("");
      
    } catch (error) {
      console.log("Error creating review:", error);
      console.log("Backend error:", error.response?.data);

      if (error.response?.status === 401) {
        localStorage.removeItem("authToken");
        logout();
        setReviewErrorMessage("Your session expired. Please log in again to submit a review.");
        return;
      }

      setReviewErrorMessage(
        error.response?.data?.message || "Unable to submit your review right now."
      );
    }
  };
  
  const handleDeleteReview = async (reviewId) => {
    try{
      await deleteReview(reviewId)
      
      const reviewResponse = await fetchReviews(ideaId);
      setReviews(reviewResponse.data);    
    } catch(error){
      console.log("Error deleting review:", error);
      console.log(error.response?.data);
    }
  }
  
  const handleDeleteIdea = async () => {
    try {
      await deleteIdea(ideaId);
      nav("/my-ideas");
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
  if (score >= 85) return t("Excellent potential. This idea is well-defined and promising.");
  if (score >= 70) return t("Strong idea. A bit more refinement could make it even better.");
  if (score >= 50) return t("Good start. Try improving the problem and solution clarity.");
  return t("Needs more detail. Strengthen the concept before validation.");
};

const aiScore = idea? calculateAIScore() : 0;
const aiMessage = getAIScoreMessage(aiScore);


  if(loading) {
    return <p className="loading-text">{t("Loading idea details...")}</p>
  };

  if(!idea) {
    return <p role="alert">
      {loadError ? tError(loadError) : t("Idea not found")}
    </p>
  };

  const isOwner = Boolean(user) && (idea.createdBy?._id ?? idea.createdBy) === user._id;

  const isPublic = ["public", "summary"].includes(idea.visibility);

  const showFullDetails = (ownerView && isOwner) || idea.visibility === "public";

  const visibilityLabel = idea.visibility === "public" ? "Public" : idea.visibility === "summary" ? "Public (summary only)" : "Private";
  return (
    <div className="idea-details-page">
    <div className="idea-hero-card">
      <div className="idea-hero-copy">
        <p className="idea-details-eyebrow">
          {t("Startup idea overview")}
        </p>

        <h2>{idea.title}</h2>

        <div className="idea-meta-row">
          <span className="idea-meta-pill">{t(idea.category)}</span>
          <span className="idea-meta-pill">{t(visibilityLabel)}</span>

          <span className="idea-meta-text">
            {t("reviewCount", { count: reviews.length })}
          </span>

          {idea.publishedAt && (
            <span className="idea-meta-text">
              {t("First published on {{date}}", {
                date: formatDate(idea.publishedAt),
              })}
            </span>
          )}
        </div>

        {ownerView && isOwner && (
          <p>
            {t("Owner view: full details and review history are visible only to you here.")}
          </p>
        )}
      </div>

      {isOwner && (
        <div className="idea-actions">
          <button
            type="button"
            className="delete-button"
            onClick={handleDeleteIdea}
          >
            {t("Delete Idea")}
          </button>

          <Link
            to={`/ideas/${idea._id}/edit`}
            className="edit-button"
          >
            {t("Edit Idea")}
          </Link>

          {ownerView && isPublic && (
            <Link
              to={`/ideas/${idea._id}`}
              className="edit-button"
            >
              {t("View public page")}
            </Link>
          )}
        </div>
      )}
    </div>

    <div className="idea-details-grid">
      <div className="idea-content-stack">
        {showFullDetails ? (
          <>
            <section className="idea-content-card">
              <h3>{t("Idea")}</h3>
              <p>{idea.idea}</p>
            </section>

            <section className="idea-content-card">
              <h3>{t("Problem")}</h3>
              <p>{idea.problem}</p>
            </section>

            <section className="idea-content-card">
              <h3>{t("Solution")}</h3>
              <p>{idea.solution}</p>
            </section>
          </>
        ) : (
          <section className="idea-content-card">
            <h3>{t("Public summary")}</h3>
            <p>{idea.publicSummary}</p>
            <p>{t("The owner has chosen to share only a summary.")}</p>
          </section>
        )}
      </div>

      <aside className="idea-sidebar">
        <div className="ai-score-box">
          <h3>{t("Sharing settings")}</h3>
          <p>{t(visibilityLabel)}</p>

          <p>
            {idea.visibility === "private"
              ? t("This idea is not published.")
              : idea.visibility === "summary"
                ? t("Only the title, category, author name and summary are shared publicly.")
                : t("The full idea, problem and solution are shared publicly.")}
          </p>
        </div>
      </aside>
    </div>

    {isPublic && (
      <ReportButton 
        key={`idea-${idea._id}`}
        targetType="idea"
        targetId={idea._id}
      />
    )}


    <div className="reviews-section">
      <h3>
        {t(ownerView ? "Review history" : "Reviews")}
      </h3>

      {ownerView && (
        <p>
          {t("Earlier reviews may be visible only to you after a visibility change.")}
        </p>
      )}

      {reviews.length === 0 ? (
        <div className="reviews-empty-state">
          <p>{t("No reviews yet.")}</p>
        </div>
      ) : (
        reviews.map((review) => {
          const ownerOnly =
            ownerView &&
            (!isPublic ||
              idea.moderationStatus === "hidden" ||
              review.moderationStatus === "hidden" ||
              review.reviewEpoch !== (idea.reviewEpoch ?? 0));

          return (
            <div className="review-card" key={review._id}>
              {ownerOnly && (
                <p className="idea-meta-pill">
                  {t("Owner-only review history")}
                </p>
              )}

              <p className="review-rating">
                <strong>{t("Rating:")} </strong>
                {renderStars(review.rating)} (
                {formatNumber(review.rating)}/5)
              </p>

              <p>{review.comment}</p>

              {isPublic && !ownerOnly && (
                <ReportButton
                  key={`review-${review._id}`}
                  targetType="review"
                  targetId={review._id}
                />
              )}

              {user &&
                (review.user?._id ?? review.user) === user._id && (
                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDeleteReview(review._id)}
                  >
                    {t("Delete review")}
                  </button>
                )}
            </div>
          );
        })
      )}
    </div>

    {reviewErrorMessage && (
      <p role="alert" className="auth-message auth-message-error">
        {tError(reviewErrorMessage)}
      </p>
    )}

    {isPublic ? (
      <div className="review-form">
        <h3>{t("Add Review")}</h3>

        {!isLoggedIn ? (
          <div className="review-login-note">
            <p>
              {t("Please log in to submit a review for this idea.")}
            </p>

            <Link to="/login" className="profile-create-link">
              {t("Go to login")}
            </Link>
          </div>
        ) : (
          <form
            onInvalid={validateField}
            onInput={clearFieldValidity}
            onSubmit={handleReview}
          >
            <label htmlFor="review-rating">
              {t("Rating (1-5)")}
            </label>

            <input
              id="review-rating"
              type="number"
              value={rating}
              min="1"
              max="5"
              step="1"
              required
              onChange={(event) => setRating(event.target.value)}
            />

            <label htmlFor="review-comment">
              {t("Write your review...")}
            </label>

            <textarea
              id="review-comment"
              value={comment}
              maxLength={2000}
              required
              onChange={(event) => setComment(event.target.value)}
            />

            <p>
              {t("Your review will be public. Do not include confidential details.")}
            </p>

            <button type="submit">{t("Submit Review")}</button>
          </form>
        )}
      </div>
    ) : (
      <div className="reviews-empty-state">
        <p>{t("Private ideas cannot receive public reviews.")}</p>
      </div>
    )}
  </div>
  );
}

export default IdeaDetailsPage
