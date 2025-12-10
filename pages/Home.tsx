import React, { useState, useMemo } from 'react';
import { Bell, Sun, Moon, Pencil, ChevronRight, Weight, Ruler, Settings as SettingsIcon } from 'lucide-react';
import { BabyProfile, CalendarEvent, Expense, Tab, GrowthRecord } from '../types';
import { ProfileModal } from '../components/ProfileModal';
import { calculatePercentile, getPercentileLabel, getPercentileColor } from '../utils/growthData';

interface HomeProps {
  profile: BabyProfile;
  events: CalendarEvent[];
  expenses: Expense[];
  weightHistory: GrowthRecord[];
  heightHistory: GrowthRecord[];
  onTabChange: (tab: Tab) => void;
  updateProfile: (p: BabyProfile) => void;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Home: React.FC<HomeProps> = ({ 
  profile, 
  events, 
  expenses, 
  weightHistory,
  heightHistory,
  onTabChange, 
  updateProfile,
  toggleTheme,
  isDarkMode
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  // Logic: Only show events for the current month
  const currentMonthEvents = useMemo(() => {
    const now = new Date();
    return events.filter(e => {
        const eventDate = new Date(e.date);
        return eventDate.getMonth() === now.getMonth() && 
               eventDate.getFullYear() === now.getFullYear() &&
               eventDate >= new Date(now.setHours(0,0,0,0)); // Upcoming or today
    }).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  // Logic: Notification only if there is an event TODAY
  const hasTodayEvent = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    return events.some(e => e.date === todayStr);
  }, [events]);

  const calculateAgeInMonths = (dob: string) => {
    const birth = new Date(dob);
    const now = new Date(); 
    let months = (now.getFullYear() - birth.getFullYear()) * 12;
    months -= birth.getMonth();
    months += now.getMonth();
    return months <= 0 ? 0 : months;
  };

  // Get Latest Records
  const latestWeight = useMemo(() => {
    if (weightHistory.length === 0) return { value: profile.birthWeight, date: profile.dob };
    return weightHistory[weightHistory.length - 1];
  }, [weightHistory, profile]);

  const latestHeight = useMemo(() => {
    if (heightHistory.length === 0) return { value: profile.birthHeight, date: profile.dob };
    return heightHistory[heightHistory.length - 1];
  }, [heightHistory, profile]);

  // Calculate Percentiles
  const weightPercentile = useMemo(() => 
    calculatePercentile(profile.dob, latestWeight.date, latestWeight.value, 'weight'), 
  [profile.dob, latestWeight]);

  const heightPercentile = useMemo(() => 
    calculatePercentile(profile.dob, latestHeight.date, latestHeight.value, 'height'), 
  [profile.dob, latestHeight]);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto animate-fade-in text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <button className="p-2 text-primary bg-cardBg rounded-full border border-gray-200 dark:border-gray-800 shadow-sm">
           <div className="w-5 h-5 flex items-center justify-center">
             <span className="text-xs">👤</span>
           </div>
        </button>
        <div className="flex gap-3">
          {/* Settings Button */}
          <button 
            onClick={() => onTabChange('ajustes')}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white bg-cardBg rounded-full border border-gray-200 dark:border-gray-800 shadow-sm transition-colors"
            title="Ajustes"
          >
            <SettingsIcon size={20} />
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white bg-cardBg rounded-full border border-gray-200 dark:border-gray-800 shadow-sm transition-colors"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white bg-cardBg rounded-full border border-gray-200 dark:border-gray-800 relative shadow-sm transition-colors">
            <Bell size={20} />
            {hasTodayEvent && (
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-cardBg animate-pulse"></span>
            )}
          </button>
        </div>
      </div>

      {/* Greeting & Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative mb-4 group cursor-pointer" onClick={() => setIsProfileOpen(true)}>
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-blue-500 shadow-lg shadow-primary/20">
            <img 
              src={profile.avatar} 
              alt="Baby" 
              className="w-full h-full rounded-full object-cover border-4 border-darkBg bg-gray-100 dark:bg-gray-800"
            />
          </div>
          <div className="absolute bottom-0 right-0 bg-cardBg p-1.5 rounded-full border border-gray-200 dark:border-gray-600 text-primary shadow-sm">
            <Pencil size={12} fill="currentColor" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-1">Buenos días, {profile.name}</h1>
        <div className="bg-cardBg px-3 py-1 rounded-full border border-gray-200 dark:border-gray-700 flex items-center gap-2 shadow-sm">
            <span className="text-lg">🎂</span>
            <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">{calculateAgeInMonths(profile.dob)} meses</span>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Resumen de Salud</h2>
      
      {/* Health Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div 
            onClick={() => onTabChange('crecer')}
            className="bg-cardBg p-4 rounded-2xl border border-gray-200 dark:border-gray-800 relative overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-blue-500/10 rounded-full text-blue-500 dark:text-blue-400">
                <Weight size={18} />
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPercentileColor(weightPercentile)}`}>
                {getPercentileLabel(weightPercentile)}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Peso Actual</p>
          <div className="flex items-end gap-1">
             <span className="text-2xl font-bold text-gray-900 dark:text-white">{latestWeight.value}</span>
             <span className="text-sm text-gray-500 mb-1">kg</span>
          </div>
        </div>

        <div 
             onClick={() => onTabChange('crecer')}
             className="bg-cardBg p-4 rounded-2xl border border-gray-200 dark:border-gray-800 relative overflow-hidden cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-colors shadow-sm"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="p-2 bg-purple-500/10 rounded-full text-purple-500 dark:text-purple-400">
                <Ruler size={18} />
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${getPercentileColor(heightPercentile)}`}>
                {getPercentileLabel(heightPercentile)}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">Altura Actual</p>
          <div className="flex items-end gap-1">
             <span className="text-2xl font-bold text-gray-900 dark:text-white">{latestHeight.value}</span>
             <span className="text-sm text-gray-500 mb-1">cm</span>
          </div>
        </div>
      </div>

      {/* Expenses Summary */}
      <div onClick={() => onTabChange('gastos')} className="bg-cardBg p-5 rounded-2xl border border-gray-200 dark:border-gray-800 mb-8 cursor-pointer shadow-sm">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">Gasto Acumulado</h3>
            <span className="text-xs text-gray-500">16%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-darkBg rounded-full overflow-hidden mb-2">
            <div className="h-full bg-primary w-[16%] rounded-full"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
            <span>{totalExpense.toFixed(2)}€</span>
            <span>600€</span>
        </div>
      </div>

      {/* Upcoming Events */}
      <h2 className="text-lg font-bold mb-4">Eventos del Mes</h2>
      <div className="space-y-3">
        {currentMonthEvents.length > 0 ? currentMonthEvents.map(event => (
             <div key={event.id} onClick={() => onTabChange('agenda')} className="bg-cardBg p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors shadow-sm">
                <div className={`w-1 ${event.type === 'vaccine' ? 'bg-pink-500' : event.type === 'medication' ? 'bg-yellow-500' : 'bg-blue-500'} h-10 rounded-full`}></div>
                <div className="flex-1">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">{event.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(event.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short'})} • {event.time}</p>
                </div>
                <ChevronRight size={16} className="text-gray-400 dark:text-gray-600" />
             </div>
        )) : (
            <div className="text-center py-6 text-gray-500 text-sm bg-cardBg rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                No hay eventos para este mes
            </div>
        )}
      </div>

      <ProfileModal 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
        profile={profile}
        onSave={updateProfile}
      />
    </div>
  );
};
