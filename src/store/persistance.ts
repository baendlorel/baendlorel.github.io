import { Consts } from '@/common/consts';
import { compress, decompress } from 'lz-string';

function genExpireTime() {
  const d = new Date();
  d.setDate(d.getDate() + Consts.ExpireDays);
  d.setHours(Consts.ExpireHour);
  return d.getTime();
}

/**
 * [WARN] Must use object can be stringified
 */
export function save(key: string, obj: any) {
  if (typeof obj !== 'object' || obj === null) {
    throw new TypeError(`Cannot save non-object value for key "${key}"`);
  }

  const k = Consts.PersistancePrefix + key;
  const ke = Consts.PersistanceExpirePrefix + key;
  const s = compress(JSON.stringify(obj));
  const e = genExpireTime();
  localStorage.setItem(k, s);
  localStorage.setItem(ke, e.toString());
}

/**
 * Load a value from localStorage with a key.
 * - when the key does not exist or the value is expired, returns null.
 */
export function load<T extends unknown>(key: string): T | null {
  const k = Consts.PersistancePrefix + key;
  const ke = Consts.PersistanceExpirePrefix + key;

  const value = localStorage.getItem(k);
  if (value === null) {
    return null;
  }

  const e = parseInt(localStorage.getItem(ke), 10);
  if (e < Date.now()) {
    localStorage.removeItem(k);
    return null;
  }

  try {
    return JSON.parse(decompress(value));
  } catch (e) {
    console.error(`Error loading key "${key}":`, e);
    return null;
  }
}
