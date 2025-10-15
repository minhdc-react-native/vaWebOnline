import { AuthRouting } from '@/auth/auth-routing';
import { RequireAuth } from '@/auth/require-auth';
import { ErrorRouting } from '@/errors/error-routing';
import { VacomLayout } from '@/layouts/vacom/layout';
import { AppListPage } from '@/pages/vacom/app-list/app-list';
import { CustomViewPage } from '@/pages/vacom/customview/customview-page';
import { DashboardPage } from '@/pages/vacom/dashboard/dashboard-page';
import { MasterWindowPage } from '@/pages/vacom/masterwindow/masterwindow-page';
import { ReportWindowPage } from '@/pages/vacom/reportwindow/reportwindow-page';
import { TreeWindowPage } from '@/pages/vacom/treewindow/treewindow-page';
import { WindowPage } from '@/pages/vacom/window/window-page';
import { Navigate, Route, Routes } from 'react-router';

export function AppRoutingVacom() {
    return (
        <Routes>
            <Route element={<RequireAuth />}>
                <Route index element={<AppListPage />} />
                <Route path="app/*" element={<VacomLayout />}>
                    {/* <Route index element={<DefaultPage />} /> */}
                    <Route path="dashboard/:window_id" element={<DashboardPage />} />
                    <Route path="treewindow/:window_id" element={<TreeWindowPage />} />
                    <Route path="window/:window_id" element={<WindowPage />} />
                    <Route path="customview/:window_id" element={<CustomViewPage />} />
                    <Route path="reportwindow/:window_id" element={<ReportWindowPage />} />
                    <Route path="masterwindow/:window_id" element={<MasterWindowPage />} />
                </Route>
            </Route>

            <Route path="error/*" element={<ErrorRouting />} />
            <Route path="auth/*" element={<AuthRouting />} />
            <Route path="*" element={<Navigate to="/error/404" />} />
        </Routes>
    );
}
