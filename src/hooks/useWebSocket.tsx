import { useEffect, useCallback, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  INotification,
  NotificationEvent,
  NotificationTopic,
} from '@/types/notification.interface';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useAppDispatch, useAppStore } from '@/lib/hooks';
import { updateNotifications } from '@/lib/features/notifications/notificationsSlice';
import { toast } from '@/hooks/use-toast';
import { updateExtra } from '@/lib/features/auth/authSlice';
import { AcceptDeclineStatus, Role } from '@/types/shared.enum';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

interface IWebSocketHook {
  isConnected: boolean;
  emit: (eventName: NotificationEvent, data: unknown) => void;
  on: (eventName: NotificationEvent, callback: (...args: unknown[]) => void) => void;
  playNotificationSound: () => void;
  updateNotificationsHandler: (data: INotification) => void;
}

const useWebSocket = (): IWebSocketHook => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const dispatch = useAppDispatch();
  const store = useAppStore();

  const notificationHandler = (topic: NotificationTopic): void => {
    if (topic === NotificationTopic.DoctorApproved) {
      dispatch(
        updateExtra({
          status: AcceptDeclineStatus.Accepted,
        }),
      );
    }
  };

  const updateNotificationsHandler = (data: INotification): void => {
    dispatch(updateNotifications(data));
    playNotificationSound();
  };

  const playNotificationSound = (): void => {
    const audio = new Audio('/audio/fornix-link-notification-sound.wav');
    audio.load();
    void audio.play().catch(() => console.error('Failed to play notification sound'));
  };

  const emit = useCallback((eventName: NotificationEvent, data: unknown) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, data);
    }
  }, []);

  const on = useCallback((eventName: NotificationEvent, callback: (...args: unknown[]) => void) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback);
    }
  }, []);

  const connect = useCallback(() => {
    try {
      const websocket = io(WS_URL, {
        withCredentials: true,
        reconnection: true,
        reconnectionDelay: 1000,
        retries: 5,
        transports: ['websocket'],
      });

      websocket.on('connect', (): void => {
        setIsConnected(true);
        console.log('WebSocket Connected');
      });

      websocket.on('disconnect', () => {
        setIsConnected(false);
        console.log('WebSocket Disconnected');
      });

      websocket.on(NotificationEvent.NewNotification, (data: INotification) => {
        const payload = data?.payload;
        if (!payload) {
          return;
        }
        const { message, topic } = payload;
        if (!topic && !message) {
          return;
        }

        // Hospital appointment requests are also emitted on the hospital room for delivery
        // reliability; only the hospital account should toast/store them from that fan-out.
        const role = store.getState().authentication.user?.role;
        if (
          topic === NotificationTopic.AppointmentRequest &&
          role !== Role.Hospital &&
          role !== Role.SuperAdmin
        ) {
          return;
        }

        updateNotificationsHandler(data);
        notificationHandler(topic as NotificationTopic);
        toast({
          title: topic || 'Notification',
          description: message || '',
          variant: 'default',
        });
      });

      websocket.on('error', (error) => {
        console.error('WebSocket Error:', error);
      });

      socketRef.current = websocket;
    } catch (error) {
      console.error('WebSocket connection error:', error);
    }
  }, [store]);

  useEffect(() => {
    connect();

    return (): void => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return { isConnected, emit, on, playNotificationSound, updateNotificationsHandler };
};

export default useWebSocket;
