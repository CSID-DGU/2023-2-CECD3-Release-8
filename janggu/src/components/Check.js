import React, { useState } from "react";

import AudioReactRecorder, { RecordState } from "audio-react-recorder";
import "audio-react-recorder/dist/index.css";
import PoseNet from "react-posenet";

import 굿거리 from "../asset/굿거리.png";
import 세마치 from "../asset/세마치.png";
import 자진모리 from "../asset/자진모리.png";
import 중중모리 from "../asset/중중모리.png";
import 휘모리 from "../asset/휘모리.png";
import 장구맨 from "../asset/장구맨.png";

export default function Check({ jangdan, setResult, setIsLoading }) {
  const [recordState, setRecordState] = useState(null);
  const [audioData, setAudioData] = useState(null);
  const [posesString, setPosesString] = useState([]);
  const [countdown, setCountdown] = useState(5);
  const [isCountdown, setIsCountdown] = useState(false);
  const [startTime, setStartTime] = useState();

  const start = () => {
    setRecordState(RecordState.START);
    setStartTime(window.performance.now());
    setPosesString([]);
    setIsCountdown(true);
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
      setIsCountdown(false);
    }, 5000);
  };

  const stop = () => {
    setRecordState(RecordState.STOP);
    console.log(posesString);
  };

  const checkJanggu = () => {
    setIsLoading(true);
    const post = {
      posesString: JSON.stringify(posesString),
      jangdan: jangdan[0],
    };
    fetch("http://localhost:3030/checkJanggu", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(post),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.is_success) {
          setResult(json.result);
          setIsLoading(false);
        } else {
          window.alert("다시 녹음해주세요.");
          setIsLoading(false);
        }
      });
  };

  const onStop = (data) => {
    setCountdown(5);

    setAudioData(data);
    console.log("onStop: audio data", data);

    var a = document.createElement("a");
    a.style = "display: none";
    a.href = data.url;
    a.download = "janggu_audio.wav";

    document.body.appendChild(a);

    a.click();

    setTimeout(function () {
      // 다운로드가 안되는 경우 방지
      document.body.removeChild(a);
    }, 100);

    checkJanggu();
  };

  const savePosesData = (poses) => {
    let re =
      poses[0] &&
      poses[0].keypoints.filter((p) => p.part === "rightElbow")[0]?.position; //rightElbow
    let rw =
      poses[0] &&
      poses[0].keypoints.filter((p) => p.part === "rightWrist")[0]?.position; //rightWrist
    let le =
      poses[0] &&
      poses[0].keypoints.filter((p) => p.part === "leftElbow")[0]?.position; //leftElbow
    let lw =
      poses[0] &&
      poses[0].keypoints.filter((p) => p.part === "leftWrist")[0]?.position; //leftWrist

    const new_pose = [
      {
        time: window.performance.now() - startTime,
        re: re,
        rw: rw,
        le: le,
        lw: lw,
      },
    ];

    // 녹음이 시작된 후부터 좌표값 저장
    recordState === RecordState.START &&
      setPosesString([...posesString, new_pose]);
  };

  return (
    <div className="div-check-section">
      <div className="div-show-jangdan-section">
        {jangdan[1] === "굿거리" && <img src={굿거리} alt="" />}
        {jangdan[1] === "세마치" && <img src={세마치} alt="" />}
        {jangdan[1] === "자진모리" && <img src={자진모리} alt="" />}
        {jangdan[1] === "중중모리" && <img src={중중모리} alt="" />}
        {jangdan[1] === "휘모리" && <img src={휘모리} alt="" />}
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
            position: "relative",
          }}
        >
          <PoseNet
            style={{ height: "100%" }}
            inferenceConfig={{ decodingMethod: "single-person" }}
            onEstimate={(poses) => savePosesData(poses)}
            // frameRate={10}
          />
          {isCountdown ? (
            <div className="div-countdown">{countdown}</div>
          ) : (
            recordState !== RecordState.START && (
              <img src={장구맨} alt="" className="img-guide" />
            )
          )}
        </div>
      </div>
      <div
        className="div-check-button-section"
        style={{ position: "relative" }}
      >
        <button
          className="outlined-black-button H3"
          id="record"
          onClick={start}
          disabled={recordState === RecordState.START}
        >
          시작
        </button>
        <button
          className="outlined-black-button H3"
          id="stop"
          onClick={stop}
          disabled={recordState === null || recordState === RecordState.STOP}
        >
          종료
        </button>
        <div
          style={{
            position: "absolute",
            right: 10,
            display: "flex",
            gap: "10px",
          }}
        >
          {/* {audioData && (
            <audio
              style={{ width: "300px", height: "40px" }}
              id="audio"
              controls
              src={audioData ? audioData.url : null}
            ></audio>
          )} */}
          <AudioReactRecorder
            state={recordState}
            onStop={onStop}
            backgroundColor="#f8f8f8"
            foregroundColor="#ff7a00"
            canvasWidth={100}
            canvasHeight={42}
          />
        </div>
      </div>
    </div>
  );
}
