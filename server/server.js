const express = require("express");
const app = express();
const port = 3030;
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.post("/checkJanggu", (req, res) => {
  const posesString = req.body.posesString;
  const fs = require("fs");
  // 파일에 JSON 데이터 저장
  fs.writeFile("janggu_poses.json", posesString, (err) => {
    if (err) throw err;
    console.log("JSON 데이터가 파일에 저장되었습니다.");
  });

  const jangdan = req.body.jangdan;
  console.log(jangdan);
  // console.log(posesString);
  const { spawn } = require("child_process");

  const result_01 = spawn("C:\\Program Files\\Python39\\python", [
    "check_jangdan.py",
    // "check_sound.py",
    jangdan,
  ]);

  console.log("체크 시작");

  let outputData = "";
  result_01.stdout.on("data", (data) => {
    outputData += data.toString();
    outputData = outputData.replace("\r\n", "");
    outputData = outputData.replace(/'/g, '"');
  });

  result_01.on("close", (ret) => {
    if (!ret) {
      // 성공
      console.log(outputData);
      res.send({ is_success: true, result: JSON.parse(outputData) });
      console.log("체크 끝");
      setTimeout(function () {}, 2000);

      console.log("wav 삭제 시작");
      var fs = require("fs"); // 다운로드된 파일 경로 (개인 pc 경로에 맞게 수정해줘야됨)
      fs.unlink(`C:\\Users\\82109\\Downloads\\janggu_audio.wav`, (err) => {
        if (err) console.log(err);
        else {
          console.log("wav 삭제 끝");
        }
      });
      fs.unlink(`janggu_poses.json`, (err) => {
        if (err) console.log(err);
        else {
          console.log("json 삭제 끝");
        }
      });
    } else {
      // 실패
      console.error("Error");
      res.send({ is_success: false });
      console.log("wav 삭제 시작");
      var fs = require("fs"); // 다운로드된 파일 경로 (개인 pc 경로에 맞게 수정해줘야됨)
      fs.unlink(`C:\\Users\\82109\\Downloads\\janggu_audio.wav`, (err) => {
        if (err) console.log(err);
        else {
          console.log("wav 삭제 끝");
        }
      });
      fs.unlink(`janggu_poses.json`, (err) => {
        if (err) console.log(err);
        else {
          console.log("json 삭제 끝");
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Connect at http://localhost:${port}`);
});
