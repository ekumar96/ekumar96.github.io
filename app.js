const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');
const navBar = document.querySelector('.navbar');
const navLogo = document.querySelector('#navbar_logo')

// Display Mobile Menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('is-active');
    navBar.classList.toggle('is-active');
}

menu.addEventListener('click', mobileMenu);



