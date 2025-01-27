import { Button, buttonVariants } from "@/components/ui/button";
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
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import authService from "@/services/authService";
import { CanceledError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CheckIcon from "@/components/ui/icons/CheckIcon";

const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Use a strong password (minimum 8 letters/symbols)" }),
});

function ResetPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ newPassword: string }>({
    defaultValues: { newPassword: "" },
    resolver: zodResolver(resetPasswordSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>("");
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const token = useRef<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    token.current = queryParams.get("token");

    if (!token.current) {
      navigate(ROUTES.notFound);
    }
  }, [navigate]);

  function onSubmit(formData: { newPassword: string }) {
    setIsSubmitting(true);
    setServerError(null);

    const { request } = authService.resetPassword(
      formData.newPassword,
      token.current as string,
    );
    request
      .then(() => {
        setIsPasswordUpdated(true);
      })
      .catch((err) => {
        if (err instanceof CanceledError) return;
        setServerError(err.response.data.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <AuthLayout role="forgot-password">
      {isPasswordUpdated ? (
        <Card className="mx-auto w-full border-none md:w-[450px]">
          <CardHeader className="text-center">
            <CardTitle className="flex flex-col items-center gap-2 text-2xl font-semibold tracking-tight">
              <CheckIcon className="size-16" color="#16a34a" />
              Password Updated successfully!
            </CardTitle>
            <CardDescription className="text-left">
              Your password has been updated. You can now log in with your new
              password. Welcome back!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              to={ROUTES.login}
              className={
                buttonVariants({ variant: "outline", size: "default" }) +
                " flex w-full items-center gap-4 py-2 text-muted-foreground hover:text-foreground"
              }
            >
              Login
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card className="mx-auto w-full border-none md:w-[450px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Reset Password
            </CardTitle>
            <CardDescription>
              Create a new password for your account. Make sure it's strong and
              secure!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      {...register("newPassword")}
                      id="newPassword"
                      name="newPassword"
                      type={passwordVisible ? "text" : "password"}
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-2 top-0 h-10 text-xl"
                    >
                      {passwordVisible ? (
                        <EyeOff className="size-4" />
                      ) : (
                        <Eye className="size-4" />
                      )}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.newPassword.message}
                    </p>
                  )}
                  {serverError && (
                    <p className="text-sm font-medium text-destructive">
                      {serverError}
                    </p>
                  )}
                </div>

                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                      wait
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Having trouble?{" "}
                <Link
                  to={ROUTES.contact}
                  className="underline hover:text-primary"
                >
                  Contact support
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </AuthLayout>
  );
}

export default ResetPassword;
