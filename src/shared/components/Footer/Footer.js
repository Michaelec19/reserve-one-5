export function loadFooter() {
    const footerContainer = document.getElementById("footer-container");
    if (!footerContainer) return;

    fetch("./Footer.html")
        .then(response => {
            if (!response.ok) throw new Error("No se pudo cargar el footer");
            return response.text();
        })
        .then(html => {
            footerContainer.innerHTML = html;
        })
        .catch(error => console.error("Error al cargar el footer:", error));
}