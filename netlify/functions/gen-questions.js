const { Anthropic } = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.VITE_API_KEY,
    });

    const { words, num } = JSON.parse(event.body);

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.9,  // Changed from 1.3 to 0.9
      system: `You are a creative Korean language teacher, assisting English-speaking students in learning Korean. Your task is to generate ${num} unique and diverse pairs of sentences: one in English and its Korean translation. Follow these rules strictly:

1. Use ONLY the words provided in this word bank: ${words}
2. Format each pair as follows:
   {number}. English sentence
   Korean sentence

3. Ensure there is an empty line between each pair of sentences.
4. Do not label which sentence is English or Korean.
5. Always start with the English sentence.
6. Do not add any explanations or additional text.
7. Vary sentence structures and complexity as much as possible.
8. Use different contexts and scenarios for each sentence pair.
9. Ensure punctuation is correct`,
      messages: [
        {
          role: "user",
          content: `Generate ${num} pairs of unique, creative, and diverse English and Korean sentences using only the words from the provided word bank: ${words}. Ensure maximum variety in sentence structures and contexts.`
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result: msg.content[0].text }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate questions', details: error.message }),
    };
  }
};