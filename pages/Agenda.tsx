import React, { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight, MapPin, Syringe, Stethoscope, Pill } from 'lucide-react';
import { CalendarEvent } from '../types';
import { EventModal } from '../components/EventModal';

interface AgendaProps {
  events: CalendarEvent[];
  onAdd: (e: CalendarEvent) => void;
  onUpdate: (e: CalendarEvent) => void;
  onDelete: (id: string) => void;
}

export const Agenda: React.FC<AgendaProps> = ({ events, onAdd, onUpdate, onDelete }) => {
  const [view, setView] = useState<'agenda' | 'mes'>('agenda');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);

  const handleMonthChange = (increment: number) => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + increment, 1));
  };

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay(); // 0 = Sun

  const getEventIcon = (type: string) => {
    switch(type) {
        case 'vaccine': return <Syringe size={18} />;
        case 'appointment': return <Stethoscope size={18} />;
        case 'medication': return <Pill size={18} />;
        default: return <Stethoscope size={18} />;
    }
  };

  const getEventColor = (type: string) => {
     switch(type) {
        case 'vaccine': return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
        case 'appointment': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        case 'medication': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        default: return 'text-gray-400 bg-gray-500/10';
    }
  }

  const handleEventClick = (event: CalendarEvent) => {
      setEditingEvent(event);
      setIsModalOpen(true);
  };

  const handleCreateClick = () => {
      setEditingEvent(null);
      setIsModalOpen(true);
  };

  const handleSubmit = (data: any) => {
      if (editingEvent) {
          onUpdate({ ...editingEvent, ...data });
      } else {
          onAdd({ id: Date.now().toString(), ...data });
      }
  };

  // Group events by date for Agenda view
  const groupedEvents = events.reduce((acc, event) => {
    if (!acc[event.date]) acc[event.date] = [];
    acc[event.date].push(event);
    return acc;
  }, {} as Record<string, CalendarEvent[]>);

  const sortedDates = Object.keys(groupedEvents).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen relative animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Calendario de Leo</h1>
        <button 
            onClick={handleCreateClick}
            className="w-10 h-10 rounded-full bg-primary text-darkBg flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="bg-cardBg p-1 rounded-xl flex mb-8 border border-gray-800">
        <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'agenda' ? 'bg-darkBg text-white shadow-sm' : 'text-gray-400'}`}
            onClick={() => setView('agenda')}
        >
            Agenda
        </button>
        <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${view === 'mes' ? 'bg-darkBg text-white shadow-sm' : 'text-gray-400'}`}
            onClick={() => setView('mes')}
        >
            Mes
        </button>
      </div>

      {view === 'mes' ? (
        <div className="animate-fade-in">
             <div className="flex justify-between items-center mb-6 px-2">
                <button onClick={() => handleMonthChange(-1)} className="p-1 hover:bg-gray-800 rounded"><ChevronLeft size={20} className="text-gray-400" /></button>
                <span className="font-bold capitalize">{currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => handleMonthChange(1)} className="p-1 hover:bg-gray-800 rounded"><ChevronRight size={20} className="text-gray-400" /></button>
             </div>

             <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['D', 'L', 'M', 'X', 'J', 'V', 'S'].map(d => (
                    <span key={d} className="text-xs font-bold text-gray-500 py-2">{d}</span>
                ))}
             </div>

             <div className="grid grid-cols-7 gap-1 text-center">
                 {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
                 {Array.from({ length: daysInMonth }).map((_, i) => {
                     const day = i + 1;
                     const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                     const dayEvents = groupedEvents[dateStr];
                     const isToday = new Date().toDateString() === new Date(dateStr).toDateString();

                     return (
                        <div key={day} className="h-10 flex flex-col items-center justify-center relative cursor-pointer hover:bg-white/5 rounded-lg transition-colors">
                            <span className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${isToday ? 'bg-primary text-darkBg shadow-lg shadow-primary/30' : 'text-white'}`}>
                                {day}
                            </span>
                            {dayEvents && (
                                <div className="flex gap-0.5 mt-0.5">
                                    {dayEvents.map((ev, idx) => (
                                        <div key={idx} className={`w-1 h-1 rounded-full ${ev.type === 'vaccine' ? 'bg-pink-500' : 'bg-blue-500'}`}></div>
                                    ))}
                                </div>
                            )}
                        </div>
                     );
                 })}
             </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
            {sortedDates.map(date => {
                const dayEvents = groupedEvents[date];
                const dateObj = new Date(date);
                
                return (
                    <div key={date}>
                        <h3 className="text-gray-400 text-sm font-medium mb-3 capitalize">
                            {dateObj.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} 
                            <span className="ml-2 text-xs font-normal text-gray-600">{dayEvents.length} eventos</span>
                        </h3>
                        <div className="space-y-3 pl-4 border-l border-gray-800">
                            {dayEvents.map(event => (
                                <div 
                                    key={event.id} 
                                    onClick={() => handleEventClick(event)}
                                    className={`p-4 rounded-2xl border flex items-start gap-4 ${getEventColor(event.type).replace('text-', 'border-').replace('bg-', 'bg-opacity-10 ')} bg-cardBg cursor-pointer hover:bg-opacity-20 transition-all`}
                                >
                                    <div className={`p-2 rounded-full ${getEventColor(event.type)}`}>
                                        {getEventIcon(event.type)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider ${getEventColor(event.type).split(' ')[0]}`}>{event.type}</span>
                                            <span className="text-gray-400 text-xs font-mono">{event.time}</span>
                                        </div>
                                        <h4 className="font-bold text-white mb-1">{event.title}</h4>
                                        <div className="flex items-center text-gray-500 text-xs">
                                            <MapPin size={12} className="mr-1" />
                                            {event.location}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
      )}

      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingEvent}
        onDelete={editingEvent ? () => onDelete(editingEvent.id) : undefined}
      />
    </div>
  );
};