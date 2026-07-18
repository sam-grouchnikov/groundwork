import { useCallback, useState } from 'react';

const INITIAL_LESSONS = [];

const INITIAL_STUDENTS = [
  {
    id: 'student-curtis-jackson',
    initials: 'CJ',
    name: 'Curtis Jackson',
    email: 'cjackson1@dbu.edu',
    mastery: 100,
    lastActive: 'Today',
  },
  {
    id: 'student-robert-kelly',
    initials: 'RK',
    name: 'Robert Kelly',
    email: 'rkelly3@dbu.edu',
    mastery: 85,
    lastActive: 'Today',
  },
  {
    id: 'student-lionel-messi',
    initials: 'LM',
    name: 'Lionel Messi',
    email: 'lmessi34@dbu.edu',
    mastery: 75,
    lastActive: 'Yesterday',
  },
  {
    id: 'student-erling-haaland',
    initials: 'EH',
    name: 'Erling Haaland',
    email: 'ehaaland1@dbu.edu',
    mastery: 60,
    lastActive: '5 Days Ago',
  },
  {
    id: 'student-curtis-jackson-2',
    initials: 'CJ',
    name: 'Curtis Jackson',
    email: 'curtis.jackson@dbu.edu',
    mastery: 92,
    lastActive: 'Today',
  },
  {
    id: 'student-robert-kelly-2',
    initials: 'RK',
    name: 'Robert Kelly',
    email: 'robert.kelly@dbu.edu',
    mastery: 71,
    lastActive: '3 Days Ago',
  },
  {
    id: 'student-lionel-messi-2',
    initials: 'LM',
    name: 'Lionel Messi',
    email: 'lionel.messi@dbu.edu',
    mastery: 88,
    lastActive: 'Yesterday',
  },
  {
    id: 'student-erling-haaland-2',
    initials: 'EH',
    name: 'Erling Haaland',
    email: 'erling.haaland@dbu.edu',
    mastery: 64,
    lastActive: '1 Week Ago',
  },
];

function fetchInitialLessons() {
  return INITIAL_LESSONS;
}

function fetchInitialStudents() {
  return INITIAL_STUDENTS;
}

function getProgressTone(mastery) {
  if (mastery >= 80) {
    return 'complete';
  }

  if (mastery >= 50) {
    return 'warning';
  }

  return 'partial';
}

function getLessonMasteryDefault(lesson) {
  if (typeof lesson.mastery === 'number') {
    return lesson.mastery;
  }

  return 0;
}

export function useAppViewModel() {
  const [activeId, setActiveId] = useState('home');
  const [lessons, setLessons] = useState(fetchInitialLessons);
  const [students, setStudents] = useState(fetchInitialStudents);
  const [lessonToContinueId, setLessonToContinueId] = useState('');
  const activeNavId = activeId === 'lesson-chat' ? 'lesson-plans' : activeId;

  const addLesson = useCallback((lesson) => {
    const mastery = getLessonMasteryDefault(lesson);

    setLessons((currentLessons) => [
      {
        ...lesson,
        mastery,
        progressTone: lesson.progressTone ?? getProgressTone(mastery),
      },
      ...currentLessons,
    ]);
  }, []);

  const updateLessonMessages = useCallback((lessonId, messages) => {
    setLessons((currentLessons) =>
      currentLessons.map((lesson) =>
        lesson.id === lessonId ? { ...lesson, messages } : lesson,
      ),
    );
  }, []);

  const deleteLesson = useCallback((lessonId) => {
    setLessons((currentLessons) =>
      currentLessons.filter((lesson) => lesson.id !== lessonId),
    );
    setLessonToContinueId((currentLessonId) =>
      currentLessonId === lessonId ? '' : currentLessonId,
    );
  }, []);

  const deleteStudent = useCallback((studentId) => {
    setStudents((currentStudents) =>
      currentStudents.filter((student) => student.id !== studentId),
    );
  }, []);

  const openLessonChat = useCallback((lessonId) => {
    setLessonToContinueId(lessonId);
    setActiveId('lesson-chat');
  }, []);

  const openLessonPlans = useCallback(() => {
    setLessonToContinueId('');
    setActiveId('lesson-plans');
  }, []);

  const openGenerate = useCallback(() => {
    setLessonToContinueId('');
    setActiveId('generate');
  }, []);

  const navigate = useCallback((pageId) => {
    if (pageId !== 'lesson-chat') {
      setLessonToContinueId('');
    }

    setActiveId(pageId);
  }, []);

  return {
    activeId,
    activeNavId,
    lessonToContinueId,
    lessons,
    students,
    addLesson,
    deleteLesson,
    deleteStudent,
    navigate,
    openGenerate,
    openLessonChat,
    openLessonPlans,
    updateLessonMessages,
  };
}
