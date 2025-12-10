import React, { useState, useRef } from 'react';
import { Plus, X, Filter, FileText, Eye, Trash2, CloudUpload, Pencil, Download, Heart, Scale, FolderOpen } from 'lucide-react';
import { DocumentFile } from '../types';

interface DocumentsProps {
  docs: DocumentFile[];
  onAdd: (d: DocumentFile) => void;
  onUpdate: (d: DocumentFile) => void;
  onDelete: (id: string) => void;
}

export const Documents: React.FC<DocumentsProps> = ({ docs, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentFile | null>(null);
  const [docToDelete, setDocToDelete] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter State
  const [filterTag, setFilterTag] = useState('Todos');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [tag, setTag] = useState('Informes');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const openModal = (doc?: DocumentFile) => {
    setSelectedFile(null);
    if (doc) {
        setEditingDoc(doc);
        setName(doc.name);
        setDate(doc.date);
        setTag(doc.tag);
    } else {
        setEditingDoc(null);
        setName('');
        setDate(new Date().toISOString().split('T')[0]);
        setTag('Informes');
    }
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setSelectedFile(file);
          // Auto-fill name if empty
          if (!name) {
              setName(file.name.split('.')[0]);
          }
      }
  };

  const handleSubmit = () => {
    if (!name || !date) return;
    
    let fileUrl = editingDoc?.fileUrl;
    let size = editingDoc?.size || '0 KB';
    let type = editingDoc?.type || 'pdf';

    if (selectedFile) {
        fileUrl = URL.createObjectURL(selectedFile);
        size = `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`;
        type = selectedFile.type.includes('image') ? 'img' : 'pdf';
    }

    const docData = {
        name,
        date,
        tag,
        size,
        type: type as 'pdf' | 'img',
        fileUrl
    };

    if (editingDoc) {
        onUpdate({ ...editingDoc, ...docData });
    } else {
        onAdd({ id: Date.now().toString(), ...docData } as DocumentFile);
    }
    setIsModalOpen(false);
  };

  const handleView = (doc: DocumentFile) => {
      if (doc.fileUrl) {
          window.open(doc.fileUrl, '_blank');
      } else {
          alert('Este es un documento de ejemplo sin archivo real adjunto.');
      }
  };

  const handleDownload = (doc: DocumentFile) => {
      if (doc.fileUrl) {
          const link = document.createElement('a');
          link.href = doc.fileUrl;
          link.download = doc.name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      } else {
          alert('Este es un documento de ejemplo sin archivo real adjunto.');
      }
  };

  const getDocStyle = (tag: string) => {
    switch (tag) {
        case 'Salud': return { icon: <Heart size={20} />, color: 'bg-red-500/10 text-red-500 border-red-500/20' };
        case 'Legal': return { icon: <Scale size={20} />, color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
        case 'Informes': return { icon: <FileText size={20} />, color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
        default: return { icon: <FolderOpen size={20} />, color: 'bg-gray-500/10 text-gray-400 border-gray-500/20' };
    }
  };

  // Filter docs based on selection
  const filteredDocs = filterTag === 'Todos' 
    ? docs 
    : docs.filter(doc => doc.tag === filterTag);

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto min-h-screen animate-fade-in">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Documentos</h1>
        <div className="flex gap-2">
            <button 
                onClick={() => openModal()}
                className="w-10 h-10 rounded-full bg-primary text-darkBg flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
            >
            <Plus size={24} />
            </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full flex justify-between items-center bg-cardBg p-3 rounded-xl border border-gray-800 text-sm hover:border-gray-600 transition-colors"
        >
            <div className="flex items-center gap-2">
                <Filter size={16} className="text-primary" />
                <span className="font-bold">{filterTag}</span>
            </div>
            <span className={`text-gray-500 text-xs transition-transform ${isFilterOpen ? 'rotate-180' : ''}`}>▼</span>
        </button>
        
        {isFilterOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-cardBg border border-gray-800 rounded-xl shadow-xl z-20 overflow-hidden animate-fade-in">
                {['Todos', 'Informes', 'Legal', 'Salud', 'Otros'].map(tagItem => (
                    <button
                        key={tagItem}
                        onClick={() => {
                            setFilterTag(tagItem);
                            setIsFilterOpen(false);
                        }}
                        className={`w-full text-left p-3 text-sm hover:bg-gray-800 transition-colors ${tagItem === filterTag ? 'text-primary font-bold bg-primary/5' : 'text-gray-300'}`}
                    >
                        {tagItem}
                    </button>
                ))}
            </div>
        )}
      </div>

      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
                <FolderOpen size={48} className="mx-auto mb-3 opacity-20" />
                <p>No hay documentos en esta categoría</p>
            </div>
        ) : (
            filteredDocs.map(doc => {
                const { icon, color } = getDocStyle(doc.tag);
                return (
                    <div key={doc.id} className="bg-cardBg p-4 rounded-2xl border border-gray-800 flex items-center justify-between group">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border ${color}`}>
                                {icon}
                            </div>
                            <div className="min-w-0">
                                <h4 className="font-bold text-sm text-white truncate pr-2">{doc.name}</h4>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500">{doc.date} • {doc.size}</p>
                                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-gray-700 text-gray-400 bg-gray-800">{doc.tag}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                            <button onClick={() => handleDownload(doc)} className="p-1.5 hover:text-white transition-colors" title="Descargar"><Download size={16} /></button>
                            <button onClick={() => handleView(doc)} className="p-1.5 hover:text-primary transition-colors" title="Ver"><Eye size={16} /></button>
                            <button onClick={() => openModal(doc)} className="p-1.5 hover:text-white transition-colors" title="Editar"><Pencil size={16} /></button>
                            <button 
                                onClick={() => setDocToDelete(doc.id)} 
                                className="p-1.5 hover:text-red-500 transition-colors" title="Eliminar"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    </div>
                );
            })
        )}
      </div>

       {/* Upload/Edit Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-cardBg w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">{editingDoc ? 'Editar Documento' : 'Subir Documento'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                {!editingDoc && (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed ${selectedFile ? 'border-primary text-primary bg-primary/10' : 'border-gray-700 text-gray-500 bg-darkBg hover:border-primary hover:text-primary'} rounded-xl p-6 mb-6 flex flex-col items-center justify-center transition-colors cursor-pointer`}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            hidden 
                        />
                        <CloudUpload size={32} className="mb-2" />
                        <span className="text-xs font-bold text-center">
                            {selectedFile ? selectedFile.name : 'Toca para seleccionar archivo'}
                        </span>
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Nombre del Archivo</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ej. Análisis de sangre"
                            className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary placeholder-gray-600"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1">Fecha</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                        />
                    </div>

                    <div>
                         <label className="block text-xs font-medium text-gray-400 mb-1">Asignar Etiqueta</label>
                         <select 
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            className="w-full bg-darkBg border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary"
                         >
                             <option>Informes</option>
                             <option>Legal</option>
                             <option>Salud</option>
                             <option>Otros</option>
                         </select>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={!editingDoc && !selectedFile}
                        className={`w-full font-bold py-3.5 rounded-xl mt-4 transition-colors ${!editingDoc && !selectedFile ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-primary hover:bg-primaryDark text-darkBg'}`}
                    >
                        {editingDoc ? 'Guardar Cambios' : 'Añadir Documento'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {docToDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-cardBg w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-700">
                <h3 className="text-lg font-bold text-white mb-2">¿Eliminar documento?</h3>
                <p className="text-gray-400 text-sm mb-6">Esta acción no se puede deshacer. ¿Estás seguro?</p>
                <div className="flex gap-3">
                    <button
                        onClick={() => setDocToDelete(null)}
                        className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 font-bold hover:bg-gray-800 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={() => {
                            if (docToDelete) onDelete(docToDelete);
                            setDocToDelete(null);
                        }}
                        className="flex-1 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 font-bold hover:bg-red-500/20 transition-colors"
                    >
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};