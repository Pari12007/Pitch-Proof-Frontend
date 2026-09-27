import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createWorkspace } from "../services/workspace.services";

function CreateWorkspacePage() {

    const [ name, setName ] = useState("");
    const [ summary, setSummary ] = useState("");
    const [ customer, setCustomer ] = useState("");
    const [ location, setLocation] = useState("");
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ saving, setSaving ] = useState(false);

    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(saving) return;

        setErrorMessage("");
        setSaving(true);

        try {
            await createWorkspace({
                name: name.trim(),
                summary: summary.trim(),
                customer: customer.trim(),
                location: location.trim(),
            });

            nav("/workspaces");
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Unable to create your business."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <main className="create-workspace-page">
            <Link to="/workspaces" className="ws-back">← My Businesses</Link>
            <span className="ws-eyebrow">Start something new</span>
            <h1>Create Business</h1>
            <p>Give your idea a private space to grow. You can update these details anytime.</p>

            {errorMessage && (
                <p role="alert">{errorMessage}</p>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="business-name">Business name</label>
                    <input
                        id="business-name"
                        type="text"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="e.g. Fresh Lunch"
                        maxLength={120}required
                    />
                </div>

                <div>
                    <label htmlFor="business-summary">Business description</label>
                    <textarea
                        id="business-summary"
                        value={summary}
                        onChange={(event) => setSummary(event.target.value)}
                        placeholder="e.g. Deliver healthy, affordable lunches to office workers through a weekly subscription."
                        maxLength={4000}
                        rows={5}
                        required
                    />
                </div>


                <div>
                    <label htmlFor="business-customer">
                        Target customer (optional)
                    </label>
                    <input
                        id="business-customer"
                        type="text"
                        value={customer}
                        onChange={(event) => setCustomer(event.target.value)}
                        placeholder="e.g. Office workers who want convenient, healthy lunches"
                        maxLength={500}
                    />
                </div>


                <div>
                    <label htmlFor="business-location">
                        location (optional)
                    </label>
                    <input
                        id="business-location"
                        type="text"
                        value={location}
                        onChange={(event) => setLocation(event.target.value)}
                        placeholder="e.g. Madrid, Spain, or online"
                        maxLength={200}
                    />
                </div>

                <button type="submit" disabled={saving}>
                    {saving ? "Creating..." : "Create business"}
                </button>
            <Link to="/workspaces" className="ws-back">Cancel</Link>
            </form>
        </main>
    );
}

export default CreateWorkspacePage