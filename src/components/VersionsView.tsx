import { useState, useEffect } from 'react';
import { Code2, RefreshCw, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Version {
  id: string;
  software_type: string;
  version: string;
  is_active: boolean;
}

export function VersionsView() {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  const loadVersions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('available_versions')
        .select('*')
        .order('software_type', { ascending: true });

      if (error) throw error;
      setVersions(data || []);
    } catch (error) {
      console.error('Error loading versions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVersions();
  }, []);

  const softwareTypes = Array.from(new Set(versions.map((v) => v.software_type)));
  const filteredVersions = filter
    ? versions.filter((v) => v.software_type === filter)
    : versions;

  const getIcon = (type: string) => {
    switch (type) {
      case 'php':
      case 'nodejs':
        return <Code2 className="w-5 h-5" />;
      case 'mysql':
      case 'postgresql':
        return <Database className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'php':
        return { bg: 'bg-blue-100', text: 'text-blue-600', badge: 'bg-blue-600' };
      case 'nodejs':
        return { bg: 'bg-green-100', text: 'text-green-600', badge: 'bg-green-600' };
      case 'mysql':
        return { bg: 'bg-orange-100', text: 'text-orange-600', badge: 'bg-orange-600' };
      case 'postgresql':
        return { bg: 'bg-purple-100', text: 'text-purple-600', badge: 'bg-purple-600' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-600', badge: 'bg-gray-600' };
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case 'php':
        return 'PHP';
      case 'nodejs':
        return 'Node.js';
      case 'mysql':
        return 'MySQL';
      case 'postgresql':
        return 'PostgreSQL';
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Версії ПО</h2>
          <p className="text-gray-600 mt-1">Доступні версії для конфігурації</p>
        </div>
        <button
          onClick={loadVersions}
          className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
        >
          <RefreshCw className="w-5 h-5" />
          Оновити
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Все
        </button>
        {softwareTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === type
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {getLabel(type)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVersions.map((v) => {
            const colors = getColor(v.software_type);
            return (
              <div
                key={v.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`${colors.bg} p-2 rounded-lg`}>
                    {getIcon(v.software_type)}
                  </div>
                  <span
                    className={`${colors.badge} text-white text-xs font-semibold px-3 py-1 rounded-full`}
                  >
                    {v.is_active ? 'Активна' : 'Неактивна'}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {getLabel(v.software_type)}
                </h3>
                <p className={`text-2xl font-bold ${colors.text}`}>{v.version}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
