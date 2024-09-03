document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.comments-section').forEach(section => {
        const postId = section.getAttribute('data-post-id');
        loadComments(postId);

        section.querySelector('.comment-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            formData.append('post_id', postId);

            const response = await fetch('php/add_comment.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                form.reset();
                loadComments(postId); // Reload comments after a successful submission
            } else {
                alert('Failed to add comment.');
            }
        });
    });
});

async function loadComments(postId) {
    const response = await fetch(`php/get_comments.php?post_id=${postId}`);
    const comments = await response.json();

    const commentsContainer = document.getElementById(`comments-${postId}`);
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
