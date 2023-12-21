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
    if(window.innerWidth <= 980 && menuBars) {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('is-active');
        navBar.classList.remove('is-active');
    }
}

menuLinks.addEventListener('click', hideMobileMenu)
navLogo.addEventListener('click', hideMobileMenu)

// show active menu when scrolling
const highlightMenu = () => {
    const elem = document.querySelector('.highlight')
    const homeMenu = document.querySelector('#home-page')
    const aboutMenu = document.querySelector('#about-page')
    const projectsMenu = document.querySelector('#projects-page')
    let scrollPos = window.scrollY

    // Adds 'highlight' class to menu items - class should only work if not in mobile
    if(window.innerWidth > 960 && scrollPos < 600) { // 600 is when we should be on home highlighted
        homeMenu.classList.add('highlight')
        projectsMenu.classList.remove('highlight')
        return
    } else if (window.innerWidth > 960 && scrollPos < 1400) {
        homeMenu.classList.remove('highlight')
        aboutMenu.classList.remove('highlight')
        projectsMenu.classList.add('highlight')
        return
    } else if (window.innerWidth > 960 && scrollPos < 3545) {
        aboutMenu.classList.add('highlight')
        projectsMenu.classList.remove('highlight')
        return
    }

    if ((elem && window.innerWidth < 960 && scrollPos < 600) || elem) {
        elem.classList.remove('highlight')

    }
}

window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);

// Restore scroll to top of page on refresh
if (history.scrollRestoration) {
    history.scrollRestoration = 'manual';
} else {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
}

// Timeline line animation
const line = document.querySelector('#line_id')
let scrollDown = true;
let expBoxHeightDeltas = {
    '#first_exp_box': 108,
    '#second_exp_box': 160,
    '#third_exp_box': 186,
    '#fourth_exp_box': 196,
    '#fifth_exp_box': 160,
};

const animate_line = () => {
    let scrollPos = window.scrollY
    let aboveLine = 1300
    let belowLine = 3550
    let startAnimationTop = 1600
    let startAnimationBottom = 3300

    for (const key of Object.keys(expBoxHeightDeltas)) { 
        if(document.querySelector(key).checked){
            let heightDelta = expBoxHeightDeltas[key]
            belowLine += heightDelta
            startAnimationBottom += heightDelta
        }
     };


    if (scrollPos < aboveLine || scrollPos > belowLine) {
        line.classList.remove('is-inView')
        line.classList.remove('is-inView-up')
        if (scrollPos < aboveLine) {
            scrollDown = true
        } else if (scrollPos > belowLine) {
            scrollDown = false
        }
    }
    else if (scrollPos > startAnimationTop && scrollPos < startAnimationBottom){
        if(scrollDown){
            line.classList.add('is-inView')
        } else {
            line.classList.add('is-inView-up')
        }
    } 
}

window.addEventListener('scroll', animate_line);

// Show and hide elements when scrolling
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        } else {
            entry.target.classList.remove('show');
        }
    });
});


const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

const observer_left = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        console.log(entry)
        if (entry.isIntersecting) {
            entry.target.classList.add('show-left');
        } else {
            entry.target.classList.remove('show-left');
        }
    });
});

const hiddenLeftElements = document.querySelectorAll('.hidden-left');
hiddenLeftElements.forEach((el) => observer_left.observe(el));
