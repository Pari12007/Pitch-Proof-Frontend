import api from "./api";

export const getWorkspaces = () => {
    return api.get("/api/workspaces");
}

export const createWorkspace = (workspaceData) => {
    return api.post("/api/workspaces", workspaceData);
};

export const getWorkspace = (workspaceId) => {
    return  api.get(`/api/workspaces/${workspaceId}`);
};

export const updateWorkspace = (workspaceId, workspaceData) => {
    return api.patch(`/api/workspaces/${workspaceId}`, workspaceData);
};


export const deleteWorkspace = (workspaceId) => {
    return api.delete(`/api/workspaces/${workspaceId}`);
};

export const getWorkspaceChat = (workspaceId) => {
    return api.get(`/api/workspaces/${workspaceId}/chat`);
};

export const sendWorkspaceMessage = (workspaceId, message, language = "en") => {
    return api.post(`/api/workspaces/${workspaceId}/chat`, {message, language});
};