import { BrowserRouter, Routes, Route } from "react-router-dom";
import Results from "./pages/Results";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";

import PublicLayout from "./layouts/PublicLayout";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import Optimize from "./pages/Optimize";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={
              <PublicLayout>
                <Landing />
              </PublicLayout>
            }
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
            <Route
              path="/optimize"
              element={
            <ProtectedRoute>
              <Optimize />
            </ProtectedRoute>
              }
          />
          <Route
          path="/results"
          element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;