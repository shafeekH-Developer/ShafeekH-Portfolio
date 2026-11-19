/**
 * Main Interactive Features Script for Shafeek H Portfolio
 * Features:
 * - Role Typing Animation
 * - Interactive Canvas Particle Graph
 * - Scrollspy & Sticky Glass Header
 * - Scroll Reveal Animations
 * - Animated Skill Meters
 * - Contact Form Handler
 * - Custom Cursor & Scroll-to-Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  /* -------------------------------------------------------------
   * 1. Typing Animation
   * ------------------------------------------------------------- */
  const typingElement = document.getElementById('typingText');
  const roles = [
    'Front-End Developer',
    'Full-Stack Developer',
    'React & Flask Developer',
    'Responsive Web Designer',
    'Python Developer'
  ];
  
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeRole() {
    if (!typingElement) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typeSpeed = 2000; // Pause at end
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typeSpeed = 500; // Pause before next word
    }

    setTimeout(typeRole, typeSpeed);
  }

  typeRole();

  /* -------------------------------------------------------------
   * 2. Hero Background Canvas Geometric Particle Graph
   * ------------------------------------------------------------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resizeCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? '#3B82F6' : '#06B6D4';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 45);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.18 * (1 - dist / 130)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      requestAnimationFrame(animateParticles);
    }

    animateParticles();
  }

  /* -------------------------------------------------------------
   * 3. Header Scrollspy & Sticky Glass Effect
   * ------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function handleScroll() {
    // Header glass transition
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scrollspy active link
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });

    // Scroll To Top button visibility
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  }

  window.addEventListener('scroll', handleScroll);

  /* -------------------------------------------------------------
   * 4. Mobile Navigation Drawer Toggle
   * ------------------------------------------------------------- */
  const mobileToggle = document.getElementById('mobileToggle');
  const navDrawer = document.getElementById('navDrawer');

  if (mobileToggle && navDrawer) {
    mobileToggle.addEventListener('click', () => {
      navDrawer.classList.toggle('open');
    });

    // Close menu when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navDrawer.classList.remove('open');
      });
    });
  }

  /* -------------------------------------------------------------
   * 5. Scroll Reveal & Skill Progress Fill
   * ------------------------------------------------------------- */
  const observerOptions = {
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');

        // If skill card is revealed, trigger skill progress bars fill
        if (entry.target.classList.contains('skills-section')) {
          fillSkillBars();
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  function fillSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    skillBars.forEach(bar => {
      const progress = bar.getAttribute('data-progress');
      bar.style.width = `${progress}%`;
    });
  }

  /* -------------------------------------------------------------
   * 6. Contact Form Handler with Google Forms & Confirmation Modal
   * ------------------------------------------------------------- */
  const contactForm = document.getElementById('contactForm');
  const toastMsg = document.getElementById('toastMsg');
  const confirmModal = document.getElementById('confirmModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalOkBtn = document.getElementById('modalOkBtn');
  const modalSenderName = document.getElementById('modalSenderName');

  function openConfirmModal(senderName) {
    if (confirmModal) {
      if (modalSenderName) {
        modalSenderName.textContent = senderName || 'Friend';
      }
      confirmModal.classList.add('active');
      confirmModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeConfirmModal() {
    if (confirmModal) {
      confirmModal.classList.remove('active');
      confirmModal.setAttribute('aria-hidden', 'true');
    }
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeConfirmModal);
  if (modalOkBtn) modalOkBtn.addEventListener('click', closeConfirmModal);
  if (confirmModal) {
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) {
        closeConfirmModal();
      }
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const nameInput = document.getElementById('senderName');
      const emailInput = document.getElementById('senderEmail');
      const msgInput = document.getElementById('senderMsg');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = msgInput ? msgInput.value.trim() : '';

      if (!name || !email || !message) {
        e.preventDefault();
        alert('Please fill out all fields before submitting.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Sending...</span>`;
      }

      // Allow native form POST to hidden_iframe target, then trigger UI confirmation
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }

        openConfirmModal(name);

        if (toastMsg) {
          toastMsg.classList.add('show');
          setTimeout(() => {
            toastMsg.classList.remove('show');
          }, 4500);
        }

        contactForm.reset();
      }, 1000);
    });
  }

  /* -------------------------------------------------------------
   * 7. Custom Mouse Cursor Glow Effect
   * ------------------------------------------------------------- */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 992) {
    document.addEventListener('mousemove', (e) => {
      cursorGlow.style.left = `${e.clientX}px`;
      cursorGlow.style.top = `${e.clientY}px`;
    });
  }

  /* -------------------------------------------------------------
   * 8. Scroll To Top Button
   * ------------------------------------------------------------- */
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});