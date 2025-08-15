document.addEventListener('DOMContentLoaded', function () {
    const generateBtn = document.getElementById('generate-btn');
    const ideaContainer = document.getElementById('idea-container');
    const languageBtn = document.getElementById('language-btn');
    const editCategoriesBtn = document.getElementById('edit-categories-btn');
    const categoryModal = document.getElementById('category-modal');
    const editorModal = document.getElementById('editor-modal');
    const closeCategoryModal = document.getElementById('close-category-modal');
    const closeEditorModal = document.getElementById('close-editor-modal');
    const ideaPlaceholder = document.getElementById('idea-placeholder');

    const defaultCategories = {
        "genres": [
            "Action", "Adventure", "RPG", "Strategy", "Puzzle", "Racing",
            "Fighting", "Platformer", "Shooter", "Horror", "Simulation",
            "Sport", "Arcade", "Rhythm", "Card Game", "Board Game",
            "Tower Defense", "JRPG", "FPS", "Turn-Based", "Real-Time",
            "Sandbox", "Survival", "Stealth", "Music", "Dancing",
            "Business Sim", "City Builder", "Farming Sim", "Dating Sim",
            "Visual Novel", "Text-Based", "VR", "Mobile", "Casual",
            "Educational", "Art Game", "Experimental", "Metroidvania", "Roguelike", "Roguelite", "Beat 'em up", "Hack and Slash",
"MOBA", "MMORPG", "Point and Click", "Interactive Fiction", "Idle Game",
"Incremental", "Bullet Hell", "Shoot 'em up", "Twin-Stick Shooter", "Autobattler",
"Party Game", "Trivia", "Hidden Object", "Escape Room", "Logic",
"Tycoon", "God Game", "Life Sim", "Vehicle Sim", "Flight Sim",
"Space Sim", "Train Sim", "Naval Sim", "Open World", "Cinematic Platformer",
"Climbing", "Parkour", "Time Management", "Programming Game", "Tower Climb",
"Asymmetric Multiplayer", "Social Deduction", "Monster Tamer", "Creature Collector", "Battle Royale"
        ],
        "settings": [
            "cyberpunk", "steampunk", "medieval", "modern", "futuristic",
            "post-apocalyptic", "fantasy", "sci-fi", "horror", "western",
            "pirate", "space", "underwater", "prehistoric", "mythology",
            "fairy tale", "superhero", "zombie", "vampire", "robot",
            "alien", "magic", "technology", "nature", "urban", "rural", "ancient egypt", "ancient rome", "ancient greece", "bronze age", "iron age",  
"victorian", "renaissance", "industrial revolution", "cold war", "world war i",  
"world war ii", "1930s", "1960s", "1980s", "stone age",  
"pre-columbian", "mesoamerican", "feudal japan", "samurai era", "wuxia",  
"arabian nights", "afrofuturism", "dieselpunk", "atompunk", "biopunk",  
"gaslamp fantasy", "solar punk", "martial arts", "sports-themed", "high seas",  
"desert", "arctic", "jungle", "swamp", "mountains",  
"volcanic", "dreamscape", "parallel universe", "virtual reality", "psychedelic"
        ],
        "mechanics": [
            "One Life", "No Weapons", "Only One Enemy", "Time Limit",
            "No Jumping", "Everything Is Procedural", "You Are The Enemy",
            "Reverse Controls", "Growing/Shrinking", "Day/Night Cycle",
            "Limited Visibility", "No Save", "Permadeath", "Co-op Only",
            "Split Screen", "Asymmetric Multiplayer", "Real-Time Strategy",
            "Turn-Based Combat", "Resource Management", "Base Building",
            "Crafting System", "Leveling Up", "Skill Trees", "Open World", "Stealth Mechanics", "Parkour Movement", "Wall Running", "Double Jump", "Grappling Hook",  
"Cover System", "Bullet Time", "Chain Combos", "Parrying", "Dual Wielding",  
"Weapon Customization", "Armor Upgrades", "Dynamic Weather", "Physics-Based Puzzles", "Destructible Environments",  
"Environmental Hazards", "Climbing System", "Dialogue Choices", "Multiple Endings", "Branching Story",  
"Morality System", "Faction System", "Trading/Economy", "Mounts", "Pet Companions",  
"Squad Commands", "AI Allies", "AI Director", "Random Events", "Minigames",  
"Cooking System", "Farming", "Fishing", "Hacking", "Lockpicking",  
"Slow Motion", "Teleportation", "Shape-Shifting", "Mind Control", "Gravity Manipulation"
        ],
        "themes": [
            "revenge", "love", "betrayal", "survival", "mystery",
            "coming of age", "redemption", "sacrifice", "friendship",
            "family", "war", "peace", "discovery", "exploration",
            "conspiracy", "corruption", "justice", "freedom", "oppression",
            "technology vs nature", "good vs evil", "rich vs poor", "identity", "loss", "grief", "hope", "despair",  
"loyalty", "honor", "duty", "power", "ambition",  
"faith", "destiny", "chaos", "order", "isolation",  
"madness", "fear", "greed", "envy", "forgiveness",  
"prejudice", "tolerance", "transformation", "rebellion", "tradition vs change",  
"self-discovery", "heroism", "cowardice", "temptation", "truth vs lies",  
"memory", "time", "mortality", "immortality", "fate vs free will",  
"adaptation", "legacy", "courage", "failure", "deception"
        ]
    };

    let categories = JSON.parse(localStorage.getItem('categories')) || defaultCategories;

    let currentLanguage = 'en';

    function updateTextWithLanguage() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = window.i18nData[currentLanguage][key];
            if (translation) {
                el.textContent = translation;
            }
        });
        if (ideaPlaceholder) {
            ideaPlaceholder.textContent = window.i18nData[currentLanguage]['placeholder-text'];
        }
    }

    languageBtn.addEventListener('click', function () {
        currentLanguage = currentLanguage === 'en' ? 'ru' : 'en';
        document.documentElement.setAttribute('lang', currentLanguage);
        document.documentElement.setAttribute('data-lang', currentLanguage);
        updateTextWithLanguage();
    });

    updateTextWithLanguage();

    generateBtn.addEventListener('click', function () {
        if (ideaPlaceholder) {
            ideaContainer.innerHTML = '';
        }
        toggleLoadingOverlay(true);
        // Используем setTimeout, чтобы браузер успел отрисовать оверлей загрузки
        setTimeout(() => {
            const idea = generateIdea();
            displayIdea(idea);
            toggleLoadingOverlay(false);
        }, 1); // Минимальная задержка для обратной связи
    });

    function generateIdea() {
        function capitalizeAllWords(text) {
            return text.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        function getRandomElement(arr) {
            return arr[Math.floor(Math.random() * arr.length)];
        }

        function generateTitle() {
            const titlePatterns = [
                `${getRandomElement(['The', 'A', 'An', ''])} ${getRandomElement(['Last', 'First', 'Final', 'Ultimate', 'Secret', 'Hidden', 'Lost', 'Dark', 'Light'])} ${getRandomElement(['Warrior', 'Guardian', 'Hunter', 'Knight', 'Mage', 'Hero', 'Legend', 'Quest', 'Adventure', 'Journey'])}`,
                `${getRandomElement(['Blood', 'Fire', 'Shadow', 'Storm', 'Ice', 'Thunder', 'Star', 'Moon', 'Sun'])} ${getRandomElement(['Blade', 'Crown', 'Throne', 'Empire', 'Kingdom', 'Realm', 'World', 'Land'])}`,
                `${getRandomElement(['Beyond', 'Into', 'Through', 'Across'])} the ${getRandomElement(['Void', 'Darkness', 'Light', 'Unknown', 'Horizon', 'Depths', 'Heights'])}`
            ];
            return getRandomElement(titlePatterns).trim();
        }

        const mainGenre = getRandomElement(categories.genres);
        let secondaryGenre = getRandomElement(categories.genres);
        while (secondaryGenre === mainGenre) {
            secondaryGenre = getRandomElement(categories.genres);
        }
        const setting = getRandomElement(categories.settings);
        const mechanic = getRandomElement(categories.mechanics);
        const theme = getRandomElement(categories.themes);
        const title = generateTitle();

        let genreDesc = mainGenre;
        if (Math.random() > 0.7) {
            genreDesc += `/${secondaryGenre}`;
        }

        const settingDesc = capitalizeAllWords(setting);
        const mechanicDesc = mechanic;
        const themeDesc = capitalizeAllWords(theme);

        return {
            title: title,
            genre: genreDesc,
            setting: settingDesc,
            mechanic: mechanicDesc,
            theme: themeDesc,
            description: `A ${genreDesc.toLowerCase()} game set in a ${settingDesc.toLowerCase()} world. Features: ${mechanicDesc}. Story theme: ${themeDesc.toLowerCase()}.`
        };
    }

    function toggleLoadingOverlay(show) {
        const overlay = document.getElementById('loading-overlay');
        overlay.style.display = show ? 'block' : 'none';
    }

    function displayIdea(idea) {
        const ideaHTML = `
            <div class="idea-card">
                <h3 class="idea-title">${idea.title}</h3>
                <div class="idea-details">
                    <div class="detail-item">
                        <div class="detail-label" data-i18n="genre-label">Genre:</div>
                        <div class="detail-value">${idea.genre}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label" data-i18n="setting-label">Setting:</div>
                        <div class="detail-value">${idea.setting}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label" data-i18n="mechanic-label">Mechanic:</div>
                        <div class="detail-value">${idea.mechanic}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label" data-i18n="theme-label">Theme:</div>
                        <div class="detail-value">${idea.theme}</div>
                    </div>
                </div>
                <div class="idea-description">
                    ${idea.description}
                </div>
            </div>
        `;
        ideaContainer.innerHTML += ideaHTML;
        updateTextWithLanguage();
    }

    // Categories Management
    editCategoriesBtn.addEventListener('click', function () {
        categoryModal.style.display = 'block';
    });

    closeCategoryModal.addEventListener('click', function () {
        categoryModal.style.display = 'none';
    });

    closeEditorModal.addEventListener('click', function () {
        editorModal.style.display = 'none';
    });

    window.onclick = function (event) {
        if (event.target == categoryModal) {
            categoryModal.style.display = 'none';
        }
        if (event.target == editorModal) {
            editorModal.style.display = 'none';
        }
    }

    let currentEditingCategory = '';

    window.openCategoryEditor = function (category) {
        currentEditingCategory = category;
        document.getElementById('editor-title').textContent = `Edit ${category}`;
        populateCategoryList(categories[category]);
        editorModal.style.display = 'block';
    }

    const categoryList = document.getElementById('category-list');
    const newItemInput = document.getElementById('new-item-input');
    const addItemBtn = document.getElementById('add-item-btn');
    const saveCategoryBtn = document.getElementById('save-category-btn');
    const cancelCategoryBtn = document.getElementById('cancel-category-btn');

    addItemBtn.addEventListener('click', function () {
        const newItem = newItemInput.value.trim();
        if (newItem) {
            const itemElement = document.createElement('div');
            itemElement.className = 'category-item';
            itemElement.innerHTML = `<span>${newItem}</span> <button class='delete-btn' onclick='removeCategoryItem(this)'>&times;</button>`;
            categoryList.appendChild(itemElement);
            newItemInput.value = '';
        }
    });
    
    newItemInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addItemBtn.click();
        }
    });

    saveCategoryBtn.addEventListener('click', function () {
        const items = Array.from(categoryList.children).map(item => item.querySelector('span').textContent.trim());
        categories[currentEditingCategory] = items;
        localStorage.setItem('categories', JSON.stringify(categories));
        editorModal.style.display = 'none';
    });

    cancelCategoryBtn.addEventListener('click', function() {
        editorModal.style.display = 'none';
    });

    function populateCategoryList(items) {
        categoryList.innerHTML = '';
        items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'category-item';
            itemElement.innerHTML = `<span>${item}</span> <button class='delete-btn' onclick='removeCategoryItem(this)'>&times;</button>`;
            categoryList.appendChild(itemElement);
        });
    }

    window.removeCategoryItem = function (button) {
        button.parentElement.remove();
    }
});

