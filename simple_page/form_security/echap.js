async function printUsername(username) {
    try {
        // Utilisation de encodeURIComponent pour échapper le contenu non fiable (contexte URL)
        const res = await fetch('https://my-api.com/user/' + encodeURIComponent(username));
        const jsonData = await res.json();

        // Utilisation de textContent pour échapper le contenu non fiable (contexte HTML)
        document.getElementById('username').textContent = jsonData.username;

    } catch (err) {
        // Gestion de l'erreur à implémenter
    }
}
