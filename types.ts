export type Tab = 'agenda' | 'crecer' | 'inicio' | 'gastos' | 'documentos';

export interface BabyProfile {
  name: string;
  lastName: string;
  dob: string; // YYYY-MM-DD
  weight: number;
  height: number;
  avatar: string; // URL string
  birthWeight: number;
  birthHeight: number;
}

export type EventType = 'medication' | 'appointment' | 'vaccine';

export interface CalendarEvent {
  id: string;
  title: string;
  type: EventType;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description?: string;
}

export interface GrowthRecord {
  id: string;
  date: string;
  value: number;
  type: 'weight' | 'height';
}

export type ExpenseCategory = 'food' | 'diapers' | 'clothes' | 'health' | 'toys' | 'other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  isBabyCheck: boolean;
}

export interface DocumentFile {
  id: string;
  name: string;
  date: string;
  size: string;
  tag: string;
  type: 'pdf' | 'img';
  fileUrl?: string; // URL for blob or download
}