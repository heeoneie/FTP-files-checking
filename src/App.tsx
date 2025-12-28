import { Toaster } from 'react-hot-toast';
import { useUserStore } from './store/userStore';
import { LoginForm } from './components/LoginForm';
import { SourceManager } from './components/SourceManager';

function App() {
  const userName = useUserStore((state) => state.userName);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#1f2937',
            boxShadow:
              '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e5e7eb',
            borderRadius: '0.5rem',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
            style: {
              background: '#fff',
              color: '#1f2937',
              border: '1px solid #fed7aa',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
            style: {
              background: '#fff',
              color: '#1f2937',
              border: '1px solid #fecaca',
            },
          },
        }}
      />
      {userName ? <SourceManager /> : <LoginForm />}
    </>
  );
}

export default App;
