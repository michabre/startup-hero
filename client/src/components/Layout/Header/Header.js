import React from "react";
import "./Header.css";

const Header = ({
  connect,
  homeLink,
  mergeLink,
  shopLink,
  nftCount,
  connected,
}) => {
  const viewCollectionButton = () => {
    if (nftCount > 0) {
      return (
        <button className="button is-primary" onClick={connect}>
          {mergeLink}
        </button>
      );
    }
  };

  return (
    <nav
      id="header"
      className="navbar is-flex is-justify-content-space-between"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src="./startup-logo.png" alt="a really cool startup icon" />
        </a>
        <div className="navbar-item">{homeLink}</div>
        <div className="navbar-item">{shopLink}</div>
      </div>

      <div className="navbar-end">
        <div className="navbar-item">
          <div className="buttons">
            {viewCollectionButton()}
            <button className="button is-link is-inverted is-outlined">
              NFTs: <span className="ml-3 ">{nftCount}</span>
            </button>
            <button className="button is-link is-inverted is-outlined">
              Account: <span className="ml-3">{connected}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
