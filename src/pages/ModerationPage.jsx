import { useContext, useEffect, useState } from "react";
import { AuthContext } from  "../context/AuthContext";
import { useLanguage } from "../context/languageStore";
import  ReportContentPreview  from "../components/ReportContentPreview";
import { getReports, moderateReport } from "../services/report.services";

const reasonLabels = {
    spam: "Spam",
    abuse: "Abuse or harassment",
    privacy: "Privacy concern",
    misleading: "Misleading content",
    other: "Other",
};

const statusLabels = {
    open: "Open",
    resolved: "Resolved",
    dismissed: "Dismissed",
};

function ModerationPage() {
    const { user } = useContext(AuthContext)
    const { t, tError, formatDate } = useLanguage();

    const [ status, setStatus ] = useState("open");
    const [ page, setPage ] = useState(1);
    const [ refresh, setRefresh ] = useState(0);
    const [ result, setResult ] = useState(null);

    const [ actionBusy, setActionbusy ] = useState(false);
    const [ actionError, setActionError ] = useState("");
    const [ actionMessage, setActionMessage ] = useState("");

    const requestKey = `${user?._id}:${status}:${page}:${refresh}`;
    const currentResult = result?.requestKey === requestKey ? result : null;

    useEffect(() => {
        let active = true;

        getReports(status, page).then(({ data }) => {
            if(!active) return;

            setResult({requestKey, reports: data.reports, hasMore: data.hasMore,});
        }).catch((error) => {
            if (!active) return;

            const denied = error.response?.status === 403;

            setResult({ requestKey, error: denied ? "Moderator access required." : error.response?.data?.message || "Unable to load reports.", });
        });

        return () => {
            active = false;
        };
    }, [status, page, requestKey]);


    const handleModeration = async (reportId, action) => {
        if (actionBusy) return;

        const confirmationMessages = {
            hide: "Hide this content from public view?",
            restore: "Remove the moderation restriction? The owner's privacy settings will still apply.",
            dismiss: "Dismiss this report without changing the content?",
        };

        if (!window.confirm(t(confirmationMessages[action]))) {
            return;
        }

        setActionbusy(true);
        setActionError("")
        setActionMessage("");

        try {
            await moderateReport(reportId, action);

            setActionMessage("Moderation action saved.");

            //RELOAD THE QUEUE AND ANY CONTENT PREVIEWS.
            setRefresh((previous) => previous + 1);
        } catch (error) {
            setActionError(error.response?.data?.message || "Unable to save moderation action.");
        } finally {
            setActionbusy(false);
        }
    };


    return ( 
        <main className="moderation-page">
            <h1>{t("Moderation")}</h1>
            <p>{t("Review reports submitted by the community.")}</p>

            {actionError && (
                <p role="alert" className="auth-message auth-message-error">{tError(actionError)}</p>
            )}

            {actionMessage && (
                <p role="status">{t(actionMessage)}</p>
            )}

            <div className="moderation-controls">
                <label htmlFor="report-status">{t("Report status")}</label>

                <select
                id="report-status"
                value={status}
                onChange={(e) => {setStatus(e.target.value); setPage(1);}}
                >
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>
                            {t(label)}
                        </option>
                    ))}
                </select>

                <button type="button" onClick={() => setRefresh((previous) => previous + 1)}>
                    {t("Refresh")}
                </button>
            </div>

            {!currentResult ? (
                <p role="status">{t("Loading reports...")}</p>
            ) : currentResult.error ? (
                <p role="alert" className="auth-message auth-message-error">
                    {tError(currentResult.error)}
                </p>
            ) : (
                <>
                    {currentResult.reports.length === 0 ? (
                        <p>{t("No reports in this category.")}</p>
                    ) : (
                        currentResult.reports.map((report) => (
                            <article className="moderation-card" key={report._id}>
                                <h2>
                                    {t(reasonLabels[report.reason] || "Other")}
                                </h2>

                                <p>
                                    <strong>{t("Content type")}: </strong>
                                    {t(report.targetType === "idea" ? "Idea" : "Review")}
                                </p>

                                <p>
                                    <strong>{t("Content ID")}: </strong>
                                    <code>{report.targetId}</code>
                                </p>

                                <p>
                                    <strong>{t("Status")}: </strong>
                                    {t(statusLabels[report.status] || report.status)}
                                </p>

                                <p>
                                    <strong>{t("Submitted on")}: </strong>
                                    {formatDate(report.createdAt)}
                                </p>

                                <p className="moderation-details">
                                    {report.details || t("No additional details.")}
                                </p>

                                <ReportContentPreview
                                    key={`${user?._id}:${report._id}`} reportId={report._id}
                                />

                                <div className="moderation-controls">
                                    <button
                                    type="button"
                                    disabled={actionBusy}
                                    onClick={() => handleModeration(report._id, "hide")}>
                                        {t("Hide content")}
                                    </button>

                                    <button
                                    type="button"
                                    disabled={actionBusy}
                                    onClick={() => handleModeration(report._id, "restore")}>
                                        {t("Restore content")}
                                    </button>

                                    <button
                                    type="button"
                                    disabled={actionBusy || report.status === "dismissed"}
                                    onClick={() => handleModeration(report._id, "dismiss")}>
                                        {t("Dismiss report")}
                                    </button>
                                </div>
                            </article>
                        ))
                    )}

                    <div className="moderation-controls">
                        <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((previous) => previous - 1)}
                        >
                            {t("Previous")}
                        </button>

                        <span>{t("Page {{page}}", { page })}</span>

                        <button
                        type="button"
                        disabled={!currentResult.hasMore}
                        onClick={() => setPage((previous) => previous + 1)}
                        >
                            {t("Next")}
                        </button>
                    </div>
                </>
            )}
        </main>
    )
}

export default ModerationPage