
const btns1 = document.querySelector(".first-three").children;
const btns2 = document.querySelector(".second-three").children;

const svgs = document.querySelectorAll(".svgs");
const even_odd = document.querySelectorAll(".choose-bet");


const place_bet = document.querySelector(".place-bet-btn");
const amount = document.querySelector(".amount-h2");
const plus = document.querySelector(".plus-button");
const minus = document.querySelector(".minus-button");

const balance = document.querySelector(".balance");
const timeBar = document.querySelector(".time-bar");

const menu_container = document.querySelector(".menu-container");

var choose = [];  


for (let x = 0; x < 6; x++){
  let b = svgs[x];
  let val = x+1;
 
  b.addEventListener("click", function(){
    if (x == 5 || x == 2){

      if (menu_container.classList.contains("menu-visible")){
        menu_container.classList.add("menu-hide");
        menu_container.classList.remove("menu-visible");
      } 
    }
    if (!choose.includes(val)) {
      if (choose.includes(7)) removeElement(7, choose);
      if (choose.includes(8)) removeElement(7, choose);
        choose.push(val);
      }
     else {
      removeElement(val, choose);
    }
    fillSelected();
  });
}
// for (let x = 0; x < 2; x++){
//   let b = even_odd[x];
//   let val = x + 7;
//   b.addEventListener("click", function(){
//     choose.length = 0;
//     if (!choose.includes(val)){
//       fillSelected();
//       choose.push(val);
//       if (choose.includes(7)){
//         for (let odd = 0; odd < 6; odd += 2)
//         svgs[odd].classList.add("svgs-clicked");
//       }
//       else {
//         for (let even = 1; even < 6; even += 2)
//         svgs[even].classList.add("svgs-clicked");
//       }
//     }
//     else {
//       removeElement(val.toString(), choose);
//     }
      
//   })
// }
function resetSelectedBets(){
    for (let x = 0; x < 6; x++) {
        if (svgs[x].classList.contains("svgs-clicked"))
        svgs[x].classList.remove("svgs-clicked")
    }
}


place_bet.addEventListener("click", async (e) => {

  if (menu_container.classList.contains("menu-visible")){
    menu_container.classList.add("menu-hide");
    menu_container.classList.remove("menu-visible");
  } 
    if (choose.length > 0 && !choose.includes(undefined)){
  var result = choose.map(function (x) {
    return parseInt(x, 10);
  });

  setTimeout(getAmount, 5000);
  disableBet();
  choose.length = 0;
  resetSelectedBets();
  const rawResponse = await fetch("/", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      id: "2017926772",
      gameId: gameId,
      choose: result,
      amount: parseInt(amount.innerText),
    }),
  }).then(result)
  .then(data => {
    if(data.success){
         getAmount()
  }
  });
}
});

function removeElement(element, arr) {
  if (arr.includes(element)) {
    const pos = arr.indexOf(element);
    arr.splice(pos, 1);
  }
}
function fillSelected(){
  for (let y = 0; y < 6; y++) {
    if (choose.includes((y+1))) {
      svgs[y].classList.add("svgs-clicked");
    } else {
      svgs[y].classList.remove("svgs-clicked");
    }
  }
}
plus.addEventListener("click", (e) => {
  amount.innerText = parseInt(amount.innerText) + 5;
});

minus.addEventListener("click", (e) => {
  if (amount.innerText > 5) amount.innerText -= 5;
});

function enableButton() {
  place_bet.disabled = false;
  place_bet.classList.remove("disable");
  place_bet.style.backgroundColor = "#63A95A";
}

function disableBet(){
  place_bet.disabled = true;
  place_bet.classList.add("disable");
  place_bet.style.backgroundColor = "#313B43";
}