// Admin Dashboard Types with Bilingual Support

export type Tab = 'sections' | 'projects' | 'experiences' | 'skills' | 'stats' | 'settings';

export interface Section {
  id?: number;
  slug: string;
  title: string;
  title_id?: string;
  subtitle: string;
  subtitle_id?: string;
  content: string;
  content_id?: string;
  image_url?: string;
  sort_order: number;
  is_active: number;
  updated_at?: string;
}

export interface Project {
  id?: number;
  title: string;
  title_id?: string;
  description: string;
  description_id?: string;
  problem?: string;
  problem_id?: string;
  solution?: string;
  solution_id?: string;
  impact?: string;
  impact_id?: string;
  image_url?: string;
  year: string;
  role: string;
  role_id?: string;
  tags: string;
  link?: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface SystemItem {
  title: string;
  title_id?: string;
  tagline?: string;
  tagline_id?: string;
  description: string;
  description_id?: string;
  tech?: string;
}

export interface Experience {
  id?: number;
  company: string;
  position: string;
  position_id?: string;
  program?: string;
  program_id?: string;
  location: string;
  period: string;
  description: string;
  description_id?: string;
  systems?: string; // JSON string of SystemItem[]
  systems_id?: string; // JSON string of translated systems
  technologies: string;
  collaboration?: string;
  collaboration_id?: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface Education {
  id?: number;
  degree: string;
  degree_id?: string;
  institution: string;
  location: string;
  period: string;
  gpa: string;
  description?: string;
  description_id?: string;
  sort_order: number;
  is_active: number;
}

export interface Certification {
  id?: number;
  title: string;
  title_id?: string;
  issuer: string;
  location: string;
  issue_date: string;
  credential_info?: string;
  credential_info_id?: string;
  sort_order: number;
  is_active: number;
}

export interface Skill {
  id?: number;
  title: string;
  description: string; // Used as Category
  description_id?: string;
  icon: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
}

export interface AboutStat {
  id?: number;
  value: string;
  label: string;
  label_id?: string;
  sort_order: number;
  is_active: number;
}

export interface Approach {
  id?: number;
  step_number?: string;
  title: string;
  title_id?: string;
  description: string;
  description_id?: string;
  sort_order: number;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

export interface Settings {
  site_title: string;
  site_title_id?: string;
  site_description: string;
  site_description_id?: string;
  hero_meta: string;
  hero_meta_id?: string;
  footer_tagline: string;
  footer_tagline_id?: string;
  status_left: string;
  status_right: string;
  email: string;
  phone: string;
  linkedin: string;
  location: string;
  [key: string]: string | undefined;
}

export type AdminData = Section | Project | Experience | Education | Certification | Skill | AboutStat | Approach;

export interface FormErrors {
  [key: string]: string;
}
