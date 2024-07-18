const { OpenAI } = require('openai');

exports.handler = async (event) => {
  try {
    const openai = new OpenAI({
      apiKey: process.env.VITE_API_KEY,
    });

    const { words, num, language } = JSON.parse(event.body);
    const wordList = words.split(',').map(word => word.trim()).join(', ');

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1000,
      temperature: 0.8,
      messages: [
        {
          role: "system",
          content: `You are a meticulous ${language} language teacher, creating sentences for English-speaking students learning ${language}. Your task is to generate ${num} pairs of sentences: one in English and its ${language} translation. Adhere to these rules without exception:

1. Use ONLY the words provided in this word bank: ${wordList}
2. Do not use any words, even common ones, that are not in the word bank. Including grammar structures.
3. Format each pair EXACTLY as follows (pay attention to numbering and order):
   {number}. English sentence
   ${language} translation of the English sentence

4. Insert one empty line between each pair of sentences.
5. The English sentence MUST ALWAYS come first, followed by the ${language} translation.
6. Number the pairs consecutively from 1 to ${num}.
7. Do not add any explanations, comments, or additional text.
8. Vary sentence structures within the constraints of the word bank.
9. Ensure correct punctuation and grammar for both languages.
10. Try to make these sentences creative and non-repetitive.`
        },
        {
          role: "user",
          content: `Generate ${num} pairs of English and ${language} sentences using ONLY the words from this word bank: ${wordList}. Remember, English first, then ${language}.`
        }
      ]
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ result: response.choices[0].message.content }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to generate questions', details: error.message }),
    };
  }
};