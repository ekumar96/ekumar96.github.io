// Cache DOM elements for better performance
const navBar = document.querySelector('#navbar');
const navToggle = document.querySelector('#mobile-menu');
const navToggleIcon = document.querySelector('#mobile-menu-icon');
const navMobile = document.querySelector('#navbar-mobile');
const line = document.querySelector('#line_id');

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

// Glass blur fades in past 20px scroll.
const onScroll = () => {
    if (window.scrollY > 20) {
        navBar.classList.add('scrolled');
    } else {
        navBar.classList.remove('scrolled');
    }
};
onScroll();
window.addEventListener('scroll', throttle(onScroll, 50), { passive: true });

const setMobileOpen = (open) => {
    navBar.classList.toggle('mobile-open', open);
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navMobile.hidden = !open;
    navToggleIcon.classList.toggle('fa-bars', !open);
    navToggleIcon.classList.toggle('fa-xmark', open);
};

navToggle.addEventListener('click', () => {
    const isOpen = navBar.classList.contains('mobile-open');
    setMobileOpen(!isOpen);
});

navMobile.addEventListener('click', (e) => {
    if (e.target.matches('a')) setMobileOpen(false);
});

// Active section highlight — section's top within 35vh of viewport top → active.
const navAnchors = document.querySelectorAll('.navbar_anchor[data-section]');
const sectionsById = Array.from(
    new Set(Array.from(navAnchors).map((a) => a.dataset.section))
)
    .map((id) => document.getElementById(id))
    .filter(Boolean);

const setActiveAnchor = (activeId) => {
    navAnchors.forEach((anchor) => {
        const isActive = anchor.dataset.section === activeId;
        anchor.classList.toggle('active', isActive);
        anchor.setAttribute('aria-current', isActive ? 'page' : 'false');
    });
};

const highlightOnScroll = () => {
    if (sectionsById.length === 0) return;
    // No highlight on first load — wait until the user actually scrolls.
    if (window.scrollY < 50) {
        setActiveAnchor(null);
        return;
    }
    const triggerY = window.innerHeight * 0.35;
    let activeId = null;
    sectionsById.forEach((section) => {
        if (section.getBoundingClientRect().top <= triggerY) {
            activeId = section.id;
        }
    });
    setActiveAnchor(activeId);
};

window.addEventListener('scroll', throttle(highlightOnScroll, 50), { passive: true });
window.addEventListener('resize', throttle(highlightOnScroll, 100));
window.addEventListener('load', highlightOnScroll);
highlightOnScroll();

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
    let aboveLine = 300;
    let belowLine = 2950;
    let startAnimationTop = 600;
    let startAnimationBottom = 2300;

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
