import { questionGen, processAnswer } from './prompting.js'
import { strip, display, handleSubmit, handleNext } from './ui.js'
import { initTypewriterEffect } from './typewriterEffect.js';

let text

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
        if (!text) {
            alert("Please select a file with words first.");
            return;
        }
        await questionGen(text, numSentence); // send to llm
    });

    const fileSelector = document.getElementById('file-selector')

    // Reading the file
    fileSelector.addEventListener('change', (event) => {
        const file = event.target.files[0]  // get selected file
        if (file) {
            const reader = new FileReader()
            reader.readAsText(file)

            reader.onload = (e) => {
                text = e.target.result
                //console.log(text) // log text
            }
            reader.onerror = (e) => {
                console.error('Error reading file', e)
            }
        }
        else {
            console.log('No file selected')
        }
    })

    // Button control
    document.getElementById('submit-button').addEventListener('click', handleSubmit)
    document.getElementById('next').addEventListener('click', handleNext)
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

export { text }