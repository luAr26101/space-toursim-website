// TABS

const tabList = document.querySelector('[role="tablist"]');
const tabs = tabList.querySelectorAll('[role="tab"]');

let tabFocus = 0;
const changeTabFocus = (e) => {
  const keydownLeft = 37;
  const keydownRight = 39;
  // change the tabindex of the current tab to -1
  if (e.keyCode === keydownLeft || e.keyCode === keydownRight) {
    tabs[tabFocus].setAttribute("tabindex", -1);

    if (e.keyCode === keydownRight) {
      tabFocus === tabs.length - 1 ? (tabFocus = 0) : (tabFocus += 1);
    } else if (e.keyCode === keydownLeft) {
      tabFocus === 0 ? (tabFocus = tabs.length - 1) : (tabFocus -= 1);
    }
    tabs[tabFocus].setAttribute("tabindex", 0);
    tabs[tabFocus].focus();
  }
};

const hideContent = (parent, selector) => {
  parent
    .querySelectorAll(selector)
    .forEach((item) => item.classList.add("hidden"));
};

const showContent = (parent, selector) => {
  parent.querySelector(selector).classList.remove("hidden");
};

const changeTabPanel = (e) => {
  e.preventDefault();
  const targetTab = e.target;
  const targetPanel = targetTab.getAttribute("aria-controls");
  const targetImage = targetTab.dataset.image;
  const tabContainer = targetTab.parentNode;
  const mainContainer = tabContainer.parentNode;

  tabContainer
    .querySelector('[aria-selected="true"]')
    .setAttribute("aria-selected", false);
  targetTab.setAttribute("aria-selected", true);

  // Show correct panel
  hideContent(mainContainer, '[role="tabpanel"]');
  showContent(mainContainer, `#${targetPanel}`);

  // Show correct image
  hideContent(mainContainer, "picture img");
  showContent(mainContainer, `#${targetImage} img`);
};

tabList.addEventListener("keydown", changeTabFocus);
tabs.forEach((tab) => {
  tab.addEventListener("click", changeTabPanel);
});
