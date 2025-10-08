import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { VacomLayout } from '@/layouts/vacom/layout';
import {
    AccountGetStartedPage
} from '@/pages/account';
import { DefaultPage, Demo1DarkSidebarPage } from '@/pages/dashboards';
import { ProfileDefaultPage } from '@/pages/public-profile';
import { AppListPage } from '@/pages/vacom/app-list/app-list';
import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingVacom() {
    return (
        <Routes>
            <Route element={<RequireAuth />}>
                <Route index element={<AppListPage />} />
                <Route path="app/*" element={<VacomLayout />}>
                    <Route index element={<DefaultPage />} />
                    <Route path="dark-sidebar" element={<Demo1DarkSidebarPage />} />
                    <Route path="public-profile/profiles/default/" element={<ProfileDefaultPage />} />
                    <Route path="auth/get-started" element={<AccountGetStartedPage />} />
                </Route>
            </Route>

            <Route path="error/*" element={<ErrorRouting />} />
            <Route path="auth/*" element={<AuthRouting />} />
            <Route path="*" element={<Navigate to="/error/404" />} />
        </Routes>
    );
}
