import { getStorage, setStorage } from "@/lib/utils";
import { useState } from "react";

export function useLocalStorage(key: string, initialValue?: string) {
  const [value, setter] = useState(getStorage(key, initialValue));
  const setValue = (value: string) => {
    setter(value);
    setStorage(key, value);
  };
  return [value, setValue] as const;
}
