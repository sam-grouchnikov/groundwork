import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Bot, Mic, Plus, Send, User } from 'lucide-react';
import './LessonChat.css';

const EMPTY_MESSAGES = [];

function buildAssistantReply(prompt) {
  return `Absolutely. I can keep building this lesson from "${prompt}". Share any grade level, timing, or student needs you want reflected, and I will shape the next draft around them.`;
}

export default function LessonChatPage({
  lessonToContinueId = '',
  lessons = [],
  onOpenLessonPlans,
  onUpdateLessonMessages,
}) {
  const lesson = lessons.find((currentLesson) => currentLesson.id === lessonToContinueId);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const messages = lesson?.messages ?? EMPTY_MESSAGES;
  const canSend = Boolean(lesson && inputValue.trim() && !isGenerating);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  function submitPrompt() {
    const trimmedPrompt = inputValue.trim();

    if (!lesson || !trimmedPrompt || isGenerating) {
      return;
    }

    const nextMessages = [
      ...messages,
      {
        id: `${Date.now()}-user`,
        role: 'user',
        content: trimmedPrompt,
      },
    ];

    onUpdateLessonMessages(lesson.id, nextMessages);
    setInputValue('');
    setIsGenerating(true);

    window.setTimeout(() => {
      onUpdateLessonMessages(lesson.id, [
        ...nextMessages,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: buildAssistantReply(trimmedPrompt),
        },
      ]);
      setIsGenerating(false);
    }, 700);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submitPrompt();
    }
  }

  if (!lesson) {
    return (
      <section className="lesson-chat-page">
        <div className="lesson-chat-missing">
          <h1>Lesson not found</h1>
          <p>Return to Lesson Plans and choose a lesson chat to open.</p>
          <button onClick={onOpenLessonPlans} type="button">
            <ArrowLeft size={18} />
            <span>Back to lesson plans</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="lesson-chat-page">
      <header className="lesson-chat-header">
        <button onClick={onOpenLessonPlans} type="button">
          <ArrowLeft size={18} />
          <span>Lesson Plans</span>
        </button>
        <div>
          <p>Lesson Chat</p>
          <h1>{lesson.title}</h1>
        </div>
      </header>

      <div className="lesson-chat-thread" aria-live="polite">
        {messages.length ? (
          messages.map((message) => {
            const MessageIcon = message.role === 'user' ? User : Bot;

            return (
              <article
                className={`lesson-chat-message ${message.role}`}
                key={message.id}
              >
                <div className="lesson-chat-avatar" aria-hidden="true">
                  <MessageIcon size={18} />
                </div>
                <div className="lesson-chat-bubble">{message.content}</div>
              </article>
            );
          })
        ) : (
          <div className="lesson-chat-empty">
            This lesson does not have chat history yet.
          </div>
        )}

        {isGenerating && (
          <article className="lesson-chat-message assistant">
            <div className="lesson-chat-avatar" aria-hidden="true">
              <Bot size={18} />
            </div>
            <div className="lesson-chat-bubble typing-bubble">
              <span />
              <span />
              <span />
            </div>
          </article>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        className="lesson-chat-composer"
        onSubmit={(event) => {
          event.preventDefault();
          submitPrompt();
        }}
      >
        <button
          className="lesson-chat-icon-button"
          type="button"
          aria-label="Add attachment"
          title="Add attachment"
        >
          <Plus size={22} />
        </button>
        <textarea
          ref={inputRef}
          aria-label={`Continue chat for ${lesson.title}`}
          onChange={(event) => setInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Continue this lesson chat"
          rows={1}
          value={inputValue}
        />
        <button
          className="lesson-chat-icon-button"
          type="button"
          aria-label="Voice input"
          title="Voice input"
        >
          <Mic size={22} />
        </button>
        <button
          className="lesson-chat-icon-button"
          disabled={!canSend}
          type="submit"
          aria-label="Send message"
          title="Send message"
        >
          <Send size={24} />
        </button>
      </form>
    </section>
  );
}
