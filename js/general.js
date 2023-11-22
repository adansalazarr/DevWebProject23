// Código reutilizable en la plataforma

// Cambia la visibilidad de los enlaces en la navbar
function toggleMenu() {
    const menuEnlaces = document.getElementById("menu");
    const menuDashboardAcciones = document.querySelector(".dashboard-acciones");

    if (menuEnlaces.style.display == "flex") {
        menuEnlaces.style.display = "none";
        menuDashboardAcciones.style.display = "none";
    } else {
        menuEnlaces.style.display = "flex";
        menuDashboardAcciones.style.display = "flex";
    }
}