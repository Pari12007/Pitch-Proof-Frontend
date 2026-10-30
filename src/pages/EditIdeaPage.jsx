import { useLanguage } from "../context/languageStore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { getOwnerIdea, updateIdea } from "../services/idea.services";



const EditIdeaPage = () => {
    const { t, tError, validateField, clearFieldValidity } = useLanguage();


    const { ideaId } = useParams();
    const nav = useNavigate();

    const [title, setTitle] = useState("");
    const [idea, setIdea] = useState("");
    const [problem, setProblem] = useState("");
    const [solution, setSolution] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);

    const [ visibility, setVisibility ] = useState("private");
    const [ publicSummary, setPublicSummary ] = useState("");
    const [ saving, setSaving ] = useState(false);
    const [ loadError, setLoadError ] = useState("");
    const [ saveError, setSaveError ] = useState("");

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
        let active = true;

        const fetchIdea = async () => {
            setLoading(true);
            setLoadError("");
            setSaveError("");

            try {
                const response = await getOwnerIdea(ideaId);
                const foundIdea = response.data;

                if (!active) return;

                setTitle(foundIdea.title || "");
                setIdea(foundIdea.idea || "");
                setProblem(foundIdea.problem || "");
                setSolution(foundIdea.solution || "");
                setCategory(foundIdea.visibility || "");
                setVisibility(foundIdea.visibility ?? "private");
                setPublicSummary(foundIdea.publicSummary || "");
            } catch (error) {
                if (!active) return;

                setLoadError(error.response?.data?.message || "Unable to load your idea.");
            } finally {
                if(active) {
                    setLoading(false);
                }
            }
        };

        fetchIdea();

        return () => {
            active = false;
        };
    }, [ideaId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (saving || loading || loadError) return;

        setSaveError("");

        if(!visibility === "summary" && !publicSummary.trim()) {
            setSaveError("Please write a public summary before publishing.");
            return;
        }

        setSaving(true);

        try {
            await updateIdea(ideaId, {
                title: title.trim(),
                idea: idea.trim(),
                problem: problem.trim(),
                solution: solution.trim(),
                category,
                visibility,
                publicSummary: publicSummary.trim(),
            });

            nav(`/my-ideas/${ideaId}`);
        } catch (error) {
            setSaveError(error.response?.data?.message || "Unable to update your idea.");
        } finally {
            setSaving(false);
        }
    };

    if(loading){
        return <p className="loading-text">{t("Loading idea...")}</p>;
    }

    if (loadError) {
        return <p role="alert">{tError(loadError)}</p>
    }


    return (
    <div className="create-idea-container">
        <h2>{t("Edit your idea")}</h2>

        {saveError && (
            <p role="alert" className="auth-mesage auth-message-error">{tError(saveError)}</p>
        )}


        <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={handleSubmit} className="create-form">
            <label htmlFor="idea-title">{t("Title")}</label>
            <input
            id="idea-title"
            type="text"
            value={title}
            maxLength={120}
            required
            placeholder={t("Title")}
            onChange={(e) => setTitle(e.target.value)}
            disabled={saving}
            />

            <label htmlFor="idea-description">{t("Your idea")}</label>
            <textarea
            id="idea-description"
            value={idea}
            required
            disabled={saving}
            onChange={(e) => setIdea(e.target.value)}
            />

            <label htmlFor="idea-problem">{t("idea-problem")}</label>
            <textarea
            id="idea-problem"
            value={problem}
            required
            disabled={saving}
            onChange={(e) => setProblem(e.target.value)}
            />

            <label htmlFor="idea-solution">{t("Solution")}</label>
            <textarea 
            id="idea-solution"
            value={solution}
            required
            disabled={saving}
            onChange={(e) => setSolution(e.target.value)}
            />

            <label htmlFor="idea-category">{t("Select Category")}</label>
            <select
            id="idea-category"
            className="create-category-select"
            value={category}
            required
            disabled={saving}
            onChange={(e) => setCategory(e.target.value)}
            >
                <option value="">{t("Select Category")}</option>

                {categories.map((type) => (
                    <option key={type} value={type}>
                        {t(type)}
                    </option>
                ))}
            </select>


            <label htmlFor="idea-visibility">{t("Visibility")}</label>
            <select
                id="idea-visibility"
                className="create-category-select"
                value={visibility}
                disabled={saving}
                onChange={(e) => setVisibility(e.target.value)}
            >
                <option value="private">{t("Private")}</option>
                <option value="public">{t("Public")}</option>
                <option value="summary">{t("Public summary only")}</option>
            </select>

            <p>{t("Share the problem and vision, not your secret sauce.")}</p>

            <p>{t("changing visibility keeps earlier reviews owner-only. Previously public information any already have been copied.")}</p>

            {visibility === "summary" && (
                <>
                    <label htmlFor="idea-summary">{t("Public summary")}</label>

                    <textarea 
                        id="idea-summary"
                        value={publicSummary}
                        maxLength={600}
                        required
                        disabled={saving}
                        onChange={(e) => setPublicSummary(e.target.value)}
                    />

                    <small>{publicSummary.length}/600</small>
                </>
            )}

            <section className="idea-content-card">
                <h3>{t("Public review")}</h3>

                {visibility === "private" ? (
                    <p>{t("Nothing from this idea is published.")}</p>
                ) : (
                    <>
                        <p>
                            {t("Your title, category and profile name will be public.")}
                        </p>

                        <h4>{title}</h4>
                        <p>{t(category)}</p>

                        {visibility === "summary" ? (
                            <p>{publicSummary}</p>
                        ) : (
                            <>
                                <h4>{t("Idea")}</h4>
                                <p>{idea}</p>

                                <h4>{t("Problem")}</h4>
                                <p>{problem}</p>

                                <h4>{t("Solution")}</h4>
                                <p>{solution}</p>
                            </>
                        )}
                    </>
                )}
            </section>

            <button type="submit" disabled={saving}>
                {t(saving ? "Saving..." : "Update Idea")}
            </button>
        </form>
    </div>
    )
}

export default EditIdeaPage
