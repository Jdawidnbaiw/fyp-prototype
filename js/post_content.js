document.addEventListener("DOMContentLoaded", () => {
    fetchCommunities();

    document.getElementById("post-content-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const response = await fetch('php/post_content.php', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Post created successfully!');
            e.target.reset();
        } else {
            alert('Failed to create post.');
        }
    });
});

async function fetchCommunities() {
    const response = await fetch('php/community.php');
    const communities = await response.json();

    const communitySelect = document.getElementById('community-select');
    communitySelect.innerHTML = '';

    communities.forEach(community => {
        const option = document.createElement('option');
        option.value = community.id;
        option.textContent = community.name;
        communitySelect.appendChild(option);
    });
}

async function fetchPosts(communityId) {
    const response = await fetch(`php/community.php?community_id=${communityId}`);
    const posts = await response.json();

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        postDiv.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <small>Posted by ${post.username} on ${new Date(post.created_at).toLocaleString()}</small>
        `;
        postsContainer.appendChild(postDiv);
    });
}