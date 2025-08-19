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
export function save(key: string, value: any) {
  const k = Consts.PersistancePrefix + key;
  const s = compress(JSON.stringify(value));
  const expire = genExpireTime();
  localStorage.setItem(k, `{"value":"${s}","expire":${expire}}`);
}

/**
 * Load a value from localStorage with a key.
 * - when the key does not exist or the value is expired, returns null.
 */
export function load<T extends unknown>(key: string): T | null {
  const k = Consts.PersistancePrefix + key;
  const item = localStorage.getItem(k);
  if (!item) {
    return null;
  }

  try {
    const parsed = JSON.parse(item);
    if (parsed.expire < Date.now()) {
      localStorage.removeItem(k);
      return null;
    }
    return JSON.parse(decompress(parsed.value));
  } catch (e) {
    console.error(`Error loading key "${key}":`, e);
    return null;
  }
}
