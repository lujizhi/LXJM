import type { Metadata } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import { AppShell } from '@/components/app-shell';

export const metadata: Metadata = {
  title: {
    default: 'LXJM | 具身智能设备管理平台',
    template: '%s | LXJM具身智能',
  },
  description: 'LXJM具身智能设备管理平台 - 面向工业制造场景的智能设备统一管控系统',
  keywords: ['LXJM', '具身智能', '设备管理', '机器狗', '工业制造'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {isDev && <Inspector />}
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
