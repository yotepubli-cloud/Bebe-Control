import React, { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { BabyProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BabyProfile;
  onSave: (p: BabyProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [formData, setFormData] = useState(profile);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Convert image to Base64 to store in localStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-cardBg w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Editar Perfil</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-primary to-blue-500 cursor-pointer hover:scale-105 transition-transform"
            >
               <img src={formData.avatar} alt="Avatar" className="w-full h-full rounded-full object-cover border-4 border-cardBg bg-gray-800" />
            </div>
            <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-cardBg p-2 rounded-full border border-gray-600 text-white hover:text-primary transition-colors"
            >
              <Camera size={16} />
            </button>
          </div>
          
          <button 
             onClick={() => fileInputRef.current?.click()}
             className="text-xs text-primary font-bold hover:text-primaryDark transition-colors"
          >
             Cambiar foto
          </button>
          
          <input 
                 type="file" 
                 ref={fileInputRef} 
                 onChange={handleFileChange} 
                 accept="image/*"
                 hidden 
            />
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">Nombre</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
             <label className="block text-xs font-medium text-gray-400 mb-1">Apellidos</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div>
             <label className="block text-xs font-medium text-gray-400 mb-1">Fecha Nacimiento</label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Peso Nac. (kg)</label>
              <input
                type="number"
                step="0.01"
                value={formData.birthWeight}
                onChange={(e) => setFormData({ ...formData, birthWeight: parseFloat(e.target.value) || 0 })}
                className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-400 mb-1">Altura Nac. (cm)</label>
              <input
                type="number"
                step="0.1"
                value={formData.birthHeight}
                onChange={(e) => setFormData({ ...formData, birthHeight: parseFloat(e.target.value) || 0 })}
                 className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <button
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="w-full bg-primary hover:bg-primaryDark text-darkBg font-bold py-3.5 rounded-xl mt-2 transition-colors"
          >
            Guardar Perfil
          </button>
        </div>
      </div>
    </div>
  );
