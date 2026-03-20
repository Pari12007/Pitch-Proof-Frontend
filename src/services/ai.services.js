import api from "./api";

export const validateIdeaWithAI = (ideaPrompt) => {
    return api.post("api/ai/validate-idea", { ideaPrompt});
};