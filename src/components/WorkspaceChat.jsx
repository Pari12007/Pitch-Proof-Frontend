import { useLanguage } from "../context/languageStore";
import { useState, useEffect, useRef } from "react";
import {
    getWorkspaceChat,
    sendWorkspaceMessage,
} from "../services/workspace.services";
import { Link } from "react-router-dom";
import { verify } from "../services/auth.services";

function WorkspaceChat({ workspaceId }) {
  const { t , tError, language, validateField, clearFieldValidity } = useLanguage();

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [loadError, setLoadError] = useState("");
    const [sendError, setSendError] = useState("");
    const [loadAttempt, setLoadAttempt] = useState(0);
    const [ showUpgrade, setShowUpgrade ] = useState(false);
    const conversationRef = useRef(null);
    const messagesRef = useRef(null);

    useEffect(() => {
        if (!loading && messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [loading, messages]);

    useEffect(() => {
        // Ignore replies from a conversation after leaving or switching it.
        const conversation = { active: true, sending: false };
        conversationRef.current = conversation;

        const fetchChat = async () => {
            setLoading(true);
            setLoadError("");
            setSendError("");
            setSending(false);
            setMessages([]);
            setShowUpgrade(false);

            try {
                const [response, accountResponse] = await Promise.all([
                    getWorkspaceChat(workspaceId),
                    verify(),
                ]);
                if (!Array.isArray(response.data?.messages)) {
                    throw new Error(t("Invalid conversation response."));
                }
                if (conversation.active) {
                    setMessages(response.data.messages);
                    const account = accountResponse.data;
                    setShowUpgrade(Boolean(account && !account.isPro && account.aiQuestionsCount >= 5));
                }
            } catch (error) {
                if (conversation.active) {
                    setLoadError(
                        error.response?.data?.message ||
                        "Unable to load your conversation."
                    );
                }
            } finally {
                if (conversation.active) setLoading(false);
            }
        };

        fetchChat();
        return () => {
            conversation.active = false;
        };
    }, [workspaceId, loadAttempt]);

    const handleSend = async (event) => {
        event.preventDefault();
        const message = input.trim();
        const conversation = conversationRef.current;
        if (!message || loading || loadError || !conversation?.active || conversation.sending) return;

        // A ref blocks rapid duplicate submissions before React re-renders.
        conversation.sending = true;
        setSending(true);
        setSendError("");

        try {
            const response = await sendWorkspaceMessage(workspaceId, message, language);
            if (!Array.isArray(response.data?.messages)) {
                throw new Error(t("Invalid conversation response."));
            }
            if (conversation.active) {
                setMessages(response.data.messages);
                setInput("");
                // Refresh usage after a successful answer without treating a
                // failed account refresh as a failed/savable chat request.
                verify().then(({ data: account }) => {
                    if (conversation.active) {
                        setShowUpgrade(Boolean(account && !account.isPro && account.aiQuestionsCount >= 5));
                    }
                }).catch(() => {
                    // The next send still checks the allowance on the server.
                });
            }
        } catch (error) {
            if (conversation.active) {
                const errorMessage = error.response?.data?.message || t("Unable to send your message. Please try again.");

                const limitReached = error.response?.status === 403 && /free.*limit/i.test(errorMessage);
                setSendError(limitReached ? "" : errorMessage);
                if (limitReached) setShowUpgrade(true);
            }
        } finally {
            conversation.sending = false;
            if (conversation.active) setSending(false);
        }
    };

    if (loading) return <p role="status">{t("Loading your conversation…")}</p>;

    if (loadError) {
        return (
            <section className="workspace-chat">
                <h2>{t("Business mentor")}</h2>
                <p role="alert">{tError(loadError)}</p>
                <button type="button" onClick={() => setLoadAttempt((attempt) => attempt + 1)}> {t("Retry loading chat")} </button>
            </section>
        );
    }

    return (
        <section className="workspace-chat">
            <h2>{t("Business mentor")}</h2>
            <p>{t("Ask questions about this business and plan your next steps.")}</p>

            <div ref={messagesRef} className="workspace-chat-messages" role="log" aria-label={t("Business conversation")} aria-live="polite">
                {messages.length === 0 ? (
                    <p>{t("No messages yet. Ask your first question below.")}</p>
                ) : (
                    messages.map((message, index) => (
                        <article key={`${message.createdAt}-${index}`} className={`workspace-message ${message.role}`}>
                            <strong>{message.role === "user" ? t("You") : t("PitchProof AI")}</strong>
                            <p style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                                {message.content}
                            </p>
                        </article>
                    ))
                )}
            </div>

            {sending && <p role="status">{t("PitchProof AI is preparing an answer…")}</p>}
            {sendError && <p role="alert">{tError(sendError)}</p>}
            {showUpgrade && (
                <aside className="ws-upgrade-notice" aria-label={t("Free AI limit reached")}>
                    <div role="status">
                        <strong>{t("You’ve used your free AI questions")}</strong>
                        <p>{t("Upgrade to Pro to continue chatting with your business mentor. Your conversation is saved.")}</p>
                    </div>
                    <Link to="/pricing" className="ws-button ws-upgrade-link"> {t("Upgrade to Pro")} <span aria-hidden="true">→</span>
                    </Link>
                </aside>
            )}

            <form onInvalid={validateField} onInput={clearFieldValidity} onSubmit={handleSend}>
                <label htmlFor={`message-${workspaceId}`}>{t("Your question")}</label>
                <textarea
                    id={`message-${workspaceId}`}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder={t("What should I test first?")}
                    maxLength={4000}
                    rows={3}
                    disabled={sending}
                    required
                />
                <button type="submit" disabled={sending || !input.trim()}>
                    {sending ? t("Sending…") : t("Send")}
                </button>
            </form>
        </section>
    );
}

export default WorkspaceChat;
