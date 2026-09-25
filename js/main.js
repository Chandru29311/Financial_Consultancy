document.addEventListener('DOMContentLoaded', () => {
    // Redirect to index.html on page reload (unless already on index.html)
    if (!window.location.pathname.endsWith('index.html') && window.location.pathname !== '/') {
        const navEntries = performance.getEntriesByType("navigation");
        if ((navEntries.length > 0 && navEntries[0].type === "reload") || 
            (performance.navigation && performance.navigation.type === performance.navigation.TYPE_RELOAD)) {
            window.location.href = 'index.html';
            return; // Stop execution
        }
    }

    // Loader Handling
    const loader = document.getElementById('loader');
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('loader-hidden');
            }, 600);
        });
    }

    // Scroll handling for glass header
    const header = document.querySelector('.glass-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                header.style.background = 'rgba(8, 20, 39, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.3)';
            } else {
                header.style.background = '#081427';
                header.style.boxShadow = 'none';
            }
        });
    }

    // Role-based login handling with persistence
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('userEmail').value;
            const role = document.getElementById('roleSelect').value;
            
            // Persist for dashboard display
            localStorage.setItem('userEmail', email);
            localStorage.setItem('userRole', role);
            
            const btn = loginForm.querySelector('button');
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Authenticating...';
            btn.disabled = true;

            setTimeout(() => {
                if (role === 'Advisor') {
                    window.location.href = 'advisor-dashboard.html';
                } else if (role === 'Client') {
                    window.location.href = 'client-dashboard.html';
                }
            }, 1000);
        });
    }

    // Dashboard Email Display
    const emailDisplay = document.getElementById('user-email-display');
    if (emailDisplay) {
        const storedEmail = localStorage.getItem('userEmail');
        if (storedEmail) {
            emailDisplay.textContent = storedEmail;
        }
    }

    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }

    // Mobile Menu & Sidebar Toggle (Perfect Full Page Navigation Coding)
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isActive = navMenu.classList.contains('active');
            const icon = mobileToggle.querySelector('i');
            
            if (isActive) {
                if (icon) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    mobileToggle.style.color = '#FFFFFF'; // ensure visibility on dark background
                }
                document.documentElement.classList.add('menu-open');
                document.body.classList.add('menu-open');
                document.body.style.overflow = 'hidden'; // prevent background scroll
            } else {
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    mobileToggle.style.color = '';
                }
                document.documentElement.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });

        // Close full page menu when a menu item is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                document.documentElement.classList.remove('menu-open');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
                mobileToggle.style.color = '';
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            const icon = sidebarToggle.querySelector('i');
            if (icon) {
                if (sidebar.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    sidebarToggle.style.color = '#FFFFFF'; // ensure visibility on dark background
                    document.body.style.overflow = 'hidden'; // prevent background scroll
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    sidebarToggle.style.color = '';
                    document.body.style.overflow = '';
                }
            }
        });

        // Close full page sidebar when any navigation link is clicked
        sidebar.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
                document.body.style.overflow = '';
                sidebarToggle.style.color = '';
                const icon = sidebarToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // Advisory Consultation Form Validation & Redirection
    const consultForm = document.getElementById('consultForm');
    if (consultForm) {
        const fields = [
            { id: 'firstName', errorId: 'firstNameError', validate: val => val.trim() !== '', errorMsg: 'Please enter your first name' },
            { id: 'lastName', errorId: 'lastNameError', validate: val => val.trim() !== '', errorMsg: 'Please enter your last name' },
            { 
                id: 'email', 
                errorId: 'emailError', 
                validate: val => {
                    if (val.trim() === '') return false;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(val.trim());
                },
                errorMsg: val => val.trim() === '' ? 'Please enter your email address' : 'Please enter a valid email address'
            },
            { id: 'investorCategory', errorId: 'categoryError', validate: val => val && val.trim() !== '', errorMsg: 'Please select an investor category' },
            { id: 'message', errorId: 'messageError', validate: val => val.trim() !== '', errorMsg: 'Please enter your message or investment objective' }
        ];

        // Attach input/change event listener to clear error as user types
        fields.forEach(fieldInfo => {
            const inputElem = document.getElementById(fieldInfo.id);
            const errorElem = document.getElementById(fieldInfo.errorId);
            if (inputElem) {
                const clearError = () => {
                    inputElem.classList.remove('is-invalid');
                    if (errorElem) {
                        errorElem.textContent = '';
                    }
                };
                inputElem.addEventListener('input', clearError);
                inputElem.addEventListener('change', clearError);
            }
        });

        consultForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            fields.forEach(fieldInfo => {
                const inputElem = document.getElementById(fieldInfo.id);
                const errorElem = document.getElementById(fieldInfo.errorId);
                if (!inputElem) return;

                const val = inputElem.value;
                const fieldValid = fieldInfo.validate(val);

                if (!fieldValid) {
                    isValid = false;
                    inputElem.classList.add('is-invalid');
                    if (errorElem) {
                        errorElem.textContent = typeof fieldInfo.errorMsg === 'function' ? fieldInfo.errorMsg(val) : fieldInfo.errorMsg;
                    }
                } else {
                    inputElem.classList.remove('is-invalid');
                    if (errorElem) {
                        errorElem.textContent = '';
                    }
                }
            });

            if (isValid) {
                consultForm.reset();
                window.location.href = '404.html';
            }
        });
    }

    // Footer Newsletter Mailbox Handling: Reset input data & redirect to 404 error page
    const newsletterForms = document.querySelectorAll('.newsletter-box');
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('.newsletter-input');
            if (input && input.value.trim() !== '') {
                input.value = '';
                form.reset();
                window.location.href = '404.html';
            }
        });
    });

    // FAQ Accordion Open / Close Toggle
    const faqBoxes = document.querySelectorAll('.faq-box');
    faqBoxes.forEach(box => {
        const header = box.querySelector('.faq-header') || box.querySelector('h4');
        if (header) {
            header.addEventListener('click', () => {
                box.classList.toggle('active');
            });
        }
    });

    // Running Numbers Counter Animation for Stats Banner (supporting mirror: true)
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                const el = entry.target;
                const targetVal = parseFloat(el.getAttribute('data-target'));
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
                const isMirror = el.getAttribute('data-mirror') === 'true';

                if (entry.isIntersecting) {
                    const duration = 2000; // 2 seconds animation
                    const startTime = performance.now();

                    if (el._animFrame) cancelAnimationFrame(el._animFrame);

                    function updateNumber(currentTime) {
                        const elapsedTime = currentTime - startTime;
                        const progress = Math.min(elapsedTime / duration, 1);
                        // Ease out cubic function for smooth slowing down at end
                        const easeOutProgress = 1 - Math.pow(1 - progress, 3);
                        const currentVal = easeOutProgress * targetVal;

                        if (decimals > 0) {
                            el.textContent = prefix + currentVal.toFixed(decimals) + suffix;
                        } else {
                            el.textContent = prefix + Math.floor(currentVal).toLocaleString() + suffix;
                        }

                        if (progress < 1) {
                            el._animFrame = requestAnimationFrame(updateNumber);
                        } else {
                            if (decimals > 0) {
                                el.textContent = prefix + targetVal.toFixed(decimals) + suffix;
                            } else {
                                el.textContent = prefix + targetVal.toLocaleString() + suffix;
                            }
                        }
                    }

                    el._animFrame = requestAnimationFrame(updateNumber);
                    if (!isMirror) {
                        obs.unobserve(el);
                    }
                } else if (isMirror) {
                    if (el._animFrame) cancelAnimationFrame(el._animFrame);
                    if (decimals > 0) {
                        el.textContent = prefix + (0).toFixed(decimals) + suffix;
                    } else {
                        el.textContent = prefix + '0' + suffix;
                    }
                }
            });
        }, { threshold: 0.2 });

        statNumbers.forEach(num => observer.observe(num));
    }

    // Interactive Blog Category Filtering
    const categoryTabs = document.querySelectorAll('.category-tab');
    const blogCards = document.querySelectorAll('.blog-card[data-category]');

    if (categoryTabs.length > 0) {
        categoryTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                categoryTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const selectedCategory = tab.getAttribute('data-category');

                blogCards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                        card.classList.remove('filter-hidden');
                        card.style.display = '';
                    } else {
                        card.classList.add('filter-hidden');
                    }
                });
            });
        });
    }

});

