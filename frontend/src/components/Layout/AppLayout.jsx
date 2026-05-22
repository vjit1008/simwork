import { useState } from 'react';
import NeuralSidebar from './NeuralSidebar';
import NeuralTopbar  from './NeuralTopbar';

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--void)' }}>
      {/* Sidebar */}
      <div style={{ display: 'flex', flexShrink: 0 }} className="desktop-sidebar">
        <NeuralSidebar collapsed={collapsed} onToggle={() => setCollapsed(p => !p)} />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebar && (
        <>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', zIndex: 199, backdropFilter: 'blur(4px)' }}
            onClick={() => setMobileSidebar(false)} />
          <div style={{ position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 200 }}>
            <NeuralSidebar collapsed={false} onToggle={() => setMobileSidebar(false)} />
          </div>
        </>
      )}

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <NeuralTopbar onMenuClick={() => setMobileSidebar(p => !p)} />
        <main style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden' }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
        }
      `}</style>
    </div>
  );
}