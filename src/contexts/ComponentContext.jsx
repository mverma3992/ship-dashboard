import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFromStorage, saveToStorage } from '../utils/localStorage';
import { formatDate } from '../utils/dateUtils';

// Initial component data
export const initialComponents = [
  {
    id: '1',
    shipId: '1',
    name: 'Gas Turbine Engine',
    serialNumber: 'GTE-LM2500-01',
    installDate: '2022-01-15',
    lastMaintenanceDate: '2023-11-10'
  },
  {
    id: '2',
    shipId: '1',
    name: 'BrahMos Missile System',
    serialNumber: 'BMS-VIK-001',
    installDate: '2022-02-20',
    lastMaintenanceDate: '2023-10-05'
  },
  {
    id: '3',
    shipId: '1',
    name: 'Barak-8 Air Defense System',
    serialNumber: 'BAR8-VIK-002',
    installDate: '2022-01-30',
    lastMaintenanceDate: '2023-12-12'
  },
  {
    id: '4',
    shipId: '2',
    name: 'MiG-29K Support System',
    serialNumber: 'MIG-SUP-001',
    installDate: '2020-05-10',
    lastMaintenanceDate: '2023-08-15'
  },
  {
    id: '5',
    shipId: '2',
    name: 'STOBAR Flight Deck',
    serialNumber: 'DECK-VIK-001',
    installDate: '2019-11-03',
    lastMaintenanceDate: '2023-09-22'
  },
  {
    id: '6',
    shipId: '2',
    name: 'Marine Gas Turbine',
    serialNumber: 'MGT-VIK-003',
    installDate: '2019-10-15',
    lastMaintenanceDate: '2023-07-18'
  },
  {
    id: '7',
    shipId: '3',
    name: 'Oto Melara 76mm Gun',
    serialNumber: 'OMG-CHE-001',
    installDate: '2021-03-12',
    lastMaintenanceDate: '2023-11-30'
  },
  {
    id: '8',
    shipId: '3',
    name: 'HUMSA-NG Sonar System',
    serialNumber: 'HUM-CHE-002',
    installDate: '2021-04-05',
    lastMaintenanceDate: '2023-10-25'
  },
  {
    id: '9',
    shipId: '4',
    name: 'Brahmos Cruise Missile System',
    serialNumber: 'BMS-TAR-001',
    installDate: '2020-08-18',
    lastMaintenanceDate: '2023-12-05'
  },
  {
    id: '10',
    shipId: '4',
    name: 'Diesel Engine MTU 12V1163',
    serialNumber: 'MTU-TAR-002',
    installDate: '2020-07-25',
    lastMaintenanceDate: '2023-11-15'
  },
  {
    id: '11',
    shipId: '5',
    name: 'Main Propulsion System',
    serialNumber: 'MPS-KOL-001',
    installDate: '2021-05-10',
    lastMaintenanceDate: '2023-12-01'
  },
  {
    id: '12',
    shipId: '5',
    name: 'Shivalik Radar System',
    serialNumber: 'SRS-KOL-002',
    installDate: '2021-05-15',
    lastMaintenanceDate: '2023-09-10'
  },
  {
    id: '13',
    shipId: '6',
    name: 'AK-630 Gun System',
    serialNumber: 'AKG-KAM-001',
    installDate: '2020-02-28',
    lastMaintenanceDate: '2023-10-20'
  },
  {
    id: '14',
    shipId: '6',
    name: 'Kavach Chaff System',
    serialNumber: 'KCS-KAM-002',
    installDate: '2020-03-10',
    lastMaintenanceDate: '2023-11-05'
  }
];

// Create context
const ComponentContext = createContext();

export const ComponentProvider = ({ children }) => {
  // Get components from localStorage or use initial data
  const [components, setComponents] = useState(() => {
    return getFromStorage('components', initialComponents);
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize components in localStorage if they don't exist
  useEffect(() => {
    if (!getFromStorage('components')) {
      saveToStorage('components', initialComponents);
    }
    setIsLoading(false);
  }, []);

  // Save components to localStorage whenever they change
  useEffect(() => {
    saveToStorage('components', components);
  }, [components]);

  // Add a new component
  const addComponent = (componentData) => {
    const newComponent = {
      id: uuidv4(),
      ...componentData,
      installDate: formatDate(componentData.installDate || new Date()),
      lastMaintenanceDate: formatDate(componentData.lastMaintenanceDate || new Date())
    };
    setComponents([...components, newComponent]);
    return newComponent;
  };

  // Update a component
  const updateComponent = (id, componentData) => {
    // Ensure dates are properly formatted
    const formattedData = { ...componentData };
    if (formattedData.installDate) {
      formattedData.installDate = formatDate(formattedData.installDate);
    }
    if (formattedData.lastMaintenanceDate) {
      formattedData.lastMaintenanceDate = formatDate(formattedData.lastMaintenanceDate);
    }

    const updatedComponents = components.map(component => 
      component.id === id ? { ...component, ...formattedData } : component
    );
    setComponents(updatedComponents);
    return updatedComponents.find(component => component.id === id);
  };

  // Delete a component
  const deleteComponent = (id) => {
    setComponents(components.filter(component => component.id !== id));
  };

  // Get a component by ID
  const getComponent = (id) => {
    return components.find(component => component.id === id);
  };

  // Get components by ship ID
  const getComponentsByShip = (shipId) => {
    return components.filter(component => component.shipId === shipId);
  };

  const value = {
    components,
    isLoading,
    addComponent,
    updateComponent,
    deleteComponent,
    getComponent,
    getComponentsByShip
  };

  return <ComponentContext.Provider value={value}>{children}</ComponentContext.Provider>;
};

// Custom hook to use component context
export const useComponents = () => {
  const context = useContext(ComponentContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentProvider');
  }
  return context;
}; 