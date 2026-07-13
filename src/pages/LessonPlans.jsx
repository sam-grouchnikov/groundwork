import { useState } from 'react';
import {
  BookOpenCheck,
  CalendarDays,
  ChevronRight,
  MessageCircleMore,
  MessagesSquare,
  Trash2,
} from 'lucide-react';
import './LessonPlans.css';

export default function LessonPlansPage({
  lessons = [],
  onContinueLesson,
  onDeleteLesson,
}) {
  const [lessonPendingDeleteId, setLessonPendingDeleteId] = useState('');

  function confirmDeleteLesson() {
    onDeleteLesson(lessonPendingDeleteId);
    setLessonPendingDeleteId('');
  }

  return (
    <section className="lesson-page">
      <header className="lesson-page-header">
        <div>
          <p className="lesson-page-kicker">Course Materials</p>
          <h1>Lesson Plans</h1>
        </div>
      </header>

      {lessons.length ? (
        <div className="lesson-board">
          {lessons.map((lesson) => {
            const isPendingDelete = lessonPendingDeleteId === lesson.id;

            return (
              <article className="lesson-board-card" key={lesson.id}>
                <div className="lesson-card-main">
                  <div className="lesson-card-icon" aria-hidden="true">
                    <BookOpenCheck size={24} />
                  </div>
                  <div>
                    <h2>{lesson.title}</h2>
                    <div className="lesson-card-meta">
                      <span>
                        <CalendarDays size={16} />
                        Created {lesson.created}
                      </span>
                      <span>
                        <MessagesSquare size={16} />
                        {lesson.messages?.length ?? 0} chat message
                        {(lesson.messages?.length ?? 0) === 1 ? '' : 's'}
                      </span>
                    </div>
                  </div>
                  <button
                    className="lesson-delete-button"
                    onClick={() => setLessonPendingDeleteId(lesson.id)}
                    type="button"
                    aria-label={`Delete ${lesson.title}`}
                    title={`Delete ${lesson.title}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                {isPendingDelete ? (
                  <div className="delete-confirmation-inline">
                    <p>Delete this lesson and its chat history?</p>
                    <div>
                      <button
                        className="delete-cancel-button"
                        onClick={() => setLessonPendingDeleteId('')}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="delete-confirm-button"
                        onClick={confirmDeleteLesson}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="history-button"
                    onClick={() => onContinueLesson(lesson.id)}
                    type="button"
                  >
                    <MessageCircleMore size={18} />
                    <span>Open lesson chat</span>
                    <ChevronRight size={18} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="lesson-empty-state">
          <BookOpenCheck size={36} />
          <h2>No lesson plans yet</h2>
          <p>Start a new lesson from Generate to create its chat history.</p>
        </div>
      )}
    </section>
  );
}
