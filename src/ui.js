import { processAnswer } from './prompting.js'

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

async function handleSubmit(openai) {
  const answerBox = document.getElementById('answer-box')
  const answer = answerBox.value
  
  if (answer.trim() === '') {
    alert('Please enter an answer before submitting.')
    return
  }

  try {
    await processAnswer(currentQuestion, answer, openai)
  } 
  catch (error) {
    console.error("Error processing answer:", error)
  }

  document.getElementById('submit-button').style.display = 'none'
  document.getElementById('next').style.display = 'inline'
}

function handleNext() {
  const answerBox = document.getElementById('answer-box')
  answerBox.value = ''
  currentIndex++
  display()
}

export { strip, display, handleSubmit, handleNext }