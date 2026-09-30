import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@PetCare360:appointmentReminders';

async function readMap(): Promise<Record<string, string>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function writeMap(map: Record<string, string>): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
  }
}

export const appointmentReminderStorage = {
  async set(appointmentId: number, notificationId: string): Promise<void> {
    const map = await readMap();
    map[appointmentId] = notificationId;
    await writeMap(map);
  },

  async get(appointmentId: number): Promise<string | null> {
    const map = await readMap();
    return map[appointmentId] ?? null;
  },

  async remove(appointmentId: number): Promise<void> {
    const map = await readMap();
    delete map[appointmentId];
    await writeMap(map);
  },
};
