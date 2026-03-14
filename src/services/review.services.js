import api from "./api";

export const getReviews = (ideaId) => {
  return api.get(`/api/ideas/${ideaId}/reviews`);
};

export const createReview = (ideaId, reviewData) => {
  return api.post(`/api/ideas/${ideaId}/reviews`, reviewData);
};

export const deleteReview = (reviewId) => {
  return api.delete(`/api/reviews/${reviewId}`);
};