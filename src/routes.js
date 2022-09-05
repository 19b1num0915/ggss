import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
import GuestGuard from './guards/GuestGuard';
import AuthGuard from './guards/AuthGuard';
// components
import LoadingScreen from './components/LoadingScreen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/bc/order')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const menuMerchant = [
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
        // <GuestGuard>
        //   <DashboardLayout />
        // </GuestGuard>
      ),
      children: [
        { element: <Navigate to="/bc/order" replace />, index: true },
        // Merchant --> ss
        { path: '/bc/order', element: <BcOrder /> },
        { path: '/bc/plan', element: <BcPlan /> },
        { path: '/bc/report', element: <BcReport /> },
        { path: '/settings/indicator', element: <Indicator /> },
        { path: '/settings/user', element: <User /> },
        // <-- Merchant
      ],
    },
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ];
  return useRoutes(menuMerchant);
}

// Dashboard
const Login = Loadable(lazy(() => import('./pages/auth/Login')));
const NotFound = Loadable(lazy(() => import('./pages/Page404')));

const BcOrder = Loadable(lazy(() => import('./pages/bc/order/Order')));
const BcPlan = Loadable(lazy(() => import('./pages/bc/plan/Plan')));
const BcReport = Loadable(lazy(() => import('./pages/bc/report/Report')));
// Settings
const Indicator = Loadable(lazy(() => import('./pages/settings/indicator/Indicator')));
const User = Loadable(lazy(() => import('./pages/settings/user/User')));
