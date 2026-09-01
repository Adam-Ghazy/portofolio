// Admin Dashboard Types

export type Tab = 'sections' | 'projects' | 'experiences' | 'skills' | 'stats' | 'settings';

export interface Section {
  id?: number;
  slug: string;
  title: string;
  subtitle: string;
  content: string;
  image_url?: string;
  sort_order: number;
  is_active: number;
  updated_at?: string;
}

export interface Project {
  id?: number;
  title: string;
  description: string;
  problem?: string;
  solution?: string;
  impact?: string;
  image_url?: string;
  year: string;
  role: string;
  tags: string;
  link?: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface Experience {
  id?: number;
  company: string;
  position: string;
  program?: string;
  location: string;
  period: string;
  description: string;
  systems?: string; // JSON string of systems/projects contributed to
  technologies: string;
  collaboration?: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id?: number;
  degree: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
  description?: string;
  sort_order: number;
  is_active: number;
}

export interface Certification {
  id?: number;
  title: string;
  issuer: string;
  location: string;
  issue_date: string;
  credential_info?: string;
  sort_order: number;
  is_active: number;
}

export interface Skill {
  id?: number;
  title: string;
  description: string; // Used as Category: 'Programming & Development' | 'Backend & API' | 'Database' | 'Tools & Infrastructure' | 'Development Practices' | 'Soft Skills'
  icon: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
}

export interface AboutStat {
  id?: number;
  value: string;
  label: string;
  sort_order: number;
  is_active: number;
}

export interface Approach {
  id?: number;
  step_number?: string;
  title: string;
  description: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface Settings {
  site_title: string;
  site_description: string;
  hero_meta: string;
  footer_tagline: string;
  status_left: string;
  status_right: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  [key: string]: string;
}

export type AdminData = Section | Project | Experience | Education | Certification | Skill | AboutStat | Approach;

export interface FormErrors {
  [key: string]: string;
}


