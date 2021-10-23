import React from "react";
import "./Hero.css";

const Hero = ({ title, subtitle }) => {
  return (
    <section className="hero is-small">
      <div className="hero-body">
        <div className="container has-text-centered">
          <h2 className="title is-size-1">{title}</h2>
          <h3 className="subtitle">{subtitle}</h3>
        </div>
      </div>
      <div className="band">
        <div className="container">
          <div className="columns">
            <div className="column is-one-fifth">
              <h4 className="title is-size-4 has-text-weight-bold">
                Instructions
              </h4>
            </div>
            <div className="column">
              <ol>
                <li>
                  Choose a <b>name</b> for your hero.
                </li>
                <li>
                  Determine where they are on the <b>Artist</b>, <b>Hacker</b>{" "}
                  and <b>Hustler</b> spectrum. Each selection will determine the
                  visual traits of your hero.
                </li>
                <li>
                  Select an Angel Investor. This will improve the background of
                  the hero.
                </li>
                <li>
                  If you like everything, click <b>Mint</b> and this will create
                  your own NFT!
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
