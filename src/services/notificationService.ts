import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NOTIFICATION_CHANNEL_ID = 'pet-alerts';

export const APPOINTMENT_REMINDER_LEAD_MINUTES = 30;

export const notificationService = {
  async ensureReady(): Promise<boolean> {
    let permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== 'granted') {
      permissions = await Notifications.requestPermissionsAsync();
    }
    if (permissions.status !== 'granted') {
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(NOTIFICATION_CHANNEL_ID, {
        name: 'Alertas de saúde dos pets',
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    return true;
  },

  async notifyPetAlert(params: { petId: number; petName: string; reason: string; critical: boolean }): Promise<void> {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: params.critical ? `🚨 ${params.petName} precisa de atenção` : `⚠️ ${params.petName}`,
        body: params.reason,
        data: { type: 'pet-alert', petId: params.petId },
        sound: true,
      },
      trigger: Platform.OS === 'android' ? { channelId: NOTIFICATION_CHANNEL_ID } : null,
    });
  },

  addResponseListener(callback: (data: Record<string, any>) => void) {
    return Notifications.addNotificationResponseReceivedListener(response => {
      callback(response.notification.request.content.data ?? {});
    });
  },

  async scheduleAppointmentReminder(params: {
    petName: string;
    reason: string;
    scheduledAt: Date;
  }): Promise<string | null> {
    const ready = await this.ensureReady();
    if (!ready) return null;

    const triggerDate = new Date(params.scheduledAt.getTime() - APPOINTMENT_REMINDER_LEAD_MINUTES * 60 * 1000);
    if (triggerDate.getTime() <= Date.now()) return null;

    return Notifications.scheduleNotificationAsync({
      content: {
        title: `📅 Consulta em ${APPOINTMENT_REMINDER_LEAD_MINUTES} min`,
        body: `${params.petName} — ${params.reason}`,
        data: { type: 'appointment-reminder' },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
        channelId: NOTIFICATION_CHANNEL_ID,
      },
    });
  },

  async cancelAppointmentReminder(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch {
    }
  },
};
