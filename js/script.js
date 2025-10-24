// ========================================
// Carousel Code (only runs if carousel exists)
// ========================================
(function() {
    const cards = document.querySelectorAll(".card");
    const dots = document.querySelectorAll(".dot");
    const memberName = document.querySelector(".member-name");
    const memberRole = document.querySelector(".member-role");
    const leftArrow = document.querySelector(".nav-arrow.left");
    const rightArrow = document.querySelector(".nav-arrow.right");
    
    // Only run carousel code if all required elements exist
    if (!cards.length || !dots.length || !memberName || !memberRole || !leftArrow || !rightArrow) {
        return; // Exit if carousel elements don't exist on this page
    }

    const researchTracks = [
        { name: "Artificial Intelligence", role: "AI & ML" },
        { name: "Data Science", role: "Big Data Analytics" },
        { name: "Internet of Things", role: "IoT & Smart Systems" },
        { name: "Cybersecurity", role: "Cryptography" },
        { name: "Natural Language", role: "NLP & Speech" },
        { name: "Computer Vision", role: "Image Processing" },
        { name: "Interdisciplinary Research", role: "Distributed Tech" },
        { name: "Computational Intelligence", role: "Emerging Tech" }
    ];

    let currentIndex = 0;
    let isAnimating = false;

    function updateCarousel(newIndex) {
	if (isAnimating) return;
	isAnimating = true;

	currentIndex = (newIndex + cards.length) % cards.length;

	cards.forEach((card, i) => {
		const offset = (i - currentIndex + cards.length) % cards.length;

		card.classList.remove(
			"center",
			"left-1",
			"left-2",
			"right-1",
			"right-2",
			"hidden"
		);

		if (offset === 0) {
			card.classList.add("center");
		} else if (offset === 1) {
			card.classList.add("right-1");
		} else if (offset === 2) {
			card.classList.add("right-2");
		} else if (offset === cards.length - 1) {
			card.classList.add("left-1");
		} else if (offset === cards.length - 2) {
			card.classList.add("left-2");
		} else {
			card.classList.add("hidden");
		}
	});

	dots.forEach((dot, i) => {
		dot.classList.toggle("active", i === currentIndex);
	});

	memberName.style.opacity = "0";
	memberRole.style.opacity = "0";

	setTimeout(() => {
		memberName.textContent = researchTracks[currentIndex].name;
		memberRole.textContent = researchTracks[currentIndex].role;
		memberName.style.opacity = "1";
		memberRole.style.opacity = "1";
	}, 300);

	setTimeout(() => {
		isAnimating = false;
	}, 800);
}

leftArrow.addEventListener("click", () => {
	updateCarousel(currentIndex - 1);
});

rightArrow.addEventListener("click", () => {
	updateCarousel(currentIndex + 1);
});

dots.forEach((dot, i) => {
	dot.addEventListener("click", () => {
		updateCarousel(i);
	});
});

cards.forEach((card, i) => {
	card.addEventListener("click", () => {
		updateCarousel(i);
	});
});

document.addEventListener("keydown", (e) => {
	if (e.key === "ArrowLeft") {
		updateCarousel(currentIndex - 1);
	} else if (e.key === "ArrowRight") {
		updateCarousel(currentIndex + 1);
	}
});

let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
	touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
	touchEndX = e.changedTouches[0].screenX;
	handleSwipe();
});

function handleSwipe() {
	const swipeThreshold = 50;
	const diff = touchStartX - touchEndX;

	if (Math.abs(diff) > swipeThreshold) {
		if (diff > 0) {
			updateCarousel(currentIndex + 1);
		} else {
			updateCarousel(currentIndex - 1);
		}
	}
}

    // Initialize carousel
    updateCarousel(0);
})(); // End of carousel IIFE

// ========================================
// Navbar and Mobile Menu Code
// ========================================
(function() {
    // State variables
    let isOpen = false;
    let isClosing = false;
    let isMobile = false;
    let isScrolled = false;
    let kietSlideIndex = 0;
    let kietAutoSlideInterval = null;

    // DOM elements
    const navbar = document.getElementById('navbar');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const menuIcon = document.getElementById('menuIcon');
    const mobileNavOverlay = document.getElementById('mobileNavOverlay');
    const mobileBackdrop = document.getElementById('mobileBackdrop');
    const posterImage = document.getElementById('posterImage');
    const kietSlides = document.querySelectorAll('.kiet-slide');
    const kietDots = document.querySelectorAll('.kiet-dot');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    // KIET Image Slider Functions
    function setKietSlide(index) {
        kietSlideIndex = index;
        
        // Update images opacity
        kietSlides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });
        
        // Update dots
        kietDots.forEach((dot, i) => {
            if (i === index) {
                dot.style.width = '12px';
                dot.style.height = '12px';
                dot.style.backgroundColor = 'white';
            } else {
                dot.style.width = '10px';
                dot.style.height = '10px';
                dot.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            }
        });
    }

    // Auto-slide for KIET images every 3 seconds
    function startKietAutoSlide() {
        if (kietSlides.length > 0) {
            kietAutoSlideInterval = setInterval(() => {
                kietSlideIndex = (kietSlideIndex === 0) ? 1 : 0;
                setKietSlide(kietSlideIndex);
            }, 3000);
        }
    }

    // Make setKietSlide available globally for onclick handlers
    window.setKietSlide = setKietSlide;

    // Check if mobile view
    function checkMobile() {
        isMobile = window.innerWidth <= 1024;
        // only update poster image if present
        if (typeof updatePosterImage === 'function') {
            try { updatePosterImage(); } catch (e) { /* ignore if poster not present */ }
        }
    }

    // Update poster image based on screen size
    function updatePosterImage() {
        if (!posterImage) return;
        if (isMobile) {
            posterImage.src = 'assets/POSTER.png';
        } else {
            posterImage.src = 'assets/POSTER-1.png';
        }
    }

    // Handle scroll behavior
    function handleScroll() {
        if (!navbar) return;
        
        const scrollTop = window.scrollY;
        // Calculate poster height dynamically if poster exists, otherwise use default
        let posterHeight = 50; // Lower threshold for pages without poster
        
        const posterSection = document.querySelector('.poster-section');
        if (posterSection) {
            posterHeight = posterSection.offsetHeight;
        } else {
            posterHeight = isMobile ? 50 : 80;
        }
        
        const shouldBeScrolled = scrollTop > posterHeight;

        if (shouldBeScrolled !== isScrolled) {
            isScrolled = shouldBeScrolled;
            if (isScrolled) {
                navbar.classList.add('sticky');
            } else {
                navbar.classList.remove('sticky');
            }
        }
    }

    // Open mobile menu
    function openMenu() {
        if (!mobileNavOverlay || !mobileBackdrop || !menuIcon) return;
        
        isClosing = false;
        isOpen = true;
        
        mobileNavOverlay.classList.remove('closing');
        mobileNavOverlay.classList.add('active');
        mobileBackdrop.classList.remove('closing');
        mobileBackdrop.classList.add('active');
        
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
        
        document.body.classList.add('menu-open');
    }

    // Close mobile menu
    function closeMenu() {
        if (!mobileNavOverlay || !mobileBackdrop || !menuIcon) return;
        
        isClosing = true;
        
        mobileNavOverlay.classList.add('closing');
        mobileBackdrop.classList.add('closing');
        
        setTimeout(() => {
            isOpen = false;
            isClosing = false;
            
            mobileNavOverlay.classList.remove('active', 'closing');
            mobileBackdrop.classList.remove('active', 'closing');
            
            menuIcon.classList.remove('fa-times');
            menuIcon.classList.add('fa-bars');
            
            document.body.classList.remove('menu-open');
        }, 300);
    }

    // Toggle menu
    function toggleMenu() {
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Event Listeners - with null checks
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }
    
    if (mobileBackdrop) {
        mobileBackdrop.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking on mobile nav links
    if (mobileNavLinks && mobileNavLinks.length > 0) {
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    window.addEventListener('resize', checkMobile);
    
    if (navbar) {
        window.addEventListener('scroll', handleScroll);
    }

    // Initial checks
    checkMobile();
    if (navbar) {
        handleScroll();
    }
    
    // Start KIET image auto-slide
    startKietAutoSlide();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        document.body.style.overflow = 'auto';
        if (kietAutoSlideInterval) {
            clearInterval(kietAutoSlideInterval);
        }
    });
})();

// ========================================
// Scroll to Top Button with Progress
// ========================================
(function() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const progressCircle = document.getElementById('progressCircle');
    const circumference = 2 * Math.PI * 23; // Radius of SVG circle is 23
    
    // Set initial stroke-dasharray
    progressCircle.style.strokeDasharray = circumference;
    progressCircle.style.strokeDashoffset = circumference;
    
    function handleScrollProgress() {
        // Show/hide button based on scroll position
        if (window.pageYOffset > 300) {
            scrollToTopBtn.style.display = 'flex';
        } else {
            scrollToTopBtn.style.display = 'none';
        }
        
        // Calculate scroll progress
        const scrollTop = document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        // Update circle progress
        const offset = circumference - (progress / 100) * circumference;
        progressCircle.style.strokeDashoffset = offset;
    }
    
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', handleScrollProgress);
    scrollToTopBtn.addEventListener('click', scrollToTop);
    
    // Initial check
    handleScrollProgress();
})();
