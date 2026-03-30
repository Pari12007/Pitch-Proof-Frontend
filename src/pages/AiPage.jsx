import { useState, useEffect, useRef, useContext} from "react";
import { validateIdeaWithAI } from "../services/ai.services";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";



function AIValidatorPage() {
  
  const bottomRef = useRef(null);
  const nav = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [limitMessage, setLimitMessage] = useState("");
  const [input, setInput] = useState("");
  
  
  const initialMessage = {
    role: "ai",
    content: 
    "Hi, I'm PitchProof AI. Share you startup idea or ask a business question, and I'll help you.",
    result: null,
  } 
  const chatStorageKey = user?._id ? `pitchproof_ai_chat_${user._id}` : "pitchproof_ai_chat_guest";
    const [messages, setMessages] = useState([initialMessage]);


    const [loading, setLoading] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!input.trim()) return;

        const userMessages = {
          role: "user",
          content: input,
        };
        setLimitMessage("");
        setMessages((prev) => [...prev, userMessages]);
        const currentInput = input;
        setInput("")
        setLoading(true);

        try{
            setLoading(true);
            const response = await validateIdeaWithAI(currentInput);

            const aiMessage = {
              role: "ai",
              content: response.data.reply,
              result: response.data,
            };

            setMessages((prev) => [...prev, aiMessage]);
        } catch (err) {
            console.log("AI error:", err);
            console.log(err.response?.data)

            if (err.response?.status === 403) {
              setLimitMessage(
                err.response?.data?.message || "Upgrade to pro to continue"
              )
              return;
            }

            setMessages((prev) => [
              ...prev, 
              {
                role: "ai",
                content: "Something went wrong while validating your idea.",
                result: null,
              }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {

      const saved = localStorage.getItem(chatStorageKey);
      if(saved) {
        setMessages(JSON.parse(saved))
      } else {
        setMessages([initialMessage])
      }
    }, [chatStorageKey])

    useEffect(() => 
    {
      localStorage.setItem(chatStorageKey, JSON.stringify(messages))
    }, [messages, chatStorageKey]);

    const handleEnterSend = (e) => {
      if(e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();

        if (!input.trim() || loading) return;

        handleSubmit(e);
      }
    }



    const handleClearChat = () => {
      localStorage.removeItem(chatStorageKey);
      setMessages([initialMessage]);
    }

    return (
          <div className="chat-page">
            <div className="chat-header">
              <p className="chat-badge">
                PitchProof AI
              </p>
              <button className="clear-chat-button" onClick={handleClearChat}>
                Clear Chat
              </button>
              <h1>Validate Your Idea</h1>
              <p className="chat-subtitle">
                Ask anything about startup ideas, validation, business strategy, or growth.
              </p>
            </div>

            <div className="chat-container">
              <div className="chat-messages">
                {messages.map((message, index) => (
                  <div key={index} className={`chat-message-row ${
                    message.role === "user" ? "user-row" : "ai-row"
                  }`}
                  >
                    <div
                    className={`chat-bubble ${
                      message.role === "user" ? "user-bubble" : "ai-bubble"
                    }`}
                    >
                      <p>{message.content}</p>

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
                              {message.result.weaknesses.map((item, i ) => (
                                <p key={i}>⚠ {item}</p>
                              ))}
                            </div>

                            <div className="chat-report-card">
                              <h4>Suggestions</h4>
                              {message.result.suggestions.map((item, i ) => (
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
    )
}

export default AIValidatorPage;
