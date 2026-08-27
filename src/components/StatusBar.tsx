'use client';

export default function StatusBar({ settings }: { settings: any }) {
  const currentYear = new Date().getFullYear();
  const defaultStatusRight = `terms & service · © ${currentYear}`;
  const statusRight =
    settings?.status_right && settings.status_right !== 'Digital Automation Studio'
      ? settings.status_right
      : defaultStatusRight;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-xl border-t px-4 h-6 flex items-center justify-between"
      style={{ 
        background: 'var(--bg-primary)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-tertiary)',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '0.03em'
      }}
    >
      <span>{settings?.status_left || 'ADAM GHAZY // JUNIOR DEVELOPER'}</span>
      <span>{statusRight}</span>
    </div>
  );
}
