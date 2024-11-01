import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navigation.css";
const Navigation: React.FC = () => {
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
      <div className="navButtonHolder col-12 col-md-6">
        <Link
          to="/"
          className={`navButton ${location.pathname === "/" ? "active" : ""}`}
        >
          Home
        </Link>
        <Link
          to="/"
          className={`navButton ${location.pathname === "/" ? "active" : ""}`}
        >
          Home2
        </Link>
        <Link
          to="/"
          className={`navButton ${location.pathname === "/" ? "active" : ""}`}
        >
          Home3
        </Link>
      </div>
      {/* If the screen is small enough and is opened is true */}
      {/* Open menu that closes upon click */}
      {isOpen && (
        <div className="collapsed-menu col-12 text-center">
          <Link
            to="/"
            className={`navButton ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Home
          </Link>
          <Link
            to="/"
            className={`navButton ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Home2
          </Link>
          <Link
            to="/"
            className={`navButton ${location.pathname === "/" ? "active" : ""}`}
            onClick={() => {
              setIsOpen(false);
            }}
          >
            Home3
          </Link>
        </div>
      )}
    </div>
  );
};

export default Navigation;
