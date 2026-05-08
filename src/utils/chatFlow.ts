import { getStoredUser } from './auth';

export type BookingDoctor = {
  doctorName: string;
  doctorTitle: string;
  specialization: string;
  avatarSeed: string;
  price: number;
};

export type FamilyProfile = {
  id: string;
  fullName: string;
  dob: string;
  relationship: string;
};

export type ActiveChatSession = {
  doctorName: string;
  doctorTitle: string;
  specialization: string;
  avatarSeed: string;
  patientName: string;
  startedAt: number;
};

const BOOKING_DOCTOR_KEY = 'nihaoBookingDoctor';
const FAMILY_PROFILES_KEY = 'nihaoFamilyProfiles';
const ACTIVE_CHAT_SESSION_KEY = 'active_session';
const LEGACY_ACTIVE_CHAT_SESSION_KEY = 'nihaoActiveChatSession';
const CHAT_DURATION_MS = 3 * 60 * 60 * 1000;

export const getChatDurationMs = () => CHAT_DURATION_MS;

export const savePendingDoctor = (doctor: BookingDoctor) => {
  localStorage.setItem(BOOKING_DOCTOR_KEY, JSON.stringify(doctor));
};

export const getPendingDoctor = (): BookingDoctor | null => {
  const raw = localStorage.getItem(BOOKING_DOCTOR_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as BookingDoctor;
  } catch {
    return null;
  }
};

export const clearPendingDoctor = () => {
  localStorage.removeItem(BOOKING_DOCTOR_KEY);
};

export const getFamilyProfiles = (): FamilyProfile[] => {
  const raw = localStorage.getItem(FAMILY_PROFILES_KEY);

  if (raw) {
    try {
      const parsed = JSON.parse(raw) as FamilyProfile[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch {
      // Fallback to default profile.
    }
  }

  const user = getStoredUser();
  if (!user) {
    return [];
  }

  const defaultProfile: FamilyProfile = {
    id: 'self',
    fullName: user.fullName || user.username,
    dob: user.birthDate || '',
    relationship: 'Saya Sendiri',
  };

  localStorage.setItem(FAMILY_PROFILES_KEY, JSON.stringify([defaultProfile]));
  return [defaultProfile];
};

export const saveFamilyProfiles = (profiles: FamilyProfile[]) => {
  localStorage.setItem(FAMILY_PROFILES_KEY, JSON.stringify(profiles));
};

export const saveActiveSession = (session: ActiveChatSession) => {
  localStorage.removeItem(LEGACY_ACTIVE_CHAT_SESSION_KEY);
  localStorage.setItem(ACTIVE_CHAT_SESSION_KEY, JSON.stringify(session));
};

export const getActiveSession = (): ActiveChatSession | null => {
  const raw =
    localStorage.getItem(ACTIVE_CHAT_SESSION_KEY) ||
    localStorage.getItem(LEGACY_ACTIVE_CHAT_SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as ActiveChatSession;

    if (!isSessionStillActive(parsed.startedAt)) {
      clearActiveSession();
      return null;
    }

    if (!localStorage.getItem(ACTIVE_CHAT_SESSION_KEY)) {
      localStorage.setItem(ACTIVE_CHAT_SESSION_KEY, raw);
      localStorage.removeItem(LEGACY_ACTIVE_CHAT_SESSION_KEY);
    }

    return parsed;
  } catch {
    return null;
  }
};

export const clearActiveSession = () => {
  localStorage.removeItem(ACTIVE_CHAT_SESSION_KEY);
  localStorage.removeItem(LEGACY_ACTIVE_CHAT_SESSION_KEY);
};

export const isSessionStillActive = (startedAt: number) => {
  return Date.now() - startedAt < CHAT_DURATION_MS;
};
