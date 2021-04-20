import React, { useRef, useState, useCallback } from "react";

type IProps = {
  size?: number;
  step?: number;
  value?: number;
  range?: number[];
  onChange?(value: number): any;
};

const Slider: React.FC<IProps> = ({
  value: valueProps,
  step = 0.1,
  range = [0, 100],
  onChange: onChangeProps,
}) => {
  const [valueState, setValueState] = useState(1);
  const barElement = useRef<HTMLDivElement>();

  const onChange = useCallback((...args) => {
    onChangeProps(...args);
  }, [valueProps, valueState])

  function getValue() {
    return valueProps !== undefined ? valueProps : valueState;
  }

  function setValue(value) {
    if (value > range[1]) {
      value = range[1];
    }

    if (value < range[0]) {
      value = range[0];
    }

    if (typeof onChange === "function") {
      onChange(value);
    }

    if (valueProps === undefined) {
      setValueState(value);
    }
  }

  function getOffset() {
    const value = getValue();
    const offset = (size / (range[1] - range[0])) * (value - range[0]);
    return offset;
  }

  function onClick(type: "plus" | "minus") {
    const value = getValue();
    let newValue = value + (type === "plus" ? step : -step);

    // if (newValue > range[1]) {
    //   newValue = range[1];
    // }
    // if (newValue < range[0]) {
    //   newValue = range[0];
    // }

    setValue(newValue);
  }

  function onMouseDown(e: React.MouseEvent) {
    const start = barElement.current.getBoundingClientRect().left;
    const current = e.pageX;
    const delta = current - start;
    const value = ((range[1] - range[0]) * delta) / size + range[0];

    setValue(value);
    removeEvents();
    addEvents();
  }

  function onMouseMove(e: MouseEvent) {
    const start = barElement.current.getBoundingClientRect().left;
    const current = e.pageX;
    const delta = current - start;
    const value = ((range[1] - range[0]) * delta) / size + range[0];

    setValue(value);
  }

  function onMouseUp(e) {
    removeEvents();
  }

  function addEvents() {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  }

  function removeEvents() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  }

  return (
    <div className="slider">
      <i>-</i>
      <div className="bar" style={{ width: size }} ref={barElement} onMouseDown={onMouseDown}>
        <div className="outline">
          <div className="inline"></div>
        </div>
        <div className="ball" style={{ transform: `translateX(${getOffset()}px)` }}></div>
      </div>
      <i>+</i>
    </div>
  );
};

export default Slider;
