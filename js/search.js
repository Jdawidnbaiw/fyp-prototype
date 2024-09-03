document.getElementById("search-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("query").value;
    const response = await fetch(`php/search.php?query=${query}`);
    const results = await response.json();

    const resultsContainer = document.getElementById("search-results");
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        const resultDiv = document.createElement("div");
        resultDiv.classList.add("result");
        resultDiv.innerHTML = `<h3>${result.title}</h3><p>${result.content}</p>`;
        resultsContainer.appendChild(resultDiv);
    });
});
