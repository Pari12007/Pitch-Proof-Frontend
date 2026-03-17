import { useEffect, useState } from "react"
import { getIdeas } from "../services/idea.services";
import { Link } from "react-router-dom";

const IdeasPage = () => {

  const [ ideas, setIdeas ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {

    const fetchIdeas = async () => {
      try{
        const response = await getIdeas();
        setIdeas(response.data);
      } catch (error) {
        console.log("Error fetching ideas:", error)
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  if (loading) {
    return <p>Loading ideas...</p>;
  }


  return (
    <div className="ideas-page">
      <h2>All Ideas</h2>

      <div className="ideas-list">
        {ideas.map((idea) => (
          <Link to={`/ideas/${idea._id}`} key={idea._id} className="idea-link">
            <div className="idea-card">
              <h3>{idea.title}</h3>
              <p>{idea.idea}</p>
              <span>{idea.category}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default IdeasPage