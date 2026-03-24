import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getIdea, updateIdea } from "../services/idea.services";



const EditIdeaPage = () => {

    const { ideaId } = useParams();
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [idea, setIdea] = useState("");
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

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

    useEffect (() => {
        const fetchIdea = async () => {
            try {
                const response = await getIdea(ideaId);
                const foundIdea = response.data;

                setTitle(foundIdea.title || "");
                setIdea(foundIdea.idea || "");
                setProblem(foundIdea.problem || "");
                setSolution(foundIdea.solution || "");
                setCategory(foundIdea.category || "");
            } catch (error) {
                console.log("Error fetching ideas:", error);
            } finally{
                setLoading(false);
            }
        }

        fetchIdea();
    }, [ideaId])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await updateIdea(ideaId, {
                title,
                idea,
                problem,
                solution,
                category
            });

            nav(`/ideas/${ideaId}`);
        } catch (error) {
            console.log("Error updating idea:", error)
            console.log(error.response?.data)
        }
    };

    if(loading){
        return <p className="loading-text">Loading idea...</p>;
    }
    return (
    <div className="create-idea-container">
        <h2>Edit your idea</h2>

        <form onSubmit={handleSubmit} className="create-form">
            <input
            type="text"
            value={title}
            placeholder="Title"
            onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
            placeholder="Your idea"
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            />

            <textarea
            placeholder="Problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            />

            <textarea
            placeholder="Solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            />

            <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            >
            <option value="">Select Category</option>

            {categories.map((type) => (
                <option key={type} value={type}>
                {type}
                </option>
            ))}
            </select>

            <button type="submit">Update Idea</button>
        </form>
    </div>
    )
}

export default EditIdeaPage