import { useCallback, useState } from 'react';
import {
  Home,
  FilePenLine,
  BarChart3,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import './App.css';
import logo from './assets/logo.svg';
import HomePage from './pages/home/Home.jsx';
import ClassEditorPage from './pages/ClassEditor.jsx';
import MasteryPage from './pages/Mastery.jsx';
import GeneratePage from './pages/Generate.jsx';
import LessonPlansPage from './pages/LessonPlans.jsx';
import LessonChatPage from './pages/LessonChat.jsx';

const INITIAL_LESSONS = [];

const INITIAL_STUDENTS = [
  { id: 'student-curtis-jackson', initials: 'CJ', name: 'Curtis Jackson' },
  { id: 'student-robert-kelly', initials: 'RK', name: 'Robert Kelly' },
  { id: 'student-lionel-messi', initials: 'LM', name: 'Lionel Messi' },
  { id: 'student-erling-haaland', initials: 'EH', name: 'Erling Haaland' },
  { id: 'student-curtis-jackson-2', initials: 'CJ', name: 'Curtis Jackson' },
  { id: 'student-robert-kelly-2', initials: 'RK', name: 'Robert Kelly' },
  { id: 'student-lionel-messi-2', initials: 'LM', name: 'Lionel Messi' },
  { id: 'student-erling-haaland-2', initials: 'EH', name: 'Erling Haaland' },
];

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

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'class-editor', label: 'Class Editor', icon: FilePenLine },
  { id: 'mastery', label: 'Mastery', icon: BarChart3 },
  { id: 'generate', label: 'Generate', icon: Sparkles },
  { id: 'lesson-plans', label: 'Lesson Plans', icon: BookOpen },
];

const PAGES = {
  home: HomePage,
  'class-editor': ClassEditorPage,
  mastery: MasteryPage,
  generate: GeneratePage,
  'lesson-plans': LessonPlansPage,
  'lesson-chat': LessonChatPage,
};

export default function App() {
  const [activeId, setActiveId] = useState('home');
  const [lessons, setLessons] = useState(INITIAL_LESSONS);
  const [students] = useState(INITIAL_STUDENTS);
  const [lessonToContinueId, setLessonToContinueId] = useState('');
  const ActiveComponent = PAGES[activeId];
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

  function handleNavigation(pageId) {
    if (pageId !== 'lesson-chat') {
      setLessonToContinueId('');
    }

    setActiveId(pageId);
  }

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="navbar-brand">
          <img src={logo} alt="My App logo" className="navbar-logo" />
          <h3>Groundwork</h3>
        </div>
        <ul className="nav-items">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                className={activeNavId === id ? 'active' : undefined}
                onClick={() => handleNavigation(id)}
              >
                <Icon size={18} />
                <span>{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <main className="content">
        <ActiveComponent
          lessonToContinueId={lessonToContinueId}
          lessons={lessons}
          students={students}
          onAddLesson={addLesson}
          onContinueLesson={openLessonChat}
          onDeleteLesson={deleteLesson}
          onOpenGenerate={openGenerate}
          onOpenLessonPlans={openLessonPlans}
          onUpdateLessonMessages={updateLessonMessages}
        />
      </main>
    </div>
  );
}
