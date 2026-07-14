import { CalendarDays, ChevronRight, Plus, UserCheck } from "lucide-react";
import "./ClassDetails.css";

function getProgressTone(mastery) {
    if (mastery >= 80) {
        return "complete";
    }

    if (mastery >= 50) {
        return "warning";
    }

    return "partial";
}

export default function LessonPlansRow({
    lessons = [],
    onContinueLesson,
    onOpenGenerate,
}) {
    return (
        <section className="lesson-plans-section" aria-labelledby="lesson-plans-heading">
            <h2 id="lesson-plans-heading" className="lesson-plans-heading">Lesson Plans</h2>
            <div className="lesson-plans-scroll" aria-label="Lesson plans">
                {lessons.map(({ id, title, created, mastery = 0, progressTone }) => (
                    <article className="lesson-plan-card" key={id}>
                        <h3 className="lesson-plan-title">{title}</h3>

                        <div className="lesson-plan-content">
                            <div className="lesson-plan-meta">
                                <div className="lesson-plan-pill">
                                    <span className="lesson-plan-icon" aria-hidden="true">
                                        <CalendarDays size={20} strokeWidth={2.5} />
                                    </span>
                                    <span>Created {created}</span>
                                </div>

                                <div className="lesson-plan-pill">
                                    <span className="lesson-plan-icon" aria-hidden="true">
                                        <UserCheck size={20} strokeWidth={2.5} />
                                    </span>
                                    <span>Mastery: {mastery}%</span>
                                </div>
                            </div>

                            <button
                                className="lesson-plan-action"
                                onClick={() => onContinueLesson(id)}
                                type="button"
                                aria-label={`Open ${title}`}
                            >
                                <ChevronRight size={44} strokeWidth={1.8} />
                            </button>
                        </div>

                        <div className="lesson-plan-progress" aria-label={`${mastery}% mastery`}>
                            <span
                                className={`lesson-plan-progress-fill lesson-plan-progress-${progressTone ?? getProgressTone(mastery)}`}
                                style={{ width: `${mastery}%` }}
                            />
                        </div>
                    </article>
                ))}

                <button
                    className="lesson-plan-card lesson-plan-create-card"
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
