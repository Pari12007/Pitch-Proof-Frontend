import { useState } from "react"
import { updateWorkspace } from "../services/workspace.services";

function WorkspaceValidation({ workspace, onSaved }) {
    const [ problem, setProblem ] = useState(workspace.problem || "");
    const [ mainAssumption, setMainAssumption ] = useState(workspace.mainAssumption || "")
    const [ successCriteria, setSuccessCriteria ] = useState(workspace.successCriteria || "")
    const [ saving, setSaving ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");
    const [ saved, setSaved ] = useState(false);

    const handleSave = async (event) => {
        event.preventDefault();

        if(saving) return;

        setSaving(true);
        setErrorMessage("");
        setSaved(false);

        const updates = {
            problem: problem.trim(),
            mainAssumption: mainAssumption.trim(),
            successCriteria: successCriteria.trim(),
        };

        try {
            await updateWorkspace(workspace._id, updates);

            onSaved(updates);
            setSaved(true);
        } catch (error) {
            setErrorMessage(
                error.response?.data?.message || "Unable to save your validation summary."
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <section className="ws-validation">
            <h2>Validation summary</h2>
            <p>
                Record what you need to test and what a successful
                result would look like.
            </p>

            <form onSubmit={handleSave}>
                <label htmlFor="validation-problem">
                    What problem are you solving?
                </label>
                <textarea
                    id="validation-problem"
                    value={problem}
                    onChange={(event) => {
                        setProblem(event.target.value);
                        setSaved(false);
                    }}
                    maxLength={2000}
                    rows={3}
                    disabled={saving}
                />

                <label htmlFor="validation-assumption">
                    What is your main assumption?
                </label>
                <textarea
                    id="validation-assumption"
                    value={mainAssumption}
                    onChange={(event) => {
                        setMainAssumption(event.target.value);
                        setSaved(false);
                    }}
                    maxLength={2000}
                    rows={3}
                    disabled={saving}
                />

                <label htmlFor="validation-success">
                    What result would justify moving forward?
                </label>
                <textarea
                    id="validation-success"
                    value={successCriteria}
                    onChange={(event) => {
                        setSuccessCriteria(event.target.value);
                        setSaved(false);
                    }}
                    maxLength={2000}
                    rows={3}
                    disabled={saving}
                />

                {errorMessage && <p role="alert">{errorMessage}</p>}
                {saved && <p role="status">Validation summary saved.</p>}

                <button
                    type="submit"
                    className="ws-button"
                    disabled={saving}
                >
                    {saving ? "Saving…" : "Save validation summary"}
                </button>
            </form>
        </section>
    )
}

export default WorkspaceValidation;