import React, { createContext, useContext, useState, ReactNode } from 'react';

// Property types
export interface Property {
  id: string;
  title: string;
  type: string;
  location: string;
  area: number;
  deedNumber: string;
  estimatedValue: number;
  eligibleAmount: number;
  qualificationStatus: 'qualified_24h' | 'qualified_48h' | 'not_qualified';
  imageUrl?: string;
}

// Loan types
export interface Loan {
  id: string;
  propertyId: string;
  propertyTitle: string;
  amount: number;
  tenor: number;
  monthlyPayment: number;
  apr: number;
  totalPayment: number;
  status: 'active' | 'processing' | 'closed';
  actionRequired?: string;
  nextPaymentDate?: string;
  remainingBalance?: number;
}

// Credit profile types
export interface CreditProfile {
  eligibilityScore: number;
  averageIncome: number;
  flowStability: number;
  estimatedObligations: number;
  cashSafetyMargin: number;
  bankLinked: boolean;
  lastUpdated?: string;
}

// App state interface
interface AppState {
  // User info
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
  
  // Properties
  properties: Property[];
  setProperties: (properties: Property[]) => void;
  selectedProperty: Property | null;
  setSelectedProperty: (property: Property | null) => void;
  
  // Loan design
  loanAmount: number;
  setLoanAmount: (amount: number) => void;
  loanTenor: number;
  setLoanTenor: (tenor: number) => void;
  
  // Loans
  loans: Loan[];
  setLoans: (loans: Loan[]) => void;
  
  // Credit profile
  creditProfile: CreditProfile | null;
  setCreditProfile: (profile: CreditProfile | null) => void;
  
  // UI states
  currentFlow: 'onboarding' | 'main';
  setCurrentFlow: (flow: 'onboarding' | 'main') => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

// Mock data for properties
const mockProperties: Property[] = [
  {
    id: '1',
    title: 'فيلا الياسمين',
    type: 'فيلا سكنية',
    location: 'الرياض، حي الياسمين',
    area: 450,
    deedNumber: '310125478963',
    estimatedValue: 2500000,
    eligibleAmount: 1750000,
    qualificationStatus: 'qualified_24h',
    imageUrl: '/images/property-illustration.png'
  },
  {
    id: '2',
    title: 'شقة النرجس',
    type: 'شقة سكنية',
    location: 'الرياض، حي النرجس',
    area: 180,
    deedNumber: '310125478964',
    estimatedValue: 850000,
    eligibleAmount: 595000,
    qualificationStatus: 'qualified_48h',
    imageUrl: '/images/property-illustration.png'
  },
  {
    id: '3',
    title: 'أرض المروج',
    type: 'أرض سكنية',
    location: 'الرياض، حي المروج',
    area: 600,
    deedNumber: '310125478965',
    estimatedValue: 1200000,
    eligibleAmount: 0,
    qualificationStatus: 'not_qualified',
    imageUrl: '/images/property-illustration.png'
  }
];

// Mock loans
const mockLoans: Loan[] = [
  {
    id: 'L001',
    propertyId: '1',
    propertyTitle: 'فيلا الياسمين',
    amount: 500000,
    tenor: 5,
    monthlyPayment: 9583,
    apr: 7.5,
    totalPayment: 575000,
    status: 'active',
    nextPaymentDate: '2026-02-01',
    remainingBalance: 485000
  }
];

// Mock credit profile
const mockCreditProfile: CreditProfile = {
  eligibilityScore: 78,
  averageIncome: 25000,
  flowStability: 85,
  estimatedObligations: 3500,
  cashSafetyMargin: 72,
  bankLinked: true,
  lastUpdated: '2026-01-15'
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  // User state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Properties state
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  
  // Loan design state
  const [loanAmount, setLoanAmount] = useState(500000);
  const [loanTenor, setLoanTenor] = useState(5);
  
  // Loans state
  const [loans, setLoans] = useState<Loan[]>(mockLoans);
  
  // Credit profile state
  const [creditProfile, setCreditProfile] = useState<CreditProfile | null>(mockCreditProfile);
  
  // UI state
  const [currentFlow, setCurrentFlow] = useState<'onboarding' | 'main'>('onboarding');
  
  const value: AppState = {
    phoneNumber,
    setPhoneNumber,
    isAuthenticated,
    setIsAuthenticated,
    properties,
    setProperties,
    selectedProperty,
    setSelectedProperty,
    loanAmount,
    setLoanAmount,
    loanTenor,
    setLoanTenor,
    loans,
    setLoans,
    creditProfile,
    setCreditProfile,
    currentFlow,
    setCurrentFlow
  };
  
  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}
