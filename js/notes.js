document.addEventListener("DOMContentLoaded", () => {
    fetchNotes();

    document.getElementById("new-note-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        const response = await fetch('php/notes.php', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            fetchNotes();
            e.target.reset();
        } else {
            alert('Failed to save note');
        }
    });
});

async function fetchNotes() {
    const response = await fetch('php/notes.php');
    const notes = await response.json();

    const notesContainer = document.getElementById('notes-container');
    notesContainer.innerHTML = '';
    notes.forEach(note => {
        const noteDiv = document.createElement('div');
        noteDiv.classList.add('note');
        noteDiv.innerHTML = `
            <h3>${note.title}</h3>
            <p>${note.content}</p>
            <button onclick="deleteNote(${note.id})">Delete</button>
        `;
        notesContainer.appendChild(noteDiv);
    });
}

async function deleteNote(id) {
    const response = await fetch(`php/notes.php?id=${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        fetchNotes();
    } else {
        alert('Failed to delete note');
    }
}
