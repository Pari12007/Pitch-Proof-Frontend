import { useLanguage } from "../context/languageStore";
import { getWorkspaces } from "../services/workspace.services";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function WorkSpacesPage() {
  const { t , tError } = useLanguage();

    
    const [ workspaces, setWorkspaces ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState("");

    useEffect(() => {
        const fetchWorkspaces = async () => {
            try {
                const response = await getWorkspaces();
                setWorkspaces(response.data);
            } catch (error) {
                console.error("Error loading the workspaces:", error);
                setErrorMessage("Unable to load your businesses.");
            }finally{
                setLoading(false);
            }
        };

        fetchWorkspaces();
    }, []);

    if (loading) {
        return <p>{t("Loading your businesses...")}</p>
    }

    if (errorMessage) {
        return <p role="alert">{tError(errorMessage)}</p>;
    }

    return (
        <main className="workspaces-page">
            <header className="ws-header">
                <div>
                    <span className="ws-eyebrow">{t("Your founder workspace")}</span>
                    <h1>{t("My Businesses")}</h1>
                    <p>{t("A place for your ideas, next steps, and what you learn.")}</p>
                </div>
                <Link to="/workspaces/new" className="ws-button">{t("+ Create Business")}</Link>
            </header>
            <p className="ws-list-caption">{t("businessCount", {count: workspaces.length})} {t("· Private to your account")}</p>
            {workspaces.length === 0 ? (
                <section className="ws-empty">
                    <h2>{t("Give your next idea a home.")}</h2>
                    <p>{t("Create a business to organize your tasks and talk through your next steps with AI.")}</p>
                    <Link to="/workspaces/new" className="ws-button">{t("Create your first business")}</Link>
                </section>
            ) : (
                <div className="workspaces-grid">
                    {workspaces.map((workspace) => (
                        <article key={workspace._id} className="workspace-card">
                            <span className="ws-eyebrow">{t("Private workspace")}</span>
                            <h2><Link to={`/workspaces/${workspace._id}`}>{workspace.name}</Link></h2>
                            <p className="ws-card-summary">{workspace.summary}</p>
                            <p className="ws-location">{workspace.location || t("Location not set")}</p>
                            <div className="ws-actions">
                                <Link to={`/workspaces/${workspace._id}`} className="ws-button">{t("Open Business →")}</Link>
                                <Link to={`/workspaces/${workspace._id}/edit`} className="ws-button ws-secondary">{t("Edit")}</Link>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}

export default WorkSpacesPage;
