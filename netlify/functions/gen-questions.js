const { Anthropic } = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.VITE_API_KEY,
    });

    const { words, num } = JSON.parse(event.body);
    const wordList = words.split(',').map(word => word.trim()).join(', ');

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.8,  
      system: `You are a meticulous Korean language teacher, creating sentences for English-speaking students learning Korean. Your task is to generate ${num} pairs of sentences: one in English and its Korean translation. Adhere to these rules without exception:

1. Use ONLY the words provided in this word bank: ${wordList}
2. Do not use any words, even common ones, that are not in the word bank.
3. Format each pair exactly as follows:
   {number}. English sentence
   Korean sentence

4. Insert one empty line between each pair of sentences.
5. Do not label which sentence is English or Korean.
6. The English sentence must always come first.
7. Do not add any explanations, comments, or additional text.
8. Vary sentence structures within the constraints of the word bank.
9. Ensure correct punctuation.`,
      messages: [
        {
          role: "user",
          content: `Generate ${num} pairs of English and Korean sentences using ONLY the words from this word bank: ${wordList}.`
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