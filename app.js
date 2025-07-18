// Cache DOM elements for better performance
const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar_menu');
const navBar = document.querySelector('.navbar');
const navLogo = document.querySelector('#navbar_logo');
const line = document.querySelector('#line_id');

// Debounce function for scroll events
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Throttle function for performance-critical scroll events
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// Display Mobile Menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('is-active');
    navBar.classList.toggle('is-active');
};

menu.addEventListener('click', mobileMenu);

// Close mobile Menu when click on menu item
const hideMobileMenu = () => {
    const menuBars = document.querySelector('.is-active'); // menu list is down
    if (window.innerWidth <= 980 && menuBars) {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('is-active');
        navBar.classList.remove('is-active');
    }
};

menuLinks.addEventListener('click', hideMobileMenu);
navLogo.addEventListener('click', hideMobileMenu);

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
    };
}

// Timeline line animation
let scrollDown = true;
const expBoxHeightDeltas = {
    '#first_exp_box': 108,
    '#aws_s3_exp_box': 160,
    '#second_exp_box': 160,
    '#third_exp_box': 186,
    '#fourth_exp_box': 196,
    '#fifth_exp_box': 160,
};

const animate_line = throttle(() => {
    const scrollPos = window.scrollY;
    let aboveLine = 1300;
    let belowLine = 3750;
    let startAnimationTop = 1600;
    let startAnimationBottom = 3300;

    // Calculate height deltas for expanded boxes
    for (const key of Object.keys(expBoxHeightDeltas)) {
        const element = document.querySelector(key);
        if (element && element.checked) {
            const heightDelta = expBoxHeightDeltas[key];
            belowLine += heightDelta;
            startAnimationBottom += heightDelta;
        }
    }

    // Remove classes if outside animation range
    if (scrollPos < aboveLine || scrollPos > belowLine) {
        line.classList.remove('is-inView', 'is-inView-up');
        if (scrollPos < aboveLine) {
            scrollDown = true;
        } else if (scrollPos > belowLine) {
            scrollDown = false;
        }
    }
    // Add appropriate class based on scroll direction
    else if (scrollPos > startAnimationTop && scrollPos < startAnimationBottom) {
        if (scrollDown) {
            line.classList.add('is-inView');
            line.classList.remove('is-inView-up');
        } else {
            line.classList.add('is-inView-up');
            line.classList.remove('is-inView');
        }
    }
}, 16); // ~60fps

window.addEventListener('scroll', animate_line);

// Optimized intersection observer for scroll animations
const createObserver = (className) => {
    return new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add(className);
            } else {
                entry.target.classList.remove(className);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
};

// Create observers
const observer = createObserver('show');
const observer_left = createObserver('show-left');

// Observe elements
const hiddenElements = document.querySelectorAll('.hidden');
const hiddenLeftElements = document.querySelectorAll('.hidden-left');

hiddenElements.forEach((el) => observer.observe(el));
hiddenLeftElements.forEach((el) => observer_left.observe(el));

// Cleanup function for memory management
const cleanup = () => {
    observer.disconnect();
    observer_left.disconnect();
};

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);
