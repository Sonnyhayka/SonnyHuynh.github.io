// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functions
    initScrollAnimations();
    initMobileMenu();
    initSmoothScroll();
    initFormValidation();
    initTypewriterEffect();
    initProjectFilters();
    initLazyLoading();
    initNavbarScroll();
});

// Scroll Animations
function initScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-animate');
    const elementInView = (el, offset = 1) => {
        const elementTop = el.getBoundingClientRect().top;
        return elementTop <= (window.innerHeight * offset);
    };

    const displayScrollElement = (element) => {
        element.classList.add('visible');
    };

    const hideScrollElement = (element) => {
        element.classList.remove('visible');
    };

    const handleScrollAnimation = () => {
        scrollElements.forEach((el) => {
            if (elementInView(el, 0.8)) {
                displayScrollElement(el);
            } else {
                hideScrollElement(el);
            }
        });
    };

    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScrollAnimation);
    });

    // Initial check
    handleScrollAnimation();
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            menuButton.setAttribute('aria-expanded', 
                menuButton.getAttribute('aria-expanded') === 'false' ? 'true' : 'false'
            );
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }
}

// Smooth Scroll for Anchor Links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form Validation and Submission
function initFormValidation() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic form validation
            const formData = new FormData(contactForm);
            let isValid = true;
            let errorMessages = [];

            // Validate email
            const email = formData.get('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                isValid = false;
                errorMessages.push('Please enter a valid email address');
            }

            // Validate required fields
            formData.forEach((value, key) => {
                if (!value.trim()) {
                    isValid = false;
                    errorMessages.push(`${key.charAt(0).toUpperCase() + key.slice(1)} is required`);
                }
            });

            if (!isValid) {
                showFormErrors(errorMessages);
                return;
            }

            // Submit form (replace with your form handling logic)
            try {
                const response = await submitForm(formData);
                showSuccessMessage('Message sent successfully!');
                contactForm.reset();
            } catch (error) {
                showFormErrors(['Failed to send message. Please try again.']);
            }
        });
    }
}

// Typewriter Effect
function initTypewriterEffect() {
    const elements = document.querySelectorAll('.typewriter');
    
    elements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let index = 0;

        function type() {
            if (index < text.length) {
                element.textContent += text.charAt(index);
                index++;
                setTimeout(type, 100);
            }
        }

        type();
    });
}

// Project Filtering
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    if (filterButtons.length && projects.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const filter = button.dataset.filter;

                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter projects
                projects.forEach(project => {
                    const category = project.dataset.category;
                    if (filter === 'all' || category === filter) {
                        project.style.display = '';
                        setTimeout(() => {
                            project.classList.add('visible');
                        }, 10);
                    } else {
                        project.classList.remove('visible');
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                });
            });
        });
    }
}

// Lazy Loading for Images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const lazyLoad = (target) => {
        const io = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.disconnect();
                }
            });
        });

        io.observe(target);
    };

    lazyImages.forEach(lazyLoad);
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            navbar.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
            // Scroll Down
            navbar.classList.remove('scroll-up');
            navbar.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
            // Scroll Up
            navbar.classList.remove('scroll-down');
            navbar.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Utility Functions
function showFormErrors(errors) {
    const errorContainer = document.querySelector('.form-errors');
    if (errorContainer) {
        errorContainer.innerHTML = errors.map(error => `<p class="error">${error}</p>`).join('');
        errorContainer.style.display = 'block';
    }
}

function showSuccessMessage(message) {
    const successContainer = document.querySelector('.form-success');
    if (successContainer) {
        successContainer.textContent = message;
        successContainer.style.display = 'block';
        setTimeout(() => {
            successContainer.style.display = 'none';
        }, 5000);
    }
}

async function submitForm(formData) {
    // Replace with your form submission logic
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({ success: true });
            // reject(new Error('Failed to send message')); // For testing error handling
        }, 1000);
    });
}

// Add this if you want to use dynamic year in footer
document.querySelector('.current-year')?.textContent = new Date().getFullYear();

// Optional: Add page transition effects
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Optional: Add scroll-to-top button functionality
function initScrollToTop() {
    const scrollToTop = document.querySelector('.scroll-to-top');
    
    if (scrollToTop) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                scrollToTop.classList.add('active');
            } else {
                scrollToTop.classList.remove('active');
            }
        });

        scrollToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}