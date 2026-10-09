import { useLanguage } from "../context/languageStore";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";


function HomePage() {
  const { t } = useLanguage();


  const { isLoggedIn } = useContext(AuthContext);

  const privateLink = (path) => (isLoggedIn ? path : "/signup");

  const features = [
    {
      title: t("Your personal dashboard"),
      description: t("See your business, pending tasks, completed work, and recent reviews in one place."),
      path: "/dashboard",
      action: t("Open your dashboard"),
    },
    {
      title: t("Private business workspaces"),
      description: t("Keep your business summary, target customers, stage, and validation notes together."),
      path: "/workspaces",
      action: t("Explore your businesses"),
    },
    {
      title: t("Tasks with a clear next step"),
      description: t("Set deadlines, track progress, and see what needs your attention next."),
      path: "/workspaces",
      action: t("Plan your next steps"),
    },
    {
      title: t("AI feedback and guidance"),
      description: t("Explore your idea with AI analysis discuss your next steps with the mentor inside your workspace."),
      path: "/ai-validator",
      action: t("Try AI validation"),
    },
  ];


  return (
    // <main className="home-page home-refresh">

    //   {/* --------------------------- HERO SECTION ------------------------- */}
    //   <section className="hero">
    //     <div className="hero-left">
    //       <div className="hero-badge">
    //         Startup validation platform
    //       </div>

    //       <h1 className="hero-title">Want to build a startup?
    //         <br/>
    //         <span className="hero-gradient">Validate before you build</span>
    //       </h1>

    //       <p className="hero-subtitle">Get AI-powered feedback, collect community reviews, and organise your business into clear, manageable steps before you spend time and money building.
    //       </p>

    //       <div className="hero-actions">
    //         <Link to={privateLink("/workspaces/new")} className="hero-primary">
    //           {isLoggedIn ? "Create a business" : "Get started"}
    //         </Link>

    //         <Link to="/ideas" className="hero-secondary">
    //           Explore ideas
    //         </Link>
    //       </div>

    //       <p className="home-hero-note">
    //         Public ideas for feedback. Private worksapces for your plans.
    //       </p>
    //     </div>

    //     <div className="hero-right">
    //       <section className="home-preview" aria-labelledby="home-preview-heading">
    //         <div className="home-preview-heading">
    //           <div>
    //             <span className="section-kicker">Your workspace</span>

    //             <h2 id="home-preview-heading">A clearer picture.</h2>
    //           </div>

    //           <span className="home-example-label">Example</span>
    //         </div>

    //         <div className="home-preview-business">
    //           <span className="home-preview-stage">
    //             Customer research
    //           </span>
    //           <h3>Healthy office lunches</h3>
    //           <p>Affordable lunches for busy office workers.</p>
    //         </div>

    //         <dl className="home-preview-stats">
    //           <div>
    //             <dt>Total tasks</dt>
    //             <dd>6</dd>
    //           </div>

    //           <div>
    //             <dt>Pending</dt>
    //             <dd>4</dd>
    //           </div>

    //           <div>
    //             <dt>Completed</dt>
    //             <dd>2</dd>
    //           </div>
    //         </dl>

    //         <div className="home-preview-next">
    //           <span className="section-kicker">Next step</span>
    //           <h3>Talk to five potential customers</h3>
    //           <p>
    //             Learn how they choose lunch and what they would change.
    //           </p>
    //         </div>
    //       </section>
    //     </div>
    //   </section>

    //   {/* Product features */}
    //   <section
    //     className="home-tools-section"
    //     aria-labelledby="home-tools-heading"
    //   >
    //     <div className="section-heading">
    //       <p className="section-kicker">Your everyday tools</p>
    //       <h2 id="home-tools-heading">
    //         Keep your ideas and your progress connected.
    //       </h2>
    //       <p>
    //         Move from collecting feedback to planning what you will do next.
    //       </p>
    //     </div>

    //     <div className="home-tools-grid">
    //       {features.map((feature) => (
    //         <article className="home-tool-card" key={feature.title}>
    //           <h3>{feature.title}</h3>
    //           <p>{feature.description}</p>

    //           <Link to={privateLink(feature.path)}>
    //             {feature.action} →
    //           </Link>
    //         </article>
    //       ))}
    //     </div>
    //   </section>

    //   {/* Community */}
    //   <section className="post-idea-section">
    //     <div className="post-idea-content">
    //       <div className="post-idea-text">
    //         <p className="section-kicker">Community feedback</p>
    //         <h2>A different perspective can make a difference.</h2>
    //         <p>
    //           Share the problem you want to solve and your proposed
    //           solution. Read reviews, explore other ideas, and contribute
    //           your own feedback.
    //         </p>

    //         <Link
    //           to={privateLink("/create-idea")}
    //           className="hero-primary"
    //         >
    //           Post Your Idea
    //         </Link>
    //       </div>

    //       <div className="post-idea-card">
    //         <h3>Explore before you start</h3>

    //         <ul>
    //           <li>Browse ideas by category</li>
    //           <li>Read community ratings and reviews</li>
    //           <li>Share constructive feedback with other builders</li>
    //         </ul>

    //         <Link to="/ideas" className="community-link">
    //           Browse community ideas →
    //         </Link>
    //       </div>
    //     </div>
    //   </section>

    //   {/* How it works */}
    //   <section
    //     className="features-section"
    //     aria-labelledby="home-process-heading"
    //   >
    //     <div className="section-heading">
    //       <p className="section-kicker">Make a start</p>
    //       <h2 id="home-process-heading">
    //         A simple way to move forward
    //       </h2>
    //     </div>

    //     <div className="features-grid">
    //       <article className="feature-card">
    //         <span className="home-step-number">01</span>
    //         <h3>Explore your idea</h3>
    //         <p>
    //           Describe the problem, consider your solution, and use AI
    //           feedback to identify questions worth investigating.
    //         </p>
    //       </article>

    //       <article className="feature-card">
    //         <span className="home-step-number">02</span>
    //         <h3>Build your plan</h3>
    //         <p>
    //           Create a private workspace, define your target customer,
    //           and turn your next steps into tasks.
    //         </p>
    //       </article>

    //       <article className="feature-card">
    //         <span className="home-step-number">03</span>
    //         <h3>Learn and improve</h3>
    //         <p>
    //           Collect feedback, record what you discover, and update
    //           your plan as you make progress.
    //         </p>
    //       </article>
    //     </div>
    //   </section>

    //   {/* Final invitation */}
    //   <section className="final-cta">
    //     <p className="section-kicker">Your next step</p>
    //     <h2>Start with an idea. Make progress one task at a time.</h2>
    //     <p>
    //       Bring your thinking, feedback, and business planning together.
    //     </p>

    //     <Link
    //       to={privateLink("/workspaces/new")}
    //       className="cta-button"
    //     >
    //       {isLoggedIn ? "Create Your Workspace" : "Create Your Account"}
    //     </Link>
    //   </section>
    // </main>



    <div className="home-page">
      {/* --------------------------- HERO SECTION ------------------------- */}
      <section className="hero">
        <div className="hero-left">
          <div className="hero-badge">{t("Startup validation platform")}</div>

          <h1 className="hero-title"> {t("Want to build a startup?")} <br />
            <span className="hero-gradient">{t("Validate before you build")}</span>
          </h1>

          <p className="hero-subtitle"> {t("Get AI-powered feedback, community reviews, and structured insight before you spend time and money building.")} </p>

          <div className="hero-actions">
            <Link to="/ideas" className="hero-primary"> {t("Explore Ideas")} </Link>
            <Link to={isLoggedIn ? "/ai-validator" : "/signup"} className="hero-secondary"> {t("Try AI Validation")} </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-chip">
              <strong>{t("AI-first")}</strong>
              <span>{t("Instant validation and clarity")}</span>
            </div>
            <div className="stat-chip">
              <strong>{t("Community")}</strong>
              <span>{t("Real reviews from other builders")}</span>
            </div>
            <div className="stat-chip">
              <strong>{t("Faster")}</strong>
              <span>{t("Build with more confidence")}</span>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-panel">
            <div className="hero-panel-top">
              <span className="hero-dot"></span>
              <span className="hero-dot"></span>
              <span className="hero-dot"></span>
            </div>

            <div className="hero-mini-card">
              <h4>{t("AI Validation Score")}</h4>
              <p> {t("Analyze clarity, strength, and opportunity before execution.")} </p>
              <div className="mini-rating">{t("Score: 88/100")}</div>
            </div>

            <div className="hero-mini-card">
              <h4>{t("Community Feedback")}</h4>
              <p>{t("Collect ratings and real validation from other builders.")}</p>
              <div className="mini-badge">{t("Top Rated")}</div>
            </div>

            <div className="hero-mini-card hero-mini-card-dark">
              <h4>{t("Builder workflow")}</h4>
              <div className="hero-flow-list">
                <span>{t("1. Submit your idea")}</span>
                <span>{t("2. Validate with AI")}</span>
                <span>{t("3. Collect real feedback")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------- AI VALIDATION SECTION ------------------------- */}
      <section className="ai-cta-section">
        <div className="ai-cta-content">
          <p className="section-kicker">{t("AI workflow")}</p>
          <h2> {t("Validate your startup idea using latest")} <br />
            <span className="gradient-text">{t("AI")}</span>
          </h2>

          <p> {t("Get instant feedback, identify strengths, uncover weaknesses, and improve your idea before building it.")} </p>

          <Link to={isLoggedIn ? "/ai-validator" : "/signup"} className="cta-button"> {t("Validate Your Idea")} </Link>
        </div>
      </section>

      {/* --------------------------- POST YOUR IDEA SECTION SECTION ------------------------- */}
      <section className="post-idea-section">
        <div className="post-idea-content">
          <div className="post-idea-text">
            <p className="section-kicker">{t("Publish and learn")}</p>
            <h2>{t("Ready to share your idea with the world?")}</h2>
            <p> {t("Once you’ve validated your concept, post it to PitchProof and collect real reviews, ratings, and community insight.")} </p>

            <Link to={ isLoggedIn ? "/create-idea" : "/signup"} className="hero-primary"> {t("Post Your Idea")} </Link>
          </div>

          <div className="post-idea-card">
            <h3>{t("What happens when you post?")}</h3>
            <ul>
              <li>{t("Your idea becomes visible on the platform")}</li>
              <li>{t("Other users can review and rate it")}</li>
              <li>{t("You build clarity before execution")}</li>
            </ul>
          </div>
        </div>
      </section>


      {/* --------------------------- COMMUNITY FEEDBACK SECTION ------------------------- */}
      <section className="community-section">
        <div className="section-heading">
          <p className="section-kicker">{t("Community feedback")}</p>
          <h2>{t("Join a community of builders")}</h2>
          <p> {t("Discover ideas, give feedback, and learn from other entrepreneurs building their next big thing.")} </p>
        </div>

        <div className="community-grid">
          <div className="community-card">
            <h3>{t("Explore Ideas")}</h3>
            <p> {t("Browse startup ideas from different industries and see how others are thinking.")} </p>
            <Link to="/ideas" className="community-link"> {t("Explore Ideas →")} </Link>
          </div>

          <div className="community-card">
            <h3>{t("Give Feedback")}</h3>
            <p> {t("Help others improve by leaving reviews and ratings on their ideas.")} </p>
          </div>

          <div className="community-card">
            <h3>{t("Learn What Works")}</h3>
            <p> {t("Understand what makes an idea strong by seeing top-rated and trending ideas.")} </p>
          </div>
        </div>
      </section>

      {/* ---------------- BUSINESS WORKSPACES SECTION ---------------- */}
      <section className="post-idea-section">
        <div className="post-idea-content">
          <div className="post-idea-text">
            <p className="section-kicker">{t("Your business workspaces")}</p>

            <h2>{t("Turn your ideea into a plan you can follow")}</h2>

            <p>{t("Create a private workspace for your business. Keep your overview, target customers, validation notes, and tasks together while you work towards your next milestone.")}</p>

            <div className="hero-actions">
              <Link to={isLoggedIn ? "/workspaces/new" : "/signup"} className="hero-primary"> {t("Create a business")} </Link>

              <Link to={isLoggedIn ? "/workspaces" : "/login"} className="hero-secondary"> {t("My businesses")} </Link>
            </div>
          </div>

          <div className="post-idea-card">
            <h3>{t("A home for every business idea")}</h3>

            <ul>
              <li>{t("Define your business and who it helps")}</li>
              <li>{t("Create tasks and set deadlines")}</li>
              <li>{t("Track pending and completed work")}</li>
              <li>{t("Save what you learn in your validation summary")}</li>
              <li>{t("discuss your next steps with your AI business mentor")}</li>
            </ul>

            <p>{t("your workspaces is private. Ideas you post to the community are public.")}</p>
          </div>
        </div>
      </section>

      {/* --------------------------- METHODOLODY SECTION ------------------------- */}
      <section className="features-section">
        <div className="section-heading">
          <p className="section-kicker">{t("Simple process")}</p>
          <h2>{t("How it works")}</h2>
          <p>{t("Simple, smart, and focused on better startup decisions.")}</p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <h3>{t("Explore your idea")}</h3>
            <p> {t("Describe your problem and solution, get AI analysis, and share your idea for community feedback.")} </p>
          </div>

          <div className="feature-card">
            <h3>{t("Create your business workspace")}</h3>
            <p> {t("Bring your business overview, target customers, and validation notes together in one private place.")} </p>
          </div>

          <div className="feature-card">
            <h3>{t("Plan and track your progress")}</h3>
            <p> {t("Turn your next steps into tasks, set deadlines, and follow your progess from your dashboard.")} </p>
          </div>
        </div>
      </section>

      {/* --------------------------- FINAL CTA SECTION ------------------------- */}
      <section className="final-cta">
        <p className="section-kicker">{t("Start now")}</p>
        <h2>{t("Stop guessing. Start building with clarity.")}</h2>

        <p>{t("Your next big idea deserves validation before execution.")}</p>

        <Link to={ isLoggedIn ? "/ai-validator" : "/signup"} className="cta-button"> {t("Get your validation now ⚡️")} </Link>
      </section>
    </div>
  );
}

export default HomePage;
