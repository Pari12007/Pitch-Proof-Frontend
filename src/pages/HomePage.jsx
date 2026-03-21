import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="home-page">
      {/* --------------------------- HERO SECTION ------------------------- */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">Startup validation platform</div>

          <h1 className="hero-title">
            Wanna build startup?
            <br />
            <span className="hero-gradient">Validate before you build</span>
          </h1>

          <p className="hero-subtitle">
            Get AI-powered feedback, community reviews, and structured insight
            before you spend time and money building.
          </p>

          <div className="hero-actions">
            <Link to="/ideas" className="hero-primary">
              Explore Ideas
            </Link>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-panel">
            <div className="hero-mini-card">
              <h4>AI Validation Score</h4>
              <p>
                Analyze clarity, strength, and opportunity before execution.
              </p>
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

      {/* --------------------------- AI VALIDATION SECTION ------------------------- */}
      <section className="ai-cta-section">
        <div className="ai-cta-content">
          <h2>
            Validate your startup idea using latest <br />
            <span className="gradient-text">AI</span>
          </h2>

          <p>
            Get instant feedback, identify strengths, uncover weaknesses, and
            improve your idea before building it.
          </p>

          <Link to="/ai-validator" className="cta-button">
            Validate Your Idea
          </Link>
        </div>
      </section>

      {/* --------------------------- POST YOUR IDEA SECTION SECTION ------------------------- */}
      <section className="post-idea-section">
  <div className="post-idea-content">
    <div className="post-idea-text">
      <h2>Ready to share your idea with the world?</h2>
      <p>
        Once you’ve validated your concept, post it to PitchProof and collect real reviews,
        ratings, and community insight.
      </p>

      <Link to="/create-idea" className="hero-primary">
        Post Your Idea
      </Link>
    </div>

    <div className="post-idea-card">
      <h3>What happens when you post?</h3>
      <ul>
        <li>Your idea becomes visible on the platform</li>
        <li>Other users can review and rate it</li>
        <li>You build clarity before execution</li>
      </ul>
    </div>
  </div>
</section>


      {/* --------------------------- COMMUNITY FEEDBACK SECTION ------------------------- */}
      <section className="community-section">
        <div className="section-heading">
          <h2>Join a community of builders</h2>
          <p>
            Discover ideas, give feedback, and learn from other entrepreneurs
            building their next big thing.
          </p>
        </div>

        <div className="community-grid">
          <div className="community-card">
            <h3>Explore Ideas</h3>
            <p>
              Browse startup ideas from different industries and see how others
              are thinking.
            </p>
            <Link to="/ideas" className="community-link">
              Explore Ideas →
            </Link>
          </div>

          <div className="community-card">
            <h3>Give Feedback</h3>
            <p>
              Help others improve by leaving reviews and ratings on their ideas.
            </p>
          </div>

          <div className="community-card">
            <h3>Learn What Works</h3>
            <p>
              Understand what makes an idea strong by seeing top-rated and
              trending ideas.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------- METHODOLODY SECTION ------------------------- */}
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

      {/* --------------------------- FINAL CTA SECTION ------------------------- */}
      <section className="final-cta">
        <h2>Stop guessing. Start building with clarity.</h2>

        <p>Your next big idea deserves validation before execution.</p>

        <Link to="/ai-validator" className="cta-button">
          Get your validation now ⚡️
        </Link>
      </section>
    </div>
  );
}

export default HomePage;
