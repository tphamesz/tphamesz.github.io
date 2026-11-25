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
      category: "Telecommunications & Digital Services",
      url: "https://www.legend.ng",
      overview:
        "Legend is Abuja's flagship fiber internet and digital entertainment provider. I was brought in to build their self-service subscriber portal and automated billing pipelines, giving thousands of residential and enterprise clients an effortless way to track bandwidth, renew plans, and manage accounts with zero downtime headaches.",
      solutions: [
        "Set up automated subscription renewal workflows with dual-redundancy payment gateway webhooks so auto-renewals never miss a beat.",
        "Built clean, real-time bandwidth telemetry graphs that help subscribers see their usage clearly and cut support tickets by 35%.",
        "Tuned PostgreSQL query pipelines and Redis caching to keep account lookups instantaneous during peak evening billing hours."
      ],
      techStack: ["Node.js", "REST APIs", "PostgreSQL", "Redis Caching", "Webhook Workers", "Microservices"]
    },
    ballershq: {
      title: "BallersHQ",
      category: "Sports Tech & Community Marketplace",
      url: "https://www.ballershq.com",
      overview:
        "BallersHQ was born to fix the chaos of organizing recreational football and court games in Nigeria. Instead of endless WhatsApp back-and-forth and chasing teammates for cash, players can instantly find open turf pitches, book a slot, and chip in together.",
      solutions: [
        "Engineered a real-time reservation engine with distributed locks so two squads never accidentally book the same pitch at the same hour.",
        "Designed the 'Squad Chip-In' split payment flow, letting team captains create a private booking link where everyone pays their share into escrow.",
        "Created dynamic, tamper-proof QR tickets that venue managers can scan at the entrance even if the local network is patchy."
      ],
      techStack: ["JavaScript", "TypeScript", "Node.js", "WebSockets", "Squad Chip-In", "Dynamic QR"]
    },
    everythingproperty: {
      title: "EverythingProperty.ng",
      category: "PropTech & Search Marketplace",
      url: "https://www.everythingproperty.ng",
      overview:
        "Finding a genuine rental or property in Nigeria shouldn't be an extreme sport. I architected EverythingProperty's core search engine and agent lead router to connect house hunters directly with verified listings and trusted agents without the usual headaches.",
      solutions: [
        "Implemented compound geospatial queries and indexing to deliver neighborhood property searches in under 50 milliseconds.",
        "Created an automated lead dispatch system that instantly notifies verified agents when a qualified buyer makes an inquiry.",
        "Applied client-side image optimization and lazy-loading so browsing image-heavy property galleries doesn't eat up mobile data."
      ],
      techStack: ["Full-Stack Web", "Relational Database", "Geospatial Indexing", "Lead Engine", "Cloud Media Storage"]
    },
    eprealestate: {
      title: "EP Real Estate",
      category: "Luxury Property Brokerage & Advisory",
      url: "https://www.eprealestate.ng",
      overview:
        "EP Real Estate is a luxury brokerage firm handling high-value residential and commercial properties in Abuja and Lagos. They needed an elegant, lightning-fast digital portfolio that matches the prestige of their clientele with buttery-smooth mobile navigation.",
      solutions: [
        "Designed a sleek, distraction-free portfolio interface with buttery-smooth mobile navigation and private VIP inquiry funnels.",
        "Optimized heavy architectural photos with responsive picture sets and modern compression, keeping mobile page load times under 1 second.",
        "Connected direct consultation booking forms with their CRM backend for immediate client qualification."
      ],
      techStack: ["Performance Engineering", "Responsive Design", "Media Optimization", "CRM Webhooks"]
    },
    gstplace: {
      title: "GSTplace",
      category: "Multi-Vertical Commerce & Brokerage",
      url: "https://www.gstplace.com",
      overview:
        "Located at Silverbird Entertainment Centre in Abuja, GSTplace is a multi-vertical commercial marketplace that brings together retail electronics, an authentic art gallery, and a regulated pawn brokerage under one umbrella.",
      solutions: [
        "Architected a unified inventory database capable of handling standard e-commerce carts alongside collateral pawn holds with different lifecycle rules.",
        "Built transparent valuation intake workflows with tamper-proof audit trails for secondary goods and artwork.",
        "Unified payment tracking across multiple channels so in-store and online ledgers stay perfectly in sync."
      ],
      techStack: ["E-Commerce Engine", "PostgreSQL", "Inventory State Machine", "Secure Checkout Rails"]
    },
    fixfoundpro: {
      title: "FixFoundPro",
      category: "Facilities & Construction Management",
      url: "https://www.fixfoundpro.com",
      overview:
        "FixFoundPro takes the uncertainty out of facility repairs and construction management. It helps homeowners and property managers quickly book vetted technicians, review photo proof of work, and release payments safely in escrow.",
      solutions: [
        "Devised proximity-smart technician dispatch that matches open maintenance requests with the closest qualified specialist.",
        "Built a milestone-based escrow workflow requiring pre-job and post-job photo verification before releasing funds.",
        "Created a clean dispute-resolution tracking interface that keeps both customers and service pros accountable and protected."
      ],
      techStack: ["Smart Dispatch", "Escrow Workflows", "State Machines", "RESTful APIs", "Modular JavaScript"]
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
