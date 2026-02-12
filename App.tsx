
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen bg-slate-950 text-slate-100 font-sans overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1400px] mx-auto min-h-full pb-12">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/members" element={<Members />} />
              <Route path="/schedule" element={<div className="p-8"><h1 className="text-2xl font-bold">Gestión de Horarios (Próximamente)</h1></div>} />
              <Route path="/settings" element={<div className="p-8"><h1 className="text-2xl font-bold">Configuración (Próximamente)</h1></div>} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
