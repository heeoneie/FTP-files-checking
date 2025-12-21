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
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#ff6b35',
              secondary: '#fff',
            },
          },
        }}
      />
      {userName ? <SourceManager /> : <LoginForm />}
    </>
  );
}

export default App;
