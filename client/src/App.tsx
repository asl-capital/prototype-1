import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppStateProvider } from "./contexts/AppStateContext";

// Pre-login flow screens
import Welcome from "./pages/Welcome";
import Consent from "./pages/Consent";
import PhoneRegistration from "./pages/PhoneRegistration";
import OTPVerification from "./pages/OTPVerification";
import NafathConfirmation from "./pages/NafathConfirmation";
import PropertySync from "./pages/PropertySync";

// Main app screens (authenticated)
import PropertiesDashboard from "./pages/PropertiesDashboard";
import PropertyDetails from "./pages/PropertyDetails";
import RevaluationBooking from "./pages/RevaluationBooking";
import LoanDesign from "./pages/LoanDesign";
import Disclosures from "./pages/Disclosures";
import InstantDecision from "./pages/InstantDecision";
import ContractPreview from "./pages/ContractPreview";
import NajizESign from "./pages/NajizESign";
import ShariaExecution from "./pages/ShariaExecution";
import DisbursementConfirmation from "./pages/DisbursementConfirmation";
import LoanDashboard from "./pages/LoanDashboard";
import CreditProfile from "./pages/CreditProfile";
import Settings from "./pages/Settings";
import OpenBankingConnect from "./pages/OpenBankingConnect";
import Home from "./pages/Home";
import LoanDetails from "./pages/LoanDetails";
import Chat from "./pages/Chat";

function Router() {
  return (
    <Switch>
      {/* Pre-login flow */}
      <Route path="/" component={Welcome} />
      <Route path="/consent" component={Consent} />
      <Route path="/phone" component={PhoneRegistration} />
      <Route path="/otp" component={OTPVerification} />
      <Route path="/nafath" component={NafathConfirmation} />
      <Route path="/sync" component={PropertySync} />
      
      {/* Main app - authenticated area */}
      <Route path="/chat" component={Chat} />
      <Route path="/home" component={Home} />
      <Route path="/properties" component={PropertiesDashboard} />
      <Route path="/property/:id" component={PropertyDetails} />
      <Route path="/revaluation/:id" component={RevaluationBooking} />
      <Route path="/loan-design/:propertyId" component={LoanDesign} />
      <Route path="/disclosures" component={Disclosures} />
      <Route path="/decision/:outcome" component={InstantDecision} />
      <Route path="/contract" component={ContractPreview} />
      <Route path="/najiz-sign" component={NajizESign} />
      <Route path="/sharia-execution" component={ShariaExecution} />
      <Route path="/disbursement" component={DisbursementConfirmation} />
      <Route path="/loans" component={LoanDashboard} />
      <Route path="/loan/:id" component={LoanDetails} />
      <Route path="/credit" component={CreditProfile} />
      <Route path="/open-banking" component={OpenBankingConnect} />
      <Route path="/settings" component={Settings} />
      
      {/* 404 fallback */}
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AppStateProvider>
          <TooltipProvider>
            <Toaster position="top-center" />
            <Router />
          </TooltipProvider>
        </AppStateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
