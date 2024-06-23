import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, useId } from "react";
import {
  FieldValues,
  Path,
  UseFormReturn,
  Controller,
  UseFormStateReturn,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";

type FormControlProps<T extends FieldValues> = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "form"
> & {
  form?: UseFormReturn<T>;
  name?: Path<T>;
  label?: string;
  horizontal?: boolean;
  render: (
    field: ControllerRenderProps<T, Path<T>>,
    {
      fieldState,
      formState,
    }: {
      fieldState: ControllerFieldState;
      formState: UseFormStateReturn<T>;
    }
  ) => React.ReactElement;
};

const FormControl = <T extends FieldValues>({
  form,
  name,
  className,
  horizontal = false,
  label,
  render,
  ...props
}: FormControlProps<T>) => {
  const id = useId();

  return (
    <div
      className={cn(
        !horizontal ? "space-y-2" : "flex items-start gap-x-4",
        className
      )}
      {...props}
    >
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "text-sm font-medium text-gray-900 break-words shrink-0 mt-2",
            horizontal && "w-1/3"
          )}
        >
          {label}
        </label>
      )}

      {form && name ? (
        <Controller
          name={name}
          control={form.control}
          render={(r) => (
            <div className={horizontal ? "flex-1" : ""}>
              {render(r.field, {
                fieldState: r.fieldState,
                formState: r.formState,
              })}

              {r.fieldState.error && (
                <p className="text-xs text-red-600 mt-1">
                  {r.fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      ) : (
        render({} as never, {} as never)
      )}
    </div>
  );
};

export default FormControl;
