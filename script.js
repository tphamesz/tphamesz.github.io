/**
 * Terfa Daniel Akpagher — Personal Portfolio
 * File: script.js
 * Description: Production-ready vanilla JavaScript handling theme toggling,
 *              project filtering, interactive specs modal, email clipboard copying,
 *              accessible navigation, and form validation.
 * Zero external libraries or frameworks.
 */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // =========================================================================
  // 1. THEME MANAGEMENT (Dark / Light Mode)
  // =========================================================================
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or check system scheme
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("portfolio-theme");
    if (savedTheme === "light" || savedTheme === "dark") {
      return savedTheme;
    }
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  };

  const applyTheme = (theme) => {
    htmlRoot.setAttribute("data-theme", theme);
    localStorage.setItem("portfolio-theme", theme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      );
    }
  };

  applyTheme(getInitialTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      const currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(nextTheme);
    });
  }

  // Listen for OS theme updates if user has not set explicit override
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("portfolio-theme")) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  // =========================================================================
  // 2. MOBILE MENU DRAWER
  // =========================================================================
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileNav = document.getElementById("mobile-nav");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  const toggleMobileMenu = (forceClose = false) => {
    if (!mobileNav || !mobileMenuBtn) return;
    const isExpanded = mobileMenuBtn.getAttribute("aria-expanded") === "true";
    const shouldOpen = forceClose ? false : !isExpanded;

    mobileMenuBtn.setAttribute("aria-expanded", String(shouldOpen));
    mobileNav.setAttribute("aria-hidden", String(!shouldOpen));
    mobileNav.classList.toggle("open", shouldOpen);
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", () => toggleMobileMenu());
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => toggleMobileMenu(true));
  });

  // Close mobile drawer on escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileNav && mobileNav.classList.contains("open")) {
      toggleMobileMenu(true);
    }
  });

  // =========================================================================
  // 3. ACTIVE NAVIGATION LINK ON SCROLL
  // =========================================================================
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll("section[id]");

  const updateActiveNavLink = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = 120;

    sections.forEach((section) => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - headerOffset;
      const sectionId = section.getAttribute("id");

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  updateActiveNavLink();

  // =========================================================================
  // 4. SELECTED WORKS CASE INDEX TRACKER & SMOOTH JUMP
  // =========================================================================
  const caseIndexLinks = document.querySelectorAll(".index-nav-link");
  const caseCards = document.querySelectorAll(".work-showcase-card");

  const updateActiveCaseIndex = () => {
    if (!caseIndexLinks.length || !caseCards.length) return;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerOffset = 180;

    caseCards.forEach((card) => {
      const cardHeight = card.offsetHeight;
      const cardTop = card.offsetTop - headerOffset;
      const cardId = card.getAttribute("id");

      if (scrollY >= cardTop && scrollY < cardTop + cardHeight) {
        caseIndexLinks.forEach((link) => {
          if (link.getAttribute("data-target") === cardId) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  };

  window.addEventListener("scroll", updateActiveCaseIndex, { passive: true });
  updateActiveCaseIndex();

  caseIndexLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("data-target");
      const targetElem = document.getElementById(targetId);
      if (targetElem) {
        const topPos = targetElem.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({
          top: topPos,
          behavior: "smooth"
        });
      }
    });
  });

  // =========================================================================
  // 5. PROJECT DETAILS DATA & MODAL VIEWER
  // =========================================================================
  const projectSpecsDatabase = {
    legend: {
      title: "Legend.ng",
      category: "Telecommunications & Digital Infrastructure",
      url: "https://www.legend.ng",
      overview:
        "Legend is an Abuja-based telecommunications conglomerate delivering enterprise-grade fiber broadband, digital television, VoIP telephony, and unified digital wallet solutions (LegendPay) across residential and commercial sectors.",
      solutions: [
        "Architected scalable subscriber portal facilitating automated broadband subscription lifecycle management.",
        "Integrated dual-redundancy payment gateway webhooks ensuring zero-loss transaction reconciliation during high-concurrency billing windows.",
        "Engineered optimized bandwidth utilization telemetry dashboard reducing customer support ticket latency by over 35%."
      ],
      techStack: ["Node.js", "REST APIs", "PostgreSQL", "Redis Caching", "Webhook Workers", "Microservices"]
    },
    ballershq: {
      title: "BallersHQ",
      category: "Sports Tech & Arena Marketplace",
      url: "https://www.ballershq.com",
      overview:
        "BallersHQ is an on-demand sports tech marketplace enabling recreational athletes and sports organizations to book arenas, coordinate match sessions, and resolve split payments across teams in real time.",
      solutions: [
        "Built conflict-free booking scheduler with distributed lock management to prevent double-booking of physical courts.",
        "Designed and implemented the 'Squad Chip-In' micro-escrow workflow allowing multiple players to contribute fractional payments toward a shared booking.",
        "Implemented dynamic cryptographic QR ticket generation verified in offline mode by venue field managers."
      ],
      techStack: ["JavaScript", "TypeScript", "Node.js", "WebSockets", "Payment Split API", "Dynamic QR"]
    },
    everythingproperty: {
      title: "EverythingProperty.ng",
      category: "PropTech & Property Marketplace",
      url: "https://www.everythingproperty.ng",
      overview:
        "A nationwide property discovery engine designed to streamline residential rentals, commercial purchases, and land acquisition across Nigeria with verified realtor vetting.",
      solutions: [
        "Developed compound geospatial querying and indexing to deliver sub-50ms search response times across large property datasets.",
        "Constructed automated agent lead-dispatch engine ensuring buyer inquiries are instantly routed and tracked with delivery confirmation.",
        "Optimized client-side media rendering and lazy loading pipelines, achieving a 90+ mobile Google PageSpeed score."
      ],
      techStack: ["Full-Stack Web", "Relational Database", "Spatial Indexing", "Lead Engine", "Cloud Media Storage"]
    },
    eprealestate: {
      title: "EP Real Estate",
      category: "Luxury Property Brokerage & Advisory",
      url: "https://www.eprealestate.ng",
      overview:
        "EP Real Estate represents luxury and institutional real estate advisory across Abuja and Lagos, managing premier residential portfolios and strategic commercial transactions.",
      solutions: [
        "Engineered a high-touch, privacy-conscious digital listing portfolio tailored for high-net-worth investors.",
        "Built responsive client consultation booking funnels integrated with CRM pipelines for prompt client qualification.",
        "Applied image compression and adaptive delivery techniques to showcase high-resolution architectural photography without degrading mobile bandwidth."
      ],
      techStack: ["Modern Semantic HTML/CSS", "Vanilla JS", "Performance Optimization", "Secure CRM Webhooks"]
    },
    gstplace: {
      title: "GSTplace",
      category: "Multi-Vertical Commerce & Asset Brokerage",
      url: "https://www.gstplace.com",
      overview:
        "GSTplace is a diversified commerce and brokerage enterprise headquartered at Silverbird Entertainment Centre, Abuja, housing retail consumer divisions, an art gallery, media studio services, and secure pawn brokerage.",
      solutions: [
        "Architected unified inventory schema supporting distinct operational models (instant retail checkout vs. pawn evaluation holds).",
        "Created an audited valuation workflow for secondary asset collateral intake with strict legal and compliance logging.",
        "Integrated multi-channel payment reconciliation enabling consistent in-store and online ledger synchronizations."
      ],
      techStack: ["E-Commerce Engine", "PostgreSQL", "Inventory State Machine", "Secure Checkout Rails"]
    },
    fixfoundpro: {
      title: "FixFoundPro",
      category: "On-Demand Technician & Maintenance Marketplace",
      url: "https://www.fixfoundpro.com",
      overview:
        "FixFoundPro coordinates professional facilities maintenance and on-demand equipment repairs, pairing vetted technicians with property owners and enterprises requiring certified service.",
      solutions: [
        "Devised proximity-weighted dispatch algorithm matching work orders with closest qualified technicians.",
        "Built verifiable work-order state machine requiring pre-job photo inspection, customer milestone sign-off, and release of service escrow.",
        "Engineered dispute resolution workflow with real-time audit logging for warranty tracking."
      ],
      techStack: ["Modular JavaScript", "Dispatch Logic", "State Engine", "Notification Pipeline", "RESTful Services"]
    }
  };

  const projectModal = document.getElementById("project-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");
  const modalDismissBtn = document.getElementById("modal-dismiss-btn");
  const modalCategory = document.getElementById("modal-category");
  const modalTitle = document.getElementById("modal-title");
  const modalOverview = document.getElementById("modal-overview");
  const modalSolutions = document.getElementById("modal-solutions");
  const modalTech = document.getElementById("modal-tech");
  const modalLiveLink = document.getElementById("modal-live-link");
  let lastActiveElement = null;

  const openProjectModal = (projectId) => {
    const data = projectSpecsDatabase[projectId];
    if (!data || !projectModal) return;

    lastActiveElement = document.activeElement;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalOverview.textContent = data.overview;
    modalLiveLink.href = data.url;

    // Populate solutions list
    modalSolutions.innerHTML = "";
    data.solutions.forEach((sol) => {
      const li = document.createElement("li");
      li.textContent = sol;
      modalSolutions.appendChild(li);
    });

    // Populate tech pills
    modalTech.innerHTML = "";
    data.techStack.forEach((tech) => {
      const span = document.createElement("span");
      span.className = "tech-pill";
      span.textContent = tech;
      modalTech.appendChild(span);
    });

    projectModal.classList.add("open");
    projectModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (modalCloseBtn) modalCloseBtn.focus();
  };

  const closeProjectModal = () => {
    if (!projectModal) return;
    projectModal.classList.remove("open");
    projectModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (lastActiveElement && typeof lastActiveElement.focus === "function") {
      lastActiveElement.focus();
    }
  };

  // Wire up open trigger buttons
  document.querySelectorAll(".project-details-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectId = btn.getAttribute("data-project");
      openProjectModal(projectId);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
  if (modalDismissBtn) modalDismissBtn.addEventListener("click", closeProjectModal);

  // Close modal when clicking on backdrop
  if (projectModal) {
    projectModal.addEventListener("click", (e) => {
      if (e.target === projectModal) {
        closeProjectModal();
      }
    });
  }

  // Handle ESC key for modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && projectModal && projectModal.classList.contains("open")) {
      closeProjectModal();
    }
  });

  // =========================================================================
  // 6. COPY EMAIL TO CLIPBOARD
  // =========================================================================
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const emailTextElem = document.getElementById("contact-email");
  const copyFeedback = document.getElementById("copy-feedback");

  if (copyEmailBtn && emailTextElem) {
    copyEmailBtn.addEventListener("click", async () => {
      const email = emailTextElem.textContent.trim();

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          // Fallback for older execution environments
          const textArea = document.createElement("textarea");
          textArea.value = email;
          textArea.style.position = "fixed";
          textArea.style.left = "-999999px";
          textArea.style.top = "-999999px";
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand("copy");
          textArea.remove();
        }

        if (copyFeedback) {
          copyFeedback.textContent = "Copied to clipboard! ✓";
          copyFeedback.classList.add("show");
          setTimeout(() => {
            copyFeedback.classList.remove("show");
          }, 2600);
        }
      } catch (err) {
        if (copyFeedback) {
          copyFeedback.textContent = "Unable to auto-copy. Please copy manually.";
          copyFeedback.classList.add("show");
          setTimeout(() => {
            copyFeedback.classList.remove("show");
          }, 3000);
        }
      }
    });
  }

  // =========================================================================
  // 7. CONTACT FORM VALIDATION & INTERACTIVE SUBMISSION
  // =========================================================================
  const contactForm = document.getElementById("portfolio-contact-form");
  const formStatusAlert = document.getElementById("form-status");
  const submitBtn = document.getElementById("form-submit-btn");

  if (contactForm) {
    const validateEmail = (email) => {
      // RFC-compliant simple email regex
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validateField = (input, errorId, validatorFn = (val) => val.trim().length > 0) => {
      const parentGroup = input.closest(".form-group");
      const isValid = validatorFn(input.value);

      if (parentGroup) {
        if (!isValid) {
          parentGroup.classList.add("has-error");
        } else {
          parentGroup.classList.remove("has-error");
        }
      }
      return isValid;
    };

    const nameInput = document.getElementById("form-name");
    const emailInput = document.getElementById("form-email");
    const subjectInput = document.getElementById("form-subject");
    const messageInput = document.getElementById("form-message");

    // Real-time clearance of error flags
    [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
      if (input) {
        input.addEventListener("input", () => {
          const group = input.closest(".form-group");
          if (group && group.classList.contains("has-error")) {
            group.classList.remove("has-error");
          }
        });
      }
    });

    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let formIsValid = true;

      if (!validateField(nameInput, "name-error")) formIsValid = false;
      if (!validateField(emailInput, "email-error", validateEmail)) formIsValid = false;
      if (!validateField(subjectInput, "subject-error")) formIsValid = false;
      if (!validateField(messageInput, "message-error", (val) => val.trim().length >= 10)) {
        formIsValid = false;
      }

      if (!formIsValid) {
        if (formStatusAlert) {
          formStatusAlert.className = "form-status-alert error";
          formStatusAlert.textContent = "Please resolve the highlighted fields before sending.";
        }
        return;
      }

      // Simulated clean async submission
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>Dispatching Message...</span>";
      }

      setTimeout(() => {
        contactForm.reset();

        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `
            <span>Message Sent</span>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          `;
        }

        if (formStatusAlert) {
          formStatusAlert.className = "form-status-alert success";
          formStatusAlert.textContent = "Thank you! Your message has been received. Terfa will be in touch shortly.";
        }

        setTimeout(() => {
          if (submitBtn) {
            submitBtn.innerHTML = `
              <span>Send Message</span>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            `;
          }
        }, 4000);
      }, 750);
    });
  }

  // =========================================================================
  // 8. BACK TO TOP BUTTON
  // =========================================================================
  const backToTopBtn = document.getElementById("back-to-top");

  if (backToTopBtn) {
    window.addEventListener(
      "scroll",
      () => {
        const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollPosition > 450) {
          backToTopBtn.classList.add("show");
        } else {
          backToTopBtn.classList.remove("show");
        }
      },
      { passive: true }
    );

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  // =========================================================================
  // 9. DYNAMIC COPYRIGHT YEAR
  // =========================================================================
  const yearElem = document.getElementById("current-year");
  if (yearElem) {
    yearElem.textContent = String(new Date().getFullYear());
  }
});
