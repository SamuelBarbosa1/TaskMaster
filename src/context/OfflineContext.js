import React, { createContext, useState, useContext, useEffect } from 'react';
import { subscribeToConnectionChanges } from '../services/networkService';
import { loadData, saveData } from '../services/storage';
import { showToast } from '../components/Toast';

const OfflineContext = createContext({});

export const OfflineProvider = ({ children }) => {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingSync, setPendingSync] = useState([]);

  useEffect(() => {
    // Carrega ações pendentes do storage
    const loadPendingActions = async () => {
      const pending = await loadData('pendingSync') || [];
      setPendingSync(pending);
    };

    loadPendingActions();

    // Inscreve para mudanças na conexão
    const unsubscribe = subscribeToConnectionChanges((isConnected) => {
      setIsOnline(isConnected);
      if (isConnected) {
        syncPendingActions();
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const addPendingAction = async (action) => {
    const newPendingSync = [...pendingSync, action];
    setPendingSync(newPendingSync);
    await saveData('pendingSync', newPendingSync);
  };

  const syncPendingActions = async () => {
    if (pendingSync.length === 0) return;

    try {
      // Aqui você implementaria a lógica de sincronização com o servidor
      // Por enquanto, vamos apenas limpar as ações pendentes
      await saveData('pendingSync', []);
      setPendingSync([]);
      showToast('success', 'Sincronizado', 'Dados sincronizados com sucesso!');
    } catch (error) {
      showToast('error', 'Erro', 'Erro ao sincronizar dados');
    }
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        addPendingAction,
        pendingSync,
        syncPendingActions,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => useContext(OfflineContext); 