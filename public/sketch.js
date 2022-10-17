let gifs = [];
let one = 0;
let two = 0;
let surprize = 5;
let w, h;
let win = 1;
let done = true;
var socket = io();
let go = false;
var gameId;
let getTime = 0;

let s, p, screenWidth = screen.width;

function setup() {
  for (let x = 1; x < 8; x++) {
    gifs[x] = loadImage("img/" + x + ".gif");
  }
  // createCanvas(displayWidth,200);
  var cnv = createCanvas(displayWidth, 200);
  cnv.parent("myContainer");
  w = width;
  h = height;

  fetch("http://localhost:3000/result")
    .then((response) => response.json())
    .then((data) => {
      win = parseInt(data.history[data.history.length -1 ]);
      gameId = data.game.toString();
    });
  getAmount();
  imageMode(CENTER);
   s = Math.round(millis() / 1000);
   p = s;
}

function draw() {
  let time = new Date();
  let second = time.getSeconds();

  background(40, 46, 51);

  socket.on("get", function (msg) {
    getTime = 0;
    removeTickets();
    go = true;
    gameId = msg[1].toString();
    win = parseInt(msg[0]);
  });
    socket.on("getTime", function(msg){
    let w =Math.floor(map (msg, 0, 59, 0, 96));
    timeBar.style.width = w + "%";
    
    time_indicator_text.textContent= Math.floor(msg);
  })
  if (!done) {
    drawGame();
  } else if (go == true) {
    one = 0;
    surprize = 0;
    two = 0;
    done = false;
    go = false;
  } else {
    image(gifs[win], w / 2, h / 2, 200, 200);
    gifs[win].setFrame(149);
  }
  // startSecond();
}

function drawGame() {
  if (one < 49) {
    one += 1;
    gifs[7].setFrame(one);
    image(gifs[7], w / 2, h / 2, 200, 200);
  } else if (one < 50) {
    surprize += 1;
    one = 0;
  } else if (two < 149) {
    two += 1;
    gifs[win].setFrame(two);
    image(gifs[win], w / 2, h / 2, 200, 200);
  }
  if (two >= 149) {
    getAmount();
    done = true;
  }
  if (surprize >= 2) {
    one = 50;
  }
}

function getAmount() {
  console.log("Updating your balance");
  const rawResponse = fetch("/amount", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: "2017926772" }),
  })
    .then((response) => response.json())
    .then((data) => {
      balance.innerText = data.amount + " ETB";
      enableButton();
      addTickets();
    });
}



function startSecond() {
  s = Math.round(millis()/100);
  if (p < s) {
    getTime += 1;
    p = s;
  }
  let w =Math.floor(map (getTime, 0, 570, 0, 100));
  timeBar.style.width = w + "%";

  time_indicator_text.textContent= Math.floor(getTime/10);
 
}

function addTickets(){
  const rawResponse = fetch("/ticket", {
    method: "get",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

  })
    .then((response) => response.json())
    .then((data) => {
      d = data["data"][gameId]
      if (d != undefined){
        removeTickets();
      Object.keys(d).forEach((key) => {
        let amount = d[key]["amount"];
        let bet = d[key]["bet"];
        createTicket(amount, bet)

      });
    }
    });
}

function removeTickets(){
  while(menu_btn.firstChild)
    menu_btn.removeChild(menu_btn.firstChild);
}

function createTicket(amount, bet){
  const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
  const path = document.createElementNS("http://www.w3.org/2000/svg", 'path');
  path.setAttribute('d', "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z");
  svg.appendChild(path)
  svg.setAttribute('width', "22px");
  svg.setAttribute('height', "22px");
  svg.setAttribute('viewBox', "0 0 16 16");
  svg.setAttribute('fill', "currentcolor");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg")
  svg.classList.add("bi","bi-ticket-perforated-fill")
  const ticket_icon = document.createElement('div')
  ticket_icon.classList.add("ticket-icon", "all-icons");
  ticket_icon.appendChild(svg);
  const div = document.createElement('div');
  const b = document.createElement('h2')
  b.textContent = "[ " + bet + " ]";

  const divTwo = document.createElement('div')
  divTwo.classList.add("bet-amount")
  const amountH2 = document.createElement("h2")
  amountH2.textContent = amount * 6/bet.length;
  divTwo.appendChild(amountH2);

  div.appendChild(b);
  const one_menu = document.createElement('div')
  one_menu.classList.add("one-menu-list");
  one_menu.appendChild(ticket_icon);
  one_menu.appendChild(div);
  one_menu.appendChild(divTwo)
  menu_btn.appendChild(one_menu);



  

}


{/* <div class="menu-list">
<div class="one-menu-list">
  <div class="ticket-icon all-icons">
    <svg xmlns="http://www.w3.org/2000/svg" width="23px" height="23px" fill="currentColor"
      class="bi bi-ticket-perforated-fill" viewBox="0 0 16 16">
      <path
        d="M0 4.5A1.5 1.5 0 0 1 1.5 3h13A1.5 1.5 0 0 1 16 4.5V6a.5.5 0 0 1-.5.5 1.5 1.5 0 0 0 0 3 .5.5 0 0 1 .5.5v1.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 11.5V10a.5.5 0 0 1 .5-.5 1.5 1.5 0 1 0 0-3A.5.5 0 0 1 0 6V4.5Zm4-1v1h1v-1H4Zm1 3v-1H4v1h1Zm7 0v-1h-1v1h1Zm-1-2h1v-1h-1v1Zm-6 3H4v1h1v-1Zm7 1v-1h-1v1h1Zm-7 1H4v1h1v-1Zm7 1v-1h-1v1h1Zm-8 1v1h1v-1H4Zm7 1h1v-1h-1v1Z" />
    </svg>
  </div>

  <div>
    <h2>Tickets</h2>
  </div>
</div>
</div>  */}



