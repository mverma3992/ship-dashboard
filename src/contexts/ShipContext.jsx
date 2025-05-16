import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFromStorage, saveToStorage } from '../utils/localStorage';

// Initial ship data
export const initialShips = [
  {
    id: '1',
    name: 'INS Vikrant',
    imo: 'IMO9879543',
    flag: 'India',
    status: 'Active'
  },
  {
    id: '2',
    name: 'INS Vikramaditya',
    imo: 'IMO9765432',
    flag: 'India',
    status: 'Active'
  },
  {
    id: '3',
    name: 'INS Chennai',
    imo: 'IMO9654321',
    flag: 'India',
    status: 'Under Maintenance'
  },
  {
    id: '4',
    name: 'INS Tarkash',
    imo: 'IMO9543210',
    flag: 'India',
    status: 'Active'
  },
  {
    id: '5',
    name: 'INS Kolkata',
    imo: 'IMO9432109',
    flag: 'India',
    status: 'Under Maintenance'
  },
  {
    id: '6',
    name: 'INS Kamorta',
    imo: 'IMO9321098',
    flag: 'India',
    status: 'Out of Service'
  }
];

// Create context
const ShipContext = createContext();

export const ShipProvider = ({ children }) => {
  // Get ships from localStorage or use initial data
  const [ships, setShips] = useState(() => {
    return getFromStorage('ships', initialShips);
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize ships in localStorage if they don't exist
  useEffect(() => {
    if (!getFromStorage('ships')) {
      saveToStorage('ships', initialShips);
    }
    setIsLoading(false);
  }, []);

  // Save ships to localStorage whenever they change
  useEffect(() => {
    saveToStorage('ships', ships);
  }, [ships]);

  // Add a new ship
  const addShip = (shipData) => {
    const newShip = {
      id: uuidv4(),
      ...shipData
    };
    setShips([...ships, newShip]);
    return newShip;
  };

  // Update a ship
  const updateShip = (id, shipData) => {
    const updatedShips = ships.map(ship => 
      ship.id === id ? { ...ship, ...shipData } : ship
    );
    setShips(updatedShips);
    return updatedShips.find(ship => ship.id === id);
  };

  // Delete a ship
  const deleteShip = (id) => {
    setShips(ships.filter(ship => ship.id !== id));
  };

  // Get a ship by ID
  const getShip = (id) => {
    return ships.find(ship => ship.id === id);
  };

  const value = {
    ships,
    isLoading,
    addShip,
    updateShip,
    deleteShip,
    getShip
  };

  return <ShipContext.Provider value={value}>{children}</ShipContext.Provider>;
};

// Custom hook to use ship context
export const useShips = () => {
  const context = useContext(ShipContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipProvider');
  }
  return context;
}; 