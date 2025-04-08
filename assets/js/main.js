document.addEventListener('DOMContentLoaded', function() {

    // Mobile menu toggle
    document.getElementById('mobile-menu-btn').addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenu.classList.toggle('hidden');
    });


    // Dynamic image loading from assets/images folder
    const carouselElement = document.getElementById('carousel');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    // Function to load images from the assets/images folder
    async function loadImagesFromFolder() {
        try {
            // In a real environment, you would make an AJAX request to get the list of images
            // For this example, we'll simulate the response with some sample image paths
            
            // This would normally be the result of an API call or directory listing
            const imagesResponse = await fetchImageList();
            
            // Process each image and add to carousel
            imagesResponse.forEach((imagePath, index) => {
                // Create image element
                const imgElement = document.createElement('img');
                imgElement.src = imagePath;
                imgElement.alt = `Architecture image ${index + 1}`;
                imgElement.classList.add('carousel-image');
                carouselElement.appendChild(imgElement);
                
                // Create indicator
                const indicator = document.createElement('div');
                indicator.classList.add('indicator');
                if (index === 0) indicator.classList.add('active');
                
                // Create progress bar
                const progress = document.createElement('div');
                progress.classList.add('indicator-progress');
                indicator.appendChild(progress);
                
                // Add click event
                indicator.addEventListener('click', () => goToSlide(index));
                
                indicatorsContainer.appendChild(indicator);
            });
            
            // Initialize carousel
            initCarousel();
            
        } catch (error) {
            console.error('Error loading images:', error);
            // Fallback to placeholder images if there's an error
            loadPlaceholderImages();
        }
    }
    
    // Simulated function to fetch image list
    // In a real environment, this would be an API call or server request
    async function fetchImageList() {
        // In a real implementation, this would be replaced with an actual API call
        // For example: const response = await fetch('/api/images');
        // const data = await response.json();
        // return data.images;
        
        // For this example, we'll return sample paths
        return [
            './assets/images/completedProjects/image1.jpg',
            './assets/images/completedProjects/image2.jpg',
            './assets/images/completedProjects/image3.jpg',
            './assets/images/completedProjects/image4.jpg',
            './assets/images/homepage/image5.jpg'
        ];
    }
    
    // Fallback function to load placeholder images if real images can't be loaded
    function loadPlaceholderImages() {
        const placeholders = [
            '/api/placeholder/1200/800',
            '/api/placeholder/1200/800',
            '/api/placeholder/1200/800',
            '/api/placeholder/1200/800',
            '/api/placeholder/1200/800'
        ];
        
        placeholders.forEach((src, index) => {
            // Create image element
            const imgElement = document.createElement('img');
            imgElement.src = src;
            imgElement.alt = `Architecture placeholder ${index + 1}`;
            imgElement.classList.add('carousel-image');
            carouselElement.appendChild(imgElement);
            
            // Create indicator
            const indicator = document.createElement('div');
            indicator.classList.add('indicator');
            if (index === 0) indicator.classList.add('active');
            
            // Create progress bar
            const progress = document.createElement('div');
            progress.classList.add('indicator-progress');
            indicator.appendChild(progress);
            
            // Add click event
            indicator.addEventListener('click', () => goToSlide(index));
            
            indicatorsContainer.appendChild(indicator);
        });
        
        // Initialize carousel
        initCarousel();
    }
    
    // Check if logo image fails to load and provide fallback
    const logoImg = document.querySelector('.logo img');
    logoImg.onerror = function() {
        // If logo image fails to load, replace with SVG fallback
        this.style.display = 'none';
        const logoDiv = document.querySelector('.logo');
        const svgLogo = document.createElement('svg');
        svgLogo.setAttribute('viewBox', '0 0 100 100');
        svgLogo.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svgLogo.innerHTML = '<path d="M30,30 C40,10 60,40 75,25" stroke="#333" stroke-width="3" fill="none"/>';
        logoDiv.appendChild(svgLogo);
    };
    
    // Start loading images
    loadImagesFromFolder();
    
    // Carousel functionality variables
    let currentIndex = 0;
    let startX, moveX;
    let isDragging = false;
    let intervalId;
    const autoplayDuration = 4000; // 4 seconds per slide
    
    // Initialize carousel functionality
    function initCarousel() {
        const carousel = document.getElementById('carousel');
        const images = carousel.querySelectorAll('.carousel-image');
        const indicators = document.querySelectorAll('.indicator');
        const progressBars = document.querySelectorAll('.indicator-progress');
        
        if (images.length === 0) {
            console.error('No images found for carousel');
            return;
        }
        
        // Function to go to a specific slide
        window.goToSlide = function(index) {
            if (intervalId) {
                clearInterval(intervalId);
            }
            
            // Reset all progress bars
            progressBars.forEach(bar => {
                bar.style.width = '0%';
            });
            
            // Remove active class from all indicators
            indicators.forEach(ind => {
                ind.classList.remove('active');
            });
            
            // Add active class to current indicator
            indicators[index].classList.add('active');
            
            // Move carousel
            carousel.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            
            // Animate progress bar for current slide
            progressBars[currentIndex].style.width = '100%';
            
            // Restart autoplay
            startAutoplay();
        };
        
        function nextSlide() {
            const newIndex = (currentIndex + 1) % images.length;
            goToSlide(newIndex);
        }
        
        function prevSlide() {
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            goToSlide(newIndex);
        }
        
        function startAutoplay() {
            if (intervalId) {
                clearInterval(intervalId);
            }
            
            // Reset current progress bar
            progressBars[currentIndex].style.width = '0%';
            
            // Force repaint to restart animation
            void progressBars[currentIndex].offsetWidth;
            
            // Start progress animation
            progressBars[currentIndex].style.width = '100%';
            
            intervalId = setInterval(() => {
                nextSlide();
            }, autoplayDuration);
        }
        
        // Touch events for mobile swiping
        carousel.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            if (intervalId) {
                clearInterval(intervalId);
            }
        });
        
        carousel.addEventListener('touchmove', (e) => {
            if (!startX) return;
            
            moveX = e.touches[0].clientX;
            const diff = startX - moveX;
            
            // Prevent overscrolling
            if ((currentIndex === 0 && diff < 0) || 
                (currentIndex === images.length - 1 && diff > 0)) {
                return;
            }
            
            const translateX = -currentIndex * 100 - (diff / carousel.offsetWidth) * 100;
            carousel.style.transform = `translateX(${translateX}%)`;
        });
        
        carousel.addEventListener('touchend', (e) => {
            if (!startX || !moveX) return;
            
            const diff = startX - moveX;
            
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            } else {
                // Return to current slide if swipe wasn't far enough
                carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
            }
            
            startX = null;
            moveX = null;
            startAutoplay();
        });
        
        // Mouse events for desktop dragging
        carousel.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            carousel.style.cursor = 'grabbing';
            if (intervalId) {
                clearInterval(intervalId);
            }
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            moveX = e.clientX;
            const diff = startX - moveX;
            
            // Prevent overscrolling
            if ((currentIndex === 0 && diff < 0) || 
                (currentIndex === images.length - 1 && diff > 0)) {
                return;
            }
            
            const translateX = -currentIndex * 100 - (diff / carousel.offsetWidth) * 100;
            carousel.style.transform = `translateX(${translateX}%)`;
        });
        
        document.addEventListener('mouseup', (e) => {
            if (!isDragging) return;
            
            isDragging = false;
            carousel.style.cursor = 'grab';
            
            if (startX && moveX) {
                const diff = startX - moveX;
                
                if (Math.abs(diff) > 50) {
                    if (diff > 0) {
                        nextSlide();
                    } else {
                        prevSlide();
                    }
                } else {
                    // Return to current slide if drag wasn't far enough
                    carousel.style.transform = `translateX(-${currentIndex * 100}%)`;
                }
            }
            
            startX = null;
            moveX = null;
            startAutoplay();
        });
        
        // Start with first slide
        goToSlide(0);
        
        // Make carousel draggable
        carousel.style.cursor = 'grab';
    }
});