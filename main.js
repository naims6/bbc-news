// show news in a container
let newsContainer = document.querySelector(".news");

const showNewsDisplay = (newsArr) => {
  //   newsContainer.innerHTML = "";
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
             <div class="news-card cursor-pointer group">
          <img
            src="${newsItem.image.srcset[7].url}"
            alt=""
          />
          <p class="leading-9 line-clamp-2 group-hover:underline decoration-gray-600 decoration-2 font-semibold mt-3 text-xl">
            ${newsItem.title}
          </p>
          <span class="text-gray-600 mt-5">${newsItem.time}</span>
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

// Showing catagory to the navbar

const showCategoryDisplay = (catagoryName) => {
  let newsCategoryContainer = document.querySelector(
    ".news-catagory-container"
  );
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
  let catagoryUrl = "https://news-api-fs.vercel.app/api/categories";
  let response = await fetch(catagoryUrl);
  let data = await response.json();
  showCategoryDisplay(data.categories);
};

loadNews("main");
loadNewsCategory();
