document.querySelector("body").onload = () => {
  document.querySelectorAll(".category")[0].classList.add("categoryMouseOver");
  document.querySelectorAll(".category")[0].classList.add("activeCategory");
};

let categoryButtons = document.querySelectorAll(".category");
let activeCategoryIndex = 0;
let categoryPhotos = [];

function updatePhotoArray() {
  categoryPhotos = [];
  let mags = document.querySelectorAll(".mag");

  for (let m = 0; m < mags.length; m++) {
    if (mags[m].parentElement.style.display !== "none") {
      categoryPhotos.push(m);
    }
  }

  console.log(categoryPhotos);
}
  updatePhotoArray(); // initializing photo array so it's not empty at start  

for (let i = 0; i < categoryButtons.length; i++) {
  categoryButtons[i].addEventListener("click", (event) => {
    categoryButtons[activeCategoryIndex].classList.remove("activeCategory");
    categoryButtons[activeCategoryIndex].classList.remove("categoryMouseOver");
    console.log(activeCategoryIndex);
    activeCategoryIndex = i;
    event.target.classList.add("activeCategory");
    event.target.classList.add("categoryMouseOver");

    let categoryType = event.target.getAttribute("_categoryType");
    console.log(categoryType);
    let photos = document.querySelectorAll("#photos > div");
    for (let j = 0; j < photos.length; j++) {
      if (photos[j].classList.contains(categoryType)) {
        photos[j].style.display = "block";
      } else {
        photos[j].style.display = "none";
      }
    }
    updatePhotoArray(); // updating with each category
  });

  categoryButtons[i].addEventListener("mouseenter", (event) => {
    event.target.classList.add("categoryMouseOver");
  });
  categoryButtons[i].addEventListener("mouseleave", (event) => {
    if (!event.target.classList.contains("activeCategory")) {
      event.target.classList.remove("categoryMouseOver");
    }
  });
}
let currentPhoto = 0;
let photoArray = [
  "photo-gallery-01.jpg",
  "photo-gallery-02.jpg",
  "photo-gallery-03.jpg",
  "photo-gallery-04.jpg",
  "photo-gallery-05.jpg",
  "photo-gallery-06.jpg",
  "photo-gallery-07.jpg",
  "photo-gallery-08.jpg",
  "photo-gallery-09.jpg",
  "photo-gallery-10.jpg",
  "photo-gallery-11.jpg",
];
let mags = document.querySelectorAll(".mag");
for (let m = 0; m < mags.length; m++) {
  // console.log(photoArray[m]);
  mags[m].addEventListener("click", () => {
    // console.log(mags[m]);
    // currentPhoto = m;
    currentPhoto = categoryPhotos.indexOf(m);
    document.querySelector("#blackScreen").style.display = "block";
    document.querySelector("#photoBox").style.display = "block";
    document.querySelector("#photoBox > img").src =
      "img/" + photoArray[categoryPhotos[currentPhoto]];
    // for(p=0;p<photoArray.length;p++) {
    //   console.log(photoArray[p]);

    // }
    console.log(categoryPhotos.length);
  });
}
document.querySelector("#blackScreen").addEventListener("click", () => {
  document.querySelector("#blackScreen").style.display = "none";
  document.querySelector("#photoBox").style.display = "none";
});

document.querySelector("#rightArrow").addEventListener("click", () => {
  if (currentPhoto < categoryPhotos.length - 1) {
    currentPhoto++;
    document.querySelector("#photoBox > img").src =
      "img/" + photoArray[categoryPhotos[currentPhoto]];
  }
});
document.querySelector("#leftArrow").addEventListener("click", () => {
  if (currentPhoto > 0) {
    currentPhoto--;
    document.querySelector("#photoBox > img").src =
      "img/" + photoArray[categoryPhotos[currentPhoto]];
  }
});
