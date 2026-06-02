gsap.registerPlugin(ScrollTrigger, Flip);



// ─────────────────────────────────────────
// LENIS SMOOTH SCROLL
// ─────────────────────────────────────────

if (typeof Lenis !== "undefined") {

  const lenis = new Lenis({
    duration: 1.4,
    smoothWheel: true,
    wheelMultiplier: 1.3,
    infinite: false,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

// mobile hamburger menu toggle
const menuToggle = document.getElementById("menuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const lines = document.querySelectorAll(".menu-line");
const menuLinks = document.querySelectorAll(".menu-link");

let isOpen = false;

// MAIN TIMELINE
const tl = gsap.timeline({ paused: true, reversed: true });

// =========================
// MENU PANEL (dropdown)
// =========================
tl.fromTo(mobileMenu,
    {
        y: -25,
        opacity: 0
    },
    {
        y: 0,
        opacity: 1,
        pointerEvents: "auto",
        duration: 0.5,
        ease: "power3.out"
    },
    0
);

// =========================
// LINKS STAGGER
// =========================
tl.from(menuLinks, {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.08,
    ease: "power3.out"
}, "-=0.2");

// =========================
// BUTTON SPIN
// =========================
tl.to(menuToggle, {
    rotate: 180,
    duration: 0.5,
    ease: "power2.inOut"
}, 0);

// =========================
// BURGER → X ANIMATION
// =========================
tl.to(lines[0], {
    rotate: 45,
    y: 6,
    width: "28px",
    duration: 0.3
}, 0);

tl.to(lines[1], {
    rotate: -45,
    y: -6,
    width: "28px",
    duration: 0.3
}, 0);

// =========================
// TOGGLE ACTION
// =========================
menuToggle.addEventListener("click", () => {
    isOpen = !isOpen;

    if (isOpen) {
        document.body.style.overflow = "hidden";
        tl.play();
    } else {
        document.body.style.overflow = "auto";
        tl.reverse();
    }
});

// ─────────────────────────────────────────
// CTA FLIP BUTTON
// ─────────────────────────────────────────

document.querySelectorAll(".cta-flip").forEach((btn) => {

  const inner = btn.querySelector(".cta");
  const icon = btn.querySelector(".cta-icon");
  const text = btn.querySelector(".cta-text");
  const bg = btn.querySelector(".cta-bg");

  const animate = (reverse = false) => {

    const state = Flip.getState([
      text,
      icon
    ]);

    inner.style.flexDirection = reverse
      ? "row"
      : "row-reverse";

    gsap.to(bg, {
      scaleX: reverse ? 0 : 1,
      duration: 0.5,
      ease: "power3.inOut"
    });

    gsap.to(text, {
      color: reverse
        ? (window.scrollY > 50 ? "#000" : "#fff")
        : "#000",
      duration: 0.3
    });

    gsap.to(icon, {
      backgroundColor: reverse
        ? "#c9f31d"
        : "#fff",
      color: "#000",
      duration: 0.3
    });

    gsap.to(btn, {
      borderColor: reverse
        ? (window.scrollY > 50 ? "#D3D3D3" : "#fff")
        : (window.scrollY > 50 ? "#D3D3D3" : "#fff"),
      duration: 0.3
    });

    Flip.from(state, {
      duration: 0.5,
      ease: "power3.inOut"
    });

  };

  btn.addEventListener("mouseenter", () => animate());
  btn.addEventListener("mouseleave", () => animate(true));

});



// ─────────────────────────────────────────
// HEADER SCROLL ANIMATION
// ─────────────────────────────────────────

const header = document.getElementById("mainHeader");
const lightLogo = document.getElementById("lightLogo");
const darkLogo = document.getElementById("darkLogo");

let lastScroll = 0;

gsap.set(lightLogo, { opacity: 1 });
gsap.set(darkLogo, { opacity: 0 });

const setHeaderTheme = (scrolled) => {

  gsap.to(header, {
    backgroundColor: scrolled ? "#fff" : "transparent",
    boxShadow: scrolled
      ? "0 4px 20px rgba(0,0,0,0.08)"
      : "0 0 0 rgba(0,0,0,0)",
    duration: 0.3
  });

  gsap.to(lightLogo, {
    opacity: scrolled ? 0 : 1,
    duration: 0.2
  });

  gsap.to(darkLogo, {
    opacity: scrolled ? 1 : 0,
    duration: 0.2
  });

  gsap.to(".nav-items a", {
    color: scrolled ? "#000" : "#dadada",
    duration: 0.3
  });

  gsap.to(".cta-flip", {
    borderColor: scrolled ? "#D3D3D3" : "#fff",
    duration: 0.3
  });

  gsap.to(".cta-text", {
    color: scrolled ? "#000" : "#fff",
    duration: 0.3
  });

};


ScrollTrigger.create({

  start: 0,
  end: "max",

  onUpdate: (self) => {

    const current = self.scroll();
    const scrollingDown = current > lastScroll;

    gsap.to(header, {
      y: scrollingDown && current > 100
        ? "-100%"
        : "0%",
      duration: 0.45,
      ease: "power2.out"
    });

    setHeaderTheme(current > 50);

    lastScroll = current;

  }

});

// Hero section content animation on page load
document.addEventListener("DOMContentLoaded", () => {

  const tl = gsap.timeline({
    defaults: {
      duration: 0.6,
      ease: "power2.out"
    }
  });

  tl.from(".social-links", {
    opacity: 0,
    x: 40
  });

  tl.from(".right-menu", {
    opacity: 0,
    x: -40
  }, "-=0.35");

  tl.from(".hero-title", {
    opacity: 0,
    x: -60
  }, "-=0.3");

  tl.from(".bottom-content", {
    opacity: 0,
    y: 40
  }, "-=0.35");

});

// METEOR ANIMATION

document.addEventListener("DOMContentLoaded", () => {

  const createMeteor = (
    target,
    direction = "vertical",
    min = 8,
    max = 16
  ) => {

    if (!target) return;

    const distance = direction === "vertical"
      ? target.parentElement.offsetHeight
      : target.parentElement.offsetWidth;

    const animate = () => {

      gsap.set(target, {
        [direction === "vertical" ? "y" : "x"]: -80,
        opacity: 0
      });

      gsap.to(target, {

        [direction === "vertical" ? "y" : "x"]:
          distance + 80,

        duration: min + Math.random() * (max - min),
        ease: "none",

        onStart: () => {
          gsap.to(target, {
            opacity: 1,
            duration: 0.4
          });
        },

        onComplete: () => {
          gsap.delayedCall(
            Math.random() * 6,
            animate
          );
        }

      });

    };

    gsap.delayedCall(
      Math.random() * 5,
      animate
    );

  };

  // Vertical meteors
  document.querySelectorAll(".meteor")
    .forEach(meteor => createMeteor(meteor));

  // Top horizontal meteor
  createMeteor(
    document.querySelector(".top-meteor"),
    "horizontal",
    10,
    14
  );

});



// ─────────────────────────────────────────
// SOCIAL ICON HOVER
// ─────────────────────────────────────────

document.querySelectorAll("a.group").forEach((link) => {

  const svgs = link.querySelectorAll("span svg");

  if (svgs.length < 2) return;

  const [first, second] = svgs;

  gsap.set(second, {
    x: -8,
    y: 8,
    opacity: 0
  });

  const toggle = (leave = false) => {

    gsap.to(first, {
      x: leave ? 0 : 8,
      y: leave ? 0 : -8,
      opacity: leave ? 1 : 0,
      duration: 0.4,
      ease: "power2.out"
    });

    gsap.to(second, {
      x: leave ? -8 : 0,
      y: leave ? 8 : 0,
      opacity: leave ? 0 : 1,
      duration: 0.4,
      ease: "power2.out"
    });

  };

  link.addEventListener("mouseenter", () => toggle());
  link.addEventListener("mouseleave", () => toggle(true));

});

