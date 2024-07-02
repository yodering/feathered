// TO ADD:
// Change complexity of sentences
// Select language

import { questionGen, processAnswer } from './prompting.js'
import { strip, display, handleSubmit, handleNext } from './ui.js'




let text

// Listening to the form
document.getElementById('myForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const numSentence = parseInt(document.getElementById('question-amount').value);
  console.log(numSentence); // log count
  if (numSentence > 30) { // cap of 30
    alert("The number of questions cannot exceed 30.");
    return;
  }
  await questionGen(text, numSentence); // send to gpt
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
// Button control
document.getElementById('submit-button').addEventListener('click', handleSubmit)
document.getElementById('next').addEventListener('click', handleNext)
