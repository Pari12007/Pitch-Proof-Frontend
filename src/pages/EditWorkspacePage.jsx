import { useState, useEffect} from "react";
import { useNavigate, Link,  useParams } from "react-router-dom";
import { updateWorkspace, getWorkspace } from "../services/workspace.services";

function EditWorkspacePage() {

    const { workspaceId } = useParams();
    const nav = useNavigate();
    
    
    const [ name, setName ] = useState("");
    const [ summary, setSummary ] = useState("");
    const [ customer, setCustomer ] = useState("");
    const [location , setLocation ] = useState("");

    const [ saving, setSaving ] = useState(false);
    const [ loadError, setLoadError ] = useState("")
    const [ loading, setLoading ] = useState(true);
    const [ errorMessage, setErrorMessage ] = useState("");

    useEffect(() => {
        let active = true;


        const fetchWorkspace = async () => {
            setLoading(true);
            setErrorMessage("");

            try {
                const response = await getWorkspace(workspaceId);
                const workspace = response.data;

                if(active) {
                    setName(workspace.name || "");
                    setSummary(workspace.summary || "");
                    setCustomer(workspace.customer || "");
                    setLocation(workspace.location || "");
                }
            } catch (error) {
                if (active) {
                    setLoadError(
                        error.response?.status === 404 ? "Workspace not found." : "Unable to load your business"
                    );
                };
            } finally {
                if(active) {
                    setLoading(false);
                }
            }

        };
        fetchWorkspace();

        return () => {
            active = false;
        }
}, [workspaceId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(saving) return;

        setErrorMessage("");
        setSaving(true);

        try {
            await updateWorkspace(workspaceId, {
                name: name.trim(),
                summary: summary.trim(),
                customer: customer.trim(),
                location: location.trim(),
            });

            nav(`/workspaces/${workspaceId}`);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Unable to save your changes."
            );
        } finally {
            setSaving(false);
        }
    };

    if(loading){
        return <p>Updating your business...</p>
    }

    if(loadError){
        return (
            <main className="edit-workspace-page">
                <p role="alert">{loadError}</p>
                <Link to="/workspaces">Back to My Businesses</Link>
            </main>
        );
    }


    return (
        <main className="edit-workspace-page">
            <Link to={`/workspaces/${workspaceId}`} className="ws-back">← Back to business</Link>
            <h1>Edit Business</h1>

            {errorMessage && <p role="alert">{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Business name</label>
                        <input
                            id="name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            maxLength={120}required
                        />
                </div>

                <div>
                    <label htmlFor="summary">
                        Business description
                    </label>

                    <textarea
                        id="summary"
                        value={summary}
                        onChange={(event) => setSummary(event.target.value)}
                        maxLength={4000}
                        rows={5}
                        required
                    />
                </div>

                <div>
                    <label htmlFor="customer">Target customer(optional)</label>
                    <input
                        id="customer"
                        value={customer}
                        onChange={(event) => setCustomer(event.target.value)}
                        maxLength={500}
                    />
                </div>

                <div>
                    <label htmlFor="location">Location (optional)</label>

                    <input
                        id="location"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        maxLength={200}
                    />
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save changes"}
                </button>

                <Link to={`/workspaces/${workspaceId}`}>
                    Cancel
                </Link>
            </form>
        </main>
    )
}

export default EditWorkspacePage