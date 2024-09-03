document.addEventListener("DOMContentLoaded", async () => {
    const response = await fetch('php/affirmations.php');
    const affirmations = await response.json();

    const affirmationContainer = document.getElementById('affirmation-container');
    affirmationContainer.innerHTML = '';
    affirmations.forEach(affirmation => {
        const affirmationDiv = document.createElement('div');
        affirmationDiv.classList.add('affirmation');
        affirmationDiv.innerHTML = `<p>${affirmation.content}</p>`;
        affirmationContainer.appendChild(affirmationDiv);
    });
});
