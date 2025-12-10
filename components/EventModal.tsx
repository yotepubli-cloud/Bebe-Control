import React, { useState, useEffect } from 'react';
import { X, Pill, Stethoscope, Syringe, MapPin, Trash2, CalendarPlus } from 'lucide-react';
import { EventType, CalendarEvent } from '../types';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  onDelete?: () => void;
  initialData?: CalendarEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSubmit, onDelete, initialData }) => {
  const [type, setType] = useState<EventType>('appointment');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setType(initialData.type);
        setTitle(initialData.title);
        setDate(initialData.date);
        setTime(initialData.time);
        setLocation(initialData.location);
      } else {
        // Defaults for new event
        setType('appointment');
        setTitle('');
        setDate(new Date().toISOString().split('T')[0]);
        setTime('10:00');
        setLocation('');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!title || !date) return;
    onSubmit({ title, date, time, type, location });
    onClose();
  };

  const handleAddToGoogleCalendar = () => {
      if (!title || !date || !time) return;

      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour duration default

      const formatDate = (d: Date) => {
          return d.toISOString().replace(/-|:|\.\d\d\d/g, "");
      };

      const params = new URLSearchParams({
          action: 'TEMPLATE',
          text: title,
          dates: `${formatDate(startTime)}/${formatDate(endTime)}`,
          details: `Tipo: ${type}`,
          location: location || ''
      });

      window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-cardBg w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {initialData ? 'Editar Evento' : 'Nuevo Evento'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Título</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Vacuna 4 meses"
              className="w-full bg-gray-50 dark:bg-darkBg border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary placeholder-gray-500 dark:placeholder-gray-600"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="w-1/3">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Hora</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo</label>
            <div className="flex gap-2">
              {[
                { id: 'vaccine', icon: <Syringe size={20} /> },
                { id: 'appointment', icon: <Stethoscope size={20} /> },
                { id: 'medication', icon: <Pill size={20} /> },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setType(item.id as EventType)}
                  className={`flex-1 py-3 rounded-lg flex justify-center items-center transition-colors ${
                    type === item.id
                      ? 'bg-primary/20 border-primary text-primary border'
                      : 'bg-gray-50 dark:bg-darkBg border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-500 border hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Ubicación</label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Centro de Salud"
                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-300 dark:border-gray-700 rounded-lg p-3 pl-10 text-gray-900 dark:text-white focus:outline-none focus:border-primary placeholder-gray-500 dark:placeholder-gray-600"
              />
            </div>
          </div>
            
          {/* Add to Google Calendar Button */}
          {title && date && time && (
            <button
                onClick={handleAddToGoogleCalendar}
                className="w-full py-2 flex items-center justify-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium text-sm transition-colors border border-dashed border-blue-500/30 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10"
            >
                <CalendarPlus size={16} />
                Añadir a Google Calendar
            </button>
          )}

          <div className="flex gap-3 mt-6">
            {initialData && onDelete && (
                <button
                    onClick={() => {
                        if(window.confirm('¿Seguro que quieres eliminar este evento?')) {
                            onDelete();
                            onClose();
                        }
                    }}
                    className="p-3.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                >
                    <Trash2 size={20} />
                </button>
            )}
            <button
                onClick={handleSubmit}
                className="flex-1 bg-primary hover:bg-primaryDark text-white dark:text-darkBg font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/20"
            >
                {initialData ? 'Guardar Cambios' : 'Crear Evento'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};