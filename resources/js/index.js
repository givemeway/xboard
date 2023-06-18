// Array.from(magazines).forEach((ele) => console.log(ele));

async function fetch_rss_topics(topicURL) {
  const url = "https://api.rss2json.com/v1/api.json?rss_url=" + topicURL;
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

const topics = [
  "https://flipboard.com/topic/sports.rss`",
  "https://flipboard.com/topic/space.rss",
  "https://flipboard.com/topic/sports.rss",
];

function createCarouselInner(feeds) {
  let divInner = document.createElement("div");
  divInner.classList.add("carousel-inner");
  feeds.forEach((feed, idx, arr) => {
    let carouselItem = document.createElement("div");
    if (idx === 0) {
      carouselItem.classList.add("carousel-item", "active");
    } else {
      carouselItem.classList.add("carousel-item");
    }
    let card = createCard(feed);
    carouselItem.appendChild(card);
    divInner.appendChild(carouselItem);
  });
  return divInner;
}

function createCard(item) {
  let divOuter = document.createElement("div");
  divOuter.classList.add("card");
  let img = document.createElement("img");
  img.classList.add("card-img-top");
  img.setAttribute("alt", "...");
  img.setAttribute("src", `${item.enclosure.link}`);

  divOuter.appendChild(img);

  let divBody = document.createElement("div");
  divBody.classList.add("card-body");

  let title = document.createElement("h3");
  title.classList.add("card-title");
  title.textContent = `${item.title}`;
  divBody.appendChild(title);

  let authorDiv = document.createElement("div");
  authorDiv.classList.add("card-subtitle");

  let authorContainer = document.createElement("span");
  authorContainer.innerText = `${item.author}`;
  let ellipse = document.createElement("i");
  ellipse.classList.add("ellipse");
  let publishDate = document.createElement("span");
  publishDate.innerText = `${item.pubDate.split(" ")[0]}`;
  authorDiv.appendChild(authorContainer);
  authorDiv.appendChild(ellipse);
  authorDiv.appendChild(publishDate);
  divBody.appendChild(authorDiv);

  let description = document.createElement("p");
  description.classList.add("card-text");
  description.innerText = `${item.description}`;

  let anchor = document.createElement("a");
  anchor.setAttribute("href", `${item.link}`);
  anchor.classList.add("nav-link");

  anchor.appendChild(description);
  divBody.appendChild(anchor);
  divOuter.appendChild(divBody);
  return divOuter;
}

function createCarouselOuter(carouselId, direction, idx, arr) {
  console.log(arr);
  const len = arr.length;
  // let right = len - 1;
  // let left = 0;
  let currentSlide = 0;
  let btn = document.createElement("button");
  btn.setAttribute("data-bs-target", `#${carouselId}`);
  btn.setAttribute(
    "data-bs-slide",
    (dir = direction === "left" ? "prev" : "next")
  );
  btn.setAttribute("id", `${carouselId}-${idx}`);
  // if (direction === "right") {
  //   btn.style.display = "block";
  // } else {
  //   btn.style.display = "none";
  // }

  btn.addEventListener("click", function (event) {
    if (event.target.getAttribute("data-bs-slide") === "next") {
      if (currentSlide < len - 1) {
        currentSlide++;
        let leftButton = document.getElementById(`${carouselId}-${idx - 1}`);
        let rightButton = document.getElementById(`${carouselId}-${idx}`);
        updateButtons(leftButton, rightButton, currentSlide, len);
        console.log(arr.length, "right", currentSlide);
      }
    } else {
      if (currentSlide > 0) {
        currentSlide--;
        let leftButton = document.getElementById(`${carouselId}-${idx}`);
        let rightButton = document.getElementById(`${carouselId}-${idx + 1}`);
        updateButtons(leftButton, rightButton, currentSlide, len);
        console.log(arr.length, "left", currentSlide);
      }
    }
  });

  let span = document.createElement("i");
  span.classList.add("fa-solid", `fa-chevron-${direction}`);
  btn.appendChild(span);
  return btn;
}

function updateButtons(leftButton, rightButton, currentSlide, len) {
  if (currentSlide === 0) {
    leftButton.style.display = "none";
  } else {
    leftButton.style.display = "block";
  }

  if (currentSlide === len - 1) {
    rightButton.style.display = "none";
  } else {
    rightButton.style.display = "block";
  }
}

function sliderFunction(event) {
  console.log(event.target);
  if (event.target.getAttribute("data-bs-slide") === "right") {
    console.log("Move Right");
  } else {
    console.log("Move Left");
  }
}

function createCarousel(feeds, courselId) {
  let carousel = document.createElement("div");
  carousel.classList.add("carousel", "slide");
  carousel.setAttribute("id", courselId);
  carousel.appendChild(createCarouselInner(feeds));
  return carousel;
}

function createAccordionItem(
  accordionId,
  collapseId,
  carousel,
  carouselId,
  topicParam,
  arr,
  idx
) {
  let accordionItem = document.createElement("div");
  accordionItem.classList.add("accordion-item");
  let accordionHeader = document.createElement("h2");
  accordionHeader.classList.add("accordion-header");

  let accordionButton = document.createElement("button");
  accordionButton.classList.add("accordion-button");
  accordionButton.setAttribute("data-bs-toggle", "collapse");
  accordionButton.setAttribute("data-bs-target", `#${collapseId}`);
  accordionButton.setAttribute("aria-expanded", "true");
  accordionButton.setAttribute("type", "button");
  accordionButton.setAttribute("aria-controls", `${collapseId}`);
  accordionButton.textContent = topicParam;
  accordionHeader.appendChild(accordionButton);

  let accordionCollapse = document.createElement("div");
  if (idx === 0) {
    accordionCollapse.classList.add("accordion-collapse", "collapse", "show");
  } else {
    accordionCollapse.classList.add("accordion-collapse", "collapse");
  }

  accordionCollapse.setAttribute("data-bs-parent", `#${accordionId}`);
  accordionCollapse.setAttribute("id", collapseId);

  let accordionBody = document.createElement("div");
  accordionBody.classList.add("accordion-body");
  accordionBody.appendChild(createCarouselOuter(carouselId, "left", idx, arr));
  accordionBody.appendChild(carousel);
  accordionBody.appendChild(
    createCarouselOuter(carouselId, "right", idx + 1, arr)
  );

  accordionCollapse.appendChild(accordionBody);
  accordionItem.appendChild(accordionHeader);
  accordionItem.appendChild(accordionCollapse);

  return accordionItem;
}

function populateAccordion(accordionId, idx, topic, topicParam) {
  let accordion = document.getElementById(accordionId);
  const collapseId = `collapse-${idx}`;
  const courselId = `carousel-${idx}`;
  const carouselNode = createCarousel(topic.items, courselId);

  const accordionItem = createAccordionItem(
    accordionId,
    collapseId,
    carouselNode,
    courselId,
    topicParam,
    topic.items,
    idx
  );

  accordion.appendChild(accordionItem);
}

const accordionId = "crio-feed-accordion";

Array.from(magazines).forEach((topicURL, idx) => {
  fetch_rss_topics(topicURL).then((topic) => {
    const len = topicURL.split("/").length;
    const topicParam = topicURL.split("/")[len - 1].split(".rss")[0];
    populateAccordion(accordionId, idx, topic, topicParam);
  });
});
