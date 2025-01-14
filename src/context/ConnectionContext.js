import React, { createContext, useState, useContext, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { showToast } from '../components/Toast';

const ConnectionContext = createContext();

export const ConnectionProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [pendingSync, setPendingSync] = useState([]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const newConnectionState = state.isConnected;
      
      if (isConnected !== newConnectionState) {
        setIsConnected(newConnectionState);
        if (newConnectionState) {
          showToast('success', 'Online', 'Conexão restaurada');
          syncPendingChanges();
        } else {
          showToast('info', 'Offline', 'Modo offline ativado');
        }
      }
    });

    return () => unsubscribe();
  }, [isConnected]);

  const addPendingSync = (action) => {
    setPendingSync(prev => [...prev, action]);
  };

  const syncPendingChanges = async () => {
    if (pendingSync.length > 0) {
      try {
        // Aqui você implementaria a sincronização com o servidor
        // Por enquanto, vamos apenas limpar as ações pendentes
        setPendingSync([]);
        showToast('success', 'Sincronizado', 'Dados sincronizados com sucesso');
      } catch (error) {
        showToast('error', 'Erro', 'Erro ao sincronizar dados');
      }
    }
  };

  return (
    <ConnectionContext.Provider 
      value={{ 
        isConnected, 
        addPendingSync,
        pendingSync 
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => useContext(ConnectionContext); 