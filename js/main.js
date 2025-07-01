import { data } from "../data/data.js";

console.log(data);

const mobileNavBtn = document.querySelector(".mobile-nav-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
mobileNavBtn.addEventListener("click", function () {
  const visibility = primaryNavigation.getAttribute("data-visible");
  console.log(typeof visibility);
  if (visibility === "false") {
    primaryNavigation.setAttribute("data-visible", true);
    mobileNavBtn.setAttribute("aria-expanded", true);
  } else {
    primaryNavigation.setAttribute("data-visible", false);
    mobileNavBtn.setAttribute("aria-expanded", false);
  }
});
