// import { data } from "../data/data.js";

// console.log(data);

const mainEl = document.querySelector("#main");

// Navigation
const mobileNavBtn = document.querySelector(".mobile-nav-toggle");
const primaryNavigation = document.querySelector("#primary-navigation");
mobileNavBtn.addEventListener("click", function () {
  const visibility = primaryNavigation.getAttribute("data-visible");
  if (visibility === "false") {
    primaryNavigation.setAttribute("data-visible", true);
    mobileNavBtn.setAttribute("aria-expanded", true);
  } else {
    primaryNavigation.setAttribute("data-visible", false);
    mobileNavBtn.setAttribute("aria-expanded", false);
  }
});

// TABS FUNCTIONALITY

function tabsInit(selector) {
  const tabList = selector.querySelector('[role="tablist"]');
  if (tabList) {
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
  }
}

async function getData() {
  const url = "../data/data.json";
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    return json;
  } catch (e) {
    console.log(e.message);
    return null;
  }
}

const data = await getData();

console.log(data);

if (data) {
  // Render Navigation items
  const renderNavigation = (data) => {
    const keys = Object.keys(data);
    keys.forEach((key, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <a
          href="#"
          data-page="${key}"
          class="ff-sans-cond text-white letter-spacing-2 uppercase fs-300"
          ><span aria-hidden="true">0${index + 1}</span>${key}</a
        >
      `;
      primaryNavigation.appendChild(li);
    });
  };
  renderNavigation(data);

  function renderPage(pageName = "home") {
    mainEl.innerHTML = "";
    document.body.className = pageName;

    // Add active class
    primaryNavigation
      .querySelectorAll("li")
      .forEach((li) => li.classList.remove("active"));
    primaryNavigation.querySelector(
      `[data-page="${pageName}"]`
    ).parentElement.className = "active";

    switch (pageName) {
      case "home":
        mainEl.className = "grid-container grid-container--home";
        mainEl.innerHTML = `
          <div>
            <h1 class="text-accent fs-500 ff-sans-cond uppercase letter-spacing-1">
              So, you want to travel to
              <span class="d-block fs-900 ff-serif text-white">Space</span>
            </h1>
            <p>
              Let&apos;s face it; if you want to go to space, you might as well
              genuinely go to outer space and not hover kind of on the edge of it.
              Well sit back, and relax because we&apos;ll give you a truly out of
              this world experience!
            </p>
          </div>
          <div>
            <a
              href="#"
              data-page="destination"
              class="large-button ff-serif uppercase text-dark bg-white"
              >Explore</a
            >
          </div>
        `;
        break;
      case "destination":
        mainEl.className = "grid-container grid-container--destination flow";
        mainEl.innerHTML = `
          <h1 class="numbered-title">
            <span aria-hidden="true">01</span> Pick your destination
          </h1>
        `;
        data[pageName].forEach((dest, index) => {
          const picture = document.createElement("picture");
          picture.id = `${dest.name.toLowerCase()}-image`;
          picture.innerHTML = `
            <source
              srcset="${dest.images.webp}"
              type="image/webp"
            />
            <img
              src="${dest.images.png}
              alt="${dest.name}"
              class="${index === 0 ? "" : "hidden"}"
            />
          `;
          mainEl.appendChild(picture);
        });

        const tabs = document.createElement("div");
        tabs.className = "tab-list underline-indicators flex";
        tabs.setAttribute("role", "tablist");
        tabs.setAttribute("aria-label", "destination list");

        data[pageName].forEach((dest, index) => {
          const destinationName = dest.name.toLowerCase();
          const button = document.createElement("button");
          button.className =
            "uppercase text-accent letter-spacing-2 ff-sans-cond";
          button.setAttribute("aria-selected", index === 0 ? true : false);
          button.setAttribute("role", "tab");
          button.setAttribute("aria-controls", `${destinationName}-tab`);
          button.setAttribute("data-image", `${destinationName}-image`);
          button.setAttribute("tabindex", index === 0 ? 0 : -1);
          button.textContent = dest.name;
          tabs.appendChild(button);
        });

        mainEl.appendChild(tabs);

        data[pageName].forEach((dest, index) => {
          const article = document.createElement("article");
          article.className = `destination-info flow ${
            index !== 0 && "hidden"
          }`;
          article.id = `${dest.name.toLowerCase()}-tab`;
          article.setAttribute("role", "tabpanel");
          article.innerHTML = `
            <h2 class="fs-800 uppercase ff-serif">${dest.name}</h2>
            <p>${dest.description}</p>
            <div class="destination-meta flex">
              <div>
                <h3 class="text-accent fs-200 uppercase">Avg. distance</h3>
                <p class="ff-serif uppercase">${dest.distance}</p>
              </div>
              <div>
                <h3 class="text-accent fs-200 uppercase">Est. travel time</h3>
                <p class="ff-serif uppercase">${dest.travel}</p>
              </div>
            </div>
          `;
          mainEl.appendChild(article);
        });

        break;
      case "crew":
        mainEl.className = "grid-container grid-container--crew flow";
        mainEl.innerHTML = `
          <h1 class="numbered-title">
            <span aria-hidden="true">02</span> Meet your crew
          </h1>
        `;
        const dots = document.createElement("div");
        dots.className = "dot-indicators flex";
        dots.setAttribute("role", "tablist");
        dots.setAttribute("aria-label", "crew member list");

        data[pageName].forEach((member, index) => {
          const role = member.role.split(" ")[0].toLowerCase();
          const button = document.createElement("button");
          button.setAttribute("aria-selected", index === 0 ? true : false);
          button.setAttribute("role", "tab");
          button.setAttribute("aria-controls", `${role}-tab`);
          button.setAttribute("data-image", `${role}-image`);
          button.setAttribute("tabindex", index === 0 ? 0 : -1);
          button.innerHTML = `<span class="sr-only">${member.name}</span>`;
          dots.appendChild(button);
        });
        mainEl.appendChild(dots);
        data[pageName].forEach((member, index) => {
          const article = document.createElement("article");
          article.className = `crew-details flow ${index !== 0 && "hidden"}`;
          article.id = `${member.role.split(" ")[0].toLowerCase()}-tab`;
          article.setAttribute("role", "tabpanel");
          article.setAttribute("tabindex", 0);
          article.innerHTML = `
            <header class="flow flow--space-small">
              <h2 class="fs-600 ff-serif uppercase">${member.role}</h2>
              <p class="fs-700 ff-serif uppercase">${member.name}</p>
            </header>
            <p>
              ${member.bio}
            </p>
          `;
          mainEl.appendChild(article);
        });

        data[pageName].forEach((member, index) => {
          const picture = document.createElement("picture");
          picture.id = `${member.role.split(" ")[0].toLowerCase()}-image`;
          picture.innerHTML = `
            <source
              srcset="${member.images.webp}"
              type="image/webp"
            />
            <img
              src="${member.images.png}
              alt="${member.name}"
              class="${index === 0 ? "" : "hidden"}"
            />
          `;
          mainEl.appendChild(picture);
        });
        break;
      case "technology":
        mainEl.className = "grid-container grid-container--technology flow";
        mainEl.innerHTML = `
          <h1 class="numbered-title">
            <span aria-hidden="true">03</span> Space launch 101
          </h1>       
        `;
        const numberedDots = document.createElement("div");
        numberedDots.className = "number-indicators flex";
        numberedDots.setAttribute("role", "tablist");
        numberedDots.setAttribute("aria-label", "technology list");

        data[pageName].forEach((tech, index) => {
          const techName = tech.name.split(" ")[0].toLowerCase();
          const button = document.createElement("button");
          button.setAttribute("aria-selected", index === 0 ? true : false);
          button.setAttribute("role", "tab");
          button.setAttribute("aria-controls", `${techName}-tab`);
          button.setAttribute("data-image", `${techName}-image`);
          button.setAttribute("tabindex", index === 0 ? 0 : -1);
          button.innerHTML = `${index + 1}<span class="sr-only">${
            tech.name
          }</span>`;
          numberedDots.appendChild(button);
        });
        mainEl.appendChild(numberedDots);

        data[pageName].forEach((tech, index) => {
          const article = document.createElement("article");
          article.className = `technology-details flow ${
            index !== 0 && "hidden"
          }`;
          article.id = `${tech.name.split(" ")[0].toLowerCase()}-tab`;
          article.setAttribute("role", "tabpanel");
          article.setAttribute("tabindex", 0);
          article.innerHTML = `
            <header class="flow flow--space-small">
              <h2 class="fs-600 ff-serif uppercase">The terminology...</h2>
              <p class="fs-700 ff-serif uppercase">${tech.name}</p>
            </header>
            <p>
              ${tech.description}
            </p>
          `;
          mainEl.appendChild(article);
        });
        data[pageName].forEach((tech, index) => {
          const picture = document.createElement("picture");
          picture.id = `${tech.name.split(" ")[0].toLowerCase()}-image`;
          picture.innerHTML = `
            <source
              srcset="${tech.images.portrait}"
              media="(min-width: 68.75em)"
            />
            <img
              src="${tech.images.landscape}"
              alt="${tech.name}"
              class="${index === 0 ? "" : "hidden"}"
            />
          `;
          mainEl.appendChild(picture);
        });
        break;
    }

    tabsInit(mainEl);
  }

  renderPage();

  const links = primaryNavigation.querySelectorAll("a");
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const page = this.dataset.page;
      renderPage(page);
    });
  });
} else {
  document.body.classList.add("flex");
  document.body.style.justifyContent = "center";
  document.body.style.alignItems = "center";
  document.body.textContent = "Unable to load page data.";
}
