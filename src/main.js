import { questionGen } from './prompting.js';
import { initTypewriterEffect } from './typewriterEffect.js';

let words = '';
let selectedLanguage = 'Korean'; // Default language

window.addEventListener('DOMContentLoaded', (event) => {
    initTypewriterEffect();
    initializeApp();
    handleRouting();
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
            
            // Use History API to change the URL
            history.pushState(null, '', '/questions');
            handleRouting();
        }
    });
}

document.getElementById('get-started-button').addEventListener('click', () => {
    const landingPage = document.getElementById('landing-page');
    const mainContent = document.getElementById('main-content');

    landingPage.style.display = 'none';
    mainContent.style.display = 'block';
});

function handleRouting() {
    const path = window.location.pathname;
    if (path === '/questions') {
        loadQuestionsPage();
    } else {
        loadMainPage();
    }
}

function loadQuestionsPage() {
    document.getElementById('landing-page').style.display = 'none';
    document.getElementById('main-content').style.display = 'none';
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
}

function loadMainPage() {
    document.getElementById('landing-page').style.display = 'block';
    document.getElementById('main-content').style.display = 'none';
    const questionsContent = document.getElementById('questions-content');
    if (questionsContent) {
        questionsContent.style.display = 'none';
    }
}

window.addEventListener('popstate', handleRouting);

export { words, selectedLanguage };