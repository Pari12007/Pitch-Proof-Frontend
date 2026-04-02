import api from "./api";

export const getMyChat = () => {
  return api.get("/api/chat/my-chat");
};

export const saveMyChat = (messages) => {
  return api.put("/api/chat/my-chat", { messages });
};

export const clearMyChat = () => {
  return api.delete("/api/chat/my-chat");
};
