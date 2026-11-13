import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendUrl } from './constants';
import { createSession } from './sessionCore';
import { reportOnce } from './errorReporting';

// The signed-in state of this phone. See sessionCore.js for what each function does.
export const {
  getSession, setSession, clearSession, hasSession, authFetch, signOut,
  requestPasswordReset, requestUsernameReminder, confirmPasswordReset, changePassword,
} = createSession({
  secureStore: SecureStore,
  asyncStorage: AsyncStorage,
  getBackendUrl: () => backendUrl,
  fetchFn: (...args) => fetch(...args),
  // Secure storage failing on someone's phone is exactly what error reporting is for; it repeats on every read, so once.
  log: (message, error) => {
    console.log(message);
    if (error) reportOnce(error, 'session');
  },
});
