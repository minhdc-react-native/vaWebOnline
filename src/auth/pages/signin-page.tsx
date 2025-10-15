import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/auth/context/auth-context';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGlobalDialog } from '@/providers/global-dialog';
import { SchemaForm } from '@/uiEngine/schema-form';
import { loginSchema } from '@/uis-schema/auth/login';
import { delay } from '@/lib/helpers';
import { forgotPassword } from '@/uis-schema/auth/forgot-password';
import { useT } from '@/i18n/config';
import { toast } from 'sonner';
import { getLoginInfo } from '../lib/helpers';
import Fieldset from '@/uiEngine/components/fieldset-component';

export function SignInPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { showDialog, closeDialog, showToast } = useGlobalDialog();
  const _ = useT();
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
      // Sign in using the auth context
      await login(values);
      // Get the 'next' parameter from URL if it exists
      const nextPath = searchParams.get('next') || '/';
      // Use navigate for navigation
      navigate('/');
    } catch (err: any) {
      console.error('Unexpected sign-in error:', err);
      const errMessage = err instanceof Error
        ? err.message
        : err;
      setError(errMessage);
      showToast(errMessage, "error");
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
      default:
        break;
    }
  };

  // Handle Action
  const onActionAlert = useCallback((action: string, values?: Record<string, any>) => {
    switch (action) {
      case 'submit':
        console.log('values>', values);
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
      title: _('Forgot password?') ?? "",
      // fullWidth: true,
      content: contentView,
      classNameContent: 'w-[700px]',
      confirmBeforeClose: true,

    })
  }, [_, contentView, showDialog]);
  const [infoLogin, setInfoLogin] = useState<Record<string, any>>();
  useEffect(() => {
    const info = getLoginInfo();
    setInfoLogin(info);
  }, [])

  const loadingRef = useRef(isProcessing);
  useEffect(() => {
    loadingRef.current = isProcessing;
  }, [isProcessing]);

  return (
    <SchemaForm
      schema={loginSchema}
      onAction={onAction}
      values={infoLogin}
      valuesCheck={{ errAlert: error, loadingRef }}
      headerForm={
        <div className="text-center space-y-1 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">{_('Sign in')}</h1>
        </div>
      }
      footerForm={
        <>
          <div className="text-center text-sm text-muted-foreground">
            {_('Don\'t have an account?') + ' '}
            <a
              href="https://dangky.vacom.vn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-foreground hover:text-primary"
            >
              {_('Sign up')}
            </a>
          </div>
        </>
      }
    />
  );
}
