import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { getSigninSchema, SigninSchemaType } from '../forms/signin-schema';
import { LoaderCircleIcon } from 'lucide-react';
import { useGlobalDialog } from '@/providers/global-dialog';
import { SchemaForm } from '@/uiEngine/schema-form';
import { schemaForgotPassword } from '@/uis-schema/auth/forgot-password';

export function SignInPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { showDialog, closeDialog } = useGlobalDialog();

  // Check for success message from password reset or error messages
  useEffect(() => {
    const pwdReset = searchParams.get('pwd_reset');
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (pwdReset === 'success') {
      setSuccessMessage(
        'Your password has been successfully reset. You can now sign in with your new password.',
      );
    }

    if (errorParam) {
      switch (errorParam) {
        case 'auth_callback_failed':
          setError(
            errorDescription || 'Authentication failed. Please try again.',
          );
          break;
        case 'auth_callback_error':
          setError(
            errorDescription ||
            'An error occurred during authentication. Please try again.',
          );
          break;
        case 'auth_token_error':
          setError(
            errorDescription ||
            'Failed to set authentication session. Please try again.',
          );
          break;
        default:
          setError(
            errorDescription || 'Authentication error. Please try again.',
          );
          break;
      }
    }
  }, [searchParams]);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      email: 'demo@kt.com',
      password: 'demo123',
      rememberMe: true,
    },
  });

  async function onSubmit(values: SigninSchemaType) {

    try {
      setIsProcessing(true);
      setError(null);

      console.log('Attempting to sign in with email:', values.email);

      // Simple validation
      if (!values.email.trim() || !values.password) {
        setError('Email and password are required');
        return;
      }

      // Sign in using the auth context
      await login(values.email, values.password);

      // Get the 'next' parameter from URL if it exists
      const nextPath = searchParams.get('next') || '/';

      // Use navigate for navigation
      navigate(nextPath);
    } catch (err) {
      console.error('Unexpected sign-in error:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

  // Handle Action
  const onAction = useCallback((action: string, values: any) => {
    switch (action) {
      case 'submit':
        console.log("values submit>>", values);
        closeDialog();
        break;
      case 'closeDialog':
        closeDialog();
        break;
      default:
        break;
    }
  }, [closeDialog]);

  const onClickFogotPassWord = useCallback((numberDialog: number = 1) => {
    showDialog({
      title: { title: `Quên mật khẩu ${numberDialog}`, subTitle: 'Bạn cần nhập đúng địa chỉ email khi đăng ký tài khoản!' },
      content: <SchemaForm
        schema={schemaForgotPassword}
        onAction={onAction}
      />
    })
  }, [onAction, showDialog]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-5"
        >
          <div className="text-center space-y-1 pb-3">
            <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back! Log in with your credentials.
            </p>
          </div>

          <Alert appearance="light" size="sm" close={false}>
            <AlertIcon>
              <AlertCircle className="text-primary" />
            </AlertIcon>
            <AlertTitle className="text-accent-foreground">
              Use <strong>demo@kt.com</strong> username and {` `}
              <strong>demo123</strong> password for demo access.
            </AlertTitle>
          </Alert>

          {/* <div className="relative py-1.5">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">or</span>
            </div>
          </div> */}

          {error && (
            <Alert
              variant="destructive"
              appearance="light"
              onClose={() => setError(null)}
            >
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          {successMessage && (
            <Alert appearance="light" onClose={() => setSuccessMessage(null)}>
              <AlertIcon>
                <Check />
              </AlertIcon>
              <AlertTitle>{successMessage}</AlertTitle>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex justify-between items-center gap-2.5">
                  <FormLabel>Password</FormLabel>
                </div>
                <div className="relative">
                  <Input
                    placeholder="Your password"
                    type={passwordVisible ? 'text' : 'password'} // Toggle input type
                    {...field}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    mode="icon"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  >
                    {passwordVisible ? (
                      <EyeOff className="text-muted-foreground" />
                    ) : (
                      <Eye className="text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-col space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal cursor-pointer">
                      Remember me
                    </FormLabel>
                  </div>
                  <Button type="button" variant="destructive" appearance="ghost" onClick={() => onClickFogotPassWord()}>
                    Forgot Password?
                  </Button>
                </div>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <LoaderCircleIcon className="h-4 w-4 animate-spin" /> Loading...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <a
              href="https://dangky.vacom.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              Sign Up
            </a>
          </div>
        </form>
      </Form>
    </>
  );
}
