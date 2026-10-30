import api from "./api";


export const reportcontent = (reportData) => {
    return api.post("/api/reports", reportData);
}

export const getReports = (status = "open", page = 1) => {
    return api.get("/api/moderation/reports", {
        params: { status, page },
    });
};

export const getReportContent = (reportId) => {
    return api.get(`/api/moderation/reports/${reportId}/content`);
};

export const moderateReport = (reportId, action) => {
    return api.patch(`/api/moderation/reports/${reportId}`, {action,})
};