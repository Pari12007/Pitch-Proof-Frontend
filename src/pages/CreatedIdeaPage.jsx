import { useLanguage } from "../context/languageStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createIdea } from "../services/idea.services";

const CreatedIdeaPage = () => {
  const { t , tError, validateField, clearFieldValidity } = useLanguage();


  const [ title, setTitle ] = useState("");
  const [ idea, setIdea ] = useState('')
  const [ problem, setProblem ] = useState("")
  const [ solution, setSolution ] = useState("")
  const [ category, setCategory ] = useState("")
  const [ limitMessage, setLimitMessage] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");

  const [ visibility, setVisibility ] = useState("private");
  const [ publicSummary, setPublicSummary ] = useState("");
  const [ saving, setSaving ] = useState(false);
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

    if (saving) return;


    setLimitMessage("");
    setErrorMessage("");

    if(!title.trim() || !idea.trim() || !problem.trim() || !solution.trim() || !category) {
      setErrorMessage("Please complete all the required fields."); return;
    }

    if(!visibility === "summary" && !publicSummary.trim()) {
      setErrorMessage
      ("Please write a public summary before publishing.");
      return;
    }

    if(publicSummary.trim().length > 600) {
      setErrorMessage("Public summary must be text of up to 600 characters.");
      return;
    }

    setSaving(true);

    try{
      const response = await createIdea({
        title: title.trim(),
        idea: idea.trim(),
        problem: problem.trim(),
        solution: solution.trim(),
        category,
        visibility,
        publicSummary: publicSummary.trim(), 
      });

      navigate(`/my-ideas/${response.data._id}`)

    } catch (error) {
      const message = error.response?.data?.message;

      if(error.response?.status === 403) {
        setLimitMessage(message || "Free posting limit reached. Upgrade to pro.")
      } else {
        setErrorMessage(message || "Unable to post yoour idea. Please try again.")
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="create-idea-container">

      <h2>{t("Create your startup idea")}</h2>

      {limitMessage && (
        <div className="upgrade-banner">
          <div>
            <h4>{t("Upgrade to Pro")}</h4>
            <p>{tError(limitMessage)}</p>
          </div>

          <button onClick={() => navigate("/pricing")} className="upgrade-banner-btn"> {t("Upgrade Now")}</button>
        </div>
      )}

      <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={handleSubmit} className="create-form">
        
        {errorMessage && (<p role="alert" className="create-form-error">{tError(errorMessage)}</p>)}
        
        <label htmlFor="title">{t("Title")}</label>
        <input
        id="title"
        required
        maxLength={120}
        disabled={saving}
        type="text"
        placeholder={t("e.g. PitchProof")}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />

        <label htmlFor="idea">{t("Idea")}</label>
        <textarea
        id="idea"
        required
        disabled={saving}
        placeholder={t("Describe your business, who it serves, and what you offer.")}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        />
        
        <label htmlFor="idea-problem">{t("Problem")}</label>
        <textarea
        id="idea-problem"
        required
        disabled={saving}
        placeholder={t("What difficulty do your customers face today?")}
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        />

        <label htmlFor="solution">{t("Solution")}</label>
        <textarea
        id="solution"
        required
        disabled={saving}
        placeholder={t("How will your product or service solve that problem?")}
        value={solution}
        onChange={(e) => setSolution(e.target.value)}
        />

        <label htmlFor="category">{t("Category")}</label>
        <select 
        id="category"
        required
        disabled={saving}
        className="create-category-select"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">{t("Select a Category")}</option>
          
          {categories.map((types) => (
            <option key={types} value={types}>
              {t(types)}
            </option>
          ))}
        </select>

        <label htmlFor="idea-visibility">{t("visibility")}</label>

        <select
          id="idea-visibility"
          className="create-category-select"
          value={visibility}
          disabled={saving}
          onChange={(e) => setVisibility(e.target.value)}
        >
          <option value="private">{t("Private")}</option>
          <option value="public">{t("Public")}</option>
          <option value="public-summary">{t("Public (summary only)")}</option>
        </select>

        <p>{t("Share the problem and vision, not your secret sauce.")}</p>

        {visibility === "summary" && (
          <>
          <label htmlFor="public-summary">
              t{("Public summary")}
          </label>

          <textarea 
            id="public-summary"
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
          <h3>{t("Public preview")}</h3>

          {visibility === "private" ? (
            <p>{t("nothing from this idea is published")}</p>
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

        <button type="submit" disabled={saving}> {t(saving ? "Saving..." : "Create Idea")} </button>

      </form>
    </div>
  )
}

export default CreatedIdeaPage
