import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("demo@bixblion.app");
  const [password, setPassword] = useState("demo12345");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const fromPath = (location.state as { from?: string } | null)?.from || "/";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      toast(result.message || "Accesso non riuscito");
      return;
    }
    toast("Accesso effettuato");
    navigate(fromPath, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 md:p-7">
        <div className="text-center mb-6">
          <img src="/bixblion-logo.svg" alt="Bixblion" className="h-10 w-10 mx-auto mb-2" />
          <h1 className="font-display text-2xl font-bold text-foreground">Accedi a Bixblion</h1>
          <p className="text-xs text-muted-foreground mt-1">Continua con il tuo account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Accedi
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Non hai un account?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Registrati
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

