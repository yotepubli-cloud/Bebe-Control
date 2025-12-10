import React from 'react';
import { Calendar, TrendingUp, Home, Wallet, FileText } from 'lucide-react';
import { Tab } from '../types';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  const navItems: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'agenda', label: 'Agenda', icon: <Calendar size={18} /> },
    { id: 'crecer', label: 'Crecer', icon: <TrendingUp size={18} /> },
    { id: 'inicio', label: 'Inicio', icon: <Home size={22} /> },
    { id: 'gastos', label: 'Gastos', icon: <Wallet size={18} /> },
    { id: 'documentos', label: 'Docs', icon: <FileText size={18} /> },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-darkBg/95 backdrop-blur-sm border-t border-gray-800 pb-safe pt-2 px-2 z-50">
      <div className="flex justify-between items-end max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          const isMain = item.id === 'inicio';

          if (isMain) {
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`relative -top-5 flex flex-col items-center justify-center`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform ${isActive ? 'bg-primary text-darkBg scale-110' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] mt-1 font-medium ${isActive ? 'text-primary' : 'text-gray-500'}`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center justify-center p-2 min-w-[3.5rem] transition-colors ${isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <div className={`mb-1 ${isActive ? 'text-primary' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
