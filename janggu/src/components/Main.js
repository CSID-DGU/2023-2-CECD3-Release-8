import React, { useState } from "react";
import Check from "./Check";
import Loading from "./Loading";
import { useEffect } from "react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import Guide from "./Guide";
import sample from "../sample.json";
const jangdanList = [
  [
    0,
    "굿거리",
    ["덩", " ", "덕", "쿵", "덕", "쿵", "덩", " ", "덕", "쿵", "덕", "쿵"],
    10,
  ],
  [1, "세마치", ["덩", " ", " ", "덩", " ", "덕", "쿵", "덕", " "], 5],
  [
    2,
    "자진모리",
    ["덩", " ", "덕", "쿵", "덕", " ", "쿵", " ", "덕", "쿵", "덕", " "],
    8,
  ],
  [
    3,
    "중중모리",
    ["덩", " ", "덕", "쿵", "덕", "덕", "쿵", "쿵", "덕", "쿵", " ", "쿵"],
    10,
  ],
  [4, "휘모리", ["덩", " ", "덕", "덕", "쿵", "덕", "쿵", " "], 6],
];

function getMotion(num) {
  if (num === -1) return "❌";
  if (num === 0) return "❌";
  if (num === 1) return "⭕";
}

function getSound(num) {
  if (num === -1) return " ";
  if (num === 0) return "덕";
  if (num === 1) return "덩";
  if (num === 2) return "쿵";
}

function Main() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [selected, setSelected] = useState(0);
  const [result, setResult] = useState(sample);
  const [isLoading, setIsLoading] = useState(false);
  const [sound, setSound] = useState([]);
  const [motion, setMotion] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [acc, setAcc] = useState(0);
  useEffect(() => {
    setResult(null);
    setIsLoading(false);
    setSound([]);
  }, [selected]);

  useEffect(() => {
    // 1. 피크값 적거나 여러개일때
    if (result)
      if (jangdanList[selected][3] - (result.peaks.length - 1) > 2) {
        window.alert("조용한 곳에서 다시 연주해주세요!");
      } else {
        // 2. 모션이랑 소리 정오 차이 3개 이상일 때
        // let diff = 0;
        // for (let i = 0; i < sound.length; i++) if (sound[i] !== motion[i]) diff++;
        // if (diff > 2) window.alert("조용한 곳에서 다시 연주해주세요!");

        setMotion([]);
        let i2 = 0;
        let arr2 = [];
        let cnt2 = 0;
        result &&
          jangdanList[selected][2].forEach((s) => {
            if (s === " ") arr2.push(" ");
            else {
              arr2.push(getMotion(result.motion[i2]));
              if (getMotion(result.motion[i2]) === "⭕") cnt2++;
              i2++;
            }
          });
        setMotion(arr2);

        setSound([]);
        let i = 0;
        let arr = [];
        let cnt = 0;
        result &&
          jangdanList[selected][2].forEach((s) => {
            if (s === " ") arr.push(" ");
            else {
              arr.push(
                getSound(result.sound[i]) === s
                  ? "⭕"
                  : s === "쿵" && result.motion[i] === 1
                  ? "⭕"
                  : "❌"
              );
              i++;
              if (arr[arr.length - 1] === "⭕") cnt++;
            }
          });
        setSound(arr);
      }
  }, [result]);

  useEffect(() => {
    setFeedback([]);
    let final_arr = [];
    let cnt3 = 0;
    let cnt4 = 1;
    for (let i = 0; i < sound.length; i++) {
      if (sound[i] === "⭕" && motion[i] === "⭕") {
        cnt3++;
        final_arr.push({ result: "⭕", comment: null, id: cnt4 });
      }
      // 3. 모션 x, 소리 o => '(덩 or 덕 or 쿵)을 연주할 때는 ~~해야 해요!'
      else if (sound[i] === "⭕" && motion[i] === "❌")
        final_arr.push({
          result: "❌",
          comment:
            "소리는 맞는데 자세가 바르지 않아요.\n'?'를 클릭하여 정확한 연주법을 확인해주세요.",
          id: cnt4,
        });
      // 4. 모션 o, 소리 x => '자세는 맞는데 (덩 or 덕 or 쿵) 소리가 정확하지 않아요. 다시 연주해주세요!'
      else if (
        jangdanList[selected][2][i] !== "쿵" &&
        motion[i] === "⭕" &&
        sound[i] === "❌"
      )
        final_arr.push({
          result: "❌",
          comment: "자세는 맞는데 소리가 명확하지 않아요!\n다시 연주해보세요.",
          id: cnt4,
        });
      else if (motion[i] === "❌" && sound[i] === "❌")
        final_arr.push({
          result: "❌",
          comment: "다른 음을 연주한 것 같아요!\n다시 연주해보세요.",
          id: cnt4,
        });
      else final_arr.push({ result: " ", comment: null, id: cnt4 });

      if (sound[i] !== " ") cnt4++;
    }
    setFeedback(final_arr);
    setAcc(((cnt3 / jangdanList[selected][3]) * 100).toFixed(2));
    // if (acc < 30) window.alert("조용한 곳에서 다시 연주해주세요!");
  }, [sound, motion]);

  console.log(feedback);
  return (
    <div className="div-main-section">
      <Check
        jangdan={jangdanList[selected]}
        setResult={setResult}
        setIsLoading={setIsLoading}
      />
      <div className="div-main-right-section">
        <div className="div-main-jangdan-section Body1">
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
          ) : result ? (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <div className="div-main-sound-list">
                {jangdanList[selected][2].map((s, idx) => (
                  <t className="Body2">{s}</t>
                ))}
              </div>
              <div className="div-main-sound-list">
                {feedback.length > 0 &&
                  feedback.map((fb) => <t className="Body2">{fb.result}</t>)}
              </div>
              <div
                className="Body2"
                style={{
                  width: "100%",
                  textAlign: "left",
                  marginTop: "10px",
                }}
              >
                정확도: <t className="H4">{acc}%</t>
              </div>
              <div className="div-main-feedback-section">
                {feedback.length > 0 &&
                  feedback.map(
                    (fb, idx) =>
                      fb.comment && (
                        <t className="Body2">
                          [{fb.id}번째 소리]
                          <br />
                          {fb.comment}
                        </t>
                      )
                  )}
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                position: "relative",
                height: "100%",
              }}
            >
              1. 장단을 선택해주세요.
              <br />
              <br />
              2. 가이드에 맞게 장구를 위치해주세요.
              <br />
              <br />
              3. 시작 버튼을 누르고 대기해주세요.
              <br />
              (타이머가 끝나면 연주를 시작해주세요.)
              <br />
              <br />
              4. 종료 버튼을 누르면 평가가 시작됩니다.
            </div>
          )}
          <AiOutlineQuestionCircle
            size={24}
            className="button-guide"
            onClick={() => setIsGuideOpen(!isGuideOpen)}
          />
        </div>
      </div>
      {isGuideOpen && <Guide setIsOpen={setIsGuideOpen} />}
    </div>
  );
}

export default Main;
