'use client';

import { Wifi, WifiOff, AlertTriangle, Clock } from 'lucide-react';
import { dashboardStats } from '@/lib/mock-data';
import { useEffect, useState } from 'react';

export function StatusBar() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <footer className="flex items-center h-8 border-t bg-slate-50 px-4 text-xs text-muted-foreground gap-6 shrink-0">
      {/* 系统状态 */}
      <div className="flex items-center gap-1.5">
        <div className="h-2 w-2 rounded-full bg-green-500" />
        <span>系统正常</span>
      </div>

      {/* 在线设备 */}
      <div className="flex items-center gap-1.5">
        <Wifi className="h-3.5 w-3.5 text-green-500" />
        <span>在线设备: {dashboardStats.onlineDevices}/{dashboardStats.totalDevices}</span>
      </div>

      {/* 未处理告警 */}
      <div className="flex items-center gap-1.5">
        <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />
        <span>未处理告警: {dashboardStats.unhandledAlerts}</span>
      </div>

      {/* 严重告警 */}
      {dashboardStats.criticalAlerts > 0 && (
        <div className="flex items-center gap-1.5">
          <WifiOff className="h-3.5 w-3.5 text-red-500" />
          <span className="text-red-600 font-medium">严重告警: {dashboardStats.criticalAlerts}</span>
        </div>
      )}

      {/* 当前时间 */}
      <div className="flex items-center gap-1.5 ml-auto">
        <Clock className="h-3.5 w-3.5" />
        <span>{currentTime}</span>
      </div>
    </footer>
  );
}
