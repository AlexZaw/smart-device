'use strict';
const callbackButton = document.querySelector('.header__callback');
const accordionButtons = document.querySelectorAll('.footer__accordion-button');
const accordionLists = document.querySelectorAll('.footer__accordion');
const acoordionPrefix = 'footer__accordion';
const activeAccordionIcon = 'footer__accordion-icon--active';
const feedbackForm = document.forms.feedback;
const masked = document.querySelectorAll('.masked');
const prefixed = document.querySelectorAll('.prefixed');
const userData = {
  name: '',
  phone: '',
  feedback: '',
};

const isStorage = () => {
  try{
    userData.name = localStorage.getItem('userName');
    userData.phone = localStorage.getItem('userPhone');
    userData.feedback = localStorage.getItem('userFeedback');
    return true;
  } catch (err) {
    return false;
  }
};
const isStorageSupport = isStorage();

const fillForm = (form) => {
  isStorage();
  if(userData.name){
    form['user-name'].value = userData.name;
  }
  if(userData.phone){
    form['user-phone'].value = userData.phone;
  }
  if(userData.feedback){
    form['user-feedback'].value = userData.feedback;
  }
};

const isEscKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const maskInput = (evt) => {
  const input = evt.target;

  const pattern = input.dataset.pattern;
  const prefix = input.dataset.prefix;
  let value;
  let startIndex = 0;
  let count = 0;
  let formatedValue = '';

  if (prefix) {
    startIndex = prefix.length;
    formatedValue += prefix;
    if (input.value.length < prefix.length) {
      input.value = prefix;
    }
  }
  if (prefix && prefix === input.value.slice(0, prefix.length)) {
    value = input.value.replace(prefix, '').replace(/[^\d]/g, '');
  } else {
    value = input.value.replace(/[^\d]/g, '');
  }

  for (let i = startIndex; i < pattern.length; i++) {
    if (value[count]) {
      if (pattern[i] !== '*') {
        formatedValue += pattern[i];
      } else {
        formatedValue += value[count];
        count++;
      }
    }
  }

  input.value = formatedValue;
};

const onMaskedInputBlur = (evt) => {
  const input = evt.target;
  const prefix = input.dataset.prefix;
  if (prefix && input.value.length <= prefix.length) {
    input.value = '';
  }
};

const onMaskedInputFocus = (evt) => {
  const input = evt.target;
  const prefix = input.dataset.prefix;
  if (prefix && !input.value) {
    input.value = prefix;
  }
};

const setMaskedInputListener = (elem) => {
  elem.addEventListener('input', maskInput);
};

const setPrefixedInputListener = (elem) => {
  elem.addEventListener('blur', onMaskedInputBlur);
  elem.addEventListener('focus', onMaskedInputFocus);
};
const bodyFixPosition = () => {

  setTimeout( () => {
    if ( !document.body.hasAttribute('data-body-scroll-fix') ) {
      const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
      document.body.setAttribute('data-body-scroll-fix', scrollPosition);
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${  scrollPosition  }px`;
      document.body.style.left = '0';
      document.body.style.width = '100%';
    }
  }, 15 );
};

const bodyUnfixPosition = () => {
  if ( document.body.hasAttribute('data-body-scroll-fix') ) {
    const scrollPosition = document.body.getAttribute('data-body-scroll-fix');
    document.body.removeAttribute('data-body-scroll-fix');
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.width = '';
    window.scroll(0, scrollPosition);
  }
};
const formDataSave = (form) => {
  if (isStorageSupport) {
    localStorage.setItem('userName', form['user-name'].value);
    localStorage.setItem('userPhone', form['user-phone'].value);
    localStorage.setItem('userFeedback', form['user-feedback'].value);
  }
};

const onFormSubmit = (evt) =>{
  const target = evt.target.closest('form');
  target.reportValidity();
  const phoneField = target.querySelector('[type="tel"]');
  const phonePattern = /\+7\(\d{3}\)\d{3}-\d\d-\d\d/;
  if(!phonePattern.test(phoneField.value)){
    evt.preventDefault();
    phoneField.setCustomValidity(phoneField.dataset.error || 'Неправильный формат номера');
  }else{
    formDataSave(target);
    phoneField.setCustomValidity('');
  }
  phoneField.reportValidity();
};


const closePopup = (evt) =>{
  if ( isEscKey(evt) || (evt.type === 'click' && evt.target.classList.contains('popup__close')
  || evt.target.classList.contains('active-popup')) ) {
    document.querySelector('.active-popup').remove();
    document.removeEventListener('keydown', closePopup);
    bodyUnfixPosition();
  }
};

const switchPopupElement = (evt) =>{
  const popup = evt.target.closest('.popup');
  const elements = [...popup.querySelector('form').elements].filter((el) =>el.tagName !== 'FIELDSET');
  const closeButton = popup.querySelector('.popup__close');

  if (evt.key === 'Tab') {
    if (evt.shiftKey) {
      if (evt.target === elements[0]) {
        evt.preventDefault();
        closeButton.focus();
      }
    } else {
      if (evt.target === closeButton) {
        evt.preventDefault();
        elements[0].focus();
      }
    }
  }
};

const checkPopupCoords = () =>{
  const formWrapper = document.querySelector('.feedback-popup');
  if(parseInt(getComputedStyle(formWrapper).height, 10) > document.documentElement.clientHeight){
    formWrapper.classList.add('feedback-popup--fixed');
  } else {
    formWrapper.classList.remove('feedback-popup--fixed');

  }
};

const setPopupListeners = (popup) =>{
  popup.querySelectorAll('.masked').forEach((el) => setMaskedInputListener(el));
  popup.querySelectorAll('.prefixed').forEach((el) => setPrefixedInputListener(el));
  popup.querySelector('[type="submit"]').addEventListener('click', onFormSubmit);
  document.addEventListener('keydown', closePopup);
  popup.addEventListener('click', closePopup);
  popup.addEventListener('keydown', switchPopupElement);
  window.addEventListener('resize', checkPopupCoords);
};


const showPopup = (evt) => {
  evt.preventDefault();
  const target = evt.target;
  const template = document.querySelector(`#${target.dataset.popup}`);
  if(template){
    const popup = template.content.querySelector('.popup').cloneNode(true);
    const form = popup.querySelector('form');
    popup.classList.add('active-popup');
    setPopupListeners(popup);
    fillForm(form);
    document.body.append(popup);
    popup.querySelector('[name="user-name"]').focus();
    checkPopupCoords();
    bodyFixPosition();
  }
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
      btn.querySelector('.footer__accordion-icon--plus').classList.add(`${activeAccordionIcon}`);
      btn.querySelector('.footer__accordion-icon--minus').classList.remove(`${activeAccordionIcon}`);
      btn.setAttribute('aria-expanded', false);
    });

    if(tab.classList.contains(`${acoordionPrefix}--hidden`)){
      accordionLists.forEach((list) => {
        list.classList.add(`${acoordionPrefix}--hidden`);
      });
      tab.classList.remove(`${acoordionPrefix}--hidden`);
      target.setAttribute('aria-expanded', true);

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

if(masked){
  masked.forEach((el) => setMaskedInputListener(el));
}

if(prefixed){
  prefixed.forEach((el) => setPrefixedInputListener(el));
}

if(feedbackForm){
  feedbackForm.addEventListener('submit', onFormSubmit);
  feedbackForm.querySelector('[type="submit"]').addEventListener('click', onFormSubmit);
  fillForm(feedbackForm);
}
