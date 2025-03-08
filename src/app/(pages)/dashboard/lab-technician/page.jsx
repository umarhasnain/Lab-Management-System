'use client'
import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import UserManagement from '@/components/UserManagement';
import TestManagement from '@/components/AdminTests';
import ReportsAnalytics from '@/components/AdminReports';
import BillingInvoices from '@/components/BillingInvoice';
import InvoiceGenerator from '@/components/GenrateBill';
import BiotechIcon from '@mui/icons-material/Biotech';
import SummarizeIcon from '@mui/icons-material/Summarize';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import AddCardIcon from '@mui/icons-material/AddCard';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import HistoryIcon from '@mui/icons-material/History';
import BookOnlineIcon from '@mui/icons-material/BookOnline';
import LabTechDashboard from '@/components/LabTech';
import AppointmentProcessing from '@/components/Appointment';
import LabTestManagement from '@/components/TestManagement';
import LabTestMangement from '@/components/TestManagement';
import PatientTestReport from '@/components/PatientTestReport';
import PatientReportGenerator from '@/components/PatientTestReport';
import TestReport from '@/components/PatientTestReport';
import QRCodeScanner from '@/components/QRCode';
import PatientHistory from '@/components/PatientHistory';
import OldAppointments from '@/components/OldAppointments';
// import OrdersComponent from '@/components/OrdersComponent'; // Make sure this exists

const NAVIGATION = [
  { segment: 'dashboard', title: 'Dashboard', icon: <DashboardIcon /> },
  { segment: 'appointment', title: 'Appointment Processing', icon: <BookOnlineIcon /> },
  { segment: 'oldAppointment', title: 'Old Appointment Processing', icon: <BookOnlineIcon /> },
  { segment: 'testManagement', title: 'Test Management', icon: <BiotechIcon /> },
  { segment: 'reportGeneration', title: 'Report Generation', icon: <SummarizeIcon /> },
  { segment: 'qrCodeScanning', title: 'QR Code Scanning', icon: <QrCodeScannerIcon /> },
  { segment: 'patientHistory', title: 'Patient History', icon: <HistoryIcon /> },
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
      {pathname === "/dashboard" ? ( <LabTechDashboard /> ) :
       pathname === "/appointment" ? (<AppointmentProcessing />  ) : 
       pathname === "/oldAppointment" ? (<OldAppointments />  ) : 
       pathname === "/testManagement" ? ( <LabTestMangement />  ) : 
       pathname === "/reportGeneration" ? ( <TestReport />  ) : 
       pathname === "/qrCodeScanning" ? ( <QRCodeScanner />  ) : 
       pathname === "/patientHistory" ? ( <PatientHistory />  ) : 
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
