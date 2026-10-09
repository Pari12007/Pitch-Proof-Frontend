import api from "./api";

export const validateIdeaWithAI = (ideaPrompt, language = "en") => {
    return api.post("api/ai/validate-idea", { ideaPrompt, language});
};