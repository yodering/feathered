import { strip } from './ui.js'

async function questionGen(words, num, language) {
  try {
    console.log('Sending request with:', { words, num, language });
    const response = await fetch('/.netlify/functions/gen-questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ words, num, language })
    });
    const text = await response.text();
    const data = JSON.parse(text);
    if (data.error) {
      throw new Error(data.error);
    }
    if (!data.result) {
      throw new Error('No result in response');
    }
    strip(data.result);
  } catch (error) {
    console.error('Error generating questions:', error);
    alert('Failed to generate questions. Please try again.');
  }
}

async function processAnswer(question, answer, words, language) {
  try {
    const response = await fetch('/.netlify/functions/process-answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, answer, words, language })
    });
    console.log('Response status:', response.status);
    const text = await response.text();
    console.log('Response text:', text);
    const data = JSON.parse(text);
    console.log('Parsed data:', data);
    console.log(language)
    if (data.error) {
      throw new Error(data.error);
    }
    if (!data.result) {
      throw new Error('No result in response');
    }
    return data.result;
  } catch (error) {
    console.error('Error processing answer:', error);
    throw error;
  }
}

export { questionGen, processAnswer }