import { createTranslator } from '@ebenezer/shared';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { StoneMark } from '../src/components/StoneMark';
import { useSession } from '../src/session';
import { useAppTheme } from '../src/theme/ThemeProvider';

export default function Ingia() {
  const t = createTranslator('sw');
  const { theme } = useAppTheme();
  const { enterDemo } = useSession();
  const [phone, setPhone] = useState('0712 000 100');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'name'>('phone');

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg, padding: 24 }}>
      <StoneMark />
      <Text style={{ marginTop: 20, fontFamily: 'Literata_600SemiBold', fontSize: 32, color: theme.colors.ink }}>
        {t('auth.title')}
      </Text>
      <Text style={{ marginTop: 8, fontSize: 17, lineHeight: 26, color: theme.colors.inkMuted }}>{t('auth.subtitle')}</Text>

      {step === 'phone' ? (
        <Field label={t('auth.phoneLabel')} value={phone} onChangeText={setPhone} theme={theme} />
      ) : null}
      {step === 'code' ? (
        <>
          <Text style={{ marginTop: 16, color: theme.colors.inkMuted }}>{t('auth.devCodeHint', { code: '255255' })}</Text>
          <Field label={t('auth.codeLabel')} value={code} onChangeText={setCode} theme={theme} />
        </>
      ) : null}
      {step === 'name' ? <Field label={t('auth.nameLabel')} value={name} onChangeText={setName} theme={theme} /> : null}

      <Pressable
        onPress={() => {
          if (step === 'phone') setStep('code');
          else if (step === 'code') setStep('name');
          else void enterDemo();
        }}
        style={{
          marginTop: 20,
          minHeight: 48,
          borderRadius: theme.radius.control,
          backgroundColor: theme.colors.gold,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ color: theme.colors.surface, fontSize: 17 }}>
          {step === 'phone' ? t('auth.sendCode') : step === 'code' ? t('auth.verify') : t('auth.finish')}
        </Text>
      </Pressable>

      <Pressable onPress={() => void enterDemo()} style={{ minHeight: 48, justifyContent: 'center', marginTop: 8 }}>
        <Text style={{ color: theme.colors.ink, fontSize: 17 }}>{t('auth.demoEnter')}</Text>
      </Pressable>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  theme,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  theme: ReturnType<typeof useAppTheme>['theme'];
}) {
  return (
    <View style={{ marginTop: 20 }}>
      <Text style={{ color: theme.colors.inkMuted, marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={{
          minHeight: 48,
          borderWidth: 1,
          borderColor: theme.colors.line,
          borderRadius: theme.radius.control,
          backgroundColor: theme.colors.surface,
          paddingHorizontal: 12,
          fontSize: 17,
          color: theme.colors.ink,
        }}
      />
    </View>
  );
}
