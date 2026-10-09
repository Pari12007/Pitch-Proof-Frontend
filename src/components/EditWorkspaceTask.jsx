import { useLanguage } from "../context/languageStore";
import { useState } from "react";
import { updateWorkspaceTask } from "../services/workspaceTask.services";

function EditWorkspaceTask({ workspaceId, task, onSave, onCancel }) {
  const { t , tError, validateField, clearFieldValidity } = useLanguage();


    const [ title, setTitle ] = useState(task.title);
    const [ dueDate, setDueDate ] = useState(task.dueDate ? task.dueDate.slice(0, 10) : "");
    const [ evidence, setEvidence ] = useState(task.evidence || "");
    const [ saving, setSaving ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState("");

    const originalDeadline = task.dueDate?.slice(0, 10) || "";

    const dateParts = new Intl.DateTimeFormat("en", {
        timeZone: "Europe/Madrid",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(new Date());

    const getPart = (type) => dateParts.find((part) => part.type === type).value;

    const today = `${getPart("year")}-${getPart("month")}-${getPart("day")}`;

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
        <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={handleSubmit}>
            <h3>{t("Edit Task")}</h3>

            {errorMessage && (
                <p role="alert">{tError(errorMessage)}</p>
            )}

            <div>
                <label htmlFor={`edit-title-${task._id}`}>{t("Task title")}</label>

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
                <label htmlFor={`edit-date-${task._id}`}> {t("Deadline(optional)")} </label>

                <input
                    id={`edit-date-${task._id}`}
                    type="date"
                    value={dueDate} 
                    onChange={(event) => setDueDate(event.target.value)}
                    disabled={saving}
                    min={originalDeadline && dueDate === originalDeadline ? originalDeadline : today}
                />
            </div>

            <div>
                <label htmlFor={`edit-evidence-${task._id}`}>{t("Evidence and findings")}</label>

                <textarea 
                    id={`edit-evidence-${task._id}`}
                    value={evidence}
                    onChange={(event) => setEvidence(event.target.value)}
                    placeholder={t("What did you test, and what did you learn?")}
                    maxLength={4000}
                    rows={4}
                    disabled={saving}
                />
            </div>

            <div className="ws-actions">
                <button type="submit" disabled={saving || !title.trim()}>{saving ? t("Saving...") : t("Save Task")}</button>

                <button type="button" onClick={onCancel} disabled={saving}>{t("Cancel")}</button>
            </div>
        </form>
    )
}

export default EditWorkspaceTask;