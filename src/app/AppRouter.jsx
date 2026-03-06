import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import CreditList from "../features/credits/CreditList";
import CreditDetail from "../features/credits/CreditDetail";
import Layout from "./Layout";
import Clients from "../features/clients/Clients";
import ClientDetail from "../features/clients/ClientDetail";
import NewCredit from "../features/credits/NewCredit";
import { CreditsProvider } from "../features/credits/CreditsContext";
import { ClientsProvider } from "../features/clients/ClientsContext";
import NotFound from "../pages/NotFound";
import ErrorPage from "../pages/ErrorPage";
import { AuthProvider } from "../features/auth/AuthContext";
import PrivateRoute from "./PrivateRoute";


const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <PrivateRoute><Layout /></PrivateRoute>,
    errorElement: <ErrorPage />,

    children: [
      { path: "dashboard", element: <Dashboard /> },

      // CLIENTS
      { path: "clients", element: <Clients /> },
      { path: "clients/:id", element: <ClientDetail /> },
      { path: "clients/:id/new-credit", element: <NewCredit /> },

      // CREDITS
      { path: "credits", element: <CreditList /> },
      { path: "credits/:id", element: <CreditDetail /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

export default function AppRouter() {
  return (
    <AuthProvider>
      <ClientsProvider>
        <CreditsProvider>
          <RouterProvider router={router} />
        </CreditsProvider>
      </ClientsProvider>
    </AuthProvider>
  );
}
