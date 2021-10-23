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
                  Determine what characteristics best define your Hero. Do they
                  lean more to being an <b>Artist</b>, <b>Hacker</b> or{" "}
                  <b>Hustler</b>?<br />
                  Each selection will determine the visual representation of
                  your hero.
                </li>
                <li>
                  If you like everything and the total trait value is 15 or
                  less, then click <b>Mint</b> and this will mint the image as
                  an NFT.
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
