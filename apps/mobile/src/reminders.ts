import { dailyGlory, type ParishJumuiya } from '@ebenezer/shared';
import { Platform } from 'react-native';

const channel = 'ebenezer';

export async function syncReminders(enabled: boolean, jumuiya: ParishJumuiya | null) {
  if (Platform.OS === 'web') return enabled;
  const Notifications = await import('expo-notifications');
  await Notifications.setNotificationChannelAsync(channel, {
    name: 'Ebenezer',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!enabled) return false;

  const permission = await Notifications.requestPermissionsAsync();
  if (permission.status !== 'granted') return false;

  const morning = dailyGlory[0];
  const evening = dailyGlory[1];
  await Notifications.scheduleNotificationAsync({
    content: {
      title: morning?.nameSw ?? 'Utukufu wa asubuhi',
      body: 'Weka sadaka yako ya asubuhi.',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, channelId: channel, hour: 6, minute: 0 },
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: evening?.nameSw ?? 'Utukufu wa jioni',
      body: 'Weka sadaka yako ya jioni.',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, channelId: channel, hour: 18, minute: 0 },
  });
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Bahasha ya Jumapili',
      body: 'Bahasha yako iko tayari: Amani, Jengo, Utumishi, na Imarisha usharika.',
    },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.WEEKLY, channelId: channel, weekday: 1, hour: 6, minute: 30 },
  });
  if (jumuiya?.weekday) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Jumuiya ya ${jumuiya.name}`,
        body: `${jumuiya.place}. ${jumuiya.day}.`,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        channelId: channel,
        weekday: jumuiya.weekday,
        hour: 15,
        minute: 0,
      },
    });
  }
  return true;
}
