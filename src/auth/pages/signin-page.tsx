import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGlobalDialog } from '@/providers/global-dialog';
import { SchemaForm } from '@/uiEngine/schema-form';
import { loginSchema } from '@/uis-schema/auth/login';
import { delay } from '@/lib/helpers';
import { forgotPassword } from '@/uis-schema/auth/forgot-password';

export function SignInPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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


  async function onSubmit(values: Record<string, any>) {
    try {
      setIsProcessing(true);
      setError(null);

      await delay(3000);

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

  const [dataDialog, setDataDialog] = useState<Record<string, any>>({});

  // Handle Action
  const onAction = (action: string, values?: Record<string, any>) => {
    switch (action) {
      case 'submit':
        onSubmit(values || {});
        break;
      case 'closeAlert':
        setError(null);
        break;
      case 'forgotPassword':
        onClickFogotPassWord();
        break;
      case 'processing':
        return isProcessing;
      default:
        break;
    }
  };

  // Handle Action
  const onActionAlert = useCallback((action: string, values?: Record<string, any>) => {
    switch (action) {
      case 'submit':
        setDataDialog(prev => ({ ...prev, ...(values || {}) }))
        closeDialog();
        break;
      case 'closeDialog':
        closeDialog();
        break;
      default:
        break;
    }
  }, [closeDialog]);

  const contentView = useMemo(() => {
    return (
      <SchemaForm
        schema={forgotPassword}
        onAction={onActionAlert}
        values={dataDialog}
        valuesCheck={{ errAlert: error, isProcessing }}
      />
    );
  }, [dataDialog, error, isProcessing, onActionAlert]);

  const onClickFogotPassWord = useCallback(() => {
    showDialog({
      title: "Quên mật khẩu",
      // fullWidth: true,
      content: contentView
    })
  }, [contentView, showDialog]);

  return (
    <SchemaForm
      schema={loginSchema}
      onAction={onAction}
      valuesCheck={{ errAlert: error, isProcessing }}
      headerForm={
        <div className="text-center space-y-1 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Log in with your credentials.
          </p>
        </div>
      }
      footerForm={
        <>
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
        </>
      }
    />
  );
}
