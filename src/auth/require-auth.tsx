import { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ScreenLoader } from '@/components/common/screen-loader';
import { useAuth } from './context/auth-context';

/**
 * Component to protect routes that require authentication.
 * If user is not authenticated, redirects to the login page.
 */
export const RequireAuth = () => {
  const { auth, verify, loading: globalLoading } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const verificationStarted = useRef(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!(loading || globalLoading)) {
      setTimeout(() => setVisible(false), 200);
    } else {
      setVisible(true);
    }
  }, [loading, globalLoading]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth?.access_token || !verificationStarted.current) {
        verificationStarted.current = true;
        try {
          await verify();
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    checkAuth();
  }, [auth, verify]);

  // if (loading || globalLoading) {
  //   return <ScreenLoader />;
  // }

  // If not authenticated, redirect to login
  if (!auth?.access_token) {
    return (
      <Navigate
        to={`/auth/signin?next=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  // If authenticated, render child routes
  return <div className="relative min-h-screen w-full">
    <ScreenLoader visible={visible} />
    <Outlet />
  </div>
};
