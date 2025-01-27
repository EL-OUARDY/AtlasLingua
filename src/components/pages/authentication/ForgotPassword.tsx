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
import { Link } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import authService from "@/services/authService";
import { CanceledError } from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { APP_NAME } from "@/shared/constants";
import CheckIcon from "@/components/ui/icons/CheckIcon";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string }>({
    defaultValues: { email: "" },
    resolver: zodResolver(forgotPasswordSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>("");
  const [isResetEmailSent, setIsResetEmailSent] = useState(false);

  function onSubmit(formData: { email: string }) {
    setIsSubmitting(true);
    setServerError(null);

    const { request } = authService.forgotPassword(formData);
    request
      .then(() => {
        setIsResetEmailSent(true);
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
      {isResetEmailSent ? (
        <Card className="mx-auto w-full border-none md:w-[450px]">
          <CardHeader className="text-center">
            <CardTitle className="flex flex-col items-center gap-2 text-2xl font-semibold tracking-tight">
              <CheckIcon className="size-16" color="#16a34a" />
              Password Reset Email Sent!
            </CardTitle>
            <CardDescription className="text-left">
              Check your inbox for a link to reset your password. If you don’t
              see it, be sure to check your spam or junk folder!
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card className="mx-auto w-full border-none md:w-[450px]">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Forgot Password
            </CardTitle>
            <CardDescription>
              Please enter the email address associated with your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    {...register("email")}
                    id="email"
                    name="email"
                    type="email"
                    placeholder={`user@${APP_NAME.toLowerCase()}.com`}
                    autoComplete="on"
                  />
                  {errors.email && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.email.message}
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

export default ForgotPassword;
