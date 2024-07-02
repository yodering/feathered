import { strip } from './ui.js'

// Question Generation
async function questionGen(words, num) {
  try {
    const response = await fetch('/.netlify/functions/generate-questions', {
      method: 'POST',
      body: JSON.stringify({ words, num })
    });
    const data = await response.json();
    console.log(data.result);
    strip(data.result);
  } catch (error) {
    console.error('Error generating questions:', error);
  }
}

// Process answer, return correctness
async function processAnswer(question, answer) {
  console.log(question);
  console.log(answer);
  // Implement this function similarly to questionGen, creating a new Netlify function if needed
}

export { questionGen, processAnswer }