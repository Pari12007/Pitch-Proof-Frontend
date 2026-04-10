import {  useEffect, useState } from "react"
import { getIdeas } from "../services/idea.services";
import { Link, useSearchParams } from "react-router-dom";
import { getReviews } from "../services/review.services"; 

const IdeasPage = () => {

  const [ searchParams ] = useSearchParams();
  const categoryFromUrl = searchParams.get("category") || "";

  const [ ideas, setIdeas ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ selectedCategory, setSelectedCategory] = useState(categoryFromUrl)
  const [ topIdeas, setTopIdeas ] = useState([]);
  const [ sortType, setSortType ] = useState("");

  const categories = [
    "Fintech",
    "HealthTech",
    "EdTech",
    "SaaS",
    "E-commerce",
    "GreenTech",
    "Proptech",
    "AdTech",
    "InsurTech",
    "Logistics",
    "Marketplace",
    "D2C",
    "B2B",
    "B2C",
    "Social Impact",
    "Lifestyle",
    "Scalable Startup",
    "Small Business",
    "AgriTech",
    "Cybersecurity",
  ];


  const calculateAverageRating = (reviews) => {
    if(reviews.length === 0) return 0;

    const total = reviews.reduce((sum, review) => sum + Number(review.rating), 0);
    return (total / reviews.length).toFixed(1);
  };
  
  useEffect(() => {

    const fetchIdeasAndRatings = async () => {
      try{
        const response = await getIdeas();
        const ideasData = response.data;

        const ideasWithRatings = await Promise.all(
          ideasData.map(async (idea) => {
            const reviewsResponse = await getReviews(idea._id);
            const reviews = reviewsResponse.data;

            const averageRating = calculateAverageRating(reviews);

            return {
              ...idea,
              averageRating,
              reviewsCount: reviews.length,
            };
          })
        );
        setIdeas(ideasWithRatings);

        const sortedTopIdeas = [...ideasWithRatings]
        .filter((idea) => Number(idea.averageRating) > 0)
        .sort((a, b) => Number(b.averageRating) - Number(a.averageRating))
        .slice(0, 3);

        setTopIdeas(sortedTopIdeas);
      } catch (error) {
        console.log("Error fetching ideas:", error)
      } finally {
        setLoading(false);
      }
    };
    setSelectedCategory(categoryFromUrl);
    fetchIdeasAndRatings();
  }, [categoryFromUrl]);

  let filteredIdeas = selectedCategory 
  ? ideas.filter((idea) => idea.category === selectedCategory) 
  : ideas;

  if( sortType === "rating") {
    filteredIdeas = [...filteredIdeas].sort(
      (a, b) => Number(b.averageRating) - Number(a.averageRating)
    );
  }

  if(sortType === "reviews") {
    filteredIdeas = [...filteredIdeas].sort(
      (a, b) => b.reviewsCount - a.reviewsCount
    )
  } 


  const renderStars = (rating) => {
    const num = Math.round(Number(rating));
    return "★".repeat(num) + "☆".repeat(5 - num);
  };

  if (loading) {
    return <p className="loading-text">Loading ideas...</p>;
  }


  return (
      <div className="ideas-page">
      <div className="ideas-header">
        <h2>All Startup Ideas</h2>
        <p>Explore and validate startup concepts from the community.</p>
      </div>

      {topIdeas.length > 0 && (
        <div className="top-rated-section">
          <h3>Top Rated Ideas ⭐</h3>
          <div className="ideas-grid">
            {topIdeas.map((idea) => (
              <Link to={`/ideas/${idea._id}`} key={idea._id} className="idea-link">
                <div className="idea-card top-card">
                  <div className="idea-card-top">
                    <h3>{idea.title}</h3>
                    <span className="idea-category">{idea.category}</span>
                  </div>

                  <p className="idea-description">{idea.idea}</p>

                  <p className="idea-rating">
                    {renderStars(idea.averageRating)} ({idea.averageRating}/5)
                  </p>

                  <p className="idea-meta">{idea.reviewsCount} reviews</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="filter-bar">
        <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="category-filter"
        >
          <option value="">All Categories</option>

          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
        value={sortType}
        onChange={(e) => setSortType(e.target.value)}
        className="category-filter"
        >
          <option value="">Sort By</option>
          <option value="rating">Highest Rated</option>
          <option value="reviews">Most Reviewed</option>
        </select>
      </div>

    {filteredIdeas.length === 0 ? (
      <div>
        <h3>No ideas found</h3>
        <p>
          {selectedCategory ? `There are no ideas yet in ${selectedCategory}.`
          : "There are no ideas available right now."}
        </p>
      </div>
    ) : (
      <div className="ideas-grid">
        {filteredIdeas.map((idea) => (
          <Link to={`/ideas/${idea._id}`} key={idea._id} className="idea-link">
            <div className="idea-card">
              <div className="idea-card-top">
                <h3>{idea.title}</h3>
                <span className="idea-category">{idea.category}</span>
              </div>

              <p className="idea-description">{idea.idea}</p>

              <p className="idea-rating">
                {idea.reviewsCount > 0
                    ? `${renderStars(idea.averageRating)} (${idea.averageRating}/5)`
                    : "No ratings yet"}
              </p>

              <div className="idea-footer">
                <span>{idea.reviewsCount > 0
                      ? `${idea.reviewsCount} reviews`
                      : "Be the first to review"}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )}  
    </div>
  )
}

export default IdeasPage
