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
import { useAppViewModel } from './viewmodel/appViewModel.js';

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
  const {
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
  } = useAppViewModel();
  const ActiveComponent = PAGES[activeId];

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
                onClick={() => navigate(id)}
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
          onDeleteStudent={deleteStudent}
          onOpenGenerate={openGenerate}
          onOpenLessonPlans={openLessonPlans}
          onUpdateLessonMessages={updateLessonMessages}
        />
      </main>
    </div>
  );
}
