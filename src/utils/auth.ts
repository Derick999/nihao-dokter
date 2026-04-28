export type StoredUser = {
  username: string;
  fullName?: string;
  birthDate?: string;
  gender?: string;
  weight?: string;
  height?: string;
  history?: string;
};

const USER_KEY = 'nihaoUser';
const LOGIN_KEY = 'isLoggedIn';
const LEGACY_LOGIN_KEY = 'nihaoIsLoggedIn';
const NAME_KEY = 'userName';
const HEIGHT_KEY = 'userHeight';
const WEIGHT_KEY = 'userWeight';

export const getStoredUser = (): StoredUser | null => {
  const rawUser = localStorage.getItem(USER_KEY);
  const isLoggedIn =
    localStorage.getItem(LOGIN_KEY) === 'true' ||
    localStorage.getItem(LEGACY_LOGIN_KEY) === 'true';

  if (!isLoggedIn) {
    return null;
  }

  const fallbackUser: StoredUser = {
    username: localStorage.getItem(NAME_KEY) || '',
    fullName: localStorage.getItem(NAME_KEY) || undefined,
    height: localStorage.getItem(HEIGHT_KEY) || undefined,
    weight: localStorage.getItem(WEIGHT_KEY) || undefined,
  };

  if (!rawUser) {
    return fallbackUser.username ? fallbackUser : null;
  }

  try {
    const parsedUser = JSON.parse(rawUser) as StoredUser;
    return {
      ...parsedUser,
      fullName: parsedUser.fullName || localStorage.getItem(NAME_KEY) || parsedUser.username,
      height: parsedUser.height || localStorage.getItem(HEIGHT_KEY) || undefined,
      weight: parsedUser.weight || localStorage.getItem(WEIGHT_KEY) || undefined,
    };
  } catch {
    return fallbackUser.username ? fallbackUser : null;
  }
};

export const loginUser = (user: StoredUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  localStorage.setItem(LOGIN_KEY, 'true');
  localStorage.setItem(LEGACY_LOGIN_KEY, 'true');
  localStorage.setItem(NAME_KEY, user.fullName || user.username || '');
  localStorage.setItem(HEIGHT_KEY, user.height || '');
  localStorage.setItem(WEIGHT_KEY, user.weight || '');
};

export const logoutUser = () => {
  localStorage.removeItem(LOGIN_KEY);
  localStorage.removeItem(LEGACY_LOGIN_KEY);
};
