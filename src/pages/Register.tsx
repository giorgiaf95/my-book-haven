import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

const Register = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) {
      toast("Inserisci un nome valido");
      return;
    }
    if (password.length < 8) {
      toast("La password deve avere almeno 8 caratteri");
      return;
    }
    if (password !== confirmPassword) {
      toast("Le password non coincidono");
      return;
    }

    const result = register({ name, email, password });
    if (!result.ok) {
      toast(result.message || "Registrazione non riuscita");
      return;
    }

    toast("Registrazione completata");
    navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-card border border-border shadow-card p-6 md:p-7">
        <div className="text-center mb-6">
          <img src="/bixblion-logo.svg" alt="Bixblion" className="h-10 w-10 mx-auto mb-2" />
          <h1 className="font-display text-2xl font-bold text-foreground">Crea il tuo account</h1>
          <p className="text-xs text-muted-foreground mt-1">Registrati per usare Bixblion</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
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
          <div>
            <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Conferma password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              className="mt-1 w-full rounded-xl bg-background border border-border px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Registrati
          </button>
        </form>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Hai già un account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Accedi
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

