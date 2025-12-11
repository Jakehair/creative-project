
// Scroll Animation Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Only animate once
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(element => {
    observer.observe(element);
});

// Accordion (Expandable Cards) Logic
// Expandable Card Logic
function toggleCard(card) {
    // Close other cards
    const allCards = document.querySelectorAll('.expandable-card');
    allCards.forEach(c => {
        if (c !== card) {
            c.classList.remove('active');
        }
    });
    // Toggle clicked card
    card.classList.toggle('active');
}

// Data for Scenarios
const scenarios = {
    laundry: {
        title: "The Laundry Request",
        steps: [
            {
                speaker: "Partner",
                text: "Hey, can you please move the laundry to the dryer before you start gaming?",
                internal: [
                    { type: "processing", text: "Input received: 'Laundry... dryer... gaming'." },
                    { type: "emotion", text: "Instant irritation spike. Why now? I was just about to sit down." }
                ]
            },
            {
                speaker: "ADHD Partner",
                text: "Yeah, sure in a minute.",
                internal: [
                    { type: "intended", text: "INTENTION: Do it immediately so I don't forget." },
                    { type: "distraction", text: "Visual cue: Phone notification lights up." },
                    { type: "analysis", text: "I'll just check this one text first." }
                ]
            },
            {
                speaker: "Partner",
                text: "(2 hours later) I thought you said you'd do it?",
                internal: [
                    { type: "shock", text: "Wait. 2 hours?? It's been 5 minutes." },
                    { type: "memory", text: "Searching memory for 'Laundry task'... ERROR: File not found." },
                    { type: "emotion", text: "Shame flooding. I failed again. I'm useless." }
                ]
            },
            {
                speaker: "ADHD Partner",
                text: "I... I completely forgot. I'm sorry. I wasn't ignoring you.",
                internal: [
                    { type: "defense", text: "Don't get defensive. Don't get defensive." },
                    { type: "reality", text: "They think I don't care. I care SO MUCH it hurts." }
                ]
            }
        ]
    },
    dinner: {
        title: "Dinner Plans",
        steps: [
            {
                speaker: "Partner",
                text: "Where do you want to go for dinner? Italian or Mexican?",
                internal: [
                    { type: "processing", text: "Decision required. Options: 2." },
                    { type: "analysis", text: "Italian = Pasta = Carbs = Sleepy. Mexican = Tacos = Spicy = Yum but messy." }
                ]
            },
            {
                speaker: "ADHD Partner",
                text: "Uhhhh...",
                internal: [
                    { type: "overwhelm", text: "Too many variables. Parking? Cost? Noise level? What did I eat for lunch?" },
                    { type: "freeze", text: "Brain freeze. Cannot compute preference." }
                ]
            },
            {
                speaker: "Partner",
                text: "It's a simple question.",
                internal: [
                    { type: "rejection", text: "RSD Triggered: Tone detected as annoyance." },
                    { type: "panic", text: "JUST PICK ONE OR THEY WILL HATE YOU." }
                ]
            },
            {
                speaker: "ADHD Partner",
                text: "I don't know! You decide! Why is this always on me?!",
                internal: [
                    { type: "regret", text: "Why did I yell? I didn't mean to yell." },
                    { type: "exhaustion", text: "Decision fatigue complete. System shutdown." }
                ]
            }
        ]
    },
    story: {
        title: "Telling a Story",
        steps: [
            {
                speaker: "ADHD Partner",
                text: "So I was at the store, and I saw this dog...",
                internal: [
                    { type: "focus", text: "Goal: Tell story about the dog." },
                    { type: "association", text: "Wait, the dog looked like my childhood dog, Buster." }
                ]
            },
            {
                speaker: "ADHD Partner",
                text: "...which reminded me of Buster, who once ate a whole deviations...",
                internal: [
                    { type: "tangent", text: "Tangent Detected: Buster's vet bill." },
                    { type: "tangent", text: "Tangent Detected: Vets are expensive." },
                    { type: "tangent", text: "Tangent Detected: I need to pay the electric bill." }
                ]
            },
            {
                speaker: "Partner",
                text: "Wait, what about the store?",
                internal: [
                    { type: "confusion", text: "Store? What store? Oh right. Main quest." },
                    { type: "shame", text: "I'm boring them. I talk too much. Wrap it up." }
                ]
            },
             {
                speaker: "ADHD Partner",
                text: "Nevermind. It wasn't important.",
                internal: [
                    { type: "withdrawal", text: "Abort mission. Save logic energy." }
                ]
            }
        ]
    }
};

// Simulation Logic
async function runSimulation() {
    const keys = Object.keys(scenarios);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const scenario = scenarios[randomKey];
    
    const externalChat = document.getElementById('externalChat');
    const internalChat = document.getElementById('internalChat');
    const typingIndicator = document.getElementById('externalTyping');
    const titleDisplay = document.getElementById('scenarioTitle');

    // Reset
    externalChat.innerHTML = '';
    internalChat.innerHTML = '';
    
    // Show Title
    titleDisplay.innerText = `Scenario: ${scenario.title}`;
    titleDisplay.style.opacity = '1';
    
    // Disable button
    const btn = document.querySelector('button');
    btn.disabled = true;
    btn.innerText = "Simulating...";

    for (const step of scenario.steps) {
        // 1. Internal Reaction first (often happens before speech or during listening)
        for (const thought of step.internal) {
            await new Promise(r => setTimeout(r, 600)); // Fast processing speed
            addInternalThought(thought, internalChat);
            internalChat.scrollTop = internalChat.scrollHeight;
        }

        // 2. Typing delay for speech
        typingIndicator.innerText = `${step.speaker} is typing...`;
        await new Promise(r => setTimeout(r, 1000));
        typingIndicator.innerText = '';

        // 3. External Speech
        addExternalMessage(step.speaker, step.text, externalChat);
        externalChat.scrollTop = externalChat.scrollHeight;
        
        await new Promise(r => setTimeout(r, 800)); // Pause between turns
    }

    btn.disabled = false;
    btn.innerText = "Simulate Another Conversation";
}

function addInternalThought(thought, container) {
    const div = document.createElement('div');
    div.className = 'internal-monologue';
    div.innerHTML = `
        <div class="thought ${thought.type}">
            <span class="thought-label">>> ${thought.type}</span>
            <span class="thought-text">${thought.text}</span>
        </div>
    `;
    container.appendChild(div);
}

function addExternalMessage(speaker, text, container) {
    const div = document.createElement('div');
    const isADHD = speaker === "ADHD Partner";
    div.className = `message ${isADHD ? 'partner-b' : 'partner-a'}`;
    div.innerHTML = `<strong>${speaker}:</strong><br>${text}`;
    container.appendChild(div);
}
