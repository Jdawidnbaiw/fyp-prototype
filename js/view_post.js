document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('post_id');

    // Load post content
    const postResponse = await fetch(`php/get_post.php?post_id=${postId}`);
    const post = await postResponse.json();
    const postContent = document.getElementById('post-content');
    postContent.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.content}</p>
    `;

    // Load comments
    loadComments(postId);

    // Handle comment submission
    document.querySelector('.comment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        formData.append('post_id', postId);

        const response = await fetch('php/add_comment.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            e.target.reset();
            loadComments(postId); // Reload comments after submission
        } else {
            alert('Failed to add comment.');
        }
    });
});

async function loadComments(postId) {
    const response = await fetch(`php/get_comments.php?post_id=${postId}`);
    const comments = await response.json();

    const commentsContainer = document.getElementById('comments-container');
    commentsContainer.innerHTML = '';

    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
        return;
    }

    comments.forEach(comment => {
        const commentDiv = document.createElement('div');
        commentDiv.classList.add('comment');
        commentDiv.innerHTML = `
            <p>${comment.content}</p>
            <small>Posted by ${comment.username} on ${new Date(comment.created_at).toLocaleString()}</small>
        `;
        commentsContainer.appendChild(commentDiv);
    });
}
