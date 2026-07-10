import { useState } from 'react';
import {
  Home,
  User,
  Settings,
  BarChart3,
  Mail,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'messages', label: 'Messages', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];

function HomePage() {
  return <PageShell title="Home">This is the Home page content.</PageShell>;
}
function ProfilePage() {
  return <PageShell title="Profile">This is the Profile page content.</PageShell>;
}
function AnalyticsPage() {
  return <PageShell title="Analytics">This is the Analytics page content.</PageShell>;
}
function MessagesPage() {
  return <PageShell title="Messages">This is the Messages page content.</PageShell>;
}
function SettingsPage() {
  return <PageShell title="Settings">This is the Settings page content.</PageShell>;
}

function PageShell({ title, children }) {
  return (
      <div className="h-full w-full p-8">
        <h1 className="text-2xl font-semibold mb-4">{title}</h1>
        <p className="text-gray-600">{children}</p>
      </div>
  );
}

const PAGES = {
  home: HomePage,
  profile: ProfilePage,
  analytics: AnalyticsPage,
  messages: MessagesPage,
  settings: SettingsPage,
};

export default function App() {
  const [activeId, setActiveId] = useState('home');
  const ActiveComponent = PAGES[activeId];

  return (
      <div>
        {/* Sidebar */}
        <nav>
          <div>
            My App
          </div>
          <ul>
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                      onClick={() => setActiveId(id)}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                </li>
            ))}
          </ul>
        </nav>

        {/* Content area — fills remaining space */}
        <main className="flex-1 overflow-y-auto">
          <ActiveComponent />
        </main>
      </div>
  );
}