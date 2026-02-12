
import { Member, MembershipStatus, GymStats, PeakHourData } from '../types';

// En un entorno real, aquí se inicializaría el cliente de Supabase
// import { createClient } from '@supabase/supabase-js'

const mockMembers: Member[] = [
  { id: '1', first_name: 'Alex', last_name: 'Pérez', email: 'alex@example.com', status: MembershipStatus.ACTIVE, plan: 'Premium', last_visit: '2023-10-25 10:30', joined_at: '2023-01-15', avatar_url: 'https://picsum.photos/seed/alex/100/100' },
  { id: '2', first_name: 'María', last_name: 'García', email: 'maria@example.com', status: MembershipStatus.ACTIVE, plan: 'Standard', last_visit: '2023-10-25 09:15', joined_at: '2023-03-20', avatar_url: 'https://picsum.photos/seed/maria/100/100' },
  { id: '3', first_name: 'Juan', last_name: 'Rodríguez', email: 'juan@example.com', status: MembershipStatus.INACTIVE, plan: 'Basic', last_visit: '2023-09-12 18:00', joined_at: '2022-11-05', avatar_url: 'https://picsum.photos/seed/juan/100/100' },
  { id: '4', first_name: 'Lucía', last_name: 'Martínez', email: 'lucia@example.com', status: MembershipStatus.ACTIVE, plan: 'Premium', last_visit: '2023-10-24 20:00', joined_at: '2023-05-10', avatar_url: 'https://picsum.photos/seed/lucia/100/100' },
  { id: '5', first_name: 'Carlos', last_name: 'Sánchez', email: 'carlos@example.com', status: MembershipStatus.EXPIRED, plan: 'Standard', last_visit: '2023-08-30 07:30', joined_at: '2022-08-15', avatar_url: 'https://picsum.photos/seed/carlos/100/100' },
  { id: '6', first_name: 'Elena', last_name: 'Torres', email: 'elena@example.com', status: MembershipStatus.ACTIVE, plan: 'Premium', last_visit: '2023-10-25 11:45', joined_at: '2023-06-01', avatar_url: 'https://picsum.photos/seed/elena/100/100' },
];

const mockPeakHours: PeakHourData[] = [
  { hour: '06:00', count: 25 },
  { hour: '07:00', count: 42 },
  { hour: '08:00', count: 65 },
  { hour: '09:00', count: 48 },
  { hour: '10:00', count: 30 },
  { hour: '11:00', count: 22 },
  { hour: '12:00', count: 18 },
  { hour: '13:00', count: 20 },
  { hour: '14:00', count: 25 },
  { hour: '15:00', count: 35 },
  { hour: '16:00', count: 58 },
  { hour: '17:00', count: 82 },
  { hour: '18:00', count: 95 },
  { hour: '19:00', count: 88 },
  { hour: '20:00', count: 60 },
  { hour: '21:00', count: 35 },
  { hour: '22:00', count: 15 },
];

export const supabaseService = {
  getMembers: async () => {
    // Simular latencia de red
    await new Promise(r => setTimeout(r, 500));
    return mockMembers;
  },
  
  getGymStats: async (): Promise<GymStats> => {
    await new Promise(r => setTimeout(r, 400));
    return {
      totalMembers: 1240,
      activeNow: 42,
      maxCapacity: 100,
      monthlyRevenue: 34500,
      newMembersThisMonth: 124
    };
  },

  getPeakHours: async (): Promise<PeakHourData[]> => {
    await new Promise(r => setTimeout(r, 600));
    return mockPeakHours;
  }
};
