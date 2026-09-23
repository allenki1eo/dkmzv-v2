import { bundledParish, createTranslator, formatTzs } from '@ebenezer/shared';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSession } from '../../src/session';
import { useAppTheme } from '../../src/theme/ThemeProvider';

type Step = 'category' | 'amount' | 'network' | 'confirm' | 'wait' | 'done';
type Gift = { id: string; category: string; amount: number; network: string; receipt: string };

const HISTORY_KEY = 'ebenezer-giving';
const quick = [5000, 10000, 20000, 50000];
const networks = [
  { key: 'mpesa', label: 'M-Pesa' },
  { key: 'mixx', label: 'Mixx by Yas' },
  { key: 'airtel', label: 'Airtel Money' },
] as const;

export default function Sadaka() {
  const { theme } = useAppTheme();
  const { user } = useSession();
  const t = createTranslator(user?.locale ?? 'sw');
  const en = user?.locale === 'en';
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState(bundledParish.categories[0]?.key ?? 'sadaka');
  const [amount, setAmount] = useState('10000');
  const [network, setNetwork] = useState<(typeof networks)[number]['key']>('mpesa');
  const [anonymous, setAnonymous] = useState(false);
  const [failed, setFailed] = useState(false);
  const [history, setHistory] = useState<Gift[]>([]);
  const [receipt, setReceipt] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY).then((raw) => {
      if (!raw) return;
      setHistory(JSON.parse(raw) as Gift[]);
    });
  }, []);

  const amountNumber = Number(amount.replace(/\D/g, '')) || 0;
  const categoryName =
    bundledParish.categories.find((item) => item.key === category)?.[en ? 'nameEn' : 'nameSw'] ?? category;

  function confirm() {
    if (amountNumber < 500) {
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
        const next = [
          { id: number, category: categoryName, amount: amountNumber, network, receipt: number },
          ...current,
        ];
        void AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));
        return next;
      });
      setStep('done');
    }, 900);
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink }}>{t('giving.title')}</Text>

        {step === 'category' ? (
          <View style={{ marginTop: 16 }}>
            {bundledParish.categories.map((item) => (
              <Pressable
                key={item.key}
                onPress={() => {
                  setCategory(item.key);
                  setStep('amount');
                }}
                style={{ minHeight: 52, justifyContent: 'center', borderTopWidth: 1, borderTopColor: theme.colors.line }}
              >
                <Text style={{ fontSize: 17, color: theme.colors.ink }}>{en ? item.nameEn : item.nameSw}</Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {step === 'amount' ? (
          <View style={{ marginTop: 16 }}>
            <Text style={{ color: theme.colors.inkMuted }}>{categoryName}</Text>
            <Text style={{ marginTop: 12, fontFamily: 'Literata_600SemiBold', fontSize: 36, color: theme.colors.ink }}>
              {formatTzs(amountNumber, en ? 'en' : 'sw')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
              {quick.map((value) => (
                <Pressable
                  key={value}
                  onPress={() => setAmount(String(value))}
                  style={{
                    minHeight: 48,
                    paddingHorizontal: 12,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: theme.colors.line,
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: theme.colors.ink }}>{formatTzs(value, 'en')}</Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              keyboardType="number-pad"
              style={{
                marginTop: 16,
                minHeight: 48,
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
              <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{t('giving.network')}</Text>
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
                <Text style={{ fontSize: 17, color: network === item.key ? theme.colors.gold : theme.colors.ink }}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setAnonymous((value) => !value)} style={{ minHeight: 48, justifyContent: 'center' }}>
              <Text style={{ color: theme.colors.ink }}>{anonymous ? '● ' : '○ '}{t('giving.anonymous')}</Text>
            </Pressable>
            <Pressable onPress={() => setStep('confirm')} style={goldButton(theme.colors.gold, theme.radius.control)}>
              <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{t('giving.confirm')}</Text>
            </Pressable>
          </View>
        ) : null}

        {step === 'confirm' ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontSize: 17, color: theme.colors.ink }}>{categoryName}</Text>
            <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink, marginTop: 8 }}>
              {formatTzs(amountNumber, en ? 'en' : 'sw')}
            </Text>
            <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>{networks.find((item) => item.key === network)?.label}</Text>
            <Pressable onPress={confirm} style={goldButton(theme.colors.gold, theme.radius.control)}>
              <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{t('giving.give')}</Text>
            </Pressable>
          </View>
        ) : null}

        {step === 'wait' ? (
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 17, lineHeight: 26, color: failed ? theme.colors.danger : theme.colors.ink }}>
              {failed ? t('giving.failed') : t('giving.waiting')}
            </Text>
            {failed ? (
              <Pressable onPress={() => setStep('amount')} style={goldButton(theme.colors.gold, theme.radius.control)}>
                <Text style={{ color: theme.colors.surface, fontSize: 17 }}>{t('states.retry')}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {step === 'done' ? (
          <View style={{ marginTop: 20 }}>
            <Text style={{ fontFamily: 'Literata_600SemiBold', fontSize: 28, color: theme.colors.ink }}>{t('giving.done')}</Text>
            <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>{t('giving.receiptNo')}</Text>
            <Text style={{ fontSize: 20, color: theme.colors.ink }}>{receipt}</Text>
            <Text style={{ marginTop: 8, fontSize: 20, color: theme.colors.ink }}>{formatTzs(amountNumber, en ? 'en' : 'sw')}</Text>
            <Pressable onPress={() => setStep('category')} style={goldButton(theme.colors.gold, theme.radius.control)}>
              <Text style={{ color: theme.colors.surface }}>{t('giving.back')}</Text>
            </Pressable>
          </View>
        ) : null}

        <Text style={{ marginTop: 32, fontFamily: 'Literata_600SemiBold', fontSize: 22, color: theme.colors.ink }}>
          {t('giving.history')}
        </Text>
        {history.length === 0 ? (
          <Text style={{ marginTop: 8, color: theme.colors.inkMuted }}>{t('states.empty')}</Text>
        ) : (
          history.map((gift) => (
            <View key={gift.id} style={{ borderTopWidth: 1, borderTopColor: theme.colors.line, paddingVertical: 12 }}>
              <Text style={{ color: theme.colors.ink }}>{gift.category}</Text>
              <Text style={{ color: theme.colors.inkMuted }}>{formatTzs(gift.amount, 'en')}</Text>
              <Text style={{ color: theme.colors.inkMuted }}>{gift.receipt}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function goldButton(backgroundColor: string, radius: number) {
  return {
    marginTop: 16,
    minHeight: 48,
    borderRadius: radius,
    backgroundColor,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  };
}
