import React, { useState } from "react";
import Check from "./Check";

const jangdanList = [
  [0, "굿거리"],
  [1, "세마치"],
  [2, "자진모리"],
  [3, "중중모리"],
  [4, "휘모리"],
];

function Main() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="div-main-section">
      <div className="div-main-jangdan-section Body1">
        {jangdanList.map((jangdan) => (
          <button
            className={
              jangdan[0] === selected
                ? "outlined-black-button-selected H2"
                : "outlined-black-button H2"
            }
            onClick={() => setSelected(jangdan[0])}
          >
            {jangdan[1]}
          </button>
        ))}
        <div
          className="Body1"
          style={{ textAlign: "center", marginTop: "20px" }}
        >
          장단을 선택해주세요!
        </div>
      </div>
      <Check jangdan={jangdanList[selected]} />
    </div>
  );
}

export default Main;
