type DevOtpRecord = {
  code: string;
  expiresAt: number;
};

type DevUserRecord = {
  id: string;
  phone: string;
  firstName: string;
  lastName?: string;
  birthDate?: string;
};

const globalForOtp = globalThis as typeof globalThis & {
  __mireaDevOtps?: Map<string, DevOtpRecord>;
  __mireaDevUsers?: Map<string, DevUserRecord>;
};

function getOtpStore() {
  if (!globalForOtp.__mireaDevOtps) {
    globalForOtp.__mireaDevOtps = new Map<string, DevOtpRecord>();
  }

  return globalForOtp.__mireaDevOtps;
}

function getUserStore() {
  if (!globalForOtp.__mireaDevUsers) {
    globalForOtp.__mireaDevUsers = new Map<string, DevUserRecord>();
  }

  return globalForOtp.__mireaDevUsers;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL ?? process.env.NEON_DATABASE_URL);
}

export function saveDevOtp(phone: string, code: string, expiresAt: Date) {
  getOtpStore().set(phone, {
    code,
    expiresAt: expiresAt.getTime(),
  });
}

export function consumeDevOtp(phone: string, code: string) {
  const store = getOtpStore();
  const record = store.get(phone);

  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    store.delete(phone);
    return false;
  }

  if (record.code !== code) return false;

  store.delete(phone);
  return true;
}

export function isTestOtpValid(code: string) {
  return Boolean(process.env.OTP_TEST_CODE) &&
    (process.env.NODE_ENV !== "production" || process.env.OTP_DEBUG === "true") &&
    code === process.env.OTP_TEST_CODE;
}

export function getDevUser(phone: string) {
  return getUserStore().get(phone);
}

export function saveDevUser(user: DevUserRecord) {
  getUserStore().set(user.phone, user);
}
