import Button, { IconButton } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useZodForm } from "@/hooks/useZodForm";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { fetchAPI } from "@/lib/api";
import { useLogin } from "@/hooks/useAuth";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const defaultValues: z.infer<typeof loginSchema> = {
  username: "",
  password: "",
};

type LoginResponse = {
  token: string;
};

const AuthLoginPage = () => {
  const form = useZodForm(loginSchema, defaultValues);
  const onLogin = useLogin();
  const navigate = useNavigate();

  const login = useMutation({
    mutationFn: (values: z.infer<typeof loginSchema>) => {
      return fetchAPI<LoginResponse>("/auth/login", {
        method: "POST",
        body: values,
      });
    },
    onSuccess(data) {
      onLogin(data.token);
    },
    onError(err) {
      console.log(err);
    },
  });

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <IconButton icon={<ArrowLeft />} onClick={() => navigate(-1)} />
        <CardTitle>Login</CardTitle>
        <CardDescription>Please login to continue</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(login.mutate as never)}>
          <div className="space-y-4">
            <Input placeholder="Username" {...form.register("username")} />
            <Input
              type="password"
              placeholder="Password"
              {...form.register("password")}
            />
            <Button type="submit" disabled={login.isPending}>
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AuthLoginPage;
