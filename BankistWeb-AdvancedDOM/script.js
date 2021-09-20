'use strict';
// HIGHLIGHT: Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// HIGHLIGHT: Smooth Scrolling (lean more)
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1cords = section1.getBoundingClientRect();

  // NOTE: Element Coordinates
  console.log(s1cords);
  console.log(e.target.getBoundingClientRect()); // NOTE: e.target -> target is the one we clicked (btnScrollTo)
  console.log(
    `Current scroll (X/Y) ${window.pageXOffset}, ${window.pageYOffset}`
  );
  console.log(
    `height/width viewport ${document.documentElement.clientHeight} ${document.documentElement.clientWidth}`
  );

  /* NOTE: Scrolling 
  - Traditional Way
  window.scrollTo(
    s1cords.left + window.pageXOffset,
    s1cords.top + window.pageYOffset
  );
  

  window.scrollTo({
    left: s1cords.left + window.pageXOffset,
    top: s1cords.top + window.pageYOffset,
    behavior: 'smooth',
  });
  */
  // NOTE: Modern way -> ONLY support for Modern Browser
  section1.scrollIntoView({ behavior: 'smooth' });
});

// HIGHLIGHT: Page Navigation (Event Delegation)

/* NOTE: Without Event Delegation
document.querySelectorAll('.nav__link').forEach(function (el) {
  el.addEventListener('click', function (e) {
    e.preventDefault();

    const id = this.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  });
});
*/

/* NOTE: Event Delegation
- Attach same event handler to Multiple Elements 
1. Add Event Listener to common parent element (nav__links) of all the element 
2. Determine what Element Originated the event
*/
document.querySelector('.nav__links').addEventListener('click', function (e) {
  console.log(e.target);
  e.preventDefault();

  // Matching Strategy (Select element that we are interested in)
  if (
    e.target.classList.contains('nav__link') &&
    !e.target.classList.contains('nav__link--btn')
  ) {
    const id = e.target.getAttribute('href');
    console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// HIGHLIGHT: Tabbed Component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

/* NOTE: Old Way (NOT desirable) 给每个tab都加事件
tabs.forEach(t =>
  t.addEventListener('click', () => {
    console.log('link');
  })
);
*/
tabsContainer.addEventListener('click', function (e) {
  // NOTE: use Closest method to ensure the button can be clicked no matter we clicked 01 or instant transfer
  const clicked = e.target.closest('.operations__tab');

  // NOTE: Modern way -> Ignore the click that is Null (Guard clause) -> If Clicked is Falsy value, the rest of code won't be executed
  if (!clicked) return;

  // NOTE: Remove Active Classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // NOTE: Activate Tab
  clicked.classList.add('operations__tab--active');

  // NOTE: Activate Content Area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

/* HIGHLIGHT: Menu Fade Animation
NOTE:
- Use Mouseover -> because MouseEnter will not Bubble Up
- Use Event Delegation (bubble up)
- Pair: Mouseover & Mouseout, Mouseenter, Mouseleave
- Use contains instead of Closest method -> because there are no other child elements like tabs (have span class and div)
- Refactor -> Pass arguments to Event Handler (handleOver)
1. one way -> Still need a CALLBACK function (manually call)
  nav.addEventListener('mouseover', function (e) {
    handleOver(e, 0.5);
  });

  nav.addEventListener('mouseout', function (e) {
    handleOver(e, 1);
  });
2. Another way -> Bind method
'this' key word is equal to currentTarget (0.5, 1)
3. Alternative way -> Use Closure

const handleHover = function (o) {
  return function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');
 
      siblings.forEach(el => {
        if (el !== link) el.style.opacity = o;
      });
      logo.style.opacity = o;
    }
  };
};
you can log the handleHover(0.1) to see that it returns a function which  // has access to the argument(opacity value) passed to handleHover() due to   // closures 
nav.addEventListener('mouseover', handleHover(0.5));
nav.addEventListener('mouseout', handleHover(1));
- Event Handler can ONLY have Real argument (can NOT pass arguments to Event Handler)
- Use 'this' keyword to pass argument to Event Handler
*/
const handleOver = function (e) {
  if (e.target.classList.contains('nav__link')) {
    console.log(this); // 0.5 or 1
    const link = e.target;
    // console.log(link);
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    console.log(siblings);
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

const nav = document.querySelector('.nav');
// NOTE: Use Bind method -> because it still a function not value (bind returns a new function)
nav.addEventListener('mouseover', handleOver.bind(0.5));
nav.addEventListener('mouseout', handleOver.bind(1));

/* HIGHLIGHT: Sticky Navigation
1. One way -> Using Scrolling -> NOT good practice (scroll event is always fired all the time)
const initialCoords = section1.getBoundingClientRect();
console.log(initialCoords.top);
window.addEventListener('scroll', function () {
  console.log(window.scrollY);
  
  window.scrollY > initialCoords.top
  ? nav.classList.add('sticky')
  : nav.classList.remove('sticky');
});
2. Use Intersection Observer API
- Viewport -> root: Target Element
- 10% -> threshold: Percentage of Intersection at which the Observer Callback will be called
*/
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries; // Destructuring to get First element
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
  /* NOTE: Visual Margin: 90 (height of Navigation) is a box with 90px that will be applied outside of Target Element
  rootMargin: '-90px',
  */
});
headerObserver.observe(header);

/* HIGHLIGHT: Revealing Sections
- Using Intersection Observer API
- CALLBACK function need Observer parameter this time to Unobserve
*/
const allSections = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);

  // Guard Clause
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  // NOTE: Unobserve for better performance
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(section => {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

/*HIGHLIGHT: Lazy Loading Images
- Use Intersection Observer API (This one really better loading performance)
 */
const imgTargets = document.querySelectorAll('img[data-src]');
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries; // const entry = entries[0]
  console.log(entry);

  if (!entry.isIntersecting) return;
  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px', // NOTE: gives a head start on the loading, on a faster connection you wont see the blur but on slower connections you might.
});

imgTargets.forEach(imgTarget => imgObserver.observe(imgTarget));

/*HIGHLIGHT: Building Slider Component
- Better put into a Whole Function
 */
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  let currentSlide = 0;
  const maxSlide = slides.length;
  const dotContainer = document.querySelector('.dots');

  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  // slides.forEach(
  //   (s, index) => (s.style.transform = `translateX(${100 * index}%)`) // 0%, 100%, 200%, 300%
  // );

  /* Functions
NOTE: 
- Going to Next Slide (change Transform property)
- Creating Dots
*/
  const goToSlide = function (slide) {
    slides.forEach(
      (s, index) =>
        (s.style.transform = `translateX(${100 * (index - slide)}%)`) // -100%, 0%, 100%, 200%
    );
  };

  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++; // 1
    }
    // slides.forEach(
    //   (s, index) =>
    //     (s.style.transform = `translateX(${100 * (index - currentSlide)}%)`) // -100%, 0%, 100%, 200%
    // );
    goToSlide(currentSlide);
    activateDot(currentSlide);
  };

  const prevSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide;
    } else {
      currentSlide--;
      goToSlide(currentSlide);
      activateDot(currentSlide);
    }
  };

  const createDots = function () {
    slides.forEach((s, index) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${index}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event Handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    // console.log(e);
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('DOT');
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(currentSlide);
    }
  });
};

slider();
