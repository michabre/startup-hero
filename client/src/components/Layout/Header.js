import React from "react";

const Header = () => {
  return (
    <nav
      className="navbar is-flex is-justify-content-space-between"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="./index.html">
          <img src="./startup-logo.png" alt="a really cool startup icon" />
        </a>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            <button className="button is-primary">
              <strong>Connect</strong>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
