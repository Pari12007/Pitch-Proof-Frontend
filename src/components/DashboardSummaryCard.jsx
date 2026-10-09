import { useLanguage } from "../context/languageStore";
import { useId, useState } from "react";
import { Link } from "react-router-dom";

function DashboardSummaryCard({ title, count, loading, error, items, emptyMessage,}) {
  const {t , tError, formatNumber } = useLanguage();


    const [ open, setOpen ] = useState(false);
    const panelId = useId();

    return (
        <div className="dashboard-summary-card" onPointerEnter={(event) => {
            if (event.pointerType === "mouse")
                setOpen(true);
        }}
        onPointerLeave={(event) => {
            if(!event.currentTarget.contains(document.activeElement)) {
                setOpen(false);
            }
        }}
        onBlur={(event) => {
            if(!event.currentTarget.contains(event.relatedTarget)) {
                setOpen(false);
            }
        }}
        onKeyDown={(event) => {
            if(event.key === "Escape") {
                setOpen(false);

                event.stopPropagation();
            }
        }}
        >

            <button
            type="button"
            className="dashboard-summary-trigger"
            aria-expanded={open}
            aria-controls={panelId}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}>
                <span className="dashboard-summary-label">{title}</span>

                <strong className="dashboard-summary-count">
                    {loading || error ? "-" : count}
                </strong>

                <span className="dashboard-summary-hint">{t("View summary")}</span>
            </button>

            {open && (
                <div id={panelId} className="dashboard-summary-popover" role="region" aria-label={t("{{0}} summary", {"0": title})}>
                    <div className="dashboard-summary-heading">
                        <strong>{title}</strong>

                        <button
                        type="button"
                        className="dashboard-summary-close"
                        aria-label={t("Close {{0}} summary", {"0": title.toLowerCase()})}
                        onClick={() => setOpen(false)}
                        >
                            ×
                        </button>
                    </div>

                    {loading ? (
                        <p role="status">{t("Loading summary...")}</p>
                    ) : error ? (
                        <p role="alert">{tError(error)}</p>
                    ) : (
                        <>
                        <p className="dashboard-summary-total">{formatNumber(count)} {t("total")}</p>
                        
                        {items.length === 0 ? (
                            <p>{emptyMessage}</p>
                        ) : (
                            <ul className="dashboard-summary-list">
                                {items.slice(0, 5).map((item) => (
                                    <li key={item.id}>
                                        <Link to={item.to}>{item.title}</Link>

                                        <p>{item.detail}</p>

                                        {item.extra && <p>{item.extra}</p>}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {items.length > 5 && (
                            <p>{t("Showing {{shown}} of {{total}} entries.", {shown: 5, total: items.length})}</p>
                        )}

                        <Link to="/workspaces" className="dashboard-text-link"> {t("Open my businesses →")} </Link>
                        </>
                    )}
                </div>
            )}
        </div>
    )
}

export default DashboardSummaryCard;