import React, { useState } from "react";
import Check from "./Check";
import Loading from "./Loading";
import { useEffect } from "react";

const jangdanList = [
  [
    0,
    "굿거리",
    ["덩", " ", "덕", "쿵", "덕", "쿵", "덩", " ", "덕", "쿵", "덕", "쿵"],
  ],
  [1, "세마치", ["덩", " ", " ", "덩", " ", "덕", "쿵", "덕", " "]],
  [
    2,
    "자진모리",
    ["덩", " ", "덕", "쿵", "덕", " ", "쿵", " ", "덕", "쿵", "덕", " "],
  ],
  [
    3,
    "중중모리",
    ["덩", " ", "덕", "쿵", "덕", "덕", "쿵", "쿵", "덕", "쿵", " ", "쿵"],
  ],
  [4, "휘모리", ["덩", " ", "덕", "덕", "쿵", "덕", "쿵", " "]],
];

function getSound(num) {
  if (num === -1) return " ";
  if (num === 0) return "덕";
  if (num === 1) return "덩";
  if (num === 2) return "쿵";
}

function Main() {
  const [selected, setSelected] = useState(0);
  // const [result, setResult] = useState(null);
  const [result, setResult] = useState({
    peaks: [40, 77, 95, 111, 126, 146, 163, 181, 197, 231, 291],
    sound: [1, 0, 2, 0, 0, 2, 2, 0, 2, 2],
    acc: 100,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState([]);

  useEffect(() => {
    setResult(null);
    setIsLoading(false);
    setSound([]);
  }, [selected]);

  useEffect(() => {
    setSound([]);
    let i = 0;
    let arr = [];
    result &&
      jangdanList[selected][2].forEach((s) => {
        if (s === " ") arr.push(" ");
        else {
          arr.push(getSound(result.sound[i]));
          i++;
        }
      });
    setSound(arr);
  }, [result]);

  return (
    <div className="div-main-section">
      <Check
        jangdan={jangdanList[selected]}
        setResult={setResult}
        setIsLoading={setIsLoading}
      />
      <div className="div-main-right-section">
        <div className="div-main-jangdan-section Body1">
          <div
            className="Body2"
            style={{ textAlign: "center", marginBottom: "10px" }}
          >
            장단을 선택해주세요.
          </div>
          {jangdanList.map((jangdan) => (
            <button
              className={
                jangdan[0] === selected
                  ? "outlined-black-button-selected H3"
                  : "outlined-black-button H3"
              }
              style={{ borderRadius: "20px" }}
              onClick={() => setSelected(jangdan[0])}
            >
              {jangdan[1]}
            </button>
          ))}
        </div>
        <div className="div-main-result-section">
          {isLoading ? (
            <Loading />
          ) : (
            result && (
              <>
                <div className="div-main-sound-list">
                  {jangdanList[selected][2].map((s, idx) => (
                    <t className="Body2">{s}</t>
                  ))}
                </div>
                <div className="div-main-sound-list">
                  {sound.length > 0 &&
                    sound.map((s, idx) => (
                      <t
                        className="Body2"
                        style={{
                          color:
                            s === jangdanList[selected][2][idx]
                              ? "#ff7a00"
                              : "rgb(150, 150, 150)",
                        }}
                      >
                        {s}
                      </t>
                    ))}
                </div>
                {/* <div className="div-main-sound-list">
                  {jangdanList[selected][2].map((s, idx) => (
                    <t className="Body2">{s !== " " && "O"}</t>
                  ))}
                </div> */}
                <div
                  className="Body2"
                  style={{
                    width: "100%",
                    textAlign: "left",
                    marginTop: "10px",
                  }}
                >
                  정확도: <t className="H4">{result.acc}%</t>
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Main;
