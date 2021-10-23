import React from "react";
import Slider from "react-input-slider";
import "./styles.css";

const Trait = ({ title, level, update }) => {
  return (
    <>
      <h3 className="has-text-centered is-title is-size-6">
        {title}: <span className="tag is-dark">{level}</span>
      </h3>
      <div className="slider-section mb-5">
        <Slider
          axis="x"
          x={level}
          xstep="1"
          xmax="10"
          onChange={update}
          styles={{
            track: {
              backgroundColor: "blue",
              width: "100%",
            },
            active: {
              backgroundColor: "red",
            },
            thumb: {
              width: 20,
              height: 20,
            },
          }}
        />
      </div>
    </>
  );
};

export default Trait;
