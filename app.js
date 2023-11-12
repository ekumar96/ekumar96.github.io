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

/// Close mobile Menu when click on menu item
const hideMobileMenu = () => {
    const menuBars = document.querySelector('.is-active') // menu list is down
    if(window.innerWidth <= 768 && menuBars) {
        menu.classList.toggle('is-active')
        menuLinks.classList.remove('is-active')
    }
}

menuLinks.addEventListener('click', hideMobileMenu)
navLogo.addEventListener('click', hideMobileMenu)


