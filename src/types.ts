export type Theme = 'light' | 'dark';

export type AppLanguage = 'ENGLISH' | 'TELUGU' | 'HINDI' | 'TAMIL' | 'MALAYALAM' | 'KANNADA';

export type AppFeature = 'CHAT' | 'CODE_GENERATOR' | 'CODE_EXPLAINER' | 'DTS' | 'SCHEDULE_GENERATOR' | 'DICTIONARY' | 'SYNTHETIC_CALCI' | 'EBOOKS' | 'RESUME_BUILDER' | 'PROGRAMS' | 'JOB_NOTIFICATIONS' | 'CAMPUS';

export interface User {
  id: number;
  name: string;
  email: string;
  isGuest?: boolean;
}

export interface ChatSession {
  session_id: string;
  first_msg: string;
  timestamp: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}
