/**
 * Avinash Saripalli - Portfolio Interactivity Engine
 * Clean, lightweight, vanilla JavaScript (ES6+)
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeaderAndScroll();
  initMobileMenu();
  initTypewriter();
  initTimelineTabs();
  initSkillsFilter();
  initProjectsFilter();
  initInteractiveTerminal();
  initClipboardAndToast();
  initScrollToTop();
  initContactForm();
  updateCurrentYear();
});

/* ==========================================================================
   1. Theme Management (Dark / Light with LocalStorage Persistence)
   ========================================================================== */
function initTheme() {
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const html = document.documentElement;

  // Retrieve saved preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = html.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('theme', newTheme);
      showToast(`Switched to ${newTheme} theme`);
    });
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    if (themeIcon) {
      if (theme === 'dark') {
        themeIcon.className = 'bx bx-moon';
      } else {
        themeIcon.className = 'bx bx-sun';
      }
    }
  }
}

/* ==========================================================================
   2. Sticky Header & Scroll Spy Navigation
   ========================================================================== */
function initHeaderAndScroll() {
  const header = document.getElementById('header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    // Header shadow and backdrop on scroll
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Active link highlighting via Scroll Spy
    let currentSectionId = '';
    const scrollPosition = window.scrollY + 120;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Mobile Navigation Menu Toggle
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-icon');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuBtn || !navbar) return;

  function toggleMenu() {
    const isActive = navbar.classList.toggle('active');
    menuBtn.classList.toggle('active');
    menuBtn.setAttribute('aria-expanded', isActive);
  }

  function closeMenu() {
    navbar.classList.remove('active');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  // Close when clicking outside navbar on mobile
  document.addEventListener('click', (e) => {
    if (navbar.classList.contains('active') && !navbar.contains(e.target) && !menuBtn.contains(e.target)) {
      closeMenu();
    }
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navbar.classList.contains('active')) {
      closeMenu();
    }
  });
}

/* ==========================================================================
   4. Hero Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const typewriterElement = document.getElementById('typewriter');
  if (!typewriterElement) return;

  const roles = [
    'MERN Stack Developer',
    'React.js Specialist',
    'Frontend Engineer',
    'Full-Stack Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      // Pause at full text
      isDeleting = true;
      typingSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      // Switch to next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   5. Experience & Education Timeline Tabs
   ========================================================================== */
function initTimelineTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabPanels = document.querySelectorAll('.tab-panel');

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      tabBtns.forEach((b) => b.classList.remove('active'));
      tabPanels.forEach((p) => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPanel = document.getElementById(`tab-${targetTab}`);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6. Skills Matrix Filtering
   ========================================================================== */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.skill-filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.35s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   7. Projects Showcase Filtering
   ========================================================================== */
function initProjectsFilter() {
  const filterBtns = document.querySelectorAll('.proj-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   8. Interactive Developer CLI Terminal Simulator
   ========================================================================== */
function initInteractiveTerminal() {
  const form = document.getElementById('terminal-form');
  const input = document.getElementById('terminal-input');
  const output = document.getElementById('terminal-output');
  const clearBtn = document.getElementById('terminal-clear-btn');
  const shortcutPills = document.querySelectorAll('.cmd-pill');

  if (!form || !input || !output) return;

  const commands = {
    help: `Available Commands:
  • <span class="term-highlight">skills</span>      - List core frontend & backend competencies
  • <span class="term-highlight">experience</span>  - View professional work history at Karncy Ventures
  • <span class="term-highlight">projects</span>    - Browse key production & research projects
  • <span class="term-highlight">education</span>   - Display academic degrees & achievements
  • <span class="term-highlight">contact</span>     - View direct email, phone, location & socials
  • <span class="term-highlight">hobbies</span>     - What I enjoy doing outside of work
  • <span class="term-highlight">clear</span>       - Clear current console output`,

    skills: `Technical Arsenal:
  [Frontend]:  React.js, Redux / Redux Toolkit, JavaScript (ES6+), Material UI, HTML5, Modern CSS3
  [Backend]:   Node.js, Express.js, RESTful APIs, JWT Authentication
  [Database]:  MongoDB, MySQL
  [Dev Tools]: Git, GitHub, Postman, VS Code, Vercel
  [Core]:      Component Lifecycle, Responsive Design, Clean Code Architecture`,

    experience: `Current Role:
  • <span class="term-highlight">Software Developer</span> @ Karncy Ventures Private Limited (Oct 2024 - Present)
    - Engineered responsive web apps using ReactJS and Material UI.
    - Implemented role-based dashboards and state flows with Redux.
    - Integrated high-throughput REST APIs and reduced latency.
    - Available for immediate joining for new full-time / contract roles.`,

    projects: `Featured Projects:
  1. <span class="term-highlight">Employee Management System</span> (React, Node, Express, MySQL, JWT)
     - Role-based permissions, automated CRUD, analytical dashboards.
  2. <span class="term-highlight">CP-ABE-HP Cloud Security</span> (Java, Cryptography, Cloud Computing)
     - Ciphertext-policy attribute encryption with hidden policy and user revocation.
  3. <span class="term-highlight">MERN E-Commerce Platform</span> (React, Redux, Node, MongoDB)
     - Shopping cart state persistence, product filtering, responsive UI.`,

    education: `Academic Credentials:
  • <span class="term-highlight">B.Tech in Computer Science & Engineering</span>
    - Sir C. R. Reddy College of Engineering (2019 - 2023) | CGPA: 6.74
  • <span class="term-highlight">Intermediate (MPC)</span>
    - Sri Chaitanya Junior College (2017 - 2019) | CGPA: 9.5 (Distinction)`,

    contact: `Direct Contacts:
  • Email:    <a href="mailto:avinashsaripalli2000@gmail.com" class="term-highlight">avinashsaripalli2000@gmail.com</a>
  • Phone:    <a href="tel:+919603883879" class="term-highlight">+91 9603883879</a>
  • WhatsApp: <a href="https://wa.me/919603883879" target="_blank" class="term-highlight">wa.me/919603883879</a>
  • GitHub:   <a href="https://github.com/AvinashSaripalli" target="_blank" class="term-highlight">github.com/AvinashSaripalli</a>
  • Location: Hyderabad, Telangana, India`,

    hobbies: `Outside of Code:
  • Exploring emerging UI/UX design trends & web micro-interactions.
  • Experimenting with open-source tools and JavaScript libraries.
  • Playing cricket, chess, and following developer tech podcasts.`,

    sudo: `Permission Denied: You are already granted VIP guest access to Avinash's terminal!`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Append echoed command
    const cmdEcho = document.createElement('div');
    cmdEcho.className = 'term-line';
    cmdEcho.innerHTML = `<span class="terminal-prompt">avinash@dev:~$</span> <span class="term-cmd-echo">${escapeHtml(rawCmd)}</span>`;
    output.appendChild(cmdEcho);

    // Process response
    if (cmd === 'clear') {
      output.innerHTML = '';
    } else if (commands[cmd]) {
      const response = document.createElement('div');
      response.className = 'term-line output-text';
      response.innerHTML = commands[cmd];
      output.appendChild(response);
    } else {
      const notFound = document.createElement('div');
      notFound.className = 'term-line output-text text-muted';
      notFound.innerHTML = `command not found: <span style="color:#ef4444">${escapeHtml(cmd)}</span>. Type <span class="term-highlight">help</span> for available commands.`;
      output.appendChild(notFound);
    }

    output.scrollTop = output.scrollHeight;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    executeCommand(input.value);
    input.value = '';
  });

  shortcutPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const cmd = pill.getAttribute('data-cmd');
      executeCommand(cmd);
    });
  });

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      output.innerHTML = '';
      showToast('Terminal screen cleared');
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }
}

/* ==========================================================================
   9. Clipboard Copying & Toast Notifications
   ========================================================================== */
function initClipboardAndToast() {
  const copyButtons = document.querySelectorAll('.copy-btn');

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const textToCopy = btn.getAttribute('data-clipboard');
      if (textToCopy) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast(`Copied "${textToCopy}" to clipboard!`);
        }).catch(() => {
          // Fallback if permission blocked
          showToast(`Selected: ${textToCopy}`);
        });
      }
    });
  });
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-message');

  if (!toast || !toastMsg) return;

  toastMsg.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

/* ==========================================================================
   10. Scroll To Top with Circular Progress Meter
   ========================================================================== */
function initScrollToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  const circle = document.querySelector('.progress-ring-circle');

  if (!backToTopBtn || !circle) return;

  const radius = circle.r.baseVal.value;
  const circumference = 2 * Math.PI * radius;

  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;

  window.addEventListener('scroll', () => {
    const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollCurrent = window.scrollY;

    if (scrollCurrent > 300) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }

    if (scrollTotal > 0) {
      const scrollProgress = scrollCurrent / scrollTotal;
      const offset = circumference - (scrollProgress * circumference);
      circle.style.strokeDashoffset = offset;
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   11. Contact Form Handler (Validation & Interactive Feedback)
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const statusDiv = document.getElementById('form-status');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (!form || !statusDiv) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      statusDiv.className = 'form-status error';
      statusDiv.textContent = 'Please fill out all required fields.';
      return;
    }

    // Interactive button state
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="bx bx-loader-alt bx-spin"></i> <span>Preparing Message...</span>`;

    setTimeout(() => {
      // Create mailto link for seamless local email client trigger as reliable fallback
      const mailtoUrl = `mailto:avinashsaripalli2000@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\nMessage:\n${message}`)}`;
      
      statusDiv.className = 'form-status success';
      statusDiv.innerHTML = `Thank you, <strong>${escapeHtml(name)}</strong>! Launching your email client... (or email directly at avinashsaripalli2000@gmail.com)`;
      
      showToast('Opening email client...');
      window.location.href = mailtoUrl;

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
      form.reset();
    }, 700);
  });

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[m]);
  }
}

/* ==========================================================================
   12. Automatic Current Year
   ========================================================================== */
function updateCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}