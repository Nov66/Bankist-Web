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
