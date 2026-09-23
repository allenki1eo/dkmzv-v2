export type OtpMessage = {
  phone: string;
  code: string;
  locale: 'sw' | 'en';
};

export interface OtpProvider {
  send(message: OtpMessage): Promise<void>;
}

export class DevOtpProvider implements OtpProvider {
  constructor(private readonly fixedCode = process.env.OTP_DEV_CODE ?? '255255') {}

  code(): string {
    return this.fixedCode;
  }

  async send(message: OtpMessage): Promise<void> {
    console.info(`[ebenezer-otp] ${message.phone} ← ${this.fixedCode} (${message.locale})`);
  }
}

export class AfricasTalkingProvider implements OtpProvider {
  constructor(
    private readonly username: string,
    private readonly apiKey: string,
    private readonly from: string,
  ) {}

  async send(message: OtpMessage): Promise<void> {
    const body =
      message.locale === 'en'
        ? `Ebenezer sign-in code: ${message.code}. It expires in five minutes.`
        : `Namba ya siri ya Ebenezer: ${message.code}. Inaisha muda baada ya dakika tano.`;

    const response = await fetch('https://api.africastalking.com/version1/messaging', {
      method: 'POST',
      headers: {
        apiKey: this.apiKey,
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: this.username,
        to: message.phone,
        from: this.from,
        message: body,
      }),
    });

    if (!response.ok) {
      throw new Error(`Africa's Talking rejected the SMS (${response.status})`);
    }
  }
}

export function createOtpProvider(): OtpProvider {
  const username = process.env.AT_USERNAME;
  const apiKey = process.env.AT_API_KEY;
  if (username && apiKey) {
    return new AfricasTalkingProvider(
      username,
      apiKey,
      process.env.AT_SENDER_ID ?? 'EBENEZER',
    );
  }
  return new DevOtpProvider();
}

export function generateOtp(): string {
  const provider = createOtpProvider();
  if (provider instanceof DevOtpProvider) return provider.code();
  return String(Math.floor(100000 + Math.random() * 900000));
}
