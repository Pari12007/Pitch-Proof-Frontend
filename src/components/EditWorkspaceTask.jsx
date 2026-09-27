import { useState } from "react";
import { updateWorkspaceTask } from "../services/workspaceTask.services";

function EditWorkspaceTask({ workspaceId, task, onSave, onCancel }) {

    const [ title, setTitle ] = useState(task.title);
    const [ dueDate, setDueDate ] = useState(task.dueDate ? task.dueDate.slice(0, 10) : "");
    const [ evidence, setEvidence ] = useState(task.evidence || "");
    const [ saving, setSaving ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(saving || !title.trim()) return;

        setSaving(true);
        setErrorMessage("");
        
        try {
            const response = await updateWorkspaceTask( workspaceId, task._id, { title: title.trim(),
                dueDate: dueDate || null, evidence: evidence.trim(),
            })

            onSave(response.data);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Unable to save your task.");
        } finally {
            setSaving(false);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <h3>Edit Task</h3>

            {errorMessage && (
                <p role="alert">{errorMessage}</p>
            )}

            <div>
                <label htmlFor={`edit-title-${task._id}`}>Task title</label>

                <input
                    id={`edit-title-${task._id}`}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    maxLength={200}
                    disabled={saving}
                    required
                />
            </div>

            <div>
                <label htmlFor={`edit-date-${task._id}`}>
                    Deadline(optional)
                </label>

                <input
                    id={`edit-date-${task._id}`}
                    type="date"
                    value={dueDate}
                    onChange={(event) => setDueDate(event.target.value)}
                    disabled={saving}
                />
            </div>

            <div>
                <label htmlFor={`edit-evidence-${task._id}`}>Evidence and findings</label>

                <textarea 
                    id={`edit-evidence-${task._id}`}
                    value={evidence}
                    onChange={(event) => setEvidence(event.target.value)}
                    placeholder="What did you test, and what did you learn?"
                    maxLength={4000}
                    rows={4}
                    disabled={saving}
                />
            </div>

            <div class="ws-actions">
                <button type="submit" disabled={saving || !title.trim()}>{saving ? "Saving..." : "Save Task"}</button>

                <button type="button" onClick={onCancel} disabled={saving}>Cancel</button>
            </div>
        </form>
    )
}

export default EditWorkspaceTask;