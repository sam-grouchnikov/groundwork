import { useState } from 'react';
import {
  BookOpenCheck,
  ChevronRight,
  MessageCircleMore,
  Plus,
  Trash2,
} from 'lucide-react';
import TopRow from '../home/TopRow/TopRow.jsx';
import './LessonPlans.css';

function getProgressTone(mastery) {
  if (mastery >= 80) {
    return 'complete';
  }

  if (mastery >= 50) {
    return 'warning';
  }

  return 'partial';
}

export default function LessonPlansPage({
  lessons = [],
  onContinueLesson,
  onDeleteLesson,
  onOpenGenerate,
}) {
  const [lessonPendingDeleteId, setLessonPendingDeleteId] = useState('');

  function confirmDeleteLesson() {
    onDeleteLesson(lessonPendingDeleteId);
    setLessonPendingDeleteId('');
  }

  return (
    <section className="lesson-page">
      <TopRow />

      <header className="lesson-page-header">
        <div>
          <p className="lesson-page-kicker">Course Materials</p>
          <h1>Lesson Plans</h1>
        </div>
      </header>

      <div className="lesson-board">
        {lessons.map((lesson) => {
          const isPendingDelete = lessonPendingDeleteId === lesson.id;
          const mastery = lesson.mastery ?? 0;
          const progressTone = lesson.progressTone ?? getProgressTone(mastery);

          return (
            <article className="lesson-board-card" key={lesson.id}>
              <div className="lesson-card-main">
                <div className="lesson-card-icon" aria-hidden="true">
                  <BookOpenCheck size={22} />
                </div>
                <div>
                  <h2>{lesson.title}</h2>
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

              <div className="lesson-mastery">
                <div className="lesson-mastery-label">
                  <span>Mastery</span>
                  <span>{mastery}%</span>
                </div>
                <div className="lesson-plan-progress" aria-label={`${mastery}% mastery`}>
                  <span
                    className={`lesson-plan-progress-fill lesson-plan-progress-${progressTone}`}
                    style={{ width: `${mastery}%` }}
                  />
                </div>
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
                  <span>Go to lesson</span>
                  <ChevronRight size={18} />
                </button>
              )}
            </article>
          );
        })}

        <button
          className="lesson-board-card lesson-create-card"
          onClick={onOpenGenerate}
          type="button"
          aria-label="Create lesson plan"
          title="Create lesson plan"
        >
          <Plus size={36} strokeWidth={2} />
        </button>
        </div>
    </section>
  );
}
