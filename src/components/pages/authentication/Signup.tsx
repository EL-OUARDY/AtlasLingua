import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ROUTES } from "@/routes/routes";
import { APP_NAME } from "@/shared/constants";
import { NavLink, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import authService, { IRegisterData } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { CanceledError } from "axios";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Invalid name" })
    .max(60, { message: "Name is very long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Use a strong password (minimum 8 letters/symbols)" }),
});

function Signup() {
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IRegisterData>({
    resolver: zodResolver(registerSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // if user is logged in redirect to returnUrl or homepage
    if (user) navigate("/");
  }, [navigate, user]);

  function onSubmit(formData: IRegisterData) {
    setIsSubmitting(true);
    const { request } = authService.register(formData);
    request
      .then(() => {
        toast.success("Account created successfully", {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
        // redirect to login page
        navigate(ROUTES.login, { state: { registerEmail: formData.email } });
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        let msg = "Invalid data. Please try again.";
        if (err.response && err.response.data && err.response.data.email)
          msg = err.response.data.email[0];
        toast(msg, {
          action: {
            label: "Ok",
            onClick: () => {},
          },
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  function googleLogin() {
    const API_BASE_URL = import.meta.env.VITE_API_URL;
    window.location.href = API_BASE_URL + "/auth/login/google";
  }

  return (
    <AuthLayout role="signup">
      <Card className="mx-auto w-full border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Start using {APP_NAME} for yourself or your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  {...register("name")}
                  id="name"
                  name="name"
                  placeholder="your name"
                  autoComplete="on"
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  name="email"
                  type="email"
                  placeholder="user@atlaslingua.com"
                  autoComplete="on"
                />
                {errors.email && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                />
                {errors.password && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <Button disabled={isSubmitting} type="submit" className="w-full">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                    account ..
                  </>
                ) : (
                  "Create an account"
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" type="button" onClick={googleLogin}>
                <svg
                  className="mr-2 size-5"
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="100"
                  height="100"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#fbc02d"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                  <path
                    fill="#e53935"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  ></path>
                  <path
                    fill="#4caf50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                  ></path>
                  <path
                    fill="#1565c0"
                    d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                  ></path>
                </svg>
                Continue with Google
              </Button>
            </div>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <NavLink
                to={ROUTES.login}
                className="underline hover:text-primary"
              >
                Sign in
              </NavLink>
            </div>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  );
}

export default Signup;
