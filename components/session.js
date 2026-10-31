import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { backendUrl } from './constants';
import { createSession } from './sessionCore';

// The signed-in state of this phone. See sessionCore.js for what each function does.
export const {
  getSession, setSession, clearSession, hasSession, authFetch, signOut,
  requestPasswordReset, confirmPasswordReset, changePassword,
} = createSession({
  secureStore: SecureStore,
  asyncStorage: AsyncStorage,
  getBackendUrl: () => backendUrl,
  fetchFn: (...args) => fetch(...args),
  log: (message, error) => console.log(message, error),
});
