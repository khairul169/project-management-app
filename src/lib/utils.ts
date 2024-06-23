import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ulid } from "ulidx";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { z } from "zod";

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

export function getStorage<
  T extends string,
  U extends T | undefined = undefined
>(key: string, defaultValue?: U) {
  return (localStorage.getItem(key) as T) || (defaultValue as U);
}

export function setStorage<T extends string>(key: string, value: T) {
  localStorage.setItem(key, value);
}

export function createDbSchema<T extends object>(shape: T) {
  return z.object({
    ...shape,
    _id: z.string(),
    _rev: z.string(),
  });
}

export type InferSchema<
  T extends z.ZodObject<U>,
  U extends z.ZodRawShape = z.ZodRawShape
> = z.infer<T>;

export type InferCreateSchema<
  T extends z.ZodObject<U>,
  U extends z.ZodRawShape = z.ZodRawShape
> = Omit<InferSchema<T>, "_rev">;
