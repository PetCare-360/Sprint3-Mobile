import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

// Precisa ser configurado uma única vez, fora de qualquer componente, para
// o sistema saber como exibir uma notificação enquanto o app está aberto.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const NOTIFICATION_CHANNEL_ID = 'pet-alerts';

export const notificationService = {
  /**
   * Garante permissão do usuário e, no Android, um canal de notificação
   * dedicado a alertas de saúde dos pets (obrigatório a partir do Android 8).
   * Retorna true se está tudo pronto para notificar.
   */
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

  /**
   * Dispara uma notificação local imediata (trigger: null) para um alerta de
   * saúde real vindo da API. `data` carrega o petId para permitir, no futuro,
   * levar o usuário direto ao pet em questão.
   */
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
};
