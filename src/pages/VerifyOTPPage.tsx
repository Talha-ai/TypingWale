import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2, AlertCircle, Mail, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useVerifyOTP, useResendOTP } from '@/hooks/useAuth';

export function VerifyOTPPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const email = location.state?.email as string;

  const verifyMutation = useVerifyOTP();
  const resendMutation = useResendOTP();

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      navigate('/signup');
    }
  }, [email, navigate]);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 7) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (index === 7 && value) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 8) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 8);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split('').forEach((char, index) => {
      if (index < 8) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or first empty
    const nextIndex = Math.min(pastedData.length, 7);
    inputRefs.current[nextIndex]?.focus();

    // Auto-submit if complete
    if (pastedData.length === 8) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = (otpCode?: string) => {
    const code = otpCode || otp.join('');
    if (code.length !== 8) return;

    verifyMutation.mutate({ email, otp: code });
  };

  const handleResend = () => {
    resendMutation.mutate({ email }, {
      onSuccess: (data) => {
        console.log('Resend successful:', data);
        setCountdown(60);
        setOtp(['', '', '', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      },
      onError: (error) => {
        console.error('Resend failed:', error);
      },
    });
  };

  return (
    <div className="h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex items-center gap-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/signup')}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent an 8-digit code to <strong>{email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* OTP Input */}
            <div className="space-y-2">
              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-12 h-14 text-center text-xl font-bold"
                    disabled={verifyMutation.isPending}
                  />
                ))}
              </div>
            </div>

            {/* Error message */}
            {verifyMutation.isError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg flex items-center gap-2 text-sm text-red-800 dark:text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  {verifyMutation.error instanceof Error
                    ? verifyMutation.error.message === 'Invalid token'
                      ? 'Invalid code. Please check and try again.'
                      : verifyMutation.error.message
                    : 'Verification failed. Please try again.'}
                </span>
              </div>
            )}

            {/* Success message for resend */}
            {resendMutation.isSuccess && (
              <div className="p-3 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 rounded-lg flex items-center gap-2 text-sm text-green-800 dark:text-green-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>
                  Code sent! Check your inbox (and spam folder).
                  {' '}Note: Free tier emails may take 2-5 minutes to arrive.
                </span>
              </div>
            )}

            {/* Error message for resend */}
            {resendMutation.isError && (
              <div className="p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 rounded-lg flex items-start gap-2 text-sm text-red-800 dark:text-red-200">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Failed to send code</p>
                  <p className="text-xs mt-1">
                    {resendMutation.error instanceof Error
                      ? resendMutation.error.message
                      : 'Unable to send verification code. You may have hit the rate limit (2 emails/hour on free tier).'}
                  </p>
                </div>
              </div>
            )}

            {/* Verify Button */}
            <Button
              onClick={() => handleVerify()}
              className="w-full h-11"
              disabled={otp.join('').length !== 8 || verifyMutation.isPending}
            >
              {verifyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>

            {/* Resend Code */}
            <div className="text-center">
              {countdown > 0 ? (
                <p className="text-sm text-muted-foreground">
                  Resend code in {countdown}s
                </p>
              ) : (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={resendMutation.isPending}
                  className="text-sm"
                >
                  {resendMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RotateCw className="mr-2 h-3 w-3" />
                      Resend Code
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Help text */}
            <p className="text-xs text-muted-foreground text-center">
              Didn't receive the code? Check your spam folder or try resending.
              <br />
              Enter all 8 digits from your email.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
