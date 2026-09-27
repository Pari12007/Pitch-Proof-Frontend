import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIdea } from "../services/idea.services";

const CreatedIdeaPage = () => {

  const [ title, setTitle ] = useState("");
  const [ idea, setIdea ] = useState('')
  const [ problem, setProblem ] = useState("")
  const [ solution, setSolution ] = useState("")
  const [ category, setCategory ] = useState("")
  const [ limitMessage, setLimitMessage] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const navigate = useNavigate();

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
    "Cybersecurity"
  ];
    
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLimitMessage("");
    setErrorMessage("");

    if(!problem.trim() || !solution.trim()) {
      setErrorMessage("Please complete both the problem and solution before posting your idea."); return;
    }

    try{
      const response = await createIdea({
        title: title.trim(),
        idea: idea.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        category,
      });

      console.log("Idea created:", response.data);

        setTitle("");
        setIdea("");
        setProblem("");
        setSolution("");
        setCategory("");

      navigate("/ideas");

    } catch (err) {
      console.log("Error creating idea: " , err)
      console.log(err.response?.data)

      if (err.response?.status === 403) {
        setLimitMessage(
          err.response?.data?.message || "Upgrade to pro to post more ideas"
        );
        return;
      }
      setErrorMessage(err.response?.data?.message || "Unable to post your idea. Please try again.");
    }
  };

  return (
    <div className="create-idea-container">

      <h2>Create your startup idea</h2>

      {limitMessage && (
        <div className="upgrade-banner">
          <div>
            <h4>Upgrade to Pro</h4>
            <p>{limitMessage}</p>
          </div>

          <button onClick={() => navigate("/pricing")} className="upgrade-banner-btn"> Upgrade Now</button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="create-form">
        
        {errorMessage && (<p role="alert" className="create-form-error">{errorMessage}</p>)}
        
        <label htmlFor="title">Title</label>
        <input
        type="text"
        placeholder="e.g. PitchProof"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="idea">Idea</label>
        <textarea
        placeholder="Describe your business, who it serves, and what you offer."
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        />
        
        <label htmlFor="idea-problem">Problem</label>
        <textarea
        placeholder="What difficulty do your customers face today?"
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        />

        <label htmlFor="solution">Solution</label>
        <textarea
        placeholder="How will your product or service solve that problem?"
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        />

        <label htmlFor="category">Category</label>
        <select 
        className="create-category-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Select a Category</option>
          
          {categories.map((types) => (
            <option key={types} value={types}>
              {types}
            </option>
          ))}
        </select>

        <button type="submit">
          Create Idea
        </button>

      </form>
    </div>
  )
}

export default CreatedIdeaPage
