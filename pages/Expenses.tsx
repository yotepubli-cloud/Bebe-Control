import React, { useState, useMemo } from 'react';
import { Plus, X, CreditCard, ShoppingBag, Baby, Heart, Tag, Trash2, Pencil } from 'lucide-react';
import { BarChart, Bar, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { Expense, ExpenseCategory } from '../types';

interface ExpensesProps {
  expenses: Expense[];
  onAdd: (e: Expense) => void;
  onUpdate: (e: Expense) => void;
  onDelete: (id: string) => void;
  products: string[];
  onAddProduct: (product: string) => void;
  chequeLimit: number;
  onUpdateChequeLimit: (limit: number) => void;
}

export const Expenses: React.FC<ExpensesProps> = ({ 
  expenses, onAdd, onUpdate, onDelete, products, onAddProduct, chequeLimit, onUpdateChequeLimit 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChequeModalOpen, setIsChequeModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  
  // Dynamic Monthly Data Calculation
  const chartData = useMemo(() => {
    const today = new Date();
    const data = [];
    
    // Generate last 6 months (including current)
    for (let i = 5; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthIndex = d.getMonth();
        const year = d.getFullYear();
        
        const monthlyTotal = expenses.reduce((sum, expense) => {
            const expDate = new Date(expense.date);
            if (expDate.getMonth() === monthIndex && expDate.getFullYear() === year) {
                return sum + expense.amount;
            }
            return sum;
        }, 0);

        const monthName = d.toLocaleDateString('es-ES', { month: 'short' });
        
        data.push({
            name: monthName.charAt(0).toUpperCase() + monthName.slice(1).replace('.', ''),
            amount: monthlyTotal,
            fullDate: d
        });
    }
    return data;
  }, [expenses]);

  // Cheque Logic
  const chequeSpent = expenses
    .filter(e => e.isBabyCheck)
    .reduce((acc, curr) => acc + curr.amount, 0);
  const chequeAvailable = chequeLimit - chequeSpent;
  const chequePercent = Math.min((chequeSpent / chequeLimit) * 100, 100);

  // Form State
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('other');
  const [isBabyCheck, setIsBabyCheck] = useState(false);
  const [newChequeLimit, setNewChequeLimit] = useState(chequeLimit.toString());

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
        case 'health': return <Heart size={16} />;
        case 'diapers': return <Baby size={16} />;
        case 'toys': return <Tag size={16} />;
        case 'food': return <span className="text-xs font-bold">Ψ</span>;
        default: return <ShoppingBag size={16} />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
        case 'health': return 'bg-red-500 text-red-100';
        case 'diapers': return 'bg-purple-500 text-purple-100';
        case 'toys': return 'bg-yellow-500 text-yellow-100';
        case 'food': return 'bg-green-500 text-green-100';
        default: return 'bg-blue-500 text-blue-100';
    }
  };

  const openModal = (expense?: Expense) => {
      if (expense) {
          setEditingExpense(expense);
          setTitle(expense.title);
          setAmount(expense.amount.toString());
          setDate(expense.date);
          setCategory(expense.category);
          setIsBabyCheck(expense.isBabyCheck);
      } else {
          setEditingExpense(null);
          setTitle('');
          setAmount('');
          setDate(new Date().toISOString().split('T')[0]);
          setCategory('other');
          setIsBabyCheck(false);
      }
      setIsModalOpen(true);
  };

  const handleSubmit = () => {
      if (!title || !amount) return;

      // Add to product database if new
      onAddProduct(title);

      const expenseData = {
          title,
          amount: parseFloat(amount),
          date,
          category,
          isBabyCheck
      };

      if (editingExpense) {
          onUpdate({ ...editingExpense, ...expenseData });
      } else {
          onAdd({ id: Date.now().toString(), ...expenseData });
      }
      setIsModalOpen(false);
  };

  const handleUpdateCheque = () => {
      const val = parseFloat(newChequeLimit);
      if (!isNaN(val)) {
          onUpdateChequeLimit(val);
      }
      setIsChequeModalOpen(false);
  };

  return (
    <div className="pb-24 pt-6 px-4 max-w-md mx-auto animate-fade-in text-gray-900 dark:text-white">
       <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Gastos</h1>
        <button 
            onClick={() => openModal()}
            className="w-10 h-10 rounded-full bg-primary text-darkBg flex items-center justify-center shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Credit Card Banner */}
      <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-3xl mb-8 shadow-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg text-white">
                    <CreditCard size={20} />
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm">Cheque Bebé</h3>
                    <p className="text-indigo-200 text-xs">Saldo disponible</p>
                </div>
            </div>
            <button 
                onClick={() => {
                    setNewChequeLimit(chequeLimit.toString());
                    setIsChequeModalOpen(true);
                }}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
                <Pencil size={14} />
            </button>
        </div>

        <div className="mb-4">
            <div className="flex items-end gap-2 mb-2">
                <span className="text-3xl font-bold text-white">{chequeAvailable.toFixed(2)}€</span>
                <span className="text-indigo-300 text-sm mb-1">/ {chequeLimit}€</span>
            </div>
            <div className="h-1.5 w-full bg-black/30 rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${chequePercent}%` }}></div>
            </div>
        </div>

        <div className="flex justify-between text-[10px] text-indigo-200 font-medium">
            <span>Gastado: {chequeSpent.toFixed(2)}€</span>
            <span>{chequePercent.toFixed(1)}%</span>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-cardBg p-6 rounded-3xl border border-gray-200 dark:border-gray-800 mb-8 shadow-sm">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Gasto Mensual</h3>
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="currentColor" className="text-gray-200 dark:text-gray-700" strokeOpacity={0.5} />
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#9ca3af', fontSize: 10 }}
                        tickFormatter={(val) => `${val}€`}
                    />
                    <Tooltip 
                        cursor={{ fill: 'rgba(128,128,128,0.1)' }}
                        contentStyle={{ 
                            backgroundColor: 'var(--bg-card)', 
                            borderColor: 'var(--bg-main)', 
                            borderRadius: '12px', 
                            fontSize: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                            color: 'var(--text-main)'
                        }}
                        formatter={(value: number) => [`${value.toFixed(2)}€`, 'Gasto Total']}
                        labelStyle={{ color: '#94a3b8', marginBottom: '4px', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} maxBarSize={40} animationDuration={1000}>
                        {chartData.map((entry, index) => (
                            <Cell 
                                key={`cell-${index}`} 
                                fill={index === chartData.length - 1 ? '#2dd4bf' : '#64748b'} 
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Movements */}
      <h3 className="text-lg font-bold mb-4">Últimos Movimientos</h3>
      <div className="space-y-3">
        {expenses.length > 0 ? expenses.map(expense => (
            <div 
                key={expense.id} 
                onClick={() => openModal(expense)}
                className="bg-cardBg p-4 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center justify-between cursor-pointer hover:border-gray-300 dark:hover:border-gray-600 transition-all shadow-sm"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getCategoryColor(expense.category)}`}>
                        {getCategoryIcon(expense.category)}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">{expense.title}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}</span>
                            {expense.isBabyCheck && <span className="text-[10px] bg-purple-500/10 text-purple-400 px-1.5 rounded border border-purple-500/20">Cheque</span>}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                     <span className="font-bold text-gray-900 dark:text-white">-{expense.amount.toFixed(2)}€</span>
                     <span className="text-xs">✎</span>
                </div>
            </div>
        )) : (
            <div className="text-center py-8 text-gray-500 bg-cardBg rounded-2xl border border-gray-200 dark:border-gray-800">
                No hay gastos registrados aún
            </div>
        )}
      </div>

       {/* Add/Edit Expense Modal */}
       {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-cardBg w-full max-w-sm rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingExpense ? 'Editar Gasto' : 'Nuevo Gasto'}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Producto / Concepto</label>
                        <input
                            list="products-list"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Buscar o escribir nuevo..."
                            className="w-full bg-gray-50 dark:bg-darkBg border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary placeholder-gray-500 dark:placeholder-gray-600"
                        />
                        <datalist id="products-list">
                            {products.map((p, idx) => <option key={idx} value={p} />)}
                        </datalist>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-1/3">
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Precio (€)</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0"
                                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                        <div className="flex-1">
                             <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha</label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-darkBg border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Etiqueta / Categoría</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['food', 'diapers', 'clothes', 'health', 'toys', 'other'].map(cat => (
                                <button 
                                    key={cat} 
                                    onClick={() => setCategory(cat as ExpenseCategory)}
                                    className={`py-2 rounded-lg text-xs font-medium border ${category === cat ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 dark:bg-darkBg border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500'}`}
                                >
                                    {cat === 'food' ? 'Comida' : 
                                     cat === 'diapers' ? 'Pañales' :
                                     cat === 'clothes' ? 'Ropa' :
                                     cat === 'health' ? 'Salud' :
                                     cat === 'toys' ? 'Juguetes' : 'Otros'}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div 
                        onClick={() => setIsBabyCheck(!isBabyCheck)}
                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${isBabyCheck ? 'bg-primary/10 border-primary' : 'bg-gray-50 dark:bg-darkBg border-gray-300 dark:border-gray-700'}`}
                    >
                        <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded mr-3 text-gray-600 dark:text-gray-300"><CreditCard size={14}/></div>
                        <div className="flex-1">
                             <p className={`text-xs font-bold ${isBabyCheck ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>Usar Cheque Bebé</p>
                             <p className="text-[10px] text-gray-500">Descontar del saldo disponible</p>
                        </div>
                        <div className={`w-10 h-5 rounded-full relative transition-colors ${isBabyCheck ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-700'}`}>
                            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isBabyCheck ? 'left-6' : 'left-1'}`}></div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        {editingExpense && (
                            <button
                                onClick={() => {
                                    if(window.confirm('¿Eliminar este gasto?')) {
                                        onDelete(editingExpense.id);
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
                            className="flex-1 bg-primary hover:bg-primaryDark text-white dark:text-darkBg font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-primary/20"
                        >
                            {editingExpense ? 'Guardar Cambios' : 'Añadir Gasto'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* Edit Cheque Limit Modal */}
      {isChequeModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm animate-fade-in">
            <div className="bg-cardBg w-full max-w-xs rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Editar Límite Cheque</h3>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Saldo Inicial (€)</label>
                <input
                    type="number"
                    value={newChequeLimit}
                    onChange={(e) => setNewChequeLimit(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-darkBg border border-gray-300 dark:border-gray-700 rounded-lg p-3 text-gray-900 dark:text-white focus:outline-none focus:border-primary mb-4"
                />
                <div className="flex gap-3">
                    <button 
                        onClick={() => setIsChequeModalOpen(false)}
                        className="flex-1 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={handleUpdateCheque}
                        className="flex-1 py-2 rounded-lg bg-primary text-white dark:text-darkBg font-bold"
                    >
                        Guardar
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};