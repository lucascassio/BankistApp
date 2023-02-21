'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


// Page Navigation

btnScrollTo.addEventListener('click', function () {
  section1.scrollIntoView({ behavior: 'smooth' });
});


document.querySelector('.nav__links').addEventListener('click', function(e) {
  if(e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior : 'smooth'})
  }
});

// Btn content
tabsContainer.addEventListener('click', function (e)  {
  // selecting clicked btn
  const clicked = e.target.closest('.operations__tab');
  // preventing click error
  if(!clicked) return;
  // Remove Conditions
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  clicked.classList.add('operations__tab--active');
  document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active');  
});

//Nav Fade animation
const mouseOver = function (e) {
  if(e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if(el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
}

nav.addEventListener('mouseover', mouseOver.bind(0.5)); 
nav.addEventListener('mouseout', mouseOver.bind(1.0));  

//Setting sticky navigation

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
  const [entry] = entries;
  if(!entry.isIntersecting) nav.classList.add('sticky');
  else (nav.classList.remove('sticky'));
}

const headerObserver = new IntersectionObserver(stickyNav, { 
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`
});
headerObserver.observe(header);

// reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
  const [entry] = entries;

  if(!entry.isIntersecting) return;
  
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, { 
  root: null, 
  threshold: 0.15
})

allSections.forEach(function(section) {
  sectionObserver.observe(section);
  section.classList.add('section--hidden');
})

//Loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
  const [entry] = entries;
  console.log(entries);

  if(!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function() { 
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
}
  
const imgObserver = new IntersectionObserver(loadImg, {
  root: null, 
  threshold: 0,
  rootMargin: '200px'
})

imgTargets.forEach(img=> imgObserver.observe(img));

//Slider Component

const slider = function () {

const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length;

const createDots = function() { 
  slides.forEach(function(_, i) {
    dotContainer.insertAdjacentHTML('beforeend', 
    `<button class="dots__dot" data-slide="${i}"></button>`)
  })
}


const activateDot = function(slide) {
  document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
}


const gotToSlide = function(slide) { 
  slides.forEach((s, i) => s.style.transform = `translateX(${100*(i - slide)}%)`);
}

const nextSlide = function() { 
  if(curSlide === maxSlide - 1) { 
    curSlide = 0;
  } else {
    curSlide++;
  }
  gotToSlide(curSlide);
  activateDot(curSlide);
};

const prevSlide = function() { 
  if(curSlide===0) {
    curSlide = maxSlide - 1;
  } else {
    curSlide--;
  }
  gotToSlide(curSlide);
  activateDot(curSlide);
};

const init = function() {
  createDots();
  gotToSlide(0);
  activateDot(0);
}
init();


btnRight.addEventListener('click', function() {
  nextSlide();
});

btnLeft.addEventListener('click', function() { 
  prevSlide();
});

document.addEventListener('keydown', function(e) {
  if(e.key === 'ArrowLeft') prevSlide();
  else if (e.key === 'ArrowRight') nextSlide();
})

dotContainer.addEventListener('click', function(e) {
  if(e.target.classList.contains('dots__dot')) {
    const slide = e.target.dataset.slide;
    gotToSlide(slide);
  }
})

}
slider();



