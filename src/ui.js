import { processAnswer } from './prompting.js'
import { text } from './main.js'

let currentIndex = 0
let currentQuestions = {} 
let currentQuestion = '' // to store the current question

// Questions to Dict
function strip(message) {
  let lines = message.split('\n')
  let dictionary = {}

  for (let i = 0; i < lines.length; i += 3) {  // each question takes 3 lines 
    let key = lines[i].match(/^\d+/)[0]
    let englishText = lines[i].replace(/^\d+\.\s*/, '').trim() // strip whitespaces and form the dictionary entry
    let otherText = lines[i + 1].trim()
    dictionary[key] = {
      english: englishText,
      other: otherText
    }
  }
  console.log(dictionary)
  display(dictionary)
}

// Display question
function display(questions) {
  if (questions) {
    currentQuestions = questions // store all questions
  }

  const keys = Object.keys(currentQuestions)
  const questionBox = document.getElementById('question-box')
  const answerBox = document.getElementById('answer-box')
  const submitButton = document.getElementById('submit-button')
  const nextButton = document.getElementById('next')

  if (currentIndex < keys.length) {
    const key = keys[currentIndex]
    currentQuestion = currentQuestions[key].english // save the current question
    questionBox.textContent = `${key}. ${currentQuestion}`
    answerBox.style.display = 'inline'
    submitButton.style.display = 'inline'
    nextButton.style.display = 'none'
  } 
  else {
    questionBox.textContent = "All questions answered!"
    answerBox.style.display = 'none'
    submitButton.style.display = 'none'
    nextButton.style.display = 'none'
  }
}

async function handleSubmit() {
  const answerBox = document.getElementById('answer-box')
  const answer = answerBox.value
  
  if (answer.trim() === '') {
    alert('Please enter an answer before submitting.')
    return
  }
  try {
    const feedback = await processAnswer(currentQuestion, answer, text)
    console.log(currentQuestion, answer, text)
    // Display the feedback to the user
    const feedbackBox = document.getElementById('feedback-box') || document.createElement('div')
    feedbackBox.id = 'feedback-box'
    feedbackBox.innerHTML = feedback.replace(/\n/g, '<br>')
    document.body.appendChild(feedbackBox)
  } 
  catch (error) {
    console.error("Error processing answer:", error)
    alert('Failed to process answer. Please try again.')
  }
  document.getElementById('submit-button').style.display = 'none'
  document.getElementById('next').style.display = 'inline'
}

function handleNext() {
  const feedbackBox = document.getElementById('feedback-box');
  if (feedbackBox) {
    feedbackBox.innerHTML = '';
  }
  
  const answerBox = document.getElementById('answer-box')
  answerBox.value = ''
  currentIndex++
  display()

}

export { strip, display, handleSubmit, handleNext }