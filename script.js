document.addEventListener('DOMContentLoaded', () => {
    // Initialize Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'page_view', {
            'page_title': document.title,
            'page_location': window.location.href,
            'page_path': window.location.pathname
        });
    }

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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

    // Navbar scroll effect
    const nav = document.querySelector('.main-nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.classList.remove('scroll-up');
            return;
        }
        
        if (currentScroll > lastScroll && !nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-up');
            nav.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && nav.classList.contains('scroll-down')) {
            nav.classList.remove('scroll-down');
            nav.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });

    // Modal functionality
    const modal = document.querySelector('.project-modal');
    const closeModal = document.querySelector('.close-modal');
    const viewProjectButtons = document.querySelectorAll('.view-project');

    if (modal && closeModal && viewProjectButtons.length > 0) {
        console.log('Modal elements found:', {
            modal: true,
            closeButton: true,
            viewButtons: viewProjectButtons.length
        });

        // Function to show modal
        function showModal() {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        // Function to hide modal
        function hideModal() {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }

        // Add click event to all View Project buttons
        viewProjectButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('View Project button clicked');
                
                // Get the project card
                const projectCard = this.closest('.work-card');
                
                // Get project details
                const projectType = projectCard.querySelector('.work-type').textContent;
                const projectTitle = projectCard.querySelector('h3').textContent;
                const projectTags = projectCard.querySelector('.work-tags').innerHTML;
                const projectImage = projectCard.querySelector('.work-image img').src;
                const projectDescription = projectCard.dataset.fullDescription || projectCard.querySelector('.work-description').textContent;
                
                // Get additional details from data attributes
                const client = projectCard.dataset.client || 'Not specified';
                const role = projectCard.dataset.role || 'Not specified';
                const duration = projectCard.dataset.duration || 'Not specified';
                const tools = projectCard.dataset.tools || 'Not specified';
                const resourceUrl = projectCard.dataset.resourceUrl;

                // Update modal content
                const modalHeader = modal.querySelector('.modal-header');
                modalHeader.querySelector('.work-type').textContent = projectType;
                modalHeader.querySelector('h2').textContent = projectTitle;
                modalHeader.querySelector('.modal-tags').innerHTML = projectTags;

                modal.querySelector('.modal-image').src = projectImage;
                modal.querySelector('.modal-description').textContent = projectDescription;

                // Update modal details
                const modalDetails = modal.querySelectorAll('.modal-detail p');
                modalDetails[0].textContent = client;
                modalDetails[1].textContent = role;
                modalDetails[2].textContent = duration;
                modalDetails[3].textContent = tools;

                // Update resource link
                const resourceLink = modal.querySelector('.resource-link');
                const resourceSection = modal.querySelector('.resource-section');
                if (resourceUrl) {
                    // Ensure the URL is treated as an external link
                    if (resourceUrl.startsWith('http')) {
                        resourceLink.href = resourceUrl;
                        resourceLink.target = '_blank';
                        resourceLink.rel = 'noopener noreferrer';
                    } else {
                        // Handle local files if needed
                        resourceLink.href = resourceUrl;
                    }
                    
                    // Determine if it's a file or link based on the URL
                    const isFile = resourceUrl.includes('/download/') || 
                                 resourceUrl.match(/\.(pdf|doc|docx|xls|xlsx|zip|rar|txt)$/i);
                    modal.querySelector('.resource-type').textContent = isFile ? 'File' : 'Link';
                    resourceSection.style.display = 'block';
                    
                    // Add click handler for the resource link
                    resourceLink.addEventListener('click', function(e) {
                        // Allow the link to work normally
                        e.stopPropagation();
                        if (resourceUrl.startsWith('http')) {
                            window.open(resourceUrl, '_blank', 'noopener,noreferrer');
                        }
                    });
                } else {
                    resourceSection.style.display = 'none';
                }

                // Show modal
                showModal();
            });
        });

        // Close modal when clicking the close button
        closeModal.addEventListener('click', (e) => {
            e.preventDefault();
            hideModal();
        });

        // Close modal when clicking outside the modal content
        modal.addEventListener('click', function(e) {
            // Only close if clicking the modal overlay (not the content)
            if (e.target === modal) {
                hideModal();
            }
        });

        // Close modal when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('show')) {
                hideModal();
            }
        });
    } else {
        console.warn('Some modal elements not found:', {
            modal: !!modal,
            closeButton: !!closeModal,
            viewButtons: viewProjectButtons.length
        });
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.querySelector('.form-message.success');
    const errorMessage = document.querySelector('.form-message.error');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Form submitted, preparing to send email...');

            // Get form data
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };

            console.log('Form data collected:', formData);
            console.log('EmailJS initialized with public key:', emailjs.init("Vt4YHZgMfmEPqUrtX"));

            // Send email using EmailJS
            emailjs.send('service_kzv8897', 'template_8zsrqzd', formData)
                .then(function(response) {
                    console.log('Email sent successfully!', response);
                    // Show success message
                    successMessage.style.display = 'block';
                    errorMessage.style.display = 'none';
                    // Reset form
                    contactForm.reset();
                })
                .catch(function(error) {
                    console.error('Failed to send email:', error);
                    // Show error message
                    errorMessage.style.display = 'block';
                    successMessage.style.display = 'none';
                });
        });
    }
}); 