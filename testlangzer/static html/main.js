const apiKey = 'AIzaSyCJ6jdZ4LyxrYTxLUg9QxnM8N0Rs8I73_E';
const blogId = '7588574506817963400';

// Collapse or expand announcement section based on its height
function readmorebtn() {
  let announcement = document.getElementById('announcement');
  let icon = document.querySelector('#readmorebtn i');
  let computedStyle = window.getComputedStyle(announcement);

  if (computedStyle.height !== '48px') {
    // Collapse the announcement
    announcement.style.height = '48px';
    icon.classList.remove('fa-chevron-up');
    icon.classList.add('fa-chevron-down');
  } else {
    // Expand the announcement
    announcement.style.height = '198px';
    icon.classList.remove('fa-chevron-down');
    icon.classList.add('fa-chevron-up');
  }
}

// Fetch blogger posts based on label
async function getBloggerPost(label) {
  let url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`;

  if (label) {
    url += `&labels=${encodeURIComponent(label)}`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

// Extract required data from a blog post and call populateSearchResults function
function extractPostData(post) {
  const title = post.title;
  const labels = post.labels;
  const content = post.content;
  const url = post.url;

  let ratings, ep, imageLink;

  // Extract ratings and number of episodes from labels
  labels.forEach(label => {
    if (label.includes('Ep')) {
      ep = label;
    } else if (!isNaN(label.charAt(0))) {
      ratings = label;
    }
  });

  // Extract image link from content
  const separatorIndex = content.indexOf('<div');
  if (separatorIndex !== -1) {
    const imgIndex = content.indexOf('<img', separatorIndex);
    if (imgIndex !== -1) {
      const srcIndex = content.indexOf('src="', imgIndex);
      if (srcIndex !== -1) {
        const endSrcIndex = content.indexOf('"', srcIndex + 5);
        if (endSrcIndex !== -1) {
          imageLink = content.substring(srcIndex + 5, endSrcIndex);
        }
      }
    }
  }

  // Log post details and call populateSearchResults function
  console.log(post);
  console.log(`Title: ${title}, Ratings: ${ratings}, Ep: ${ep}, ImageLink: ${imageLink}`);
  populateSearchResults({ title, ratings, imageLink, ep, url });
}

// Populate search results container with post data
function populateSearchResults({ title, ratings, imageLink, ep, url }) {
  const searchResultsContainer = document.querySelector('.searchresult');
  const episodeInfo = ep ? `EP ${ep}` : '';
  const listItemHTML = `
    <li>
      <a href="${url}" title="${title}">
        <div class="searchimg">
          <img alt="${title} - Free Online" class="resultimg" src="${imageLink}">
          <div class="timetext">16 minutes ago</div> <!-- Placeholder text -->
          <div class="rating">
            <i class="fa-solid fa-star"></i> ${ratings}
          </div>
        </div>
        <div class="details">
          <p class="name">${title}</p>
          <p class="infotext">${episodeInfo}</p>
        </div>
      </a>
    </li>`;

  searchResultsContainer.innerHTML += listItemHTML;
}

// Fetch all blogger posts and extract post data
getBloggerPost().then(posts => {
  posts.items.forEach(extractPostData);
});

function showmovie() {
  clearPosts();
  getBloggerPost('Movie').then(posts => {
    posts.items.forEach(extractPostData);
  });
}

// Clear posts container and fetch blogger posts with 'Dub' label
function dubbtn() {
  clearPosts();
  getBloggerPost('Dub').then(posts => {
    posts.items.forEach(extractPostData);
  });
}

// Clear posts container and fetch blogger posts with 'Sub' label
function subbtn() {
  clearPosts();
  getBloggerPost('Sub').then(posts => {
    posts.items.forEach(extractPostData);
  });
}

// Clear posts container and fetch all blogger posts
function showrecent() {
  clearPosts();
  getBloggerPost().then(posts => {
    posts.items.forEach(extractPostData);
  });
}

// Clear the posts container
function clearPosts() {
  const postsContainer = document.querySelector('.searchresult');
  postsContainer.innerHTML = '';
}


// Add 'active' class to the clicked navigation item
document.querySelector('.nav').addEventListener('click', function(e) {
  // Remove 'active' class from all 'li' elements
  document.querySelectorAll('.nav li').forEach(function(elem) {
    elem.classList.remove('active');
  });

  // Add 'active' class to parent 'li' of clicked 'a' element
  e.target.parentNode.classList.add('active');
});


let postData = [];
let postItems = [];
let current = 0;

// Function to fetch posts from the API
async function fetchPosts() {
  const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items;
}

// Function to get 3 posts
async function getPosts() {
  const posts = await fetchPosts();
  postData = posts.slice(0, 3);
}

// Function to log the titles of the posts
async function logPosts() {
  const genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'];

  await getPosts(); // Ensure posts are fetched before logging

  postData.forEach(post => {
    const title = post.title;
    const url = post.url;
    const content = post.content;
    const postGenres = post.labels.filter(label => genres.includes(label)).join(", ");
    let imageLink = "";

    // Extract image link from content
    const separatorIndex = content.indexOf('<div');
    if (separatorIndex !== -1) {
      const imgIndex = content.indexOf('<img', separatorIndex);
      if (imgIndex !== -1) {
        const srcIndex = content.indexOf('src="', imgIndex);
        if (srcIndex !== -1) {
          const endSrcIndex = content.indexOf('"', srcIndex + 5);
          if (endSrcIndex !== -1) {
            imageLink = content.substring(srcIndex + 5, endSrcIndex);
          }
        }
      }
    }

    addPostItem(title, url, postGenres, imageLink);
  });
}

function addPostItem(title, url, genres, image) {
  const postItem = `<div id="featuredbgcont">
    <img id="featuredbg" src="${image}">
  </div>
  <div id="featuredcont">
    <a href="${url}">
        <img id="featuredimg" src="${image}">
    </a>
    <div id="featuredtitle">
        <a href="${url}">${title}</a>
    </div>
    <div id="featuredtext"> This is post only </div>
    <div id="featuredgenre">
        <i class="glyphicon glyphicon-tag"></i> ${genres}
    </div>
    <a id="featuredNext" onclick="showFeatured(current + 1)">
        <i class="fa-solid fa-chevron-right"></i>
    </a>
    <a id="featuredBack" onclick="showFeatured(current - 1)">
        <i class="fa-solid fa-chevron-left"></i>
    </a>
  </div>`;

  postItems.push(postItem);
}

function showFeatured(number) {
  // Ensure the number is within the range of available posts
  const totalPosts = postItems.length;
  if (totalPosts === 0) {
    console.warn('No posts to show.');
    return;
  }

  // Normalize the number to always be within the range [0, totalPosts)
  number = ((number % totalPosts) + totalPosts) % totalPosts;
  
  // Update the current post
  current = number;

  // Display the current post
  document.getElementById('featuredcard').innerHTML = postItems[current];
}

// Assuming you want to cycle through posts
setInterval(() => {
  showFeatured(current + 1);
}, 8000);

// Call logPosts to start the process
logPosts();


getPosts().then(() => {
    // Then, log the posts
    logPosts();
});
