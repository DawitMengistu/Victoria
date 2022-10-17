const one_menu_list = document.querySelectorAll(".one-menu-list");
const time_indicator_text = document.querySelector(".time-indicator-text");

const menu_btn = document.querySelector(".menu-list");
const menu_elements = document.querySelector(".menu-elements")

const setting = document.querySelector(".ticket");
const gear = document.querySelector(".bi-gear-fill");



setting.addEventListener("click",()=>{
    menu_container.classList.toggle("menu-hide");
    menu_container.classList.toggle("menu-visible");
    gear.classList.toggle("rotate");
})
