import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Sidebar } from './Sidebar';
import { UsersView } from './UsersView';
import { VersionsView } from './VersionsView';
import { SettingsView } from './SettingsView';

export interface SystemUser {
  id: string;
  username: string;
  email: string;
  php_version: string;
  nodejs_version: string;
  database_type: string;
  database_version: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function Dashboard() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('users');

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'users':
        return <UsersView />;
      case 'php':
      case 'nodejs':
      case 'database':
        return <VersionsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <UsersView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        userEmail={user?.email}
      />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-xl font-bold text-gray-900">CloudLinux LVE Management</h1>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
