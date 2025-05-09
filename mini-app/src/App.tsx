import React, { useEffect, useState } from "react";

// Ensure Telegram WebApp is available
const TELEGRAM = (window as any).Telegram?.WebApp;

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const tgUser = TELEGRAM.initDataUnsafe?.user;
    if (tgUser?.username) {
      setUsername(tgUser.username);
      setIsSignedUp(storedUsers.includes(tgUser.username));
    }
    TELEGRAM.ready();
  }, []);

  const delayMessage = (text: string) => {
    setLoading(true);
    setMessage(""); // Clear current message
    setTimeout(() => {
      setMessage(text);
      setLoading(false);
    }, 1500); // 1.5s delay
  };

  const handleSignup = () => {
    if (!username) return;

    let storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (!storedUsers.includes(username)) {
      storedUsers.push(username);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      setIsSignedUp(true);
    }

    window.open("https://photon-sol.tinyastro.io/@malikonchain", "_blank");
  };

  const handleVerify = () => {
    if (!username) return;

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (storedUsers.includes(username)) {
      delayMessage("🎉 Verification successful! You're all set.");
    } else {
      delayMessage(
        "❌ Verification failed. Please click 'Sign up for Photon' and sign up Photon via this Mini-App."
      );
    }
  };

  return (
    <div className="container">
      <h2>👋 Welcome, {username || "Guest"}! </h2>
      <p>
        Please complete verification to access the channel.
        <br />
        <br />
        1. Please <b>sign up Photon</b> via my telegram mini-app.
        <br />
        <br />
        2. Click the <b>"Verify"</b> button and verify you here.
      </p>

      {!isSignedUp ? (
        <button onClick={handleSignup}>🚀 Sign up for Photon</button>
      ) : (
        <button disabled>💫 Already Signed Up</button>
      )}

      <button onClick={handleVerify}>✅ Verify</button>

      {loading ? (
        <div className="message">⏳ Loading...</div>
      ) : (
        message && <div className="message">{message}</div>
      )}
    </div>
  );
};

export default App;
