import { questionGen, processAnswer } from './prompting.js'
import { strip, display, handleSubmit, handleNext } from './ui.js'
import { initTypewriterEffect } from './typewriterEffect.js';

let words = '';
let selectedLanguage = 'Korean'; // Default language

window.addEventListener('DOMContentLoaded', (event) => {
  initTypewriterEffect();
});

function initializeApp() {
    document.getElementById('myForm').addEventListener('submit', async (event) => {
        event.preventDefault();
        const numSentence = parseInt(document.getElementById('question-amount').value);
        console.log(numSentence); // log count
        if (numSentence > 30) { // cap of 30
            alert("The number of questions cannot exceed 30.");
            return;
        }
        words = document.getElementById('word-input').value.trim();
        selectedLanguage = document.getElementById('language-select').value;
        console.log("Selected language:", selectedLanguage); // Debug log
        if (!words) {
            alert("Please enter words separated by commas.");
            return;
        }
        await questionGen(words, numSentence, selectedLanguage); // send to llm
    });

    // Button control
    document.getElementById('submit-button').addEventListener('click', handleSubmit);
    document.getElementById('next').addEventListener('click', handleNext);
}

// Handle transition from landing page to main app
document.getElementById('get-started-button').addEventListener('click', () => {
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');

    landingPage.style.opacity = 0;
    setTimeout(() => {
        landingPage.style.display = 'none';
        mainContent.style.display = 'block';
        setTimeout(() => {
            mainContent.style.opacity = 1;
        }, 50);
    }, 500);

    // Initialize the main app
    initializeApp();
});

function getSelectedLanguage() {
    return selectedLanguage;
}

export { words, getSelectedLanguage }