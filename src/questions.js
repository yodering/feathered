import { display, handleSubmit, handleNext, handleStartOver } from './ui.js';
import { processAnswer } from './prompting.js';

window.addEventListener('DOMContentLoaded', (event) => {
    initializeQuestionsPage();
});

function initializeQuestionsPage() {
    const questions = JSON.parse(localStorage.getItem('questions'));
    const words = localStorage.getItem('words');
    const selectedLanguage = localStorage.getItem('selectedLanguage');

    if (!questions || !words || !selectedLanguage) {
        alert('Error: Missing question data. Redirecting to main page.');
        window.location.href = '/';
        return;
    }

    display(questions);

    document.getElementById('submit-button').addEventListener('click', () => handleSubmit(processAnswer));
    document.getElementById('next').addEventListener('click', handleNext);
    document.getElementById('start-over').addEventListener('click', handleStartOver);
}