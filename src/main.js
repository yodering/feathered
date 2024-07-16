import { questionGen } from './prompting.js'
import { initTypewriterEffect } from './typewriterEffect.js';

let words = '';
let selectedLanguage = 'Korean'; // Default language

window.addEventListener('DOMContentLoaded', (event) => {
  initTypewriterEffect();
  initializeApp();
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
        const questions = await questionGen(words, numSentence, selectedLanguage);
        if (questions) {
            // Store questions and other necessary data in localStorage
            localStorage.setItem('questions', JSON.stringify(questions));
            localStorage.setItem('words', words);
            localStorage.setItem('selectedLanguage', selectedLanguage);
            
            // Redirect to questions.html
            window.location.href = '/questions.html';
        }
    });
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
});