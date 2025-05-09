import React, { useEffect, useState } from "react";

const TELEGRAM = (window as any).Telegram?.WebApp;

const App: React.FC = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
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

  const delayMessage = (text: string, onComplete?: () => void) => {
    setLoading(true);
    setMessage("");
    setTimeout(() => {
      setMessage(text);
      setLoading(false);
      if (onComplete) onComplete();
    }, 1500);
  };

  const handleSignup = () => {
    if (!username) return;

    let storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (!storedUsers.includes(username)) {
      storedUsers.push(username);
      localStorage.setItem("users", JSON.stringify(storedUsers));
      setIsSignedUp(true);
      delayMessage("🎉 You have signed up successfully for Photon.");
    } else {
      delayMessage("❌ You are already signed up.");
    }

    window.open("https://photon-sol.tinyastro.io/@malikonchain", "_blank");
  };

  const handleVerify = () => {
    if (!username) return;

    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");

    if (storedUsers.includes(username)) {
      delayMessage(
        '🎉 Verification successful!\n Please click the "Registration" button and continue',
        () => {
          setIsVerified(true);
        }
      );
    } else {
      delayMessage(
        "❌ Verification failed. Please click 'Sign up for Photon' first."
      );
    }
  };

  const handleRegistration = () => {
    setShowRegistration(true);
  };

  if (showRegistration) {
    return (
      <div className="container">
        <h2>🚀 Malik Onchain Crypto Channel</h2>
        <a
          href="https://t.me/+dFsxa2hU7gU4ZDVk"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <button>👉 Join our crypto channel</button>
        </a>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Welcome {username || "Guest"} 👋</h2>
      <p>Please complete verification to access the channel.</p>

      {!isSignedUp ? (
        <button onClick={handleSignup}>🚀 Sign up for Photon</button>
      ) : (
        <button disabled>✅ Already Signed Up</button>
      )}

      <button onClick={handleVerify}>✅ Verify</button>

      {loading ? (
        <div className="message">⏳ Loading...</div>
      ) : (
        message && <div className="message">{message}</div>
      )}

      {isVerified && !showRegistration && (
        <button onClick={handleRegistration}>📋 Registration</button>
      )}
    </div>
  );
};

export default App;
