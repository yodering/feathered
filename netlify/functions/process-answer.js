const { Anthropic } = require('@anthropic-ai/sdk');

exports.handler = async (event) => {
  try {
    const anthropic = new Anthropic({
      apiKey: process.env.VITE_API_KEY,
    });

    const { question, answer } = JSON.parse(event.body);

    const msg = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 1000,
      temperature: 0.7,
      system: `You are a helpful Korean language teacher, assisting English-speaking students in learning Korean. Your task is to evaluate the student's Korean translation of an English sentence. Provide feedback in the following format:

1. Correctness: [Correct/Partially Correct/Incorrect]
2. Explanation: [Brief explanation of any errors or areas for improvement]
3. Correct Translation: [The correct Korean translation]
4. Tips: [A short tip to help the student remember this translation or a related grammar point, no more than one sentence]

Keep your response concise and friendly, focusing on constructive feedback. Ensure the feedback is in this order and formatting.`,
      messages: [
        {
          role: "user",
          content: `English sentence: "${question}"
Student's Korean translation: "${answer}"
Please evaluate the student's translation from English to Korean.`
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
      body: JSON.stringify({ error: 'Failed to process answer', details: error.message }),
    };
  }
};