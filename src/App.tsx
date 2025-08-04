import { LoginHome } from "./pages";
import AuthRoute from "./routes/auth/AuthRoute";
import DashboardRoute from "./routes/dashboard/DashboardRoute";

function App() {
  return (
    <>
      <LoginHome />
      <AuthRoute />
      <DashboardRoute />
    </>
  );
}

export default App;
