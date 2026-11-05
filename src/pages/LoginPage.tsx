import "./LoginPage.css";

import { useState, type FormEvent } from "react";
import { login, register } from "../api/auth";

interface LoginPageProps {
  onLoginSuccess: (token: string) => void;
}

export default function LoginPage({
  onLoginSuccess,
}: LoginPageProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      if (isRegistering) {
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          return;
        }

        await register(normalizedEmail, password);
      }

      const result = await login(normalizedEmail, password);
      onLoginSuccess(result.access_token);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong.",
      );
    } finally {
      setLoading(false);
    }
  }

  function toggleMode() {
    setIsRegistering(!isRegistering);
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <main className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Book of Life</h1>

        <p>
          {isRegistering
            ? "Create an account to begin your journey."
            : "Sign in to continue your journey."}
        </p>

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          autoComplete={isRegistering ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        {isRegistering && (
          <>
            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </>
        )}

        {error && (
          <p className="login-error" role="alert">
            {error}
          </p>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isRegistering
              ? "Create Account"
              : "Sign in"}
        </button>

        <p>
          {isRegistering
            ? "Already have an account? "
            : "Don't have an account? "}

          <button type="button" onClick={toggleMode}>
            {isRegistering ? "Sign in" : "Create account"}
          </button>
        </p>
      </form>
    </main>
  );
}