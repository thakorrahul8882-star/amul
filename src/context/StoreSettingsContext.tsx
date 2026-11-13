import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '../types';
import { DEFAULT_STORE_SETTINGS } from '../data/defaultCatalog';
import { subscribeToStoreSettings, getStoredSettings } from '../services/storeService';

interface StoreSettingsContextType {
  settings: StoreSettings;
  loading: boolean;
}

const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: DEFAULT_STORE_SETTINGS,
  loading: true,
});

export const StoreSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<StoreSettings>(() => getStoredSettings());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToStoreSettings((data) => {
      setSettings(data);
      setLoading(false);
    });

    const handleLocalUpdate = () => {
      setSettings(getStoredSettings());
    };

    window.addEventListener('amul_settings_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('amul_settings_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
    };
  }, []);

  // Keep browser tab title synced with store name
  useEffect(() => {
    if (settings?.storeNameGu) {
      document.title = `${settings.storeNameGu} | ${settings.storeNameEn}`;
    }
  }, [settings?.storeNameGu, settings?.storeNameEn]);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </StoreSettingsContext.Provider>
  );
};

export const useStoreSettings = (): StoreSettings => {
  const context = useContext(StoreSettingsContext);
  return context.settings;
};
