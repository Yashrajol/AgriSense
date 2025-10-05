import { useState, useCallback } from 'react';

export const useAsyncError = () => {
  const [, setError] = useState();
  
  return useCallback((error: Error) => {
    setError(() => {
      throw error;
    });
  }, []);
};
