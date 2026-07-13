import { ArrowRight } from "lucide-react";
import "./ClassDetails.css";

const ASSIGNMENTS = [
    {
        title: "Solving Equati..",
        topic: "Area Word Problems",
        completion: 75,
        mastery: 60,
        completionTone: "green",
        masteryTone: "gold",
    },
    {
        title: "Extra Practice",
        topic: "Area Word Problems",
        completion: 60,
        mastery: 40,
        completionTone: "gold",
        masteryTone: "red",
    },
    {
        title: "Limits Review",
        topic: "Continuity Check",
        completion: 90,
        mastery: 82,
        completionTone: "green",
        masteryTone: "green",
    },
];

export default function AssignmentsRow() {
    return (
        <section className="lesson-plans-section" aria-labelledby="assignments-heading">
            <h2 id="assignments-heading" className="lesson-plans-heading">Assignments</h2>
            <div className="lesson-plans-scroll" aria-label="Assignments">
                {ASSIGNMENTS.map((assignment) => (
                    <article className="assignment-card" key={assignment.title}>
                        <div>
                            <button className="assignment-action" type="button" aria-label={`Open ${assignment.title}`}>
                                <ArrowRight size={28} strokeWidth={2.4} />
                            </button>

                            <h3 className="assignment-title">{assignment.title}</h3>
                            <div className="assignment-topic">{assignment.topic}</div>
                        </div>


                        <div className="assignment-metrics">
                            <MetricCircle
                                label="Completion"
                                value={assignment.completion}
                                tone={assignment.completionTone}
                            />
                            <MetricCircle
                                label="Mastery"
                                value={assignment.mastery}
                                tone={assignment.masteryTone}
                            />
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

function MetricCircle({ label, value, tone }) {
    return (
        <div className="assignment-metric">
            <div
                className={`assignment-ring assignment-ring-${tone}`}
                style={{ "--metric-value": `${value}%` }}
                aria-label={`${label}: ${value}%`}
            >
                <span>{value}%</span>
            </div>
            <div className="assignment-metric-label">{label}</div>
        </div>
    );
}
