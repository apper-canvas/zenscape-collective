import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { routes } from '@/config/routes';
import Layout from '@/Layout';

function App() {
  return (
    <BrowserRouter>
      <div className="h-screen overflow-hidden bg-background">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/garden" replace />} />
            {routes.map(route => (
              <Route 
                key={route.id} 
                path={route.path} 
                element={<route.component />} 
              />
            ))}
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          toastClassName="shadow-zen"
          className="z-[9999]"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;