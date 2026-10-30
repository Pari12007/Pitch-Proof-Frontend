import { useState } from "react";
import { useLanguage } from "../context/languageStore";
import { getReportContent } from "../services/report.services";

const ReportContentPreview = ({ reportId }) => {
    const { t, tError, formatNumber } = useLanguage();

    const [ content, setContent ] = useState(null);
    const [ loading, setLoading ] = useState(false);
    const [ loaded, setLoaded ] = useState(false);
    const [ error, setError ] = useState("");

    const loadContent = async () => {
        if (loading) return;

        setLoading(true);
        setLoaded(false);
        setContent(null);
        setError("");

        try {
            const response = await getReportContent(reportId);
            setContent (response.data.content);
            setLoaded(true);
        } catch (error) {
            setError(error.response?.data?.message || "Unable to load reported content.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="report-content-preview">
            <button 
            type="button"
            disabled={loading}
            onClick={loadContent}
            >
                {t(loading ? "Loading content..." : loaded ? "Reload content" : "View content")}
            </button>

            {error && <p role="alert">{tError(error)}</p>}

            {loaded && !content && (
                <p role="status">
                    {t("Content is unavailable or private.")}
                </p>
            )}

            {loaded && content && (
                <section className="idea-content-card">
                    <p>
                        <strong>{t("Moderation visibility")}</strong>

                        {t(content.moderationStatus === "hidden" ? "Hidden" : "Visible")}
                    </p>

                    {content.targetType === "review" ? (
                        <>
                            <h3>{content.ideaTitle}</h3>
                            <p>{t("Rating:")} {formatNumber(content.rating)}/5</p>
                            <p className="moderation-details">{content.comment}</p>
                        </>
                    ) : (
                        <>
                            <h3>{content.title}</h3>
                            <p>{t(content.category)}</p>

                            {content.visibility === "summary" ? (
                                <>
                                    <h4>{t("Public summary")}</h4>
                                    <p className="moderation-details">
                                        {content.publicSummary}
                                    </p>
                                </>
                            ) : (
                                <>
                                    <h4>{t("Idea")}</h4>
                                    <p className="moderation-details">{content.idea}</p>

                                    <h4>{t("Problem")}</h4>
                                    <p className="moderation-details">{content.problem}</p>

                                    <h4>{t("Solution")}</h4>
                                    <p className="moderation-details">{content.solution}</p>
                                </>
                            )}
                        </>
                    )}
                </section>
            )}
        </div>
    )
}

export default ReportContentPreview;