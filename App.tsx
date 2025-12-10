import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Agenda } from './pages/Agenda';
import { Growth } from './pages/Growth';
import { Expenses } from './pages/Expenses';
import { Documents } from './pages/Documents';
import { Settings } from './pages/Settings';
import { BottomNav } from './components/BottomNav';
import { Tab, BabyProfile, CalendarEvent, Expense, GrowthRecord, DocumentFile } from './types';
import { INITIAL_PROFILE, MOCK_EVENTS, MOCK_EXPENSES, MOCK_DOCS, MOCK_WEIGHT_HISTORY, MOCK_HEIGHT_HISTORY } from './constants';

// Hook personalizado para persistencia de datos
function usePersistentState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.error(`Error saving localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  
  // Estados persistentes (se guardan en el móvil/navegador)
  const [profile, setProfile] = usePersistentState<BabyProfile>('leo_profile', INITIAL_PROFILE);
  const [isDarkMode, setIsDarkMode] = usePersistentState<boolean>('leo_theme', true);
  
  const [events, setEvents] = usePersistentState<CalendarEvent[]>('leo_events', MOCK_EVENTS);
  const [expenses, setExpenses] = usePersistentState<Expense[]>('leo_expenses', MOCK_EXPENSES);
  const [weightHistory, setWeightHistory] = usePersistentState<GrowthRecord[]>('leo_weight', MOCK_WEIGHT_HISTORY);
  const [heightHistory, setHeightHistory] = usePersistentState<GrowthRecord[]>('leo_height', MOCK_HEIGHT_HISTORY);
  const [documents, setDocuments] = usePersistentState<DocumentFile[]>('leo_docs', MOCK_DOCS);

  // Estados persistentes para funcionalidades extra
  const [products, setProducts] = usePersistentState<string[]>('leo_products', ['Pañales T2', 'Toallitas Húmedas', 'Leche Fórmula', 'Crema Balsámica', 'Apiretal', 'Body Manga Larga']);
  const [chequeLimit, setChequeLimit] = usePersistentState<number>('leo_cheque', 2500);

  // Theme Toggler
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Efecto para aplicar el tema
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Event Handlers
  const handleAddEvent = (e: CalendarEvent) => setEvents([...events, e]);
  const handleUpdateEvent = (updated: CalendarEvent) => setEvents(events.map(e => e.id === updated.id ? updated : e));
  const handleDeleteEvent = (id: string) => setEvents(events.filter(e => e.id !== id));

  // Expense Handlers
  const handleAddExpense = (e: Expense) => setExpenses([e, ...expenses]);
  const handleUpdateExpense = (updated: Expense) => setExpenses(expenses.map(e => e.id === updated.id ? updated : e));
  const handleDeleteExpense = (id: string) => setExpenses(expenses.filter(e => e.id !== id));
  
  const handleAddProduct = (newProduct: string) => {
    if (!products.includes(newProduct)) {
      setProducts([...products, newProduct].sort());
    }
  };

  // Growth Handlers
  const handleAddGrowth = (r: GrowthRecord) => {
    if (r.type === 'weight') setWeightHistory([...weightHistory, r].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    else setHeightHistory([...heightHistory, r].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
  const handleUpdateGrowth = (updated: GrowthRecord) => {
    if (updated.type === 'weight') setWeightHistory(weightHistory.map(r => r.id === updated.id ? updated : r).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    else setHeightHistory(heightHistory.map(r => r.id === updated.id ? updated : r).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };
  const handleDeleteGrowth = (id: string, type: 'weight' | 'height') => {
    if (type === 'weight') setWeightHistory(weightHistory.filter(r => r.id !== id));
    else setHeightHistory(heightHistory.filter(r => r.id !== id));
  };

  // Document Handlers
  const handleAddDoc = (d: DocumentFile) => setDocuments([d, ...documents]);
  const handleUpdateDoc = (updated: DocumentFile) => setDocuments(documents.map(d => d.id === updated.id ? updated : d));
  const handleDeleteDoc = (id: string) => setDocuments(documents.filter(d => d.id !== id));

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <Home 
            profile={profile} 
            events={events} 
            expenses={expenses}
            weightHistory={weightHistory}
            heightHistory={heightHistory}
            onTabChange={setActiveTab}
            updateProfile={setProfile}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
        );
      case 'agenda':
        return (
          <Agenda 
            events={events} 
            onAdd={handleAddEvent}
            onUpdate={handleUpdateEvent}
            onDelete={handleDeleteEvent}
          />
        );
      case 'crecer':
        return (
          <Growth 
            profile={profile}
            weightHistory={weightHistory}
            heightHistory={heightHistory}
            onAdd={handleAddGrowth}
            onUpdate={handleUpdateGrowth}
            onDelete={handleDeleteGrowth}
          />
        );
      case 'gastos':
        return (
          <Expenses 
            expenses={expenses} 
            onAdd={handleAddExpense}
            onUpdate={handleUpdateExpense}
            onDelete={handleDeleteExpense}
            products={products}
            onAddProduct={handleAddProduct}
            chequeLimit={chequeLimit}
            onUpdateChequeLimit={setChequeLimit}
          />
        );
      case 'documentos':
        return (
          <Documents 
            docs={documents} 
            onAdd={handleAddDoc}
            onUpdate={handleUpdateDoc}
            onDelete={handleDeleteDoc}
          />
        );
      case 'ajustes':
        return (
          <Settings onBack={() => setActiveTab('inicio')} />
        );
      default:
        return (
          <Home 
            profile={profile} 
            events={events} 
            expenses={expenses} 
            weightHistory={weightHistory}
            heightHistory={heightHistory}
            onTabChange={setActiveTab} 
            updateProfile={setProfile}
            toggleTheme={toggleTheme}
            isDarkMode={isDarkMode}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-darkBg text-white font-sans selection:bg-primary selection:text-darkBg transition-colors duration-300">
      <div className="relative">
        {renderContent()}
      </div>
      <BottomNav currentTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default App;
