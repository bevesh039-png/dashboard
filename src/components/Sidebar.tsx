import { Users, Settings, Database, Code2, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  userEmail?: string;
}

export function Sidebar({ activeTab, onTabChange, onLogout, userEmail }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  const menuItems = [
    {
      id: 'users',
      label: 'Користувачі',
      icon: Users,
      description: 'Управління системними користувачами',
    },
    {
      id: 'php',
      label: 'PHP версії',
      icon: Code2,
      description: 'Вибір версій PHP',
    },
    {
      id: 'nodejs',
      label: 'Node.js версії',
      icon: Code2,
      description: 'Вибір версій Node.js',
    },
    {
      id: 'database',
      label: 'База даних',
      icon: Database,
      description: 'Конфігурація БД',
    },
    {
      id: 'settings',
      label: 'Параметри',
      icon: Settings,
      description: 'Параметри системи',
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed lg:relative left-0 top-0 h-screen w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white shadow-xl transition-transform duration-300 z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-xl font-bold">CloudLinux LVE</h1>
          <p className="text-xs text-slate-400 mt-2">Управління сервером</p>
        </div>

        <nav className="p-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 shadow-lg'
                    : 'hover:bg-slate-700 text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.label}</p>
                    <p className="text-xs opacity-75 hidden group-hover:block">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-700 p-4 space-y-4">
          <div className="px-4 py-3 bg-slate-700 rounded-lg">
            <p className="text-xs text-slate-400">Авторизований як:</p>
            <p className="text-sm font-medium truncate mt-1">{userEmail}</p>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm font-medium bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Вихід
          </button>
        </div>
      </aside>
    </>
  );
}
