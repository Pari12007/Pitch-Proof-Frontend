import { Link } from "react-router-dom"

function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">Startup validation platform</div>

          <h1 className="hero-title">
            Validate your startup idea
            <br />
            <span className="hero-gradient">before you build it</span>
          </h1>

          <p className="hero-subtitle">
            Get AI-powered feedback, community reviews, and structured insight
            before you spend time and money building.
          </p>

          <div className="hero-actions">
            <Link to="/ideas" className="hero-primary">Explore Ideas</Link>
            <Link to="/ai-validator" className="hero-secondary">Validate Your Idea with AI</Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-panel">
            <div className="hero-mini-card">
              <h4>AI Validation Score</h4>
              <p>Analyze clarity, strength, and opportunity before execution.</p>
              <div className="mini-rating">Score: 88/100</div>
            </div>

            <div className="hero-mini-card">
              <h4>Community Feedback</h4>
              <p>Collect ratings and real validation from other builders.</p>
              <div className="mini-badge">Top Rated</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="section-heading">
          <h2>How it works</h2>
          <p>Simple, smart, and focused on better startup decisions.</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>Submit your idea</h3>
            <p>Describe the problem, solution, and category clearly.</p>
          </div>

          <div className="feature-card">
            <h3>Get AI analysis</h3>
            <p>Receive a smart validation score and insight summary.</p>
          </div>

          <div className="feature-card">
            <h3>Collect feedback</h3>
            <p>See reviews, ratings, and improve your concept faster.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;