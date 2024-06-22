import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export const useZodForm = <T extends z.ZodType>(
  schema: T,
  defaultValues?: z.infer<T>
) => {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  return form;
};

export type UseZodFormReturn<T extends z.ZodType> = ReturnType<
  typeof useZodForm<T>
>;
