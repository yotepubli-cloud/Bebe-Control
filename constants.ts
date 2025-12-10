import { BabyProfile, CalendarEvent, GrowthRecord, Expense, DocumentFile } from './types';

export const INITIAL_PROFILE: BabyProfile = {
  name: "Leo",
  lastName: "García",
  dob: "2024-03-17",
  weight: 7.8,
  height: 65,
  avatar: "/avatar.png", // Guarda tu imagen en la carpeta public con este nombre
  birthWeight: 3.5,
  birthHeight: 50
};

export const MOCK_EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'Vitamina D (3 gotas)',
    type: 'medication',
    date: '2025-08-15',
    time: '20:00',
    location: 'Casa'
  },
  {
    id: '2',
    title: 'Cita Pediatra',
    type: 'appointment',
    date: '2025-08-20',
    time: '09:00',
    location: 'Clínica Central'
  },
  {
    id: '3',
    title: 'Rotavirus - 2da Dosis',
    type: 'vaccine',
    date: '2025-12-10',
    time: '10:00',
    location: 'Centro de Salud Familiar'
  },
  {
    id: '4',
    title: 'Control de los 4 Meses',
    type: 'appointment',
    date: '2025-12-12',
    time: '11:30',
    location: 'Dr. Martinez'
  }
];

export const MOCK_WEIGHT_HISTORY: GrowthRecord[] = [
  { id: '1', date: '2025-01-15', value: 3.2, type: 'weight' },
  { id: '2', date: '2025-02-15', value: 4.5, type: 'weight' },
  { id: '3', date: '2025-03-15', value: 5.8, type: 'weight' },
  { id: '4', date: '2025-04-15', value: 6.5, type: 'weight' },
  { id: '5', date: '2025-05-15', value: 7.1, type: 'weight' },
  { id: '6', date: '2025-06-15', value: 7.8, type: 'weight' },
];

export const MOCK_HEIGHT_HISTORY: GrowthRecord[] = [
  { id: '1', date: '2025-01-15', value: 50, type: 'height' },
  { id: '2', date: '2025-02-15', value: 54, type: 'height' },
  { id: '3', date: '2025-03-15', value: 58, type: 'height' },
  { id: '4', date: '2025-04-15', value: 61, type: 'height' },
  { id: '5', date: '2025-05-15', value: 63, type: 'height' },
  { id: '6', date: '2025-06-15', value: 65, type: 'height' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', title: 'Crema Pañal', amount: 8.50, date: '2025-07-20', category: 'health', isBabyCheck: false },
  { id: '2', title: 'Pack Pañales T2', amount: 24.99, date: '2025-07-01', category: 'diapers', isBabyCheck: true },
  { id: '3', title: 'Juguete Sonajero', amount: 12.99, date: '2025-06-15', category: 'toys', isBabyCheck: true },
  { id: '4', title: 'Visita Pediatra', amount: 45.00, date: '2025-06-05', category: 'health', isBabyCheck: false },
  { id: '5', title: 'Leche Fórmula 800g', amount: 18.50, date: '2025-05-12', category: 'food', isBabyCheck: false },
  { id: '6', title: 'Pack Pañales T2', amount: 24.99, date: '2025-05-10', category: 'diapers', isBabyCheck: true },
];

export const MOCK_DOCS: DocumentFile[] = [
  { id: '1', name: 'Informe Vacunación 2 meses', date: '2023-10-12', size: '2.4 MB', tag: 'Informes', type: 'pdf' },
  { id: '2', name: 'Certificado de Nacimiento', date: '2023-09-15', size: '5.1 MB', tag: 'Legal', type: 'pdf' },
  { id: '3', name: 'Receta Pediatra - Fiebre', date: '2023-11-02', size: '180 KB', tag: 'Salud', type: 'pdf' },
];

export const MONTH_DATA = [
  { name: 'may', amount: 45 },
  { name: 'jun', amount: 60 },
  { name: 'jul', amount: 35 },
];