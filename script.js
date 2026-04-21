// Состояние игры
let gameState = {
    year: 1914,
    country: "",
    stats: { economy: 50, army: 50, relation: 0 },
    era: "WWI", // WWI, WWII, ColdWar, Modern
    currentScene: "start"
};

// База данных персонажей и их реплик
const dialogues = {
    "WWI": {
        character: "Вильгельм II",
        text: "Пороховая бочка Европы готова взорваться. Какую позицию займет ваша держава?",
        choices: [
            { text: "Поддержать союзников (+10 Армия)", effect: { army: 10, rel: 5 }, next: "ww1_next" },
            { text: "Сохранить нейтралитет (+10 Экономика)", effect: { economy: 10, rel: -5 }, next: "ww1_next" }
        ]
    },
    "hitler_intro": {
        character: "Адольф Гитлер",
        text: "Мир видит во мне лишь тирана. Но знаешь ли ты, как тяжело было юноше в Вене мечтать о красках, когда вокруг была лишь серость и нужда? Мои амбиции родились из боли.",
        choices: [
            { text: "Разделить его переживания (Чувственный путь)", effect: { rel: 20 }, next: "hitler_close" },
            { text: "Осудить его методы (Вражеский путь)", effect: { rel: -20 }, next: "hitler_enemy" }
        ]
    },
    "hitler_close": {
        character: "Адольф Гитлер",
        text: "Твое понимание... оно редкость. Иногда мне кажется, что только в твоих глазах я не вижу страха. Останься, давай обсудим будущее Европы.",
        choices: [
            { text: "Пообещать верность", effect: { rel: 10, army: 5 }, next: "end_demo" }
        ]
    }
};

function startGame(selectedCountry) {
    gameState.country = selectedCountry;
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('main-game').classList.remove('hidden');
    renderScene("WWI");
}

function renderScene(sceneKey) {
    const scene = dialogues[sceneKey];
    if (!scene) return;

    document.getElementById('character-name').innerText = scene.character;
    document.getElementById('dialogue-text').innerText = scene.text;
    
    const choiceContainer = document.getElementById('choices-container');
    choiceContainer.innerHTML = "";

    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = "choice-btn";
        btn.innerText = choice.text;
        btn.onclick = () => makeChoice(choice);
        choiceContainer.appendChild(btn);
    });
}

function makeChoice(choice) {
    // Применяем эффекты
    if (choice.effect) {
        gameState.stats.army += choice.effect.army || 0;
        gameState.stats.economy += choice.effect.economy || 0;
        gameState.stats.relation += choice.effect.rel || 0;
        updateUI();
    }

    // Хронологический переход (упрощенно)
    if (gameState.year === 1914) {
        gameState.year = 1939;
        gameState.era = "WWII";
        renderScene("hitler_intro");
    } else {
        renderScene(choice.next);
    }
}

function updateUI() {
    document.getElementById('date-display').innerText = `Год: ${gameState.year}`;
    document.getElementById('econ').innerText = gameState.stats.economy;
    document.getElementById('army').innerText = gameState.stats.army;
    document.getElementById('relation').innerText = gameState.stats.relation;
}

function openPolicy(type) {
    if (type === 'inner') {
        alert("Внутренняя политика: Вы вложили средства в заводы. Экономика +5");
        gameState.stats.economy += 5;
    } else {
        alert("Внешняя политика: Ваши дипломаты ведут переговоры.");
        gameState.stats.relation += 2;
    }
    updateUI();
}
