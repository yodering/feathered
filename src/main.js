import { questionGen } from './prompting.js';
import { initTypewriterEffect } from './typewriterEffect.js';

let words = '';
let selectedLanguage = 'Korean'; // Default language

window.addEventListener('DOMContentLoaded', (event) => {
    initTypewriterEffect();
    initializeApp();
    handleInitialRouting();
    initializeSlideshow();
});

function initializeApp() {
    const form = document.getElementById('myForm');
    const wordInput = document.getElementById('word-input');
    const questionAmount = document.getElementById('question-amount');

    if (wordInput) {
        wordInput.maxLength = 10000; // Set maximum character limit
        wordInput.addEventListener('input', function() {
            const remainingChars = 10000 - this.value.length;
            const feedbackElement = document.getElementById('char-count-feedback');
            if (feedbackElement) {
                feedbackElement.textContent = `${remainingChars} characters remaining`;
            }
        });
    }

    if (questionAmount) {
        questionAmount.max = 10; // Set maximum number of questions
        questionAmount.min = 1;  // Set minimum number of questions
    }

    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const numSentence = parseInt(questionAmount.value) || 1; // Default to 1 if empty or invalid
            console.log(numSentence); // log count
            if (numSentence > 10) { // cap of 10
                alert("The number of questions cannot exceed 10.");
                return;
            }
            words = wordInput.value.trim();
            selectedLanguage = document.getElementById('language-select').value;
            console.log("Selected language:", selectedLanguage); // Debug log
            if (!words) {
                alert("Please enter words separated by commas.");
                return;
            }
            if (words.length > 10000) {
                alert("The word bank cannot exceed 10,000 characters.");
                return;
            }
            const questions = await questionGen(words, numSentence, selectedLanguage);
            if (questions) {
                // Store questions and other necessary data in localStorage
                localStorage.setItem('questions', JSON.stringify(questions));
                localStorage.setItem('words', words);
                localStorage.setItem('selectedLanguage', selectedLanguage);
                
                // Use History API to change the URL
                history.pushState(null, '', '/questions');
                handleRouting();
            }
        });
    }

    const getStartedButton = document.getElementById('get-started-button');
    if (getStartedButton) {
        getStartedButton.addEventListener('click', () => {
            const landingPage = document.getElementById('landing-page');
            const mainContent = document.getElementById('main-content');

            if (landingPage && mainContent) {
                landingPage.classList.remove('active');
                setTimeout(() => {
                    landingPage.style.display = 'none';
                    mainContent.style.display = 'block';
                    setTimeout(() => {
                        mainContent.classList.add('active');
                    }, 10);
                }, 500); // Match this with the transition duration in CSS
            }
        });
    }
}

function handleInitialRouting() {
    const path = window.location.pathname;
    if (path === '/questions') {
        // Check if we have the necessary data in localStorage
        const questions = localStorage.getItem('questions');
        const words = localStorage.getItem('words');
        const selectedLanguage = localStorage.getItem('selectedLanguage');

        if (questions && words && selectedLanguage) {
            // We have the necessary data, so we can load the questions page
            loadQuestionsPage();
        } else {
            // We don't have the necessary data, so redirect to the main page
            history.replaceState(null, '', '/');
            loadMainPage();
        }
    } else {
        loadMainPage();
    }
}

function handleRouting() {
    const path = window.location.pathname;
    if (path === '/questions') {
        loadQuestionsPage();
    } else {
        loadMainPage();
    }
}

function loadQuestionsPage() {
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');

    if (landingPage && mainContent) {
        landingPage.classList.remove('active');
        setTimeout(() => {
            landingPage.style.display = 'none';
            mainContent.style.display = 'none';

            let questionsContent = document.getElementById('questions-content');
            if (!questionsContent) {
                questionsContent = document.createElement('div');
                questionsContent.id = 'questions-content';
                questionsContent.innerHTML = `
                    <div class="question-answer-container">
                        <div id="question-box"></div>
                        <input type="text" id="answer-box">
                        <div class="button-container">
                            <button id="submit-button">submit</button>
                            <button id="next" style="display: none;">next</button>
                            <button id="start-over" style="display: none;">start over</button>
                        </div>
                        <div id="feedback-box"></div>
                    </div>
                `;
                document.body.appendChild(questionsContent);
                import('./questions.js').then(module => {
                    module.initializeQuestionsPage();
                });
            } else {
                questionsContent.style.display = 'block';
            }
            setTimeout(() => {
                questionsContent.classList.add('active');
            }, 10);
        }, 500);
    }
}

function loadMainPage() {
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');
    const questionsContent = document.getElementById('questions-content');

    if (landingPage && mainContent && questionsContent) {
        mainContent.classList.remove('active');
        questionsContent.classList.remove('active');
        setTimeout(() => {
            mainContent.style.display = 'none';
            questionsContent.style.display = 'none';
            landingPage.style.display = 'block';
            setTimeout(() => {
                landingPage.classList.add('active');
            }, 10);
        }, 500);
    }
}

function initializeSlideshow() {
    const openButton = document.getElementById('openSlideshow');
    const popover = document.getElementById('popover');
    const carousel = document.getElementById('carousel');
    const carouselContent = carousel.querySelector('.carousel-content');
    const prevButton = document.getElementById('prevSlide');
    const nextButton = document.getElementById('nextSlide');
    const closeButton = document.getElementById('closeButton');

    let currentSlide = 0;
    const totalSlides = carouselContent.children.length;

    function showSlide(index) {
        carouselContent.style.transform = `translateX(-${index * 100}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    function openPopover() {
        popover.style.display = 'block';
    }

    function closePopover() {
        popover.style.display = 'none';
        currentSlide = 0;
        showSlide(currentSlide);
    }

    openButton.addEventListener('click', openPopover);
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    closeButton.addEventListener('click', closePopover);
}

window.addEventListener('popstate', handleRouting);

export { words, selectedLanguage };