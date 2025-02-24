'use client';
// components/NavigationControls.tsx
import { useNavigation, View } from '@/context/NavigationContex';
import { useState, useEffect } from 'react';
import { Map, List } from 'lucide-react'; // Import icons from lucide-react

export default function NavigationControls() {
  const { showMap, showList, currentView } = useNavigation();
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Handle transition animation
  const handleTransition = (viewFn: () => void) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    viewFn();
    
    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="flex m-4 sticky top-0 left-0">
      <div className="bg-white rounded-full shadow-md p-1 flex items-center relative">
        {/* Sliding background */}
        <div 
          className="absolute h-10 w-1/2 bg-blue-500 rounded-full transition-all duration-300 ease-in-out z-0"
          style={{ 
            left: currentView === View.MAP ? '0' : '50%',
            transform: isAnimating ? 'scale(1.05)' : 'scale(1)'
          }}
        />
        
        {/* Map button */}
        <button 
          onClick={() => handleTransition(showMap)}
          className={`relative z-10 flex items-center justify-center px-6 py-2 rounded-full transition-all duration-300 w-32
            ${currentView === View.MAP ? 'text-white' : 'text-gray-700 hover:text-gray-900'}`}
        >
          <Map size={18} className="mr-2" />
          <span>Harita</span>
        </button>
        
        {/* List button */}
        <button 
          onClick={() => handleTransition(showList)}
          className={`relative z-10 flex items-center justify-center px-6 py-2 rounded-full transition-all duration-300 w-32
            ${currentView === View.LIST ? 'text-white' : 'text-gray-700 hover:text-gray-900'}`}
        >
          <List size={18} className="mr-2" />
          <span>Liste</span>
        </button>
      </div>
    </div>
  );
}