const phrases = [
    { text: "Fluency, one ", highlight: "feather", suffix: " at a time", lang: "English" },
    { text: "流利，一个", highlight: "羽毛", suffix: "一次", lang: "Chinese" },
    { text: "유창함, 하나의 ", highlight: "깃털", suffix: " 씩", lang: "Korean" },
    { text: "Fluidez, una ", highlight: "pluma", suffix: " a la vez", lang: "Spanish" },
    { text: "La fluidité, une ", highlight: "plume", suffix: " à la fois", lang: "French" },
    { text: "Fluidità, una ", highlight: "piuma", suffix: " alla volta", lang: "Italian" },
    { text: "流暢さ、一つの", highlight: "羽", suffix: "ずつ", lang: "Japanese" },
    { text: "Flüssigkeit, eine ", highlight: "feder", suffix: " nach der anderen", lang: "German" },
    { text: "Fluência, uma ", highlight: "pena", suffix: " de cada vez", lang: "Portuguese" }
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    const fullText = `${currentPhrase.text}${currentPhrase.highlight}${currentPhrase.suffix}`;
    const changingTextElement = document.getElementById('changing-text');

    if (!isDeleting && charIndex <= fullText.length) {
        if (charIndex <= currentPhrase.text.length) {
            changingTextElement.textContent = fullText.substring(0, charIndex);
        } else if (charIndex <= currentPhrase.text.length + currentPhrase.highlight.length) {
            changingTextElement.innerHTML = 
                `${currentPhrase.text}<span class="highlight">${currentPhrase.highlight.substring(0, charIndex - currentPhrase.text.length)}</span>`;
        } else {
            changingTextElement.innerHTML = 
                `${currentPhrase.text}<span class="highlight">${currentPhrase.highlight}</span>${fullText.substring(currentPhrase.text.length + currentPhrase.highlight.length, charIndex)}`;
        }
        charIndex++;
        if (charIndex <= fullText.length) {
            setTimeout(typeWriter, 50); // Typing speed
        } else {
            setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, 2000); // Pause before starting to delete
        }
    } else if (isDeleting && charIndex >= 0) {
        if (charIndex > currentPhrase.text.length + currentPhrase.highlight.length) {
            changingTextElement.innerHTML = 
                `${currentPhrase.text}<span class="highlight">${currentPhrase.highlight}</span>${fullText.substring(currentPhrase.text.length + currentPhrase.highlight.length, charIndex)}`;
        } else if (charIndex > currentPhrase.text.length) {
            changingTextElement.innerHTML = 
                `${currentPhrase.text}<span class="highlight">${currentPhrase.highlight.substring(0, charIndex - currentPhrase.text.length)}</span>`;
        } else {
            changingTextElement.textContent = fullText.substring(0, charIndex);
        }
        charIndex--;
        if (charIndex >= 0) {
            setTimeout(typeWriter, 25); // Faster backspace speed
        } else {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            charIndex = 0;
            setTimeout(typeWriter, 1000); // Pause before typing next phrase
        }
    }
}

export function initTypewriterEffect() {
    typeWriter();
}