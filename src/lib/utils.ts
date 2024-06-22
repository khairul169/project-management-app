import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ulid } from "ulidx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);
export { dayjs };

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId() {
  return ulid().toLowerCase();
}

export function curTimestamp() {
  return new Date().toISOString();
}

export function debounce<T extends Function>(cb: T, wait = 20) {
  let h: NodeJS.Timeout;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}
