import { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  BookOpenCheck,
  Bot,
  ClipboardCheck,
  Gauge,
  Lightbulb,
  Mic,
  Plus,
  Send,
  Sparkles,
  User,
} from 'lucide-react';
import './Generate.css';

const QUICK_ACTIONS = [
  {
    label: 'Baseline Check',
    icon: ClipboardCheck,
    prompt: 'Create a baseline check for this lesson.',
  },
  {
    label: 'Practice Quiz',
    icon: Lightbulb,
    prompt: 'Build a short practice quiz with answer explanations.',
  },
  {
    label: 'Worksheet',
    icon: BookOpenCheck,
    prompt: 'Draft a student worksheet with clear steps and examples.',
  },
  {
    label: 'Pacing Guide',
    icon: Gauge,
    prompt: 'Make a pacing guide for this lesson.',
  },
];

const STARTER_MESSAGES = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'Hi Sean, I can help draft classroom materials, assessments, rubrics, and pacing plans. What are you creating today?',
  },
];

function buildAssistantReply(prompt) {
  return `Absolutely. I can help turn "${prompt}" into a classroom-ready resource. Share the grade level, learning goal, and any constraints you want me to follow, and I will draft it in a format you can review before sending to students.`;
}

function formatCreatedDate() {
  return new Date().toLocaleDateString('en-US', {
    month: 'numeric',
    day: '2-digit',
    year: '2-digit',
  });
}

export default function GeneratePage({
  lessonToContinueId = '',
  lessons = [],
  onAddLesson,
  onOpenLessonPlans,
  onUpdateLessonMessages,
}) {
  const [activeLessonId, setActiveLessonId] = useState('');
  const [lessonName, setLessonName] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonError, setLessonError] = useState('');
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const hasConversation = activeLessonId || messages.length > 0;
  const hasLessonName = lessonName.trim().length > 0;
  const shouldShowChatTools = hasConversation || hasLessonName;
  const canSend = inputValue.trim().length > 0 && hasLessonName && !isGenerating;

  useEffect(() => {
    const lessonToContinue = lessons.find(
      (lesson) => lesson.id === lessonToContinueId,
    );

    if (lessonToContinue) {
      setActiveLessonId(lessonToContinue.id);
      setLessonName(lessonToContinue.title);
      setMessages(lessonToContinue.messages ?? []);
      setInputValue('');
      setLessonError('');
      setIsGenerating(false);
    }
  }, [lessonToContinueId, lessons]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }
  }, [inputValue]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  useEffect(() => {
    if (activeLessonId && messages.length) {
      onUpdateLessonMessages(activeLessonId, messages);
    }
  }, [activeLessonId, messages, onUpdateLessonMessages]);

  function submitPrompt(promptText = inputValue) {
    const trimmedPrompt = promptText.trim();
    const trimmedLessonName = lessonName.trim();

    if (!trimmedPrompt || isGenerating) {
      return;
    }

    if (!trimmedLessonName) {
      setLessonError('Enter a lesson name before starting a chat.');
      return;
    }

    const lessonId = activeLessonId || `lesson-${Date.now()}`;
    const userMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmedPrompt,
    };
    const nextMessages = [
      ...(messages.length ? messages : STARTER_MESSAGES),
      userMessage,
    ];

    if (!activeLessonId) {
      onAddLesson({
        id: lessonId,
        title: trimmedLessonName,
        created: formatCreatedDate(),
        messages: nextMessages,
      });
      setActiveLessonId(lessonId);
    }

    setLessonError('');
    setMessages(nextMessages);
    setInputValue('');
    setIsGenerating(true);

    window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
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

  return (
    <section className={`generate-page ${hasConversation ? 'is-chatting' : ''}`}>
      <div className="generate-content">
        {hasConversation ? (
          <>
            <div className="chat-session-bar">
              <button type="button" onClick={onOpenLessonPlans}>
                <ChevronLeft size={28} />
              </button>
              <h1 className="chat-lesson-context">{lessonName}</h1>
            </div>

            <div className="chat-thread" aria-live="polite">
            {messages.length ? (
              messages.map((message) => {
                const MessageIcon = message.role === 'user' ? User : Bot;

                return (
                  <article
                    className={`chat-message ${message.role}`}
                    key={message.id}
                  >
                    <div className="message-avatar" aria-hidden="true">
                      <MessageIcon size={18} />
                    </div>
                    <div className="message-bubble">{message.content}</div>
                  </article>
                );
              })
            ) : (
              <div className="chat-empty-history">
                This lesson does not have chat history yet.
              </div>
            )}

            {isGenerating && (
              <article className="chat-message assistant">
                <div className="message-avatar" aria-hidden="true">
                  <Bot size={18} />
                </div>
                <div className="message-bubble typing-bubble">
                  <span />
                  <span />
                  <span />
                </div>
              </article>
            )}
            <div ref={messagesEndRef} />
          </div>
          </>
        ) : (
          <div className="generate-empty-state">
            <h1>
              <Sparkles className="headline-icon" size={44} />
              <span>What's next on your agenda?</span>
            </h1>
            <div className="lesson-required-panel">
              <input
                id="generate-lesson-name"
                onChange={(event) => {
                  setLessonName(event.target.value);
                  setLessonError('');
                }}
                placeholder="Name this new lesson"
                type="text"
                value={lessonName}
              />
              {lessonError && <p>{lessonError}</p>}
            </div>
          </div>
        )}

        {shouldShowChatTools && (
          <div className="chat-composer-wrap">
            <form
              className="chat-composer"
              onSubmit={(event) => {
                event.preventDefault();
                submitPrompt();
              }}
            >
              <button
                className="composer-icon-button"
                type="button"
                aria-label="Add attachment"
                title="Add attachment"
              >
                <Plus size={24} />
              </button>
              <textarea
                ref={inputRef}
                aria-label="Ask GroundworkAI Anything"
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask GroundworkAI Anything"
                rows={1}
                value={inputValue}
              />
              <button
                className="composer-icon-button"
                type="button"
                aria-label="Voice input"
                title="Voice input"
              >
                <Mic size={23} />
              </button>
              <button
                className="composer-icon-button send-button"
                disabled={!canSend}
                type="submit"
                aria-label="Send message"
                title="Send message"
              >
                <Send className="right-offset" size={24} />
              </button>
            </form>

            {!hasConversation && (
              <div className="quick-actions" aria-label="Suggested prompts">
                {QUICK_ACTIONS.map(({ label, icon: Icon, prompt }) => (
                  <button
                    className="quick-action"
                    key={label}
                    onClick={() => submitPrompt(prompt)}
                    type="button"
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <p className="ai-disclaimer">
        This is an AI system and thus can make mistakes. Be sure to verify items
        before sending to students.
      </p>
    </section>
  );
}
