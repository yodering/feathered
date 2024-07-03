import { strip } from './ui.js'

async function questionGen(words, num) {
  try {
    console.log('Sending request with:', { words, num });
    const response = await fetch('/.netlify/functions/gen-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words, num })
    });
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text);
    const data = JSON.parse(text);
    console.log('Parsed data:', data);
    if (data.error) {
      throw new Error(data.error);
    }
    if (!data.result) {
      throw new Error('No result in response');
    }
    strip(data.result);
  } catch (error) {
    console.error('Error generating questions:', error);
    // You might want to display this error to the user
    alert('Failed to generate questions. Please try again.');
  }
}

// Process answer, return correctness
async function processAnswer(question, answer) {
  console.log(question);
  console.log(answer);
  // Implement this function similarly to questionGen, creating a new Netlify function if needed
}

export { questionGen, processAnswer }