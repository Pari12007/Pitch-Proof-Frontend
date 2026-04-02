import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { validateIdeaWithAI } from "../services/ai.services";
import { AuthContext } from "../context/AuthContext";
import { getMyChat, saveMyChat, clearMyChat } from "../services/chat.services";

function AIValidatorPage() {
  const bottomRef = useRef(null);
  const hasLoadedInitialChat = useRef(false);
  const nav = useNavigate();
  const { user } = useContext(AuthContext);

  const [limitMessage, setLimitMessage] = useState("");
  const [input, setInput] = useState("");
  const [isChatApiAvailable, setIsChatApiAvailable] = useState(true);
  const [chatPersistenceMessage, setChatPersistenceMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const initialMessage = {
    role: "ai",
    content:
      "Hi, I'm PitchProof AI. Share your startup idea or ask a business question, and I'll help you.",
    result: null,
    createdAt: new Date(),
  };

  const chatStorageKey = user?._id
    ? `pitchproof_ai_chat_${user._id}`
    : "pitchproof_ai_chat_guest";

  const [messages, setMessages] = useState([initialMessage]);

  const loadChatFromLocalStorage = () => {
    const saved = localStorage.getItem(chatStorageKey);

    if (saved) {
      try {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (error) {
        console.log("Error parsing saved chat:", error);
      }
    }

    setMessages([initialMessage]);
  };

  const saveChatToLocalStorage = (chatMessages) => {
    localStorage.setItem(chatStorageKey, JSON.stringify(chatMessages));
  };

  const clearChatFromLocalStorage = () => {
    localStorage.removeItem(chatStorageKey);
  };

  const isMissingChatRoute = (error) => error?.response?.status === 404;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
      createdAt: new Date(),
    };

    setLimitMessage("");
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const response = await validateIdeaWithAI(currentInput);

      const aiMessage = {
        role: "ai",
        content: response.data.reply,
        result: response.data,
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.log("AI error:", err);
      console.log(err.response?.data);

      if (err.response?.status === 403) {
        setLimitMessage(
          err.response?.data?.message || "Upgrade to pro to continue"
        );
        return;
      }

      if (err.response?.status === 429) {
        setLimitMessage(
          err.response?.data?.message || "AI is temporarily unavailable. Try again later."
        );
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Something went wrong while validating your idea.",
          result: null,
          createdAt: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchChat = async () => {
      if (!user?._id) {
        loadChatFromLocalStorage();
        hasLoadedInitialChat.current = true;
        return;
      }

      try {
        const response = await getMyChat();

        if (response.data.messages?.length > 0) {
          setMessages(response.data.messages);
        } else {
          setMessages([initialMessage]);
        }

        setIsChatApiAvailable(true);
        setChatPersistenceMessage("");
      } catch (error) {
        console.log("Error loading chat:", error);

        if (isMissingChatRoute(error)) {
          setIsChatApiAvailable(false);
          setChatPersistenceMessage(
            "Chat history is being saved only in this browser because the backend chat route is missing."
          );
          loadChatFromLocalStorage();
        } else {
          setMessages([initialMessage]);
        }
      } finally {
        hasLoadedInitialChat.current = true;
      }
    };

    hasLoadedInitialChat.current = false;
    fetchChat();
  }, [user?._id, chatStorageKey]);

  useEffect(() => {
    const persistChat = async () => {
      if (!hasLoadedInitialChat.current || messages.length === 0) return;

      saveChatToLocalStorage(messages);

      if (!user?._id || !isChatApiAvailable) return;

      try {
        await saveMyChat(messages);
      } catch (error) {
        console.log("Error saving chat:", error);

        if (isMissingChatRoute(error)) {
          setIsChatApiAvailable(false);
          setChatPersistenceMessage(
            "Chat history is being saved only in this browser because the backend chat route is missing."
          );
        }
      }
    };

    persistChat();
  }, [messages, user?._id, isChatApiAvailable, chatStorageKey]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleClearChat = async () => {
    clearChatFromLocalStorage();

    if (user?._id && isChatApiAvailable) {
      try {
        await clearMyChat();
      } catch (error) {
        console.log("Error clearing chat:", error);

        if (isMissingChatRoute(error)) {
          setIsChatApiAvailable(false);
          setChatPersistenceMessage(
            "Chat history is being saved only in this browser because the backend chat route is missing."
          );
        }
      }
    }

    setMessages([initialMessage]);
  };

  const handleEnterSend = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!input.trim() || loading) return;

      handleSubmit(e);
    }
  };

  const formatMessageTime = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-page">
      <div className="chat-header">
        <p className="chat-badge">PitchProof AI</p>
        <button className="clear-chat-button" onClick={handleClearChat}>
          Clear Chat
        </button>
        <h1>Validate Your Idea</h1>
        <p className="chat-subtitle">
          Ask anything about startup ideas, validation, business strategy, or growth.
        </p>
        {chatPersistenceMessage && (
          <p className="chat-subtitle">{chatPersistenceMessage}</p>
        )}
      </div>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat-message-row ${
                message.role === "user" ? "user-row" : "ai-row"
              }`}
            >
              <div
                className={`chat-bubble ${
                  message.role === "user" ? "user-bubble" : "ai-bubble"
                }`}
              >
                <p>{message.content}</p>
                
                <span className="chat-time">
                    {formatMessageTime(message.createdAt)}
                </span>

                {message.result?.type === "idea_validation" && (
                  <div className="chat-report">
                    <div className="chat-score">
                      <span>Score</span>
                      <strong>{message.result.score}/100</strong>
                    </div>

                    <div className="chat-report-grid">
                      <div className="chat-report-card">
                        <h4>Strengths</h4>
                        {message.result.strengths.map((item, i) => (
                          <p key={i}>✔ {item}</p>
                        ))}
                      </div>

                      <div className="chat-report-card">
                        <h4>Weakness</h4>
                        {message.result.weaknesses.map((item, i) => (
                          <p key={i}>⚠ {item}</p>
                        ))}
                      </div>

                      <div className="chat-report-card">
                        <h4>Suggestions</h4>
                        {message.result.suggestions.map((item, i) => (
                          <p key={i}>💡 {item}</p>
                        ))}
                      </div>

                      <div className="chat-report-card">
                        <h4>Verdict</h4>
                        <p>{message.result.verdict}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="chat-message-row ai-row">
              <div className="chat-bubble ai-bubble typing-bubble">
                <p>Thinking...</p>
              </div>
            </div>
          )}

          <div ref={bottomRef}></div>
        </div>

        {limitMessage && (
          <div className="upgrade-banner">
            <div>
              <h4>Upgrade to Pro</h4>
              <p>{limitMessage}</p>
            </div>

            <button onClick={() => nav("/pricing")} className="upgrade-banner-btn">
              View plans
            </button>
          </div>
        )}

        <form className="chat-input-bar" onSubmit={handleSubmit}>
          <textarea
            placeholder="Describe your idea or ask a business question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleEnterSend}
          />

          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default AIValidatorPage;
