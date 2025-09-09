import { useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';

export const useWebSocket = (url, options = {}) => {
  const ws = useRef(null);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { 
    onMessage, 
    onOpen, 
    onClose, 
    onError,
    reconnectInterval = 3000,
    maxReconnectAttempts = 5
  } = options;
  
  const reconnectAttempts = useRef(0);
  const shouldReconnect = useRef(true);

  const connect = useCallback(() => {
    if (!isAuthenticated || !url) return;

    try {
      const token = localStorage.getItem('authToken');
      const wsUrl = `${url}?token=${token}`;
      
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = (event) => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;
        if (onOpen) onOpen(event);
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (onMessage) onMessage(data);
        } catch (error) {
          console.error('WebSocket message parse error:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected');
        if (onClose) onClose(event);
        
        // Attempt to reconnect
        if (shouldReconnect.current && reconnectAttempts.current < maxReconnectAttempts) {
          setTimeout(() => {
            reconnectAttempts.current++;
            connect();
          }, reconnectInterval);
        }
      };

      ws.current.onerror = (event) => {
        console.error('WebSocket error:', event);
        if (onError) onError(event);
      };
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [url, isAuthenticated, onMessage, onOpen, onClose, onError, reconnectInterval, maxReconnectAttempts]);

  const sendMessage = useCallback((message) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;
    if (ws.current) {
      ws.current.close();
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
    isConnected: ws.current?.readyState === WebSocket.OPEN,
  };
};