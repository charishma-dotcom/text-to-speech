import { useState } from "react";

async function hashPassword(password) {
  const data =
    new TextEncoder().encode(password);

  const hash =
    await crypto.subtle.digest(
      "SHA-256",
      data
    );

  return Array.from(
    new Uint8Array(hash)
  )
    .map((byte) =>
      byte.toString(16).padStart(2, "0")
    )
    .join("");
}

function Auth({ onLogin }) {
  const [mode, setMode] =
    useState("login");

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError(
        "Please enter email and password."
      );

      return;
    }

    const users =
      JSON.parse(
        localStorage.getItem(
          "tts_users"
        )
      ) || [];

    const normalizedEmail =
      email.trim().toLowerCase();

    const passwordHash =
      await hashPassword(password);

    if (mode === "register") {
      if (!name.trim()) {
        setError(
          "Please enter your name."
        );

        return;
      }

      if (
        users.some(
          (user) =>
            user.email ===
            normalizedEmail
        )
      ) {
        setError(
          "An account with this email already exists."
        );

        return;
      }

      const newUser = {
        id: crypto.randomUUID(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash
      };

      users.push(newUser);

      localStorage.setItem(
        "tts_users",
        JSON.stringify(users)
      );

      localStorage.setItem(
        "tts_current_user",
        JSON.stringify(
          {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
          }
        )
      );

      onLogin({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      });

      return;
    }

    const existingUser =
      users.find(
        (user) =>
          user.email ===
            normalizedEmail &&
          user.passwordHash ===
            passwordHash
      );

    if (!existingUser) {
      setError(
        "Invalid email or password."
      );

      return;
    }

    const session = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email
    };

    localStorage.setItem(
      "tts_current_user",
      JSON.stringify(session)
    );

    onLogin(session);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          🔊
        </div>

        <h1>
          Text to Speech
        </h1>

        <p className="auth-subtitle">
          Free multilingual speech
          application
        </p>

        <div className="auth-tabs">
          <button
            className={
              mode === "login"
                ? "auth-tab-active"
                : ""
            }
            onClick={() => {
              setMode("login");
              setError("");
            }}
          >
            Login
          </button>

          <button
            className={
              mode === "register"
                ? "auth-tab-active"
                : ""
            }
            onClick={() => {
              setMode("register");
              setError("");
            }}
          >
            Register
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
        >
          {mode === "register" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
          />

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
          >
            {mode === "login"
              ? "Login"
              : "Create Account"}
          </button>
        </form>

        <div className="auth-note">
          If you are using this application for the first time, please register a new account. Your data will be stored locally in your browser and will not be shared with anyone.
        </div>
      </div>
    </div>
  );
}

export default Auth;