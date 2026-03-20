import { useState} from "react";
import { validateIdeaWithAI } from "../services/ai.services";

function AIValidatorPage() {
    const [input, setInput] = useState("");
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try{
            setLoading(true);
            const response = await validateIdeaWithAI(input);
            setResult(response.data);
        } catch (err) {
            console.log("AI error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        // <div className="ai-page">
        //     <h1>Validate your idea</h1>

        //     <form onSubmit={handleSubmit} className="ai-form">
        //         <textarea
        //         placeholder="Describe your idea or ask anything about buisness..."
        //         value={input}
        //         onChange={(e) => setInput(e.target.value)}
        //         />

        //         <button type="submit">
        //             {loading ? "Thinking..." : "Ask AI"}
        //         </button>
        //     </form>

        //     {result && (
        //         <div className="ai-result">
        //             {/* 🧠 MAIN REPLY */}
        //   <div className="ai-reply">
        //     <h3>AI Response</h3>
        //     <p>{result.reply}</p>
        //   </div>

        //   {/* ⭐ ONLY IF IDEA VALIDATION */}
        //   {result.type === "idea_validation" && (
        //     <>
        //       <h2>Score: {result.score}/100</h2>

        //       <div className="ai-section">
        //         <h3>Strengths</h3>
        //         {result.strengths.map((item, i) => (
        //           <p key={i}>✔ {item}</p>
        //         ))}
        //       </div>

        //       <div className="ai-section">
        //         <h3>Weaknesses</h3>
        //         {result.weaknesses.map((item, i) => (
        //           <p key={i}>⚠ {item}</p>
        //         ))}
        //       </div>

        //       <div className="ai-section">
        //         <h3>Suggestions</h3>
        //         {result.suggestions.map((item, i) => (
        //           <p key={i}>💡 {item}</p>
        //         ))}
        //       </div>

        //       <div className="ai-section">
        //         <h3>Verdict</h3>
        //         <p>{result.verdict}</p>
        //       </div>
        //     </>
        //   )}
        //         </div>
        //     )}
        // </div>

        <div className="ai-premium-page">
      <section className="ai-hero">
        <div className="ai-hero-badge">AI Startup Mentor</div>

        <h1 className="ai-hero-title">
          Validate your idea with
          <span className="ai-gradient-text"> real AI feedback</span>
        </h1>

        <p className="ai-hero-subtitle">
          Ask about startup ideas, business strategy, roadmap, market fit, or
          definitions. Get structured analysis and natural feedback in one place.
        </p>
      </section>

      <section className="ai-workspace">
        <div className="ai-input-card">
          <div className="ai-card-header">
            <h2>Ask PitchProof AI</h2>
            <span className="ai-card-pill">Live analysis</span>
          </div>

          <form onSubmit={handleSubmit} className="ai-premium-form">
            <textarea
              placeholder="Describe your startup idea or ask a business question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />

            <div className="ai-form-actions">
              <p className="ai-helper-text">
                Example: “Validate my anti-theft app idea for tourists”
              </p>

              <button type="submit" className="ai-submit-btn">
                {loading ? "Thinking..." : "Ask AI"}
              </button>
            </div>
          </form>
        </div>

        {result && (
          <div className="ai-output-card">
            <div className="ai-card-header">
              <h2>AI Response</h2>
              {result.type === "idea_validation" && (
                <span className="ai-score-pill">{result.score}/10</span>
              )}
            </div>

            <div className="ai-main-reply">
              <p>{result.reply}</p>
            </div>

            {result.type === "idea_validation" && (
              <div className="ai-analysis-grid">
                <div className="ai-analysis-card">
                  <h3>Strengths</h3>
                  {result.strengths.map((item, i) => (
                    <p key={i}>✔ {item}</p>
                  ))}
                </div>

                <div className="ai-analysis-card">
                  <h3>Weaknesses</h3>
                  {result.weaknesses.map((item, i) => (
                    <p key={i}>⚠ {item}</p>
                  ))}
                </div>

                <div className="ai-analysis-card">
                  <h3>Suggestions</h3>
                  {result.suggestions.map((item, i) => (
                    <p key={i}>💡 {item}</p>
                  ))}
                </div>

                <div className="ai-analysis-card">
                  <h3>Verdict</h3>
                  <p>{result.verdict}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
    )
}

export default AIValidatorPage;