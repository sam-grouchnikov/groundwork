import { useEffect, useRef, useState } from "react";
import TopRow from "./TopRow/TopRow.jsx";
import AssignmentsRow from "./ClassDetails/AssignmentsRow.jsx";
import ClassCard from "./ClassDetails/ClassCard.jsx";
import LessonPlansRow from "./ClassDetails/LessonPlansRow.jsx";
import TeacherOverview from "./TeacherOverview/TeacherOverview.jsx";
import "./Home.css"

export default function HomePage() {
  const classDetailsRef = useRef(null);
  const [classDetailsHeight, setClassDetailsHeight] = useState(null);

  useEffect(() => {
    const classDetailsElement = classDetailsRef.current;

    if (!classDetailsElement) {
      return undefined;
    }

    const scrollContainer = classDetailsElement.closest('.content');

    const updateClassDetailsHeight = () => {
      const rect = classDetailsElement.getBoundingClientRect();
      const containerBottom = scrollContainer instanceof Element
          ? scrollContainer.getBoundingClientRect().bottom
          : window.innerHeight;
      const bottomInset = 4;
      const nextHeight = Math.max(0, Math.floor(containerBottom - rect.top - bottomInset));

      setClassDetailsHeight((currentHeight) => (
          currentHeight === nextHeight ? currentHeight : nextHeight
      ));
    };

    updateClassDetailsHeight();

    const resizeObserver = new ResizeObserver(updateClassDetailsHeight);
    resizeObserver.observe(classDetailsElement);
    if (scrollContainer instanceof Element) {
      resizeObserver.observe(scrollContainer);
      scrollContainer.addEventListener('scroll', updateClassDetailsHeight, { passive: true });
    }

    window.addEventListener('resize', updateClassDetailsHeight);
    window.addEventListener('scroll', updateClassDetailsHeight, { passive: true });

    return () => {
      resizeObserver.disconnect();
      if (scrollContainer instanceof Element) {
        scrollContainer.removeEventListener('scroll', updateClassDetailsHeight);
      }
      window.removeEventListener('resize', updateClassDetailsHeight);
      window.removeEventListener('scroll', updateClassDetailsHeight);
    };
  }, []);

  return (
    <div className="column-home">
      <TopRow />
        <div className="row-home">
            <div
                ref={classDetailsRef}
                className="class-details-column"
                style={classDetailsHeight ? { '--class-details-max-height': `${classDetailsHeight}px` } : undefined}
            >
                <ClassCard />
                <LessonPlansRow />
                <AssignmentsRow />
            </div>
            <div className="teacher-overview-column">
                <TeacherOverview />
            </div>
        </div>

    </div>
  );
}
