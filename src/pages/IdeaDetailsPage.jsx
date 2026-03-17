import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getIdea } from "../services/idea.services";
import { getReviews } from "../services/review.services";
import { createReview } from "../services/review.services";

const IdeaDetailsPage = () => {

  const { ideaId } = useParams();

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

  if(loading) {
    return <p>Loading idea details..</p>
  };

  if(!idea) {
    return <p>Idea not found</p>
  };


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

  return (
    <div className="idea-details-page">
      <h2>{idea.title}</h2>
      <p><strong>Idea:</strong> {idea.idea} </p>
      <p><strong>Problem:</strong> {idea.problem} </p>
      <p><strong>Solution:</strong> {idea.solution} </p>
      <p><strong>Category:</strong> {idea.category} </p>

      <div className="reviews-section">
        <h3>Reviews</h3>

        {reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          reviews.map((review) => (
            <div className="review-card" key={review._id}>
              <p><strong>Rating:</strong> {review.rating} </p>
              <p>{review.comment}</p>
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