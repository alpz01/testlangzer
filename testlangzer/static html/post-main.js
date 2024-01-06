const apiKey = 'AIzaSyCJ6jdZ4LyxrYTxLUg9QxnM8N0Rs8I73_E';
const blogId = '7588574506817963400';

async function fetchPosts() {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    
    console.log(data.items[0]);
    getPost(data.items[0]);
    
}
fetchPosts();

function getPost(item) {
    const title = item.title;
    const genres = ['Action', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Mystery', 'Romance', 'Sci-Fi', 'Thriller', 'Western'];
    const postGenres = item.labels.filter(label => genres.includes(label));

    // Create the HTML string for genres
    let genresHTML = 'Genres : ';
    postGenres.forEach((genre, index) => {
        genresHTML += `<a href="/?genre=${genre}">${genre}</a>`;
        if (index !== postGenres.length - 1) {
            genresHTML += ', ';
        }
    });

    // Add the genres HTML to the bottomleft class
    document.querySelector('.animetitle').textContent = title;
    document.querySelector('#genres').innerHTML = genresHTML;
}

getPost(item);

