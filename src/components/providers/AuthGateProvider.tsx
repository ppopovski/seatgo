import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthGateContextType = {
  signInModalVisible: boolean;
  showSignInModal: () => void;
  hideSignInModal: () => void;
};

const AuthGateContext = createContext<AuthGateContextType | null>(null);

export function AuthGateProvider({ children }: { children: ReactNode }) {
  const [signInModalVisible, setSignInModalVisible] = useState(false);

  return (
    <AuthGateContext.Provider
      value={{
        signInModalVisible,
        showSignInModal: () => setSignInModalVisible(true),
        hideSignInModal: () => setSignInModalVisible(false),
      }}>
      {children}
    </AuthGateContext.Provider>
  );
}

export function useAuthGate() {
  const ctx = useContext(AuthGateContext);
  if (!ctx) throw new Error('useAuthGate must be used within AuthGateProvider');
  return ctx;
}

export function requireAuthOrShowModal(
  showSignInModal: () => void,
  isAuthenticated: boolean,
): boolean {
  if (!isAuthenticated) {
    showSignInModal();
    return false;
  }
  return true;
}
