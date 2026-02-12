
export enum MembershipStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PENDING = 'Pending',
  EXPIRED = 'Expired'
}

export interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: MembershipStatus;
  plan: string;
  last_visit: string;
  joined_at: string;
  avatar_url: string;
}

export interface AttendanceRecord {
  id: string;
  member_id: string;
  check_in: string;
  check_out?: string;
}

export interface PeakHourData {
  hour: string;
  count: number;
}

export interface GymStats {
  totalMembers: number;
  activeNow: number;
  maxCapacity: number;
  monthlyRevenue: number;
  newMembersThisMonth: number;
}
