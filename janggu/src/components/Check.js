import React, { useState } from "react";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import "audio-react-recorder/dist/index.css";
import PoseNet from "react-posenet";

import 굿거리 from "../asset/굿거리.png";
import 세마치 from "../asset/세마치.png";
import 자진모리 from "../asset/자진모리.png";
import 중중모리 from "../asset/중중모리.png";
import 휘모리 from "../asset/휘모리.png";

export default function Check({ jangdan }) {
  const [recordState, setRecordState] = useState(null);
  const [audioData, setAudioData] = useState(null);

  const start = () => {
    setRecordState(RecordState.START);
  };

  const stop = () => {
    setRecordState(RecordState.STOP);
  };

  const onStop = (data) => {
    setAudioData(data);
    console.log("onStop: audio data", data);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = data.url;
    a.download = "sound.wav";

    document.body.appendChild(a);

    a.click();

    setTimeout(function () {
      // 다운로드가 안되는 경우 방지
      document.body.removeChild(a);
    }, 100);
  };

  const [posesString, setPosesString] = useState([]);

  return (
    <div className="div-check-section">
      <div className="div-check-jangdan-section">
        {jangdan[1] === "굿거리" && (
          <img
            src={굿거리}
            alt=""
            style={{ height: "120px", objectFit: "contain" }}
          />
        )}
        {jangdan[1] === "세마치" && (
          <img
            src={세마치}
            alt=""
            style={{ height: "120px", objectFit: "contain" }}
          />
        )}
        {jangdan[1] === "자진모리" && (
          <img
            src={자진모리}
            alt=""
            style={{ height: "120px", objectFit: "contain" }}
          />
        )}
        {jangdan[1] === "중중모리" && (
          <img
            src={중중모리}
            alt=""
            style={{ height: "120px", objectFit: "contain" }}
          />
        )}
        {jangdan[1] === "휘모리" && (
          <img
            src={휘모리}
            alt=""
            style={{ height: "120px", objectFit: "contain" }}
          />
        )}
      </div>
      <div
        className="div-check-jangdan-section"
        style={{ height: "100%", paddingTop: 0 }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <PoseNet
            style={{ height: "400px" }}
            inferenceConfig={{ decodingMethod: "single-person" }}
            onEstimate={(poses) => {
              setPosesString(JSON.stringify(poses));
            }}
          />
          <div className="div-check-button-section">
            <button
              className="main-orange-button H2"
              id="record"
              onClick={start}
              disabled={recordState === RecordState.START}
            >
              녹음 시작
            </button>
            <button
              className="main-orange-button H2"
              id="stop"
              onClick={stop}
              disabled={
                recordState === null || recordState === RecordState.STOP
              }
            >
              녹음 종료
            </button>
          </div>
        </div>
        {/* {audioData && (
          <audio
            style={{ width: "400px" }}
            id="audio"
            controls
            src={audioData ? audioData.url : null}
          ></audio>
        )} */}
        <AudioReactRecorder
          state={recordState}
          onStop={onStop}
          backgroundColor="gold"
          canvasWidth={0}
          canvasHeight={0}
        />
        <div style={{ paddingTop: "20px" }}>
          <p>{posesString}</p>
        </div>
      </div>
    </div>
  );
}
