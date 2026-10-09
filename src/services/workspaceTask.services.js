import api from "./api";

export const getWorkspaceTasks = (workspaceId) => {
    return api.get(`/api/workspaces/${workspaceId}/tasks`);
}

export const createWorkspaceTask = (workspaceId, taskData) => {
    return api.post(`/api/workspaces/${workspaceId}/tasks`, taskData);
}

export const updateWorkspaceTask = (workspaceId, taskId, updates) => {
    return api.patch(`/api/workspaces/${workspaceId}/tasks/${taskId}`, updates);
};

export const deleteWorkspaceTask = (workspaceId, taskId) => {
    return api.delete(`/api/workspaces/${workspaceId}/tasks/${taskId}`);
}


export const getWorkspaceTaskSuggestions = (workspaceId, language = "en") => {
    return api.post(`/api/workspaces/${workspaceId}/task-suggestions`, { language });
};
