import React from "react";

const Header = ({ connect, merge, mergeLink, nftCount, connected }) => {
  const mergeButton = () => {
    if (nftCount > 1) {
      return <button className="button is-primary">{mergeLink}</button>;
    }
  };
  return (
    <nav
      className="navbar is-flex is-justify-content-space-between"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="./startup-logo.png" alt="a really cool startup icon" />
        </a>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            {mergeButton()}
            <button className="button is-primary" onClick={connect}>
              <strong>Connect</strong>
            </button>
            <button className="button">
              NFTs: <span className="ml-3">{nftCount}</span>
            </button>
            <button className="button">
              Account: <span className="ml-3">{connected}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
