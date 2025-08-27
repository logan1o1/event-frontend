// User types
export interface User {
  id: number;
  email: string;
  username: string;
  created_at: string;
  updated_at: string;
}

export interface UserRegistrationData {
  email: string;
  username: string;
  password: string;
  password_confirmation: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

// Category types
export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

// Event types
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  poster_url: string;
  user_id: number;
  category_id: number;
  created_at: string;
  updated_at: string;
  user: User;
  category: Category;
  participants: Participant[];
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  category_id: number;
  poster_url?: string;
}

// Participant types
export interface Participant {
  id: number;
  user_id: number;
  event_id: number;
  created_at: string;
  updated_at: string;
  user: User;
}

// Admin types
export interface Admin {
  id: number;
  email: string;
}

export interface AdminLoginData {
  email: string;
  password: string;
}

// Auth response types
export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface AdminAuthResponse {
  status: {
    code: number;
    message: string;
  };
  data: Admin;
  token: string;
}

// API response types
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: string[];
}

// Dashboard types
export interface DashboardStats {
  total_users: number;
  total_events: number;
  recent_events: Event[];
}
