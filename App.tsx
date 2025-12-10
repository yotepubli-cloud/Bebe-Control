import React, { useState, useEffect } from 'react';
import { Home } from './pages/Home';
import { Agenda } from './pages/Agenda';
import { Growth } from './pages/Growth';
import { Expenses } from './pages/Expenses';
import { Documents } from './pages/Documents';
import { BottomNav } from './components/BottomNav';
import { Tab, BabyProfile, CalendarEvent, Expense, GrowthRecord, DocumentFile } from './types';
import { INITIAL_PROFILE, MOCK_EVENTS, MOCK_EXPENSES, MOCK_DOCS, MOCK_WEIGHT_HISTORY, MOCK_HEIGHT_HISTORY } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('inicio');
  const [profile, setProfile] = useState<BabyProfile>(INITIAL_PROFILE);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // State Management
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [weightHistory, setWeightHistory] = useState<GrowthRecord[]>(MOCK_WEIGHT_HISTORY);
  const [heightHistory, setHeightHistory] = useState<GrowthRecord[]>(MOCK_HEIGHT_HISTORY);
  const [documents, setDocuments] = useState<DocumentFile[]>(MOCK_DOCS);

  // New State for Expenses Features
  const [products, setProducts] = useState<string[]>(['Pañales T2', 'Toallitas Húmedas', 'Leche Fórmula', 'Crema Balsámica', 'Apiretal', 'Body Manga Larga']);
  const [chequeLimit, setChequeLimit] = useState<number>(2500);

  // Theme Toggler
  const toggleTheme = () => {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      html.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  // Ensure theme matches state on mount
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, []);

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