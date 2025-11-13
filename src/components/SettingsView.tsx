import { Settings, Server, Shield } from 'lucide-react';

export function SettingsView() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Параметри системи</h2>
        <p className="text-gray-600 mt-1">Конфігурація CloudLinux LVE</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Server className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Інформація про сервер</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Hostname</p>
              <p className="font-medium text-gray-900 mt-1">cloudlinux.server.local</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">OS</p>
              <p className="font-medium text-gray-900 mt-1">CloudLinux 9</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">LVE Status</p>
              <p className="font-medium text-green-600 mt-1">Активна</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Безпека</h3>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">SELinux</p>
              <p className="font-medium text-gray-900 mt-1">Enabled</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Firewall</p>
              <p className="font-medium text-green-600 mt-1">Активний</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Auto-updates</p>
              <p className="font-medium text-gray-900 mt-1">Увімкнено</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-orange-100 p-2 rounded-lg">
            <Settings className="w-6 h-6 text-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Ресурси LVE</h3>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">CPU</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">50%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full w-1/2"></div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Пам'ять</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">65%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-orange-600 h-2 rounded-full w-2/3"></div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Disk I/O</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">30%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-green-600 h-2 rounded-full w-1/3"></div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Вхідна смуга</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">15%</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="bg-purple-600 h-2 rounded-full w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
