import { type JSX } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Auth from "./components/Auth";
import RoomSelection from "./components/RoomSelection";
import GamePage from "./pages/GamePage";
import { APP_ROUTES } from "./utils/constants";
import { AuthProvider, useAuth } from "./context/AuthContext";

const AppRoutes = () => {
  const { user } = useAuth();

  // Protected Route wrapper
  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!user) {
      return <Navigate to={APP_ROUTES.LOGIN} replace />;
    }
    return children;
  };

  return (
    <Routes>
      <Route
        path={APP_ROUTES.LOGIN}
        element={!user ? <Auth /> : <Navigate to={APP_ROUTES.ROOMS} />}
      />

      <Route
        path={APP_ROUTES.ROOMS}
        element={
          <ProtectedRoute>
            <RoomSelection username={user?.username} />
          </ProtectedRoute>
        }
      />

      <Route
        path={APP_ROUTES.GAME}
        element={
          <ProtectedRoute>
            <GamePage user={user} />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to={APP_ROUTES.LOGIN} />} />
    </Routes>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-900 text-white">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
