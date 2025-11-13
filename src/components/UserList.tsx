import { RefreshCw, User, Database, Code } from 'lucide-react';
import { SystemUser } from './Dashboard';

interface UserListProps {
  users: SystemUser[];
  loading: boolean;
  onRefresh: () => void;
}

export function UserList({ users, loading, onRefresh }: UserListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Нет пользователей</h3>
          <p className="text-gray-600">Создайте первого пользователя для начала работы</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={onRefresh}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Обновить
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{user.username}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 text-xs font-medium rounded ${
                  user.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {user.status}
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Code className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">PHP:</span>
                <span className="font-medium text-gray-900">{user.php_version}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Code className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Node.js:</span>
                <span className="font-medium text-gray-900">{user.nodejs_version}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <Database className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Database:</span>
                <span className="font-medium text-gray-900">
                  {user.database_type} {user.database_version}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500">
                Создан: {new Date(user.created_at).toLocaleString('ru-RU')}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
