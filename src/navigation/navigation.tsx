import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useUser } from "../SesssionManager/session";
import "./navigation.css";
const Navigation: React.FC = () => {
  const { logout, user } = useUser();
  const location = useLocation();
  // isOpen is by default false
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    // When window size
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleWindowResize = () => {
      if (!mediaQuery.matches) {
        // If screen is bigger than 767, isOpen is set to false
        setIsOpen(false);
      }
    };
    mediaQuery.addEventListener("change", handleWindowResize);
    handleWindowResize();
    return () => {
      mediaQuery.removeEventListener("change", handleWindowResize);
    };
  }, []);
  return (
    <div className="navigation row pt-3">
      <div className="row col-12 col-md-6 d-flex align-items-center">
        <h2 className="header col-6 nav-logo text-center">🔥Confidence</h2>
        <div className="col-6">
          <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
            <h2>☰</h2>
          </button>
        </div>
      </div>
      <div
        className={`${
          isOpen
            ? "collapsed-menu col-12 text-center"
            : "navButtonHolder col-12 col-md-6"
        }`}
      >
        <Link
          to="/"
          className={`navButton ${location.pathname === "/" ? "active" : ""}`}
          onClick={() => {
            if (isOpen) {
              setIsOpen(false);
            }
          }}
        >
          Home
        </Link>
        {!user && (
          <Link
            to="/authenticate"
            className={`navButton ${
              location.pathname === "/authenticate" ? "active" : ""
            }`}
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              }
            }}
          >
            Authenticate
          </Link>
        )}
        {user && (
          <Link
            to="/profile"
            className={`navButton ${
              location.pathname === "/authenticate" ? "active" : ""
            }`}
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              }
            }}
          >
            Profile
          </Link>
        )}
        {user && (
          <Link
            to="/workout"
            className={`navButton ${
              location.pathname === "/workout" ? "active" : ""
            }`}
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              }
            }}
          >
            Workout
          </Link>
        )}
        {user && (
          <Link
            to="/log"
            className={`navButton ${
              location.pathname === "/log" ? "active" : ""
            }`}
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              }
            }}
          >
            Log
          </Link>
        )}
        {user && (
          <Link
            to="/progress"
            className={`navButton ${
              location.pathname === "/progress" ? "active" : ""
            }`}
            onClick={() => {
              if (isOpen) {
                setIsOpen(false);
              }
            }}
          >
            Analysis
          </Link>
        )}
        {user && (
          <Link to="/" className="navButton">
            <button
              className="navButton sign-out"
              onClick={() => {
                if (isOpen) {
                  setIsOpen(false);
                }
                logout();
              }}
            >
              Sign out
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navigation;
