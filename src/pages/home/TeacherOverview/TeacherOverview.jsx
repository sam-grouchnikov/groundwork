import { useEffect, useRef, useState } from "react";
import "./TeacherOverview.css"
import profileMememoji from '../../../assets/ProfileMememoji.svg';
import wave from '../../../assets/wave.svg';

import { MessageCircleMore } from 'lucide-react'

const LESSON_COMPLETION = [
    { label: '6/23', value: 65, tone: 'strong' },
    { label: '6/30', value: 28, tone: 'mid' },
    { label: '7/7', value: 40, tone: 'strong' },
    { label: '7/14', value: 19, tone: 'light' },
    { label: '7/21', value: 4, tone: 'muted' },
];

export default function TeacherOverview({ students = [] }) {
    const cardRef = useRef(null);
    const [availableHeight, setAvailableHeight] = useState(null);

    useEffect(() => {
        const cardElement = cardRef.current;

        if (!cardElement) {
            return undefined;
        }

        const scrollContainer = cardElement.closest('.content');

        const updateAvailableHeight = () => {
            const rect = cardElement.getBoundingClientRect();
            const containerBottom = scrollContainer instanceof Element
                ? scrollContainer.getBoundingClientRect().bottom
                : window.innerHeight;
            const bottomInset = 32;
            const nextHeight = Math.max(0, Math.floor(containerBottom - rect.top - bottomInset));

            setAvailableHeight((currentHeight) => (
                currentHeight === nextHeight ? currentHeight : nextHeight
            ));
        };

        updateAvailableHeight();

        const resizeObserver = new ResizeObserver(updateAvailableHeight);
        resizeObserver.observe(cardElement);
        if (scrollContainer instanceof Element) {
            resizeObserver.observe(scrollContainer);
            scrollContainer.addEventListener('scroll', updateAvailableHeight, { passive: true });
        }

        window.addEventListener('resize', updateAvailableHeight);
        window.addEventListener('scroll', updateAvailableHeight, { passive: true });

        return () => {
            resizeObserver.disconnect();
            if (scrollContainer instanceof Element) {
                scrollContainer.removeEventListener('scroll', updateAvailableHeight);
            }
            window.removeEventListener('resize', updateAvailableHeight);
            window.removeEventListener('scroll', updateAvailableHeight);
        };
    }, []);

    return (
        <div
            ref={cardRef}
            className="column-to"
            style={availableHeight ? { '--teacher-overview-max-height': `${availableHeight}px` } : undefined}
        >
            <div className="text-level-1 extra-margin">Class Overview</div>

            <div className={"avatar-group"}>
                <div className="outer-circle">
                    <div className="inner-circle">
                        <img src={profileMememoji}  alt=""/>
                    </div>
                </div>

                <div className="greeting-row">
                    <img src={wave} alt="" />
                    <div className="text-level-1">Evening, Sean</div>
                </div>
            </div>


            <div className="text-level-2">Student Lessons Completed</div>

            <div className="info-container chart-card">
                <div className="lesson-chart">
                    <div className="lesson-chart-y-axis">
                        <span>60</span>
                        <span>40</span>
                        <span>20</span>
                        <span>0</span>
                    </div>
                    <div className="lesson-chart-plot">
                        <div className="lesson-chart-grid">
                            <span />
                            <span />
                            <span />
                            <span />
                        </div>
                        <div className="lesson-chart-bars">
                            {LESSON_COMPLETION.map(({ label, value, tone }) => (
                                <div key={label} className="lesson-chart-item">
                                    <div
                                        className={`lesson-chart-bar lesson-chart-bar-${tone}`}
                                        style={{ height: `${value}%` }}
                                    />
                                    <div className="lesson-chart-label">{label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className={"text-level-2"}>Students</div>

            <div className="info-container students-card">
                {students.map(({ id, initials, name }) => (
                    <div key={id} className="student-row">
                        <div className="student-chip">{initials}</div>
                        <div className="student-name">{name}</div>
                        <button className="student-action" type="button" aria-label={`Message ${name}`}>
                            <MessageCircleMore size={22} />
                        </button>
                    </div>
                ))}
            </div>

        </div>
    )
}
