"use client";

import React, { createContext, useContext, useState } from 'react';

type NavbarContextType = {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const NavbarContext = createContext<NavbarContextType | undefined>(undefined);

export const NavbarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <NavbarContext.Provider value={{ isExpanded, setIsExpanded }}>
      {children}
    </NavbarContext.Provider>
  );
};

export const useNavbar = () => {
  const context = useContext(NavbarContext);
  if (context === undefined) {
    throw new Error('useNavbar must be used within a NavbarProvider');
  }
  return context;
};