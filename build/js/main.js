'use strict';
const callbackButton = document.querySelector('.header__callback');
const accordionButtons = document.querySelectorAll('.footer__accordion-button');
const accordionLists = document.querySelectorAll('.footer__accordion');
const acoordionPrefix = 'footer__accordion';
const activeAccordionIcon = 'footer__accordion-icon--active';

const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const disableScroll = () => {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  window.onscroll = function () { window.scrollTo(scrollX, scrollY); };
};

const enableScroll = () => {
  window.onscroll =null;
};

const closePopup = (evt) =>{
  if (isEscKey(evt) || evt.target.classList.contains('popup__close')
  || evt.target.classList.contains('active-popup')) {
    document.querySelector('.active-popup').remove();
    document.removeEventListener('keydown', closePopup);
    enableScroll();
  }
};

const showPopup = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const template = document.querySelector(`#${target.dataset.popup}`).content.querySelector('.popup');
  const popup = template.cloneNode(true);
  popup.classList.add('active-popup');
  document.addEventListener('keydown', closePopup);
  popup.addEventListener('click', closePopup);
  document.body.append(popup);
  disableScroll();
};

if(callbackButton){
  callbackButton.addEventListener('click', showPopup);
}

const toggleAccordion = (evt) => {
  const target = evt.target;
  const id = target.dataset.accordion;
  const tab = document.querySelector(`.${acoordionPrefix}--${id}`);
  if(tab && accordionLists.length){
    [...accordionButtons].forEach((btn) => {
      console.log(btn);
      btn.querySelector('.footer__accordion-icon--plus').classList.add(`${activeAccordionIcon}`);
      btn.querySelector('.footer__accordion-icon--minus').classList.remove(`${activeAccordionIcon}`);
    });

    if(tab.classList.contains(`${acoordionPrefix}--hidden`)){
      accordionLists.forEach((list) => {
        list.classList.add(`${acoordionPrefix}--hidden`);
      });
      tab.classList.remove(`${acoordionPrefix}--hidden`);
      target.querySelector('.footer__accordion-icon--plus').classList.remove(`${activeAccordionIcon}`);
      target.querySelector('.footer__accordion-icon--minus').classList.add(`${activeAccordionIcon}`);

    }else{
      tab.classList.add(`${acoordionPrefix}--hidden`);

    }

  }
};


if(accordionButtons.length){
  accordionButtons.forEach((btn) => {
    btn.removeAttribute('hidden');
    btn.addEventListener('click', toggleAccordion);
  });
}

if(accordionLists.length){
  accordionLists.forEach((list) => list.classList.add('footer__accordion--hidden'));
}
