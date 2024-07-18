let currentIndex = 0;
let currentQuestions = {}; 
let currentQuestion = '';

export function strip(message) {
    let lines = message.split('\n');
    let dictionary = {};

    for (let i = 0; i < lines.length; i += 3) {
        let key = lines[i].match(/^\d+/)[0];
        let englishText = lines[i].replace(/^\d+\.\s*/, '').trim();
        let otherText = lines[i + 1].trim();
        dictionary[key] = {
            english: englishText,
            other: otherText
        };
    }

    //console.log('Processed dictionary:', dictionary);
    return dictionary;
}

export function display(questions) {
    if (questions) {
        currentQuestions = questions;
    }

    const keys = Object.keys(currentQuestions);
    const questionBox = document.getElementById('question-box');
    const answerBox = document.getElementById('answer-box');
    const submitButton = document.getElementById('submit-button');
    const nextButton = document.getElementById('next');
    const startOverButton = document.getElementById('start-over');

    if (currentIndex < keys.length) {
        const key = keys[currentIndex];
        currentQuestion = currentQuestions[key].english;
        questionBox.textContent = `${key}. ${currentQuestion}`;
        answerBox.style.display = 'inline';
        submitButton.style.display = 'inline';
        nextButton.style.display = 'none';
        startOverButton.style.display = 'none';
    } else {
        questionBox.textContent = "all questions answered!";
        answerBox.style.display = 'none';
        submitButton.style.display = 'none';
        nextButton.style.display = 'none';
        startOverButton.style.display = 'inline';
    }
}

export async function handleSubmit(processAnswerFunc) {
    const answerBox = document.getElementById('answer-box');
    const answer = answerBox.value;
    
    if (answer.trim() === '') {
        alert('Please enter an answer before submitting.');
        return;
    }
    try {
        const currentLanguage = localStorage.getItem('selectedLanguage');
        const words = localStorage.getItem('words');
        console.log("Selected language in handleSubmit:", currentLanguage);
        const feedback = await processAnswerFunc(currentQuestion, answer, words, currentLanguage);
        const feedbackBox = document.getElementById('feedback-box');
        feedbackBox.innerHTML = feedback.replace(/\n/g, '<br>');
        feedbackBox.style.display = 'block';
    } catch (error) {
        console.error("Error processing answer:", error);
        alert('Failed to process answer. Please try again.');
    }
    document.getElementById('submit-button').style.display = 'none';
    document.getElementById('next').style.display = 'inline';
}

export function handleNext() {
    const feedbackBox = document.getElementById('feedback-box');
    if (feedbackBox) {
        feedbackBox.innerHTML = '';
        feedbackBox.style.display = 'none';
    }
    
    const answerBox = document.getElementById('answer-box');
    answerBox.value = '';
    currentIndex++;
    display();
}

export function handleStartOver() {
    localStorage.removeItem('questions');
    localStorage.removeItem('words');
    localStorage.removeItem('selectedLanguage');
}