document.addEventListener("DOMContentLoaded", () => {
    fetchCommunities();

    document.getElementById('community-container').addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') {
            const communityId = e.target.getAttribute('data-id');
            fetchPosts(communityId);
        }
    });
});

async function fetchCommunities(category = '') {
    let url = 'php/community.php';
    if (category) {
        url += `?category=${encodeURIComponent(category)}`;
    }

    const response = await fetch(url);
    const communities = await response.json();

    const communityContainer = document.getElementById('community-container');
    communityContainer.innerHTML = '';

    if (communities.length === 0) {
        communityContainer.innerHTML = '<p>No communities found in this category.</p>';
        return;
    }

    communities.forEach(community => {
        const communityDiv = document.createElement('div');
        communityDiv.classList.add('community');
        communityDiv.innerHTML = `
            <h3>${community.name}</h3>
            <p>${community.description}</p>
            <small>Category: ${community.category}</small>
            <button data-id="${community.id}" onclick="joinCommunity(${community.id})">Join Community</button>
        `;
        communityContainer.appendChild(communityDiv);
    });
}

async function fetchPosts(communityId) {
    const response = await fetch(`php/community.php?community_id=${communityId}`);
    const posts = await response.json();

    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';

    if (posts.length === 0) {
        postsContainer.innerHTML = '<p>No posts in this community yet.</p>';
        return;
    }

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


async function joinCommunity(communityId) {
    const response = await fetch(`php/community.php?id=${communityId}`, {
        method: 'POST'
    });

    if (response.ok) {
        alert('Successfully joined the community!');
        fetchCommunities();
    } else {
        alert('Failed to join the community.');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCommunities(); // Initial fetch of communities

    document.getElementById("create-community-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const response = await fetch('php/create_community.php', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Community created successfully!');
            e.target.reset();
            fetchCommunities(); // Refresh the community list to show the new community
        } else {
            alert('Failed to create community.');
        }
    });
});

function getCommunityId() {
    // This function should return the community ID
    // Depending on your app, you could retrieve this from the URL, a hidden field, etc.
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('community_id');
}

function filterCommunities() {
    const category = document.getElementById('filter-category').value;
    fetchCommunities(category);
}



