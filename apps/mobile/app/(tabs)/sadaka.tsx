import { dailyGlory, formatTzs, sundayPockets } from '@ebenezer/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { MoonStars, SunHorizon } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';
import { goldButton, Mark, Screen } from '../../src/ui';

type Step = 'home' | 'amount' | 'network' | 'confirm' | 'wait' | 'done';
type Gift = { id: string; label: string; amount: number; network: string; receipt: string };
type Choice = { key: string; label: string };

const HISTORY_KEY = 'ebenezer-giving';
const quick = [1000, 2000, 5000, 10000, 20000];
const networks = [
  { key: 'mpesa', label: 'M-Pesa' },
  { key: 'mixx', label: 'Mixx by Yas' },
  { key: 'airtel', label: 'Airtel Money' },
] as const;

export default function Sadaka() {
  const { theme } = useAppTheme();
  const { user } = useSession();
  const en = user?.locale === 'en';
  const [step, setStep] = useState<Step>('home');
  const [choice, setChoice] = useState<Choice | null>(null);
  const [amount, setAmount] = useState('2000');
  const [network, setNetwork] = useState<(typeof networks)[number]['key']>('mpesa');
  const [failed, setFailed] = useState(false);
  const [history, setHistory] = useState<Gift[]>([]);
  const [receipt, setReceipt] = useState('');

  const amountNumber = Number(amount.replace(/\D/g, '')) || 0;
  const copy = en
    ? {
        title: 'Giving',
        daily: 'Daily offering',
        bahasha: 'Sunday envelope',
        memberNo: 'Member number',
        street: 'Street',
        inside: 'Inside the envelope',
        hint: 'Peace, Building, and Ministry are the small envelopes. Strengthen the parish is the parish fund.',
        network: 'Network',
        confirm: 'Confirm payment',
        give: 'Give',
        waiting: 'Waiting for M-Pesa',
        failed: 'The payment did not finish. Check your M-Pesa balance, then try again.',
        done: 'The gift was received. Thank you.',
        receipt: 'Receipt number',
        history: 'History',
        retry: 'Try again',
        back: 'Back',
        empty: 'Nothing here yet.',
      }
    : {
        title: 'Sadaka',
        daily: 'Sadaka ya kila siku',
        bahasha: 'Bahasha ya Jumapili',
        memberNo: 'Namba ya mwanachama',
        street: 'Mtaa',
        inside: 'Ndani ya bahasha',
        hint: 'Amani, Jengo na Utumishi ndizo bahasha ndogo. Imarisha usharika ni mfuko wa kuimarisha usharika.',
        network: 'Mtandao',
        confirm: 'Thibitisha malipo',
        give: 'Toa sadaka',
        waiting: 'Tunasubiri M-Pesa',
        failed: 'Malipo hayakukamilika. Angalia salio la M-Pesa kisha ujaribu tena.',
        done: 'Sadaka imepokelewa. Asante.',
        receipt: 'Namba ya risiti',
        history: 'Historia',
        retry: 'Jaribu tena',
        back: 'Rudi',
        empty: 'Hakuna kitu hapa bado.',
      };

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then((raw) => {
      if (raw) setHistory(JSON.parse(raw) as Gift[]);
    });
  }, []);

  function openChoice(next: Choice) {
    setChoice(next);
    setAmount('2000');
    setFailed(false);
    setStep('amount');
  }

  function confirm() {
    if (amountNumber < 500 || !choice) {
      setFailed(true);
      setStep('wait');
      return;
    }
    setFailed(false);
    setStep('wait');
    const number = `EB-2026-${String(history.length + 21).padStart(4, '0')}`;
    setTimeout(() => {
      setReceipt(number);
      setHistory((current) => {
        const next = [{ id: number, label: choice.label, amount: amountNumber, network, receipt: number }, ...current];
        void AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        return next;
      });
      setStep('done');
      if (Platform.OS !== 'web') void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 900);
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }}>
        <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink }}>{copy.title}</Text>
        <Text style={{ marginTop: 8, fontSize: 17, color: theme.colors.ink }}>{user?.name}</Text>
        <Text style={{ marginTop: 4, color: theme.colors.inkMuted }}>
          {copy.memberNo} {user?.memberNumber} · {user?.street}
        </Text>

        {step === 'home' ? (
          <>
            <Text style={{ marginTop: 28, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>
              {copy.daily}
            </Text>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              {dailyGlory.map((item) => {
                const Icon = item.key === 'asubuhi' ? SunHorizon : MoonStars;
                const label = en ? item.nameEn : item.nameSw;
                return (
                  <Pressable
                    key={item.key}
                    onPress={() => openChoice({ key: item.key, label })}
                    style={{
                      flex: 1,
                      minHeight: 112,
                      borderRadius: theme.radius.card,
                      backgroundColor: theme.colors.surface,
                      borderWidth: 1,
                      borderColor: theme.colors.line,
                      padding: 14,
                      justifyContent: 'space-between',
                    }}
                  >
                    <Mark icon={Icon} color={theme.colors.ink} size={26} />
                    <Text style={{ fontSize: 16, color: theme.colors.ink }}>{label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={{ marginTop: 32, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>
              {copy.bahasha}
            </Text>
            <View
              style={{
                marginTop: 12,
                borderRadius: theme.radius.sheet,
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.line,
                padding: 18,
              }}
            >
              <Text style={{ color: theme.colors.inkMuted, letterSpacing: 0.4 }}>{copy.bahasha}</Text>
              <Text style={{ marginTop: 6, fontFamily: 'Literata_600SemiBold', fontSize: 48, color: theme.colors.ink }}>
                {user?.memberNumber}
              </Text>
              <Text style={{ color: theme.colors.inkMuted }}>{user?.street}</Text>
              <Text style={{ marginTop: 18, color: theme.colors.ink }}>{copy.inside}</Text>
              <Text style={{ marginTop: 6, color: theme.colors.inkMuted, lineHeight: 22 }}>{copy.hint}</Text>
              {sundayPockets.map((pocket) => {
                const label = en ? pocket.nameEn : pocket.nameSw;
                return (
                  <Pressable
                    key={pocket.key}
                    onPress={() => openChoice({ key: pocket.key, label })}
                    style={{
                      marginTop: 10,
                      minHeight: 52,
                      borderRadius: theme.radius.control,
                      borderWidth: 1,
                      borderColor: theme.colors.line,
                      paddingHorizontal: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Text style={{ fontSize: 17, color: theme.colors.ink }}>{label}</Text>
                    <Text style={{ color: theme.colors.gold }}>{copy.give}</Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        ) : null}

        {step === 'amount' && choice ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ color: theme.colors.inkMuted }}>{choice.label}</Text>
            <Text style={{ marginTop: 8, fontFamily: 'Literata_600SemiBold', fontSize: 36, color: theme.colors.ink }}>
              {formatTzs(amountNumber, en ? 'en' : 'sw')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {quick.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setAmount(String(value))}
                  style={{
                    minHeight: 48,
                    paddingHorizontal: 14,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: theme.colors.line,
                    justifyContent: 'center',
                    backgroundColor: amount === String(value) ? theme.colors.ink : theme.colors.surface,
                  }}
                >
                  <Text style={{ color: amount === String(value) ? theme.colors.bg : theme.colors.ink }}>
                    {formatTzs(value, 'en')}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              style={{
                marginTop: 16,
                minHeight: 52,
                borderWidth: 1,
                borderColor: theme.colors.line,
                borderRadius: theme.radius.control,
                paddingHorizontal: 12,
                fontSize: 20,
                color: theme.colors.ink,
                backgroundColor: theme.colors.surface,
              }}
            />
            <Pressable onPress={() => setStep('network')} style={goldButton(theme.colors.gold, theme.radius.control)}>
              <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{copy.network}</Text>
            </Pressable>
          </View>
        ) : null}

        {step === 'network' ? (
          <View style={{ marginTop: 16 }}>
            {networks.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => setNetwork(item.key)}
                style={{ minHeight: 52, justifyContent: 'center', borderTopWidth: 1, borderTopColor: theme.colors.line }}
              >
                <Text style={{ fontSize: 17, color: network === item.key ? theme.colors.gold : theme.colors.ink }}>{item.label}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setStep('confirm')} style={goldButton(theme.colors.gold, theme.radius.control)}>
              <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{copy.confirm}</Text>
            </Pressable>
          </View>
        ) : null}

        {step === 'confirm' && choice ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, color: theme.colors.ink }}>{choice.label}</Text>
            <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink, marginTop: 8 }}>
              {formatTzs(amountNumber, en ? 'en' : 'sw')}
            </Text>
            <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>
              {copy.memberNo} {user?.memberNumber}
            </Text>
            <Text style={{ color: theme.colors.inkMuted }}>{networks.find((item) => item.key === network)?.label}</Text>
            <Pressable onPress={confirm} style={goldButton(theme.colors.gold, theme.radius.control)}>
              <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{copy.give}</Text>
            </Pressable>
          </View>
        ) : null}

        {step === 'wait' ? (
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 17, lineHeight: 26, color: failed ? theme.colors.danger : theme.colors.ink }}>
              {failed ? copy.failed : copy.waiting}
            </Text>
            {failed ? (
              <Pressable onPress={() => setStep('amount')} style={goldButton(theme.colors.gold, theme.radius.control)}>
                <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{copy.retry}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {step === 'done' ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 28, color: theme.colors.ink }}>{copy.done}</Text>
            <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>{choice?.label}</Text>
            <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>{copy.receipt}</Text>
            <Text style={{ fontSize: 20, color: theme.colors.ink }}>{receipt}</Text>
            <Text style={{ marginTop: 8, fontSize: 20, color: theme.colors.ink }}>{formatTzs(amountNumber, en ? 'en' : 'sw')}</Text>
            <Pressable onPress={() => setStep('home')} style={goldButton(theme.colors.gold, theme.radius.control)}>
              <Text style={{ color: theme.colors.surface }}>{copy.back}</Text>
            </Pressable>
          </View>
        ) : null}

        <Text style={{ marginTop: 32, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>{copy.history}</Text>
        {history.length === 0 ? (
          <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>{copy.empty}</Text>
        ) : (
          history.map((gift) => (
            <View key={gift.id} style={{ borderTopWidth: 1, borderTopColor: theme.colors.line, paddingVertical: 12 }}>
              <Text style={{ color: theme.colors.ink }}>{gift.label}</Text>
              <Text style={{ color: theme.colors.inkMuted }}>{formatTzs(gift.amount, 'en')}</Text>
              <Text style={{ color: theme.colors.inkMuted }}>{gift.receipt}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </Screen>
  );
}
