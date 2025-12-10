import React, { useState } from 'react';
import { Plus, Check, Trash2, X } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { GrowthRecord, BabyProfile } from '../types';

interface GrowthProps {
  profile: BabyProfile;
  weightHistory: GrowthRecord[];
  heightHistory: GrowthRecord[];
  onAdd: (r: GrowthRecord) => void;
  onUpdate: (r: GrowthRecord) => void;
  onDelete: (id: string, type: 'weight' | 'height') => void;
}

export const Growth: React.FC<GrowthProps> = ({ profile, weightHistory, heightHistory, onAdd, onUpdate, onDelete }) => {
  const [metric, setMetric] = useState<'peso' | 'altura'>('peso');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<GrowthRecord | null>(null);
  
  const history = metric === 'peso' ? weightHistory : heightHistory;
  const currentVal = metric === 'peso' ? profile.weight : profile.height; 
  const unit = metric === 'peso' ? 'kg' : 'cm';
  
  // Calculate dynamic domain padding for better visualization
  // Increased padding for weight to prevent label cutoff
  const domainPadding = metric === 'peso' ? 1.2 : 4;
  const yDomain = [`dataMin - ${domainPadding}`, `dataMax + ${domainPadding}`];

  // Modal State
  const [recordDate, setRecordDate] = useState('');
  const [recordValue, setRecordValue] = useState('');

  const openModal = (record?: GrowthRecord) => {
    if (record) {
      setEditingRecord(record);
      setRecordDate(record.date);
      setRecordValue(record.value.toString());
    } else {
      setEditingRecord(null);
      setRecordDate(new Date().toISOString().split('T')[0]);
      setRecordValue('');
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    const val = parseFloat(recordValue);
    if (isNaN(val) || !recordDate) return;

    if (editingRecord) {
      onUpdate({ ...editingRecord, date: recordDate, value: val });
    } else {
      onAdd({ 
        id: Date.now().toString(), 
        date: recordDate, 
        value: val, 
        type: metric === 'peso' ? 'weight' : 'height' 
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto animate-fade-in">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Crecimiento de Leo</h1>
        <button 
            onClick={() => openModal()}
            className="w-10 h-10 rounded-full bg-primary text-darkBg flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="bg-cardBg p-1 rounded-xl flex mb-6 border border-gray-800">
        <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${metric === 'peso' ? 'bg-darkBg text-white shadow-sm' : 'text-gray-400'}`}
            onClick={() => setMetric('peso')}
        >
            Peso
        </button>
        <button 
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${metric === 'altura' ? 'bg-darkBg text-white shadow-sm' : 'text-gray-400'}`}
            onClick={() => setMetric('altura')}
        >
            Altura
        </button>
      </div>

      <div className="mb-2">
        <p className="text-gray-400 text-xs font-bold uppercase mb-1">{metric === 'peso' ? 'Peso Actual' : 'Altura Actual'}</p>
        <div className="flex items-center gap-3">
            <h2 className="text-4xl font-bold text-white">{history.length > 0 ? history[history.length - 1].value : currentVal} <span className="text-lg font-medium text-gray-500">{unit}</span></h2>
            <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-1 rounded-full border border-green-500/20">Actualizado</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-cardBg rounded-3xl border border-gray-800 p-4 mb-8 h-64 relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 30, right: 10, left: 0, bottom: 5 }}>
                <defs>
                    <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#334155" strokeOpacity={0.3} strokeDasharray="4 4" />
                <XAxis dataKey="date" hide />
                <YAxis 
                    domain={yDomain} 
                    tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 600 }}
                    tickFormatter={(val) => metric === 'peso' ? val.toFixed(1) : Math.round(val).toString()}
                    tickLine={false}
                    axisLine={false}
                    width={35}
                    allowDecimals={metric === 'peso'}
                />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#374151', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ display: 'none' }}
                    formatter={(value: number) => [`${value} ${unit}`, metric === 'peso' ? 'Peso' : 'Altura']}
                />
                <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#2dd4bf" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorVal)" 
                    label={{ 
                        position: 'top', 
                        fill: '#f1f5f9', 
                        fontSize: 12, 
                        fontWeight: 'bold',
                        dy: -10,
                        formatter: (val: number) => metric === 'peso' ? val.toFixed(1) : val
                    }}
                    activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }}
                />
            </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* History List */}
      <h3 className="text-lg font-bold mb-4">Historial de {metric === 'peso' ? 'Peso' : 'Altura'}</h3>
      <div className="space-y-3">
        {[...history].reverse().map((record) => {
            const date = new Date(record.date);
            return (
                <div 
                    key={record.id} 
                    onClick={() => openModal(record)}
                    className="bg-cardBg p-4 rounded-2xl border border-gray-800 flex justify-between items-center group hover:border-gray-600 cursor-pointer transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-center bg-darkBg rounded-lg p-2 min-w-[50px] border border-gray-800">
                            <span className="text-[10px] text-gray-400 uppercase font-bold">{date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')}</span>
                            <span className="text-lg font-bold text-white leading-none">{date.getDate()}</span>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-white">{record.value} <span className="text-sm font-medium text-gray-500">{unit}</span></p>
                            <p className="text-xs text-gray-500 capitalize">{date.toLocaleDateString('es-ES', { weekday: 'long' })}</p>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-full border border-gray-700 flex items-center justify-center text-gray-600 group-hover:text-primary group-hover:border-primary transition-colors">
                        <span className="text-xs">✎</span>
                    </div>
                </div>
            );
        })}
      </div>

      {/* Add/Edit Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-cardBg w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">{editingRecord ? 'Editar Registro' : 'Nuevo Registro'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="bg-darkBg/50 rounded-xl p-3 mb-6 flex justify-center items-center text-primary font-bold border border-gray-700">
                    <span className="mr-2">📈</span> {metric === 'peso' ? 'Peso' : 'Altura'}
                </div>

                <div className="flex gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Fecha</label>
                        <input
                            type="date"
                            value={recordDate}
                            onChange={(e) => setRecordDate(e.target.value)}
                            className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-400 mb-1">Valor ({unit})</label>
                        <input
                            type="number"
                            value={recordValue}
                            onChange={(e) => setRecordValue(e.target.value)}
                            placeholder="0.0"
                            className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    {editingRecord && (
                        <button
                            onClick={() => {
                                if(window.confirm('¿Eliminar este registro?')) {
                                    onDelete(editingRecord.id, editingRecord.type);
                                    setIsModalOpen(false);
                                }
                            }}
                            className="p-3.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        className="flex-1 bg-primary hover:bg-primaryDark text-darkBg font-bold py-3.5 rounded-xl transition-colors"
                    >
                        {editingRecord ? 'Guardar' : 'Añadir'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};