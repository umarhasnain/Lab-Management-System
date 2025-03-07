'use client'
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import AdminDashboard from '@/components/Dashboard';
import UserManagement from '@/components/UserManagement';
import TestManagement from '@/components/AdminTests';
import GroupIcon from '@mui/icons-material/Group';
import ReportsAnalytics from '@/components/AdminReports';
import BillingInvoices from '@/components/BillingInvoice';
import InvoiceGenerator from '@/components/GenrateBill';
import BiotechIcon from '@mui/icons-material/Biotech';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCardIcon from '@mui/icons-material/AddCard';

// import OrdersComponent from '@/components/OrdersComponent'; // Make sure this exists

const NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'users', title: 'Users', icon: <GroupIcon /> },
  { segment: 'tests', title: 'Tests', icon: <BiotechIcon /> },
  { segment: 'reports', title: 'Reports', icon: <SummarizeIcon /> },
  { segment: 'billingInvoice', title: 'Billing Invoice', icon: <AccountBalanceWalletIcon /> },
  { segment: 'invoiceGenerator', title: 'Invoice Generator', icon: <AddCardIcon /> },
];

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {pathname === "/dashboard" ? ( <AdminDashboard /> ) :
       pathname === "/users" ? (<UserManagement />  ) : 
       pathname === "/tests" ? ( <TestManagement />  ) : 
       pathname === "/reports" ? ( <ReportsAnalytics />  ) : 
       pathname === "/billingInvoice" ? ( <BillingInvoices />  ) : 
       pathname === "/invoiceGenerator" ? ( <InvoiceGenerator />  ) : 

       (
        <Typography variant="h6">Page Not Found</Typography>
      )}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;
  const router = useDemoRouter('/dashboard');

  // Fixing hydration issue by ensuring theme runs only on client
  const [theme, setTheme] = React.useState(null);

  React.useEffect(() => {
    setTheme(
      createTheme({
        cssVariables: {
          colorSchemeSelector: 'data-toolpad-color-scheme',
        },
        colorSchemes: { light: true, dark: true },
        breakpoints: {
          values: {
            xs: 0,
            sm: 600,
            md: 600,
            lg: 1200,
            xl: 1536,
          },
        },
      })
    );
  }, []);

  if (!theme) return null; // Prevents mismatch during hydration

  return (
    <ThemeProvider theme={theme}>
      <AppProvider
        navigation={NAVIGATION}
        branding={{
          logo: "",
          title: 'InnoLab Management 🧪🎯',
        }}
        router={router}
        theme={theme}
        window={window ? window() : undefined}
      >
        <DashboardLayout>
          <DemoPageContent pathname={router.pathname} />
        </DashboardLayout>
      </AppProvider>
    </ThemeProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
