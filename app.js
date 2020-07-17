let controller;
let slideScene;
let pageScene;

function animateSliders() {
  controller = new ScrollMagic.Controller();

  const sliders = document.querySelectorAll(".slide");
  const nav = document.querySelector(".nav-header");

  sliders.forEach((slide, index, slides) => {
    const revImage = slide.querySelector(".reveal-img");
    const revText = slide.querySelector(".reveal-text");
    const img = slide.querySelector("img");

    /////GSAP
    const slidesTln = gsap.timeline({
      defaults: { duration: 1, ease: "power2.inOut" },
    });
    slidesTln.fromTo(revImage, { x: "0%" }, { x: "100%" });
    slidesTln.fromTo(img, { scale: 1 }, { scale: 2 }, "-=1");
    slidesTln.fromTo(revText, { x: "0%" }, { x: "100%" }, "-=0.75");
    slidesTln.fromTo(nav, { y: "-100%" }, { y: "0%" }, "-=0.5");
    //   Create a scene
    slideScene = new ScrollMagic.Scene({
      triggerElement: slide,
      triggerHook: 0.25,
      reverse: false,
    })
      .setTween(slidesTln)
      .addIndicators({
        colorStart: "white",
        name: "firstIndicator",
        colorTrigger: " red",
      })
      .addTo(controller);
    /////NewAnimation
    const pageTL = gsap.timeline();
    let nextSlide = slides.length - 1 === index ? "end" : slides[index + 1];
    pageTL.fromTo(nextSlide, { y: "0%" }, { y: "50%" });
    pageTL.fromTo(slide, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.5 });
    pageTL.fromTo(nextSlide, { y: "50%" }, { y: "0%" });
    /////newScene
    pageScene = new ScrollMagic.Scene({
      triggerElement: slide,
      duration: "100%",
      triggerHook: 0,
    })
      .setTween(pageTL)
      .addIndicators({
        colorStart: "white",
        colorTrigger: "red",
        name: "secondIndicator",
        indent: 200,
      })
      .setPin(slide, { pushFollowers: false })
      .addTo(controller);
  });
}

const mouse = document.querySelector(".cursor");
const cursorTxt = mouse.querySelector("span");
const burger = document.querySelector(".burger");

function cursor(e) {
  mouse.style.top = e.pageY + "px";
  mouse.style.left = e.pageX + "px";
}

function activeCursor(e) {
  const item = e.target;

  if (item.id === "logo" || item.classList.contains("burger")) {
    mouse.classList.add("nav-active");
  } else {
    mouse.classList.remove("nav-active");
  }
  if (item.classList.contains("explore")) {
    mouse.classList.add("explore-active");
    gsap.to(".title-swipe", 1, { y: "0%" });
    cursorTxt.innerText = "Tap";
  } else {
    mouse.classList.remove("explore-active");
    cursorTxt.innerText = "";
    gsap.to(".title-swipe", 1, { y: "100%" });
  }
}

function navToggle(e) {
  if (!e.target.classList.contains("active")) {
    e.target.classList.add("active");
    gsap.to(".line1", 0.5, { rotate: "50%", y: 5, background: "black" });
    gsap.to(".line2", 0.5, { rotate: "-50%", y: -5, background: "black" });
    gsap.to("#logo", 1, { color: "black" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(2500px at 100% -10%)" });
  } else {
    e.target.classList.remove("active");
    gsap.to(".line1", 0.5, { rotate: "50%", y: 5, background: "white" });
    gsap.to(".line2", 0.5, { rotate: "-50%", y: -5, background: "white" });
    gsap.to("#logo", 1, { color: "white" });
    gsap.to(".nav-bar", 1, { clipPath: "circle(50px at 100% -10%)" });
  }
}

//Barba page transitions
const logo = document.querySelector("#logo");
barba.init({
  views: [
    {
      namespace: "home",
      beforeEnter() {
        animateSliders();
        logo.href = "./index.html";
      },
      beforeLeave() {
        slideScene.destroy(), pageScene.destroy(), controller.destroy();
      },
    },
    {
      namespace: "fashion",
      beforeEnter() {
        logo.href = "../index.html";
      },
    },
  ],
  transitions: [
    {
      leave({ current, next }) {
        let done = this.async();
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(current.container, 1, { opacity: 1 }, { opacity: 0 });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "-100%" },
          { x: "0%", onComplete: done },
          "-=0.5"
        );
      },

      enter({ current, next }) {
        let done = this.async();
        window.scrollTo(0, 0);
        const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
        tl.fromTo(
          ".swipe",
          0.75,
          { x: "0%" },
          { x: "100%", stagger: 0.25, onComplete: done }
        );
        tl.fromTo(next.container, 1, { opacity: 0 }, { opacity: 1 });
      },
    },
  ],
});

window.addEventListener("mousemove", cursor);
window.addEventListener("mouseover", activeCursor);
burger.addEventListener("click", navToggle);
