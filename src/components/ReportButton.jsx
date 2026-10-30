import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/languageStore";
import { reportcontent } from "../services/report.services";

const ReportButton = ({ targetType, targetId }) => {
    const { isLoggedIn } = useContext(AuthContext);
    const { t, tError, validateField, clearFieldValidity } = useLanguage();

    const [ open, setOpen ] = useState(false);
    const [ reason, setReason ] = useState("");
    const [ details, setDetails ] = useState("");
    const [ sending, setSending ] = useState(false);
    const [ submitted, setSubmitted ] = useState(false);
    const [ error, setError ] = useState("");

    const reasons = [
        { value: "spam", label: "Spam" },
        { value: "abuse", label: "Abuse or harassment" },
        { value: "privacy", label: "Privacy concern" },
        { value: "misleading", label: "Misleading content" },
        { value: "other", label: "Other" },
    ];

    const formId = `report-${targetType}-${targetId}`;

    const handleSubmit = async (event) => {
        event.preventDefault();

        if(sending || submitted) return;

        setSending(true);
        setError("");

        try {
            await reportcontent({
                targetType,
                targetId,
                reason,
                details: details.trim(),
            });

            setSubmitted(true)
            setOpen(false);
            setDetails("");
        } catch (error) {
            setError(error.response?.data?.message || "Unable to submit your report. Please try again.");
        } finally {
            setSending(false);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <div className="report-control">
            {submitted ? (<p role="status">{t("Report received. Thank you.")}</p>
            ) : (
                <>
                    <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={formId}
                        disabled={sending}
                        onClick={() => {
                            setOpen((previous) => !previous);
                            setError("");
                        }}
                    >
                        {t(open ? "Cancel report" : "Report")}
                    </button>

                    <form
                        id={formId}
                        hidden={!open}
                        onSubmit={handleSubmit}
                        onInvalid={validateField}
                        onInput={clearFieldValidity}
                    >
                        <label htmlFor={`${formId}-reason`}>
                            {t("Report reason")}
                        </label>

                        <select
                            id={`${formId}-reason`}
                            value={reason}
                            required
                            disabled={sending}
                            onChange={(e) => setReason(e.target.value)}
                        >
                            <option value="">{t("Choose a reason")}</option>

                            {reasons.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {t(option.label)}
                                </option>
                            ))}
                        </select>

                        <label htmlFor={`${formId}-details`}>
                            {t("Details (optional)")}
                        </label>

                        <textarea 
                            id={`${formId}-details`}
                            value={details}
                            maxLength={1000}
                            disabled={sending}
                            onChange={(e) => setDetails(e.target.value)}
                        />

                        <small>{details.length}/1000</small>

                        {error && (
                            <p role="alert" className="auth-message auth-message-error">
                                {tError(error)}
                            </p>
                        )}

                        <button type="submit" disabled={sending}>
                            {t(sending ? "Sending..." : "Submit report")}
                        </button>
                    </form>
                </>
            )}
        </div>
    )
}

export default ReportButton;