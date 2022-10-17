const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const port = process.env.PORT || 3000;
const crypto = require("crypto");

const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const firebaseConfig = {
  apiKey: "AIzaSyDI4YOK3fJVTxGir2C63K4Qc5gOy6g2Wps",
  authDomain: "api-357310.firebaseapp.com",
  projectId: "youtubeapi-357310",
  storageBucket: "youtubeapi-357310.appspot.com",
  messagingSenderId: "752520913653",
  appId: "1:752520913653:web:0e5b238db9b83b5e441bbc",
  measurementId: "G-XTCFLQSLWN",
};
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const firebase = require("firebase/firestore");
const { doc, setDoc, getDoc } = require("firebase/firestore");

const { collection, query, where, getDocs } = require("firebase/firestore");
const { type } = require("os");
const { Console } = require("console");

var ans = 2;
var history = [1];
var date = "1665387387230";
var game = date;
var p,
  s,
  getTime = 0;

app.use(express.json());
app.use(express.static("public"));

function random() {
  ans = crypto.randomInt(1, 6);
  return ans;
}
setInterval(updateTime, 100);
setInterval(send, 60000);
async function send() {
  ans = random();
  history.length = 0;
  getTime = 0;
  history.push(ans);
  let pr_date = date;
  date = Date.now().toString();
  game = date;
  io.emit("get", [ans, date]);
  calculate(pr_date);
}

async function calculateBet(gameId1, win) {
  const querySnapshot = await getDocs(collection(db, "Users"));

  querySnapshot.forEach((Doc) => {
    const q = Doc.data()["history"][gameId1];
    if (q != undefined) {
      let pr_amount = Doc.data()["userInfo"]["amount"];
      Object.keys(q).forEach((key) => {
        let id = Doc.id;
        let bet_amount = Doc.data()["history"][gameId1][key]["amount"];
        let bet = Doc.data()["history"][gameId1][key]["bet"];
        let betLen = bet.length;
        let bet_num = bet[0];
        if (bet_num > 6) {
          if (betLen == 1) {
            if (win % 2 == 0 && bet_num) {
              pr_amount += 2 * bet_amount;
            } else if (win % 2 != 0 && bet_num == 7) {
              pr_amount += 2 * bet_amount;
            }
          }
        } else if (bet.includes(win)) {
          pr_amount += (6 / betLen) * bet_amount;
        }

        const cityRef = doc(db, "Users", id);
        setDoc(
          cityRef,
          { userInfo: { amount: parseInt(pr_amount) } },
          { merge: true }
        );
      });
    }
  });
}

function calculate(pr_date) {
  calculateBet(pr_date, ans);
}

s = new Date().getSeconds();
p = s;
function updateTime() {
  s = new Date().getSeconds();
  if (p != s) {
    getTime += 1;
    p = s;
  }

  io.emit("getTime", getTime);
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/result", (req, res) => {
  res.json({ history, game });
});

app.post("/amount", async (req, res) => {
  const { id } = req.body;

  const docRef = doc(db, "Users", id);
  const docSnap = await getDoc(docRef);

  let amount = docSnap.data()["userInfo"]["amount"];
  res.json({ amount });
});

app.get("/ticket", async (req, res) => {
  // const { id } = req.body;
  let id = "2017926772";
  const docRef = doc(db, "Users", id);
  const docSnap = await getDoc(docRef);
  let data = docSnap.data()["history"];
  res.json({ data });
});

app.post("/", async (req, res) => {
  {
    const { id, choose, gameId, amount } = req.body;

    const docRef = doc(db, "Users", id);
    const docSnap = await getDoc(docRef);

    let exist = false;

    if (docSnap.exists()) {
      let pr_amount = docSnap.data()["userInfo"]["amount"];

      if (pr_amount >= amount) exist = true;
      let new_amont = pr_amount - amount;
      if (exist) {
        const cityRef = doc(db, "Users", id);
        setDoc(cityRef, { userInfo: { amount: new_amont } }, { merge: true });
      }
    } else {
      console.log("No such document!");
    }
    if (exist) {
      try {
        const cityRef = doc(db, "Users", id);
        setDoc(
          cityRef,
          {
            history: {
              [gameId]: {
                [Date.now()]: {
                  amount: amount,
                  bet: choose,
                },
              },
            },
          },
          { merge: true }
        );
      } catch (e) {
        console.log(e);
      }
    }
    res.json({ success: true });
  }
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
