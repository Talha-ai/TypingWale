import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/theme-provider';
import { UpdateNotification } from '@/components/UpdateNotification';
import { queryClient } from '@/lib/queryClient';
// Auth pages removed - no login required
// import { ProtectedRoute } from '@/components/ProtectedRoute';
// import { LoginPage } from '@/pages/LoginPage';
// import { SignupPage } from '@/pages/SignupPage';
// import { VerifyOTPPage } from '@/pages/VerifyOTPPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { PracticePage } from '@/pages/PracticePage';
import { TestModePage } from '@/pages/TestModePage';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="cpct-ui-theme">
        <UpdateNotification />
        <HashRouter>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              {/* Auth disabled - go directly to dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Auth pages kept for future use but not accessible */}
              {/* <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/verify-otp" element={<VerifyOTPPage />} /> */}

              {/* All routes now unprotected - no login required */}
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/practice/:mode" element={<PracticePage />} />
              <Route path="/practice/:mode/:lessonId" element={<PracticePage />} />
              <Route path="/test" element={<TestModePage />} />
            </Routes>
          </div>
        </HashRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
