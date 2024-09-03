document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch('php/get_posts.php'); // Fetch all posts
    const posts = await response.json();

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts available.</p>';
        return;
    }

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content.substring(0, 100)}...</p> <!-- Show preview -->
            <a href="view_post.html?post_id=${post.id}">Read More & Comment</a>
        `;
        postsContainer.appendChild(postDiv);
    });
});

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');

    // Load post
    const postResponse = await fetch(`php/get_post.php?post_id=${postId}`);
    const post = await postResponse.json();
    document.getElementById('post-content').innerHTML = `<h3>${post.title}</h3><p>${post.content}</p>`;

    // Load comments
    loadComments(postId);

    document.getElementById('comment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('post_id', postId);

        const response = await fetch('php/add_comment.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            loadComments(postId); // Reload comments after submission
        } else {
            alert('Failed to add comment.');
        }
    });
});

async function loadComments(postId) {
    const response = await fetch(`php/get_comments.php?post_id=${postId}`);
    const comments = await response.json();
    const container = document.getElementById('comments-container');
    container.innerHTML = '';
    comments.forEach(comment => {
        const div = document.createElement('div');
        div.innerHTML = `<p>${comment.content}</p>
                         <small>Posted by ${comment.username} on ${new Date(comment.created_at).toLocaleString()}</small>`;
        container.appendChild(div);
    });
}
