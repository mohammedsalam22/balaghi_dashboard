import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../../shared/store/store';
import { notificationService } from '../services/notificationService';

export const useNotifications = () => {
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      notificationService.connect(accessToken, dispatch);
    } else {
      notificationService.disconnect();
    }

    return () => {
      notificationService.disconnect();
    };
  }, [isAuthenticated, accessToken, dispatch]);
};