import { strip } from './ui.js'

// Question Generation
async function questionGen(words, num, openai) {
  let wordBank = words;
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful Korean language teacher, assisting English-speaking students in learning Korean. Your task is to generate ${num} pairs of sentences: one in English and its Korean translation. Follow these rules strictly:

1. Use ONLY the words provided in this word bank: ${wordBank}
2. Format each pair as follows:
   {number}. English sentence
   Korean sentence

3. Ensure there is an empty line between each pair of sentences.
4. Do not label which sentence is English or Korean.
5. Always start with the English sentence.
6. Do not add any explanations or additional text.`
      },
      {
        role: "user",
        content: `Generate ${num} pairs of English and Korean sentences using only the words from the provided word bank: ${wordBank}.`
      }
    ],
    model: "gpt-3.5-turbo",
    temperature: 1
  });
  console.log(completion.choices[0].message.content)
  strip(completion.choices[0].message.content)
}

async function processAnswer(question, answer, openai) {
  console.log(question)
  console.log(answer)
  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a helpful Korean language teacher, assisting English-speaking students in learning Korean. Your task is to evaluate the student's Korean translation of an English sentence. Provide feedback in the following format:

1. Correctness: [Correct/Partially Correct/Incorrect]
2. Explanation: [Brief explanation of any errors or areas for improvement]
3. Correct Translation: [The correct Korean translation]
4. Tips: [A short tip to help the student remember this translation or a related grammar point]

Keep your response concise and friendly, focusing on constructive feedback.`
      },
      {
        role: "user",
        content: `English sentence: "${question}"
Student's Korean translation: "${answer}"

Please evaluate the student's translation from English to Korean.`
      }
    ],
    model: "gpt-3.5-turbo",
    temperature: 0.7 
  })
  console.log(completion.choices[0].message.content)
}

export { questionGen, processAnswer }