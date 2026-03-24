import { useState, useEffect, useRef} from "react";
import { validateIdeaWithAI } from "../services/ai.services";

function AIValidatorPage() {

    const bottomRef = useRef(null);


    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
      {
        role: "ai",
        content: 
        "Hi, I'm PitchProof AI. Share you startup idea or ask a business question, and I'll help you.",
        result: null,
      }
    ])
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!input.trim()) return;

        const userMessages = {
          role: "user",
          content: input,
        };

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
      bottomRef.current?.scrollIntoView({ behavior: "smooth"});
    }, [messages, loading])

    return (
          <div className="chat-page">
            <div className="chat-header">
              <p className="chat-badge">
                PitchProof AI
              </p>
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

              <form className="chat-input-bar" onSubmit={handleSubmit}>
                <textarea
                placeholder="Describe your idea or ask a business question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                />

                <button type="submit">Send</button>
              </form>
            </div>
          </div>
    )
}

export default AIValidatorPage;
