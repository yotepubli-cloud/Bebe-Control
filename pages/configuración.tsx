import React, { useRef } from 'react';
import { Download, Upload, Save, AlertTriangle, Database, Smartphone, ChevronLeft } from 'lucide-react';

export const Settings: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Claves de localStorage que queremos guardar
  const STORAGE_KEYS = [
    'leo_profile',
    'leo_events',
    'leo_expenses',
    'leo_weight',
    'leo_height',
    'leo_docs',
    'leo_products',
    'leo_cheque',
    'leo_theme'
  ];

  const handleExport = () => {
    const backupData: Record<string, any> = {};
    
    // Recopilar datos
    STORAGE_KEYS.forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        try {
          backupData[key] = JSON.parse(item);
        } catch (e) {
          backupData[key] = item;
        }
      }
    });

    // Añadir metadatos
    backupData['meta'] = {
      date: new Date().toISOString(),
      version: '1.0'
    };

    // Crear archivo y descargar
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `bebe_control_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validación básica
        if (!data.leo_profile && !data.meta) {
          alert('El archivo seleccionado no parece ser una copia de seguridad válida.');
          return;
        }

        if (window.confirm('ADVERTENCIA: Esto sobrescribirá TODOS los datos actuales con los del archivo. ¿Estás seguro?')) {
          // Restaurar datos
          STORAGE_KEYS.forEach(key => {
            if (data[key]) {
              if (typeof data[key] === 'object') {
                localStorage.setItem(key, JSON.stringify(data[key]));
              } else {
                localStorage.setItem(key, data[key]);
              }
            }
          });

          alert('Datos restaurados correctamente. La aplicación se reiniciará.');
          window.location.reload();
        }
      } catch (error) {
        console.error(error);
        alert('Error al leer el archivo. Asegúrate de que es un JSON válido.');
      }
    };
    reader.readAsText(file);
    // Limpiar input para permitir subir el mismo archivo si es necesario
    event.target.value = ''; 
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto animate-fade-in text-gray-900 dark:text-white">
      <div className="flex items-center gap-3 mb-6">
        <button 
          onClick={() => window.location.reload()} // Quick way to go back to default tab state if strictly needed, or relies on BottomNav
          className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
           <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Ajustes y Datos</h1>
      </div>

      <div className="space-y-6">
        
        {/* Export Section */}
        <div className="bg-cardBg p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-500">
              <Download size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Copia de Seguridad</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Guarda tus datos en un archivo</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Descarga un archivo con toda la información (fotos, eventos, gastos...) para guardarla en seguro o pasarla a otro móvil.
          </p>
          <button 
            onClick={handleExport}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Save size={18} />
            Descargar Copia
          </button>
        </div>

        {/* Import Section */}
        <div className="bg-cardBg p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Upload size={24} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Restaurar Datos</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Recupera datos desde un archivo</p>
            </div>
          </div>
          
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-4 flex gap-3">
             <AlertTriangle size={24} className="text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
             <p className="text-xs text-yellow-700 dark:text-yellow-400">
               Al restaurar una copia, <strong>se borrarán los datos actuales</strong> de este dispositivo y se reemplazarán por los del archivo.
             </p>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".json"
            className="hidden" 
          />
          
          <button 
            onClick={handleImportClick}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone size={18} />
            Seleccionar Archivo
          </button>
        </div>

        {/* Info Section */}
        <div className="text-center py-6">
            <Database size={32} className="mx-auto text-gray-300 dark:text-gray-700 mb-2" />
            <p className="text-xs text-gray-400">
                Los datos se guardan localmente en tu navegador. <br/>
                No se envían a ningún servidor externo.
            </p>
        </div>

      </div>
    </div>
  );
};
