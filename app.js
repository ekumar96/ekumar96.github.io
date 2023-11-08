const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navBar = document.querySelector('.navbar');
const navLogo = document.querySelector('#navbar__logo')

// Display Mobile Menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('is-active');
    navBar.classList.toggle('is-active');
}

menu.addEventListener('click', mobileMenu);



