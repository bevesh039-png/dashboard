import { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreateUserModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

interface AvailableVersions {
  php: string[];
  nodejs: string[];
  mysql: string[];
  postgresql: string[];
}

export function CreateUserModal({ onClose, onSuccess }: CreateUserModalProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phpVersion, setPhpVersion] = useState('8.2');
  const [nodejsVersion, setNodejsVersion] = useState('20.x');
  const [databaseType, setDatabaseType] = useState<'mysql' | 'postgresql'>('mysql');
  const [databaseVersion, setDatabaseVersion] = useState('8.0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [versions, setVersions] = useState<AvailableVersions>({
    php: ['7.4','8.2'],
    nodejs: [],
    mysql: [],
    postgresql: [],
  });

  useEffect(() => {
    loadAvailableVersions();
  }, []);

  const loadAvailableVersions = async () => {
    try {
      const { data, error } = await supabase
        .from('available_versions')
        .select('*')
        .eq('is_active', true);

      if (error) throw error;

      const grouped: AvailableVersions = {
        php: [],
        nodejs: [],
        mysql: [],
        postgresql: [],
      };

      data?.forEach((item) => {
        if (item.software_type in grouped) {
          grouped[item.software_type as keyof AvailableVersions].push(item.version);
        }
      });

      setVersions(grouped);

      if (grouped.php.length > 0) setPhpVersion(grouped.php[0]);
      if (grouped.nodejs.length > 0) setNodejsVersion(grouped.nodejs[0]);
      if (grouped.mysql.length > 0) setDatabaseVersion(grouped.mysql[0]);
    } catch (err) {
      console.error('Error loading versions:', err);
    }
  };

  const handleDatabaseTypeChange = (type: 'mysql' | 'postgresql') => {
    setDatabaseType(type);
    const availableVersions = type === 'mysql' ? versions.mysql : versions.postgresql;
    if (availableVersions.length > 0) {
      setDatabaseVersion(availableVersions[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { error: insertError } = await supabase.from('system_users').insert([
        {
          username,
          email,
          php_version: phpVersion,
          nodejs_version: nodejsVersion,
          database_type: databaseType,
          database_version: databaseVersion,
          status: 'active',
        },
      ]);

      if (insertError) throw insertError;

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        setError((err as { message: string }).message);
      } else {
        setError('Ошибка создания пользователя');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 inline-block mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Успешно!</h3>
            <p className="text-gray-600">Пользователь создан и доступы работают</p>
          </div>
        </div>
      </div>
    );
  }

  const availableDbVersions =
    databaseType === 'mysql' ? versions.mysql : versions.postgresql;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Создать пользователя</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя пользователя *
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="user123"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="user@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Версия PHP *
            </label>
            <select
              value={phpVersion}
              onChange={(e) => setPhpVersion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {versions.php.map((version) => (
                <option key={version} value={version}>
                  PHP {version}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Версия Node.js *
            </label>
            <select
              value={nodejsVersion}
              onChange={(e) => setNodejsVersion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {versions.nodejs.map((version) => (
                <option key={version} value={version}>
                  Node.js {version}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип базы данных *
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleDatabaseTypeChange('mysql')}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
                  databaseType === 'mysql'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                MySQL
              </button>
              <button
                type="button"
                onClick={() => handleDatabaseTypeChange('postgresql')}
                className={`px-4 py-3 border-2 rounded-lg font-medium transition-colors ${
                  databaseType === 'postgresql'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                }`}
              >
                PostgreSQL
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Версия {databaseType === 'mysql' ? 'MySQL' : 'PostgreSQL'} *
            </label>
            <select
              value={databaseVersion}
              onChange={(e) => setDatabaseVersion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {availableDbVersions.map((version) => (
                <option key={version} value={version}>
                  {databaseType === 'mysql' ? 'MySQL' : 'PostgreSQL'} {version}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Создание...' : 'Создать пользователя'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
