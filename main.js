// ****
// Add bookmark any news and remove
// ****
let bookmarkContainer = document.querySelector(".bookmark-container");
let bookmark = JSON.parse(localStorage.getItem("bookmark")) || [];

const renderBookmark = () => {
  bookmarkContainer.innerHTML = "";
  bookmark.forEach((title, index) => {
    bookmarkContainer.innerHTML += `
        <div class="bookmark-item relative border border-gray-400 rounded-md overflow-hidden w-full max-w-[300px]">
          <p class="truncate-2-lines p-4 pr-7 text-gray-700">
            ${title}
          </p>
          <span onclick="removeBookmark(${index})" class="absolute right-3 top-3 cursor-pointer">X</span>
        </div>
  `;
  });
};

const removeBookmark = (index) => {
  bookmark.splice(index, 1);
  renderBookmark();
  localStorage.setItem("bookmark", JSON.stringify(bookmark));
};

const addBookmark = (title) => {
  if (bookmark.includes(title)) {
    return;
  }
  bookmark.push(title);
  renderBookmark();
  localStorage.setItem("bookmark", JSON.stringify(bookmark));
};

// ****
// show news in a container
// ****
let newsContainer = document.querySelector(".news");

const showNewsDisplay = (newsArr) => {
  //   newsContainer.innerHTML = "";
  loadingSpinner(false);
  if (!newsArr.length) {
    newsContainer.innerHTML = `
                 <div class="bg-red-600 text-white mx-auto p-5 text-3xl col-span-full w-full text-center" >
                      There is no news to show
                 </div>`;
    return;
  }

  newsContainer.innerHTML = newsArr
    .map((newsItem) => {
      return `
            <div>
              <div class="news-card cursor-pointer group" onclick="loadNewsDetails('${newsItem.id}')">
                <img
                  src="${newsItem.image.srcset[7].url}"
                  alt=""
                />
                <p class="leading-9 line-clamp-2 group-hover:underline decoration-gray-600 decoration-2 font-semibold mt-3 text-xl">
                  ${newsItem.title}
                </p>
                <span class="text-gray-600 mt-5">${newsItem.time}</span> <br>
                </div>

                <button onclick='addBookmark("${newsItem.title}")' class="btn btn-primary mt-1.5">Bookmark</button>
            </div>
            
        `;
    })
    .join(" ");
};

const removeActiveClass = () => {
  document.querySelectorAll(".news-category-item").forEach((item) => {
    item.classList.remove("border-b-4", "border-red-600");
  });
};

const addActiveClass = (id) => {
  removeActiveClass();
  let clickedItem = document.getElementById(`${id}`);
  clickedItem.classList.add("border-b-4", "border-red-600");
};

const changeTitle = (title) => {
  const catagoryTitle = document.querySelector(".news-title");
  catagoryTitle.innerHTML = title;
};

const showError = () => {
  newsContainer.innerHTML = `
  <div class="bg-red-600 text-white mx-auto p-5 text-3xl col-span-full w-full text-center" >There is an Error </div>`;
};

const loadNews = async (catagoryId) => {
  loadingSpinner(true, newsContainer);
  try {
    let newsUrl = `https://news-api-fs.vercel.app/api/categories/${catagoryId}`;
    let response = await fetch(newsUrl);
    if (!response.ok) {
      showError();
      return;
    }
    let data = await response.json();

    changeTitle(data.categoryName);
    showNewsDisplay(data.articles);
    addActiveClass(catagoryId);
  } catch (e) {
    console.log(e);
  }
};

// ****
// Showing catagory to the navbar
// ****

let newsCategoryContainer = document.querySelector(".news-catagory-container");
const showCategoryDisplay = (catagoryName) => {
  loadingSpinner(false);
  newsCategoryContainer.innerHTML = "";
  catagoryName.forEach((catagory) => {
    newsCategoryContainer.innerHTML += `
        <li 
          onclick="loadNews('${catagory.id}')"
          id="${catagory.id}"
          class="news-category-item cursor-pointer py-1 md:py-3 text-xl font-bold hover:border-b-4 hover:border-red-700"
        >
          ${catagory.title}
        </li>
    `;
  });
};

const loadNewsCategory = async () => {
  loadingSpinner(true, newsCategoryContainer);
  let catagoryUrl = "https://news-api-fs.vercel.app/api/categories";
  let response = await fetch(catagoryUrl);
  let data = await response.json();
  showCategoryDisplay(data.categories);
};

// ****
// Show deatails news in a modal when user click a news
// ****
let dialog = document.querySelector("dialog");

const showNewsDetails = (articles) => {
  dialog.innerHTML = `
      <div class="modal-box thick-scrollbar">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <div class="mt-4"> 
          <img class="rounded-md" src="${articles.images[0].url}" />
          <span class="text-sm mb-3 mt-2 text-gray-600">${
            articles.timestamp
          } <span/>
          <p class="text-gray-800"> ${articles.content.join(" ")}</p>
        </div>

        <div class="modal-action">
          <form method="dialog">
            <!-- if there is a button in form, it will close the modal -->
            <button class="btn">Close</button>
          </form>
        </div>
      </div>
  `;
};

// when user click out side of the box then close the details of modal
dialog.addEventListener("click", (e) => {
  let dialogBox = e.target.closest(".modal-box");
  if (!dialogBox) {
    document.getElementById("my_modal_5").close();
  }
});

const loadNewsDetails = async (id) => {
  document.getElementById("my_modal_5").showModal();
  let url = `https://news-api-fs.vercel.app/api/news/${id}`;

  let response = await fetch(url);
  let data = await response.json();

  showNewsDetails(data.article);
};

// ****
// Adding loading spinner when data will be loading
// ****
const loadingSpinner = (loading, place) => {
  if (loading) {
    place.innerHTML = `
    <div class="col-span-full text-center w-full">
      <span class="loading loading-bars loading-md"></span>
    </div>`;
  }
};

loadNews("main");
loadNewsCategory();
renderBookmark();
