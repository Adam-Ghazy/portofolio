export interface ProjectItem {
  id: number;
  title: string;
  title_id?: string;
  description: string;
  description_id?: string;
  year?: string;
  role?: string;
  role_id?: string;
  tags?: string;
  link?: string;
  image_url?: string;
  media?: { url: string; media_type?: string }[];
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 1,
    title: 'FoodLAB - Campus Food Ordering Platform',
    title_id: 'FoodLAB - Platform Pemesanan Makanan Kampus',
    role: 'Mobile App Developer (Flutter)',
    year: '2023 - 2025',
    tags: 'Flutter, Dart, Provider, REST API, Push Notifications',
    description:
      'A production campus food ordering platform built to eliminate physical canteen queues and streamline vendor order management at PENS.',
    description_id:
      'Platform pemesanan makanan kantin kampus yang dibangun untuk mengeliminasi antrean panjang dan mempermudah pengelolaan pesanan stan penjual di PENS.',
  },
  {
    id: 2,
    title: 'Real-Time Queue Management System',
    title_id: 'Sistem Manajemen Antrean Real-Time',
    role: 'Mobile App Developer (Flutter)',
    year: '2024',
    tags: 'Flutter, Dart, REST API, WebSocket, Real-Time Sync',
    description:
      'A real-time public service queue management mobile application deployed at the Gebang Putih Urban Village Office, Surabaya.',
    description_id:
      'Aplikasi mobile manajemen antrean pelayanan publik real-time yang diterapkan di Kantor Kelurahan Gebang Putih, Surabaya.',
  },
];
