import api from "./api";

export const getIdeas = () => {
  return api.get("/api/ideas");
};

export const getIdea = (ideaId) => {
  return api.get(`/api/ideas/${ideaId}`);
};

export const createIdea = (ideaData) => {
  return api.post("/api/ideas", ideaData);
};

export const updateIdea = (ideaId, ideaData) => {
  return api.put(`/api/ideas/${ideaId}`, ideaData);
};

export const deleteIdea = (ideaId) => {
  return api.delete(`/api/ideas/${ideaId}`);
};