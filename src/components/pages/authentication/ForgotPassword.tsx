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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1024 1024"
                className="size-16"
                version="1.1"
              >
                <path
                  d="M905.92 237.76a32 32 0 0 0-52.48 36.48A416 416 0 1 1 96 512a418.56 418.56 0 0 1 297.28-398.72 32 32 0 1 0-18.24-61.44A480 480 0 1 0 992 512a477.12 477.12 0 0 0-86.08-274.24z"
                  fill="#16a34a"
                />
                <path
                  d="M630.72 113.28A413.76 413.76 0 0 1 768 185.28a32 32 0 0 0 39.68-50.24 476.8 476.8 0 0 0-160-83.2 32 32 0 0 0-18.24 61.44zM489.28 86.72a36.8 36.8 0 0 0 10.56 6.72 30.08 30.08 0 0 0 24.32 0 37.12 37.12 0 0 0 10.56-6.72A32 32 0 0 0 544 64a33.6 33.6 0 0 0-9.28-22.72A32 32 0 0 0 505.6 32a20.8 20.8 0 0 0-5.76 1.92 23.68 23.68 0 0 0-5.76 2.88l-4.8 3.84a32 32 0 0 0-6.72 10.56A32 32 0 0 0 480 64a32 32 0 0 0 2.56 12.16 37.12 37.12 0 0 0 6.72 10.56zM230.08 467.84a36.48 36.48 0 0 0 0 51.84L413.12 704a36.48 36.48 0 0 0 51.84 0l328.96-330.56A36.48 36.48 0 0 0 742.08 320l-303.36 303.36-156.8-155.52a36.8 36.8 0 0 0-51.84 0z"
                  fill="#16a34a"
                />
              </svg>
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
