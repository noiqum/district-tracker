'use client';
// context/NavigationContext.tsx

import { createContext, useContext, useState, ReactNode } from 'react';

// Define views as enum
export enum View {
  MAP = 'map',
  LIST = 'list'
}

// Define context type
interface NavigationContextType {
  currentView: View;
  showMap: () => void;
  showList: () => void;
  toggleView: () => void;
  isMapVisible: boolean;
  isListVisible: boolean;
}

// Create the context with an undefined initial value
const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

// Provider props type
interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [currentView, setCurrentView] = useState<View>(View.MAP);

  const showMap = () => setCurrentView(View.MAP);
  const showList = () => setCurrentView(View.LIST);
  const toggleView = () => {
    setCurrentView(prev => prev === View.MAP ? View.LIST : View.MAP);
  };

  return (
    <NavigationContext.Provider value={{ 
      currentView, 
      showMap, 
      showList, 
      toggleView,
      isMapVisible: currentView === View.MAP,
      isListVisible: currentView === View.LIST
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

// Custom hook for using the context
export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}