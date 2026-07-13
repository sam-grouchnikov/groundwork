import { CalendarDays, ChevronRight, UserCheck } from "lucide-react";
import "./ClassDetails.css";

const LESSON_PLANS = [
    {
        title: "Implicit Differentiation",
        created: "7/07/26",
        mastery: 100,
        progressTone: "complete",
    },
    {
        title: "Area with Integrals",
        created: "7/12/26",
        mastery: 60,
        progressTone: "warning",
    },
    {
        title: "Series Convergence",
        created: "7/18/26",
        mastery: 35,
        progressTone: "partial",
    },
];

export default function LessonPlansRow() {
    return (
        <section className="lesson-plans-section" aria-labelledby="lesson-plans-heading">
            <h2 id="lesson-plans-heading" className="lesson-plans-heading">Lesson Plans</h2>
            <div className="lesson-plans-scroll" aria-label="Lesson plans">
                {LESSON_PLANS.map(({ title, created, mastery, progressTone }) => (
                    <article className="lesson-plan-card" key={title}>
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

                            <button className="lesson-plan-action" type="button" aria-label={`Open ${title}`}>
                                <ChevronRight size={44} strokeWidth={1.8} />
                            </button>
                        </div>

                        <div className="lesson-plan-progress" aria-label={`${mastery}% mastery`}>
                            <span
                                className={`lesson-plan-progress-fill lesson-plan-progress-${progressTone}`}
                                style={{ width: `${mastery}%` }}
                            />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
