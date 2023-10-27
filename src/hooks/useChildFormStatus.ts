/* eslint-disable react-hooks/rules-of-hooks */
import { useCallback, useEffect, useState } from 'react';
import { useFormStatus } from 'react-dom';

export const useChildFormStatus = () => {
  const [status, setStatus] = useState<ReturnType<typeof useFormStatus>>({
    action: null,
    data: null,
    method: null,
    pending: false,
  });

  const Listener = useCallback(() => {
    const currentStatus = useFormStatus();
    useEffect(() => {
      setStatus(currentStatus);
    }, [currentStatus]);
    return null;
  }, [setStatus]);

  return { ...status, Listener };
};
