import { useContext, useEffect, useState } from "react";
import { getWorkspace, getWorkspaces } from "../services/workspace.services";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const DashboardPage = () => {

  const { user } = useContext(AuthContext);

  const [ businesses, setBusinesses ] = useState([]);
  const [ businessesLoading, setBusinessesLoading ] = useState(true);
  const [ businessesError, setBusinessesError ] = useState("");
  
  const stageLabels = {
    idea: "Idea",
    customer_research: "Customer research",
    testing_demand: "Testing demand",
    building: "Building",
    launched: "Launched",
  }

  useEffect(() => {
    let active = true;

    const fetchBusinesses = async () => {
      setBusinessesLoading(true);
      setBusinessesError("");
      setBusinesses([]);

      try {
        const response = await getWorkspaces();

        if (active) {
          setBusinesses(response.data);
        }
      } catch (error) {
        if(active) {
          setBusinessesError(error.reponse?.data?.message || "Unable to load your businesses.")
        }
      } finally {
        if(active) {
          setBusinessesLoading(false);
        }
      }
    }

    if(user?._id) {
      fetchBusinesses();

      return () => {
        active = false;
      }
    }

  }, [user?._id]);

  return (
    <main className="account-dashboard">
      <header className="dashboard-header">
        <div>
          <span className="ws-eyebrow">Your dashboard</span>

          <h1>Welcome Back, {user?.name || "founder"}</h1> 
          {/* //In the end make it a if/else for the first time user===welcome and afterwards it should be welcome back. */}

          <p>Your businesses, next steps, and community feedback in one place.</p>
        </div>

        <Link to="/workspaces/new" className="ws-button">
            Create Business
        </Link>
      </header>

      <section aria-labelledby="dashboard-overview-heading">

        <h2 id="dashboard-overview-heading">Account overview</h2>

        <dl className="dashboard-stats">
          <div><dt>Businesses</dt><dd>{businessesLoading || businessesError ? "-" : businesses.length}</dd></div>
          <div><dt>Open tasks</dt><dd>—</dd></div>
          <div><dt>Completed tasks</dt><dd>—</dd></div>
          <div><dt>Overdue tasks</dt><dd>—</dd></div>
        </dl>

        <p className="dashboard-note">
          task statistice hasvent been connected.
        </p>
      </section>

      <div className="dashboard-columns">
        <section className="dashboard-panel">
          <div className="dashboard-section-heading">
            <h2>Needs attention</h2>

            <span className="dashboard-tag">
              Deadline
            </span>
          </div>

          <p>
            Your overdue tasks and upcoming deadlines will appear here once task data is connected.
          </p>

          <Link to="/workspaces" className="dashboard-text-link">
            Open my businesses →
          </Link>
        </section>


        <section className="dashboard-panel">
          <h2>Quick links</h2>

          <nav className="dashboard-quick-links" aria-label="Dashboard shortcuts">
            <Link to="/workspaces">My businesses →</Link>
            <Link to="/my-ideas">My ideas →</Link>
            <Link to="/create-idea">Post your idea →</Link>
            <Link to="/ai-validator">AI validator →</Link>
          </nav>
        </section>
      </div>

      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <h2>My businesses</h2>

          <Link to="/workspaces" className="dashboard-text-link">
            View all →
          </Link>
        </div>

        {businessesLoading ? (
          <p role="status">Loading your businesses...</p>
        ) : businessesError ? (
          <p role="alert">{businessesError}</p>
        ) : businesses.length === 0 ? (
          <div>
            <p>You haven't created a business yet.</p>
            <Link to="/workspaces/new" className="ws-button">Create your first business</Link>
          </div>
        ) : (
          <div className="ideas-grid">{businesses.map((business) => (
            <Link key={business._id} to={`/workspaces/${business._id}`} className="idea-link">
              <article className="idea-card">
                <div className="idea-card-top">
                  <h3>{business.name}</h3>

                  <span className="idea-category">{stageLabels[business.stage] || "Idea"}</span>
                </div>

                <p className="idea-description">{business.summary}</p>

                <div className="idea-footer">
                  <span>Open business →</span>
                </div>

              </article>
            </Link>
          ))}</div>
        )}
      </section>

      <section className="dashboard-panel">
        <div className="dashboard-section-heading">
          <h2>Community activity</h2>

          <Link to="/my-ideas" className="dashboard-text-link">
            My ideas →
          </Link>
        </div>


        <p>
          Recent reviews on your posted ideas will appear here once review data is connected.
        </p>
      </section>
    </main>
  )
}

export default DashboardPage