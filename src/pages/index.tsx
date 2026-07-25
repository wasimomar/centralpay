import { useState } from "react";
import Login from "../pages/Login/login";
import Register from "../pages/Register/register";
import AnimatedBackground from "../component/AnimatedBackground/AnimatedBackground";
import FloatingShapes from "../component/FloatingShapes/FloatingShapes";

export default function WelcomePage() {

  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <>
      {/* BACKGROUND */}
      <AnimatedBackground />
      <FloatingShapes />

      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center pt-20 pb-10">

        <div className={`auth-container ${isSignUp ? "active" : ""}`}>

          {/* SIGN UP */}
          <div className="form-container sign-up">
            <Register />
          </div>

          {/* LOGIN */}
          <div className="form-container sign-in">
            <Login />
          </div>

          {/* OVERLAY */}
          <div className="overlay-container">

            <div className="overlay">

              <div className="overlay-panel left">
                <h1 className="text-3xl font-bold mb-4">
                  Welcome Back!
                </h1>

                <p>
                  To keep connected with us please login with your personal info
                </p>

                <button
                  className="ghost-btn"
                  onClick={() => setIsSignUp(false)}
                >
                  SIGN IN
                </button>
              </div>

              <div className="overlay-panel right">

                <h1 className="text-3xl font-bold mb-4">
                  Hello, Friend!
                </h1>

                <p>
                  Enter your personal details and start your journey with us
                </p>

                <button
                  className="ghost-btn"
                  onClick={() => setIsSignUp(true)}
                >
                  SIGN UP
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}