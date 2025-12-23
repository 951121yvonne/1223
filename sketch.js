let player;
let questioners = [];
let potion;
let hintCharacter;
let gameBackground;
let currentQuestioner = null;
let currentQuestionerIndex = 0;
let questionActive = false;
let hintCharacterVisible = false;
let playerAttacking = false;
let hintTarget = { x: null, y: null };
let hintTimeoutId = null;

// 遊戲狀態
let gameState = 'preparing'; // 'preparing', 'playing', 'gameOver'

// 遊戲中的所有圖片資源
let images = {};
let fireballs = [];

// 遊戲參數
const TILE_SIZE = 64; 
let GAME_WIDTH = 800;
let GAME_HEIGHT = 600;

let GROUND_Y = GAME_HEIGHT * 0.65; 

// 動畫和角色尺寸常量
const PLAYER_SCALE = 0.5; 
const PLAYER_DISPLAY_W = 180 * PLAYER_SCALE; 
const PLAYER_DISPLAY_H = 193 * PLAYER_SCALE; 

const HINT_SCALE = 0.7; 
const HINT_DISPLAY_W = 167 * HINT_SCALE; 
const HINT_DISPLAY_H = 120 * HINT_SCALE; 

const QUESTIONER_SCALE = 0.6; 
const Q1_DISPLAY_W = 205 * QUESTIONER_SCALE; 
const Q1_DISPLAY_H = 192 * QUESTIONER_SCALE; 
const Q2_DISPLAY_W = 175 * QUESTIONER_SCALE; 
const Q2_DISPLAY_H = 166 * QUESTIONER_SCALE; 
const Q3_DISPLAY_W = 188 * QUESTIONER_SCALE; 
const Q3_DISPLAY_H = 141 * QUESTIONER_SCALE; 

const POTION_SCALE = 1.2;
const POTION_W = 541 / 8 * POTION_SCALE; 
const POTION_H = 73 * POTION_SCALE; 

const ANIMATION_SPEED = 5; 

// 遊戲狀態
let playerHealth = 5;
const MAX_PLAYER_HEALTH = 5;

// --- 美術題庫 (已擴充) ---
const QUESTION_BANK = {
    '提問者二': [ // 風格：印象派、色彩學
        { 
            question: "誰被稱為「印象派」的創始人，以描繪巴黎街景和芭蕾舞者著稱?", 
            options: ["A. 莫內", "B. 達文西", "C. 梵谷"],
            answer: "a", 
            hint: "他的代表作有《日出·印象》。" 
        },
        { 
            question: "哪種顏色是三原色之一，不能透過混合其他顏色得到?", 
            options: ["A. 綠色", "B. 黃色", "C. 紫色"],
            answer: "b", 
            hint: "另兩種原色是紅與藍。" 
        },
        {
            question: "《星夜》是哪位後印象派畫家的著名作品？",
            options: ["A. 畢卡索", "B. 梵谷", "C. 高更"],
            answer: "b",
            hint: "他生前只賣出一幅畫，且割掉了自己的耳朵。"
        },
        {
            question: "在色彩學中，紅色與綠色互為？",
            options: ["A. 相似色", "B. 互補色", "C. 同類色"],
            answer: "b",
            hint: "在色相環上，它們位於正對面，對比最強烈。"
        }
    ],
    '提問者三': [ // 風格：文藝復興、光影、透視
        { 
            question: "文藝復興時期，哪位藝術家創作了著名壁畫《最後的晚餐》?", 
            options: ["A. 米開朗基羅", "B. 拉斐爾", "C. 達文西"],
            answer: "c", 
            hint: "他也是一位著名的科學家、發明家。" 
        },
        { 
            question: "在繪畫中，用於表現光線投射到物體上所產生的深淺變化叫做什麼?", 
            options: ["A. 色相", "B. 明度", "C. 對比"],
            answer: "b", 
            hint: "這與顏色的亮度有關。" 
        },
        {
            question: "文藝復興三傑中，雕刻出著名作品《大衛像》的是誰？",
            options: ["A. 米開朗基羅", "B. 波提切利", "C. 達文西"],
            answer: "a",
            hint: "他也繪製了西斯汀禮拜堂的天頂畫《創世紀》。"
        },
        {
            question: "在平面上表現立體空間感（近大遠小）的技法稱為什麼？",
            options: ["A. 透視法", "B. 潑墨法", "C. 拼貼法"],
            answer: "a",
            hint: "這是在文藝復興時期被確立的科學繪畫方法。"
        }
    ],
    '提問者一': [ // 風格：雕塑、設計原理、現代藝術
        { 
            question: "哪一種雕塑媒材是法國雕塑家羅丹最常使用的，用於創作《沉思者》?", 
            options: ["A. 大理石", "B. 青銅", "C. 木頭"],
            answer: "b", 
            hint: "青綠色的金屬合金。" 
        },
        { 
            question: "在設計中，將物件安排在畫面上，使之平衡或產生動態感的行為稱為什麼?", 
            options: ["A. 構圖", "B. 紋理", "C. 筆觸"],
            answer: "a", 
            hint: "這是創作前的基本規劃。" 
        },
        {
            question: "誰是「立體派」的代表人物，創作了《格爾尼卡》？",
            options: ["A. 達利", "B. 畢卡索", "C. 馬諦斯"],
            answer: "b",
            hint: "他的畫作常將物體拆解、重組，同時呈現不同角度。"
        },
        {
            question: "以超現實主義著稱，畫作中有融化時鐘（《記憶的堅持》）的畫家是？",
            options: ["A. 達利", "B. 馬格利特", "C. 米羅"],
            answer: "a",
            hint: "他留著非常具標誌性的翹鬍子。"
        }
    ]
};

// --- 藥水題庫 (已修改為陣列) ---
const POTION_BANK = [
    {
        question: "請計算： $\\frac{10 \\times 2}{5} + 7 = ?$", 
        options: ["A. 11", "B. 4", "C. 9"],
        answer: "a",
        hint: "先乘除後加減，答案是 11。"
    },
    {
        question: "請計算： $3^2 + 4^2 = ?$",
        options: ["A. 14", "B. 25", "C. 7"],
        answer: "b",
        hint: "3的平方是9，4的平方是16，加起來是25。"
    },
    {
        question: "若 $2x = 10$，則 $x + 3 = ?$",
        options: ["A. 5", "B. 8", "C. 13"],
        answer: "b",
        hint: "先算出 x 是 5，再加 3。"
    },
    {
        question: "請計算： $15 \\div 3 \\times 2 = ?$",
        options: ["A. 2.5", "B. 10", "C. 1"],
        answer: "b",
        hint: "由左至右計算，先除再乘。"
    },
    {
        question: "請問 $180^\\circ$ 的一半是多少度？",
        options: ["A. 45度", "B. 90度", "C. 60度"],
        answer: "b",
        hint: "這是直角三角形的一個角。"
    }
];


// --- 動畫管理類別 ---
class Animation {
    constructor(spritesheet, frameW, frameH, frameCount, speed, framesMeta = null, options = {}) {
        this.spritesheet = spritesheet;
        this.frameW = frameW;
        this.frameH = frameH;
        this.frameCount = frameCount;
        this.speed = speed;
        this.frames = [];
        this.currentFrame = 0;
        this.framesMeta = framesMeta;
        this.options = Object.assign({ scale: 1, offsetX: 0, offsetY: 0 }, options);

        // 切割精靈圖
        if (this.framesMeta && Array.isArray(this.framesMeta) && this.framesMeta.length > 0) {
            for (let i = 0; i < this.framesMeta.length; i++) {
                let m = this.framesMeta[i];
                let img = this.spritesheet.get(m.x, m.y, m.w, m.h);
                this.frames.push(img);
            }
            this.frameCount = this.frames.length;
        } else {
            for (let i = 0; i < this.frameCount; i++) {
                // 這裡假設精靈圖是單行排列
                let img = this.spritesheet.get(i * this.frameW, 0, this.frameW, this.frameH);
                this.frames.push(img);
            }
        }
    }

    display(x, y, displayW, displayH) {
        let index = floor(frameCount / this.speed) % this.frameCount;
        let frameImg = this.frames[index];
        
        let targetW, targetH, drawX, drawY;
        
        // 若有 framesMeta，直接使用實際寬高（不等比例調整）
        if (this.framesMeta && Array.isArray(this.framesMeta) && this.framesMeta.length > 0 && index < this.framesMeta.length) {
            let m = this.framesMeta[index];
            targetW = m.w;
            targetH = m.h;
            // 置中於 displayW 和 displayH 內
            drawX = x + (displayW - targetW) / 2;
            drawY = y + (displayH - targetH) / 2;
        } else {
            // 沒有 metadata 時，按等比例縮放
            let aspect = frameImg.width / frameImg.height;
            targetH = displayH;
            targetW = targetH * aspect;
            drawX = x + (displayW - targetW) / 2;
            drawY = y + (displayH - targetH) / 2;
            
            if (this.options.scale !== 1) {
                targetW *= this.options.scale;
                targetH *= this.options.scale;
                drawX = x + (displayW - targetW) / 2;
                drawY = y + (displayH - targetH) / 2;
            }
        }
        
        drawX += this.options.offsetX;
        drawY += this.options.offsetY;

        image(frameImg, drawX, drawY, targetW, targetH);
        this.currentFrame = index;
    }
}

// 火球類別（簡單表示，使用圓形）
class Fireball {
    constructor(x, y, targetX, targetY, speed, owner) {
        this.x = x;
        this.y = y;
        this.owner = owner;
        this.speed = speed || 6;
        // 計算單位方向向量
        let dx = targetX - x;
        let dy = targetY - y;
        let d = sqrt(dx*dx + dy*dy) || 1;
        this.vx = (dx / d) * this.speed;
        this.vy = (dy / d) * this.speed;
        this.active = true;
        this.radius = 12;
    }

    update() {
        if (!this.active) return;
        this.x += this.vx;
        this.y += this.vy;
        // 若超出畫面範圍則取消
        if (this.x < -50 || this.x > GAME_WIDTH + 50 || this.y < -50 || this.y > GAME_HEIGHT + 50) {
            this.active = false;
        }
    }

    display() {
        if (!this.active) return;
        push();
        noStroke();
        // 閃爍效果：alpha 隨時間改變
        let a = 180 + 75 * sin(frameCount * 0.3);
        fill(255, 120, 20, a);
        ellipse(this.x, this.y, this.radius*2, this.radius*2);
        pop();
    }
}


// --- 遊戲物件類別定義 ---

class Character {
    constructor(x, y, name, health) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.health = health;
        this.maxHealth = health;
        this.animations = {}; 
        this.currentState = 'idle'; 
        this.displayW = TILE_SIZE; 
        this.displayH = TILE_SIZE; 
        this.direction = 1; 
    }
    
    initAnimations() {}

    drawHealthBar(barW = 50, barH = 5) {
        if (this.health <= 0 || this.name === '提示角色') return;

        let drawY = -this.displayH - 10; 
        let healthRatio = this.health / this.maxHealth;

        push();
        noStroke();
        rectMode(CENTER);
        fill(0);
        rect(0, drawY, barW, barH, 2);

        let healthColor;
        if (this.name === '玩家') {
            healthColor = color(0, 200, 0);
        } else {
            healthColor = color(200, 0, 0);
        }
        fill(healthColor);
        rectMode(CORNER);
        rect(-barW / 2, drawY - barH / 2, barW * healthRatio, barH);
        pop();
    }
    
    display() {
        push();
        translate(this.x, this.y);
        let drawY = -this.displayH; // 腳底對齊

        if (this.animations[this.currentState]) {
            push();
            if (this.direction === -1) {
                scale(-1, 1);
            }
            this.animations[this.currentState].display(
                -this.displayW / 2, 
                drawY, 
                this.displayW, 
                this.displayH
            );
            pop();
        } else if (this.health > 0) {
            fill(150, 0, 150); 
            rectMode(CENTER);
            rect(0, drawY + this.displayH / 2, TILE_SIZE, TILE_SIZE);
        }

        this.drawHealthBar();
        
        fill(255);
        textAlign(CENTER, BOTTOM);
        text(this.name, 0, drawY - 20); 
        pop();
    }
}

class Player extends Character {
    constructor(x, y) {
        super(x, y, '玩家', MAX_PLAYER_HEALTH);
        this.speed = 3;
        this.displayW = PLAYER_DISPLAY_W;
        this.displayH = PLAYER_DISPLAY_H;
        this.direction = 1; 
        this.vy = 0;
        this.gravity = 0.8;
        this.jumpPower = 14; 
        this.onGround = true;
        this.maxJumpHeight = (this.jumpPower * this.jumpPower) / (2 * this.gravity);
    }
    
    initAnimations() {
        this.animations.idle = new Animation(images.player_idle, 179.4, 184, 7, ANIMATION_SPEED);
        this.animations.walk = new Animation(images.player_walk, 182.8, 190, 7, ANIMATION_SPEED);
        this.animations.attack = new Animation(images.player_attack, 160, 193, 8, ANIMATION_SPEED);
        this.animations.hurt = new Animation(images.player_hurt, 182, 184, 4, ANIMATION_SPEED);
        this.animations.dead = new Animation(images.player_dead, 168, 176, 4, ANIMATION_SPEED * 2);
        // 優先使用每幀原始尺寸（若存在 framesMeta），以避免等比例裁切不同大小的影格
        for (let k in this.animations) {
            this.animations[k].options = Object.assign(this.animations[k].options || {}, { useNaturalSize: true });
        }
    }

    move() {
        if (this.health <= 0 || questionActive || playerAttacking) return; 

        let moving = false;
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { 
            this.x -= this.speed;
            this.direction = -1; 
            moving = true;
        } 
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { 
            this.x += this.speed;
            this.direction = 1; 
            moving = true;
        }

        if (moving && this.currentState !== 'walk') {
            this.currentState = 'walk';
        } else if (!moving && this.currentState === 'walk') {
            this.currentState = 'idle';
        }
        
        this.x = constrain(this.x, this.displayW / 2, GAME_WIDTH - this.displayW / 2);

        this.vy += this.gravity;
        this.y += this.vy;

        if (this.y >= GROUND_Y) {
            this.y = GROUND_Y;
            this.vy = 0;
            this.onGround = true;
            if (this.currentState === 'jump') this.currentState = 'idle';
        } else {
            this.onGround = false;
        }
    }

    jump() {
        if (!this.onGround || this.health <= 0 || questionActive) return;
        this.vy = -this.jumpPower;
        this.onGround = false;
        this.currentState = 'jump';
    }
    
    display() {
        if (this.health <= 0) {
            this.currentState = 'dead';
        }
        
        push();
        translate(this.x, this.y);
        let drawY = -this.displayH;

        if (this.animations[this.currentState]) {
            push();
            if (this.direction === -1) scale(-1, 1);
            this.animations[this.currentState].display(
                -this.displayW / 2,
                drawY,
                this.displayW,
                this.displayH
            );
            pop();
        }
        
        this.drawHealthBar(PLAYER_DISPLAY_W * 0.8, 8);

        fill(255);
        textAlign(CENTER, BOTTOM);
        text(this.name, 0, drawY - 20); 

        pop();
    }
}

class HintCharacter extends Character {//
    constructor(x, y) {
        super(x, y, '提示角色', Infinity); //
        this.displayW = HINT_DISPLAY_W;
        this.displayH = HINT_DISPLAY_H;
    }

    initAnimations() {
        this.animations.idle = new Animation(images.hint_idle, 156, 104, 4, ANIMATION_SPEED);
        this.animations.walk = new Animation(images.hint_walk, 161.3, 112, 6, ANIMATION_SPEED);
        this.animations.jump = new Animation(images.hint_jump, 162.7, 120, 6, ANIMATION_SPEED);
        this.animations.run = new Animation(images.hint_run, 161.3, 104, 6, ANIMATION_SPEED);
    }
    
    display() {
        if (!hintCharacterVisible) return;
        
        push();
        translate(this.x, this.y);
        let drawY = -this.displayH; 

        if (this.animations[this.currentState]) {
            this.animations[this.currentState].display(
                -this.displayW / 2, 
                drawY, 
                this.displayW, 
                this.displayH
            );
        }
        pop();
    }
}

class Questioner extends Character {
    constructor(x, y, name, questionKey) {
        super(x, y, name, 2); 
        this.questions = QUESTION_BANK[questionKey];
        this.currentQuestionIndex = 0; 
        this.vx = (random() < 0.5 ? -1 : 1) * random(0.8, 2);
        this.triggered = false; 
        this.canShoot = true;
        
        if (this.name === '提問者一') {
            this.displayW = Q1_DISPLAY_W;
            this.displayH = Q1_DISPLAY_H;
        } else if (this.name === '提問者二') { 
            this.displayW = Q2_DISPLAY_W;
            this.displayH = Q2_DISPLAY_H;
        } else if (this.name === '提問者三') { 
            this.displayW = Q3_DISPLAY_W;
            this.displayH = Q3_DISPLAY_H;
        }
        this.initAnimations();
    }

    update() {
        if (this.health <= 0) return;

        if (!questionActive && !this.triggered) {
            this.x += this.vx;
            if (this.x < this.displayW / 2 || this.x > GAME_WIDTH - this.displayW / 2) {
                this.vx *= -1;
                this.x = constrain(this.x, this.displayW / 2, GAME_WIDTH - this.displayW / 2);
            }
            if (this.currentState !== 'walk') this.currentState = 'walk';

            this.direction = this.vx >= 0 ? 1 : -1;
            
            let d = dist(this.x, this.y, player.x, player.y);
            // 提問者一遠距發射火球（在中距離時觸發）
            if (this.name === '提問者一' && this.canShoot && d > 120 && d < 400) {
                let startX = this.x;
                let startY = this.y - this.displayH / 2;
                let targetX = player.x;
                let targetY = player.y - player.displayH / 2;
                let fb = new Fireball(startX, startY, targetX, targetY, 7, this);
                fireballs.push(fb);
                this.canShoot = false;
                this.currentState = 'attack';
                setTimeout(() => { this.canShoot = true; }, 3000);
            }
            if (d < 120) {
                this.triggered = true;
                this.currentState = 'attack';
                this.direction = (player.x > this.x) ? 1 : -1; 
                
                currentQuestioner = this;
                currentQuestionerIndex = questioners.indexOf(this);
                let qData = this.askQuestion();
                if (qData) {
                    displayQuestion(qData, 'questioner');
                }
            }
        }
    }

    initAnimations() {
        if (this.name === '提問者一') {
            this.animations.idle = new Animation(images.q1_idle, 148.1, 176, 6, ANIMATION_SPEED);
            this.animations.walk = new Animation(images.q1_walk, 156.4, 184, 8, ANIMATION_SPEED);
            this.animations.attack = new Animation(images.q1_attack, 204.4, 184, 8, ANIMATION_SPEED); 
            this.animations.hurt = new Animation(images.q1_hurt, 123.3, 192, 3, ANIMATION_SPEED);
            this.animations.dead = new Animation(images.q1_dead, 171.3, 184, 3, ANIMATION_SPEED * 2);
            for (let k in this.animations) this.animations[k].options = Object.assign(this.animations[k].options || {}, { useNaturalSize: true });
        } else if (this.name === '提問者二') {
            this.animations.idle = new Animation(images.q2_idle, 174.7, 160, 6, ANIMATION_SPEED);
            this.animations.walk = new Animation(images.q2_walk, 155.6, 154, 8, ANIMATION_SPEED);
            this.animations.attack = new Animation(images.q2_attack, 160, 132, 8, ANIMATION_SPEED);
            this.animations.hurt = new Animation(images.q2_hurt, 148, 152, 2, ANIMATION_SPEED);
            for (let k in this.animations) this.animations[k].options = Object.assign(this.animations[k].options || {}, { useNaturalSize: true });
        } else if (this.name === '提問者三') {
            this.animations.idle = new Animation(images.q3_idle, 160, 102, 8, ANIMATION_SPEED);
            this.animations.walk = new Animation(images.q3_walk, 160, 134, 8, ANIMATION_SPEED);
            this.animations.attack = new Animation(images.q3_attack, 182.9, 141, 7, ANIMATION_SPEED);
            this.animations.hurt = new Animation(images.q3_hurt, 180, 112, 2, ANIMATION_SPEED);
            this.animations.dead = new Animation(images.q3_dead, 188, 120, 2, ANIMATION_SPEED * 2); 
            for (let k in this.animations) this.animations[k].options = Object.assign(this.animations[k].options || {}, { useNaturalSize: true });
        }
    }

    askQuestion() {
        if (this.health <= 0) return null; 
        if (this.currentQuestionIndex >= this.questions.length) return null; 
        return this.questions[this.currentQuestionIndex];
    }
    
    takeDamage() {
        this.health -= 1;
        if (this.health > 0) {
            this.currentState = 'hurt';
            setTimeout(() => {
                if (this.health > 0) this.currentState = 'idle';
            }, 300);
        } else {
            this.currentState = 'dead';
            setTimeout(() => {
                spawnNextQuestioner();
            }, 800); 
        }
    }
    
    display() {
        if (this.health <= 0) {
                this.currentState = 'dead'; 
        }
        
        push();
        translate(this.x, this.y);
        
        let drawY = -this.displayH; 

        if (this.animations[this.currentState]) {
            push();
            if (this.direction === -1) scale(-1, 1);
            
            this.animations[this.currentState].display(
                -this.displayW / 2, 
                drawY, 
                this.displayW, 
                this.displayH
            );
            pop();
        }
        
        if (this.health > 0) {
            this.drawHealthBar(this.displayW * 0.8, 8);
            fill(255);
            textAlign(CENTER, BOTTOM);
            text(this.name, 0, drawY - 20); 
        }
        pop();
    }
}

class Potion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visible = true; 
        
        // --- 從提問者的美術題庫隨機選題（與提問者共用題庫） ---
        let allArtQuestions = [];
        for (let key in QUESTION_BANK) {
            QUESTION_BANK[key].forEach(q => allArtQuestions.push(Object.assign({}, q)));
        }
        this.question = random(allArtQuestions);
        // 確保答案小寫
        if (this.question && this.question.answer) {
            this.question.answer = this.question.answer.toLowerCase().trim();
        }

        this.displayW = POTION_W;
        this.displayH = POTION_H;
        this.animation = new Animation(images.potion, 541 / 8, 73, 8, ANIMATION_SPEED);
    }

    display() {
        if (this.visible && this.animation) {
            push();
            // 閃爍與抖動效果
            let alpha = 180 + 75 * sin(frameCount * 0.4 + this.x * 0.01);
            let jitterX = 3 * sin(frameCount * 0.6 + this.x * 0.02);
            translate(this.x + jitterX, this.y);
            // 使用 tint 控制透明度
            push();
            tint(255, alpha);
            this.animation.display(-this.displayW / 2, -this.displayH / 2, this.displayW, this.displayH);
            pop();
            pop();
        }
    }
    
    static generateRandom() {
        let randX = random(TILE_SIZE, GAME_WIDTH - TILE_SIZE);
        let maxReach = 100; 
        if (typeof player !== 'undefined' && player) {
            maxReach = player.maxJumpHeight + player.displayH / 2;
        }
        let minY = GROUND_Y - maxReach - 10;
        let maxY = GROUND_Y - 20;
        minY = max(50, minY);
        let randY = random(minY, maxY);
        return new Potion(randX, randY);
    }
}

// --- p5.js 核心函數 ---

function preload() {
    images.background = loadImage('background.jpg');
    images.potion = loadImage('potion.png');
    
    images.player_attack = loadImage('玩家/attack.png');
    images.player_dead = loadImage('玩家/dead.png');
    images.player_hurt = loadImage('玩家/hurt.png');
    images.player_idle = loadImage('玩家/idle.png');
    images.player_walk = loadImage('玩家/walk.png');
    
    images.hint_dead = loadImage('提示角色/dead.png');
    images.hint_walk = loadImage('提示角色/walk.png');
    images.hint_hurt = loadImage('提示角色/hurt.png');
    images.hint_idle = loadImage('提示角色/idle.png');
    images.hint_jump = loadImage('提示角色/jump.png');
    images.hint_run = loadImage('提示角色/run.png');
    
    images.q1_dead = loadImage('提問者一/dead.png');
    images.q1_walk = loadImage('提問者一/walk.png');
    images.q1_attack = loadImage('提問者一/attack.png');
    images.q1_hurt = loadImage('提問者一/hurt.png');
    images.q1_idle = loadImage('提問者一/idle.png');
    
    images.q2_walk = loadImage('提問者二/walk.png');
    images.q2_attack = loadImage('提問者二/attack.png');
    images.q2_hurt = loadImage('提問者二/hurt.png');
    images.q2_idle = loadImage('提問者二/idle.png');
    
    images.q3_dead = loadImage('提問者三/dead.png');
    images.q3_walk = loadImage('提問者三/walk.png');
    images.q3_attack = loadImage('提問者三/attack.png');
    images.q3_hurt = loadImage('提問者三/hurt.png');
    images.q3_idle = loadImage('提問者三/idle.png');
}

function setup() {
    GAME_WIDTH = windowWidth;
    GAME_HEIGHT = windowHeight;
    GROUND_Y = GAME_HEIGHT * 0.65;
    let canvas = createCanvas(GAME_WIDTH, GAME_HEIGHT);
    canvas.parent('game-container');
    
    player = new Player(GAME_WIDTH / 2, GROUND_Y); 
    player.initAnimations(); 
    
    let q1 = new Questioner(GAME_WIDTH / 4, GROUND_Y, '提問者一', '提問者一');
    let q2 = new Questioner(-Q2_DISPLAY_W, GROUND_Y, '提問者二', '提問者二'); 
    let q3 = new Questioner(-Q3_DISPLAY_W, GROUND_Y, '提問者三', '提問者三');
    questioners.push(q1, q2, q3);
    
    currentQuestionerIndex = 0;
    questioners.forEach((q, i) => q.active = (i === currentQuestionerIndex));
    
    hintCharacter = new HintCharacter(TILE_SIZE + HINT_DISPLAY_W / 2, GROUND_Y); 
    hintCharacter.initAnimations(); 

    potion = Potion.generateRandom(); 

    // 嘗試在執行階段載入 potion.json（若存在，會被用來切割每一幀）
    fetch('potion.json').then(r => {
        if (r.ok) return r.json();
        throw new Error('no meta');
    }).then(meta => {
        images.potionMeta = meta;
        if (potion && images.potion) {
            potion.animation = new Animation(images.potion, 541/8, 73, 8, ANIMATION_SPEED, images.potionMeta, { useNaturalSize: true, scale: 1 });
        }
    }).catch(()=>{});

    select('#submit-answer').mousePressed(handleSubmitAnswer);
    
    // 初始化美術題庫答案格式
    for (let key in QUESTION_BANK) {
        QUESTION_BANK[key].forEach(q => {
            q.answer = q.answer.toLowerCase().trim();
        });
    }
    // 藥水題庫答案格式已經在 Potion constructor 處理，這裡不需要再處理
}

// 嘗試載入所有已知精靈的 metadata (.json)，若存在則用 framesMeta 重建 Animation
function tryLoadAllMeta() {
    // 映射 images 的 key 與實際檔案路徑（用於尋找同名 .json）
    const mapping = [
        ['player_attack','玩家/attack.png'],
        ['player_dead','玩家/dead.png'],
        ['player_hurt','玩家/hurt.png'],
        ['player_idle','玩家/idle.png'],
        ['player_walk','玩家/walk.png'],

        ['hint_dead','提示角色/dead.png'],
        ['hint_walk','提示角色/walk.png'],
        ['hint_hurt','提示角色/hurt.png'],
        ['hint_idle','提示角色/idle.png'],
        ['hint_jump','提示角色/jump.png'],
        ['hint_run','提示角色/run.png'],

        ['q1_dead','提問者一/dead.png'],
        ['q1_walk','提問者一/walk.png'],
        ['q1_attack','提問者一/attack.png'],
        ['q1_hurt','提問者一/hurt.png'],
        ['q1_idle','提問者一/idle.png'],

        ['q2_walk','提問者二/walk.png'],
        ['q2_attack','提問者二/attack.png'],
        ['q2_hurt','提問者二/hurt.png'],
        ['q2_idle','提問者二/idle.png'],

        ['q3_dead','提問者三/dead.png'],
        ['q3_walk','提問者三/walk.png'],
        ['q3_attack','提問者三/attack.png'],
        ['q3_hurt','提問者三/hurt.png'],
        ['q3_idle','提問者三/idle.png']
    ];

    mapping.forEach(([imgKey, imgPath]) => {
        let metaPath = imgPath.replace(/\.png$/i, '.json');
        fetch(metaPath).then(r => {
            if (!r.ok) throw new Error('no meta');
            return r.json();
        }).then(meta => {
            images[imgKey + 'Meta'] = meta;
            // 對目前已存在的 Animation 進行重建
            rebuildAnimationsUsingMeta(images[imgKey], meta);
        }).catch(()=>{
            // 忽略不存在的 metadata
        });
    });
}

function rebuildAnimationsUsingMeta(spritesheetImg, framesMeta) {
    if (!spritesheetImg || !framesMeta) return;
    // 檢查 player, hintCharacter, questioners 的 animations
    let allChars = [player, hintCharacter].concat(questioners);
    allChars.forEach(ch => {
        if (!ch || !ch.animations) return;
        for (let state in ch.animations) {
            let anim = ch.animations[state];
            if (anim && anim.spritesheet === spritesheetImg) {
                // 使用原先的參數重建，但套用 framesMeta 與 useNaturalSize
                ch.animations[state] = new Animation(anim.spritesheet, anim.frameW, anim.frameH, anim.frameCount, anim.speed, framesMeta, { useNaturalSize: true, scale: 1 });
            }
        }
    });
}

// 在 setup 完成後嘗試載入 metadata
setTimeout(tryLoadAllMeta, 300);

function windowResized() {
    GAME_WIDTH = windowWidth;
    GAME_HEIGHT = windowHeight;
    GROUND_Y = GAME_HEIGHT * 0.65;
    resizeCanvas(GAME_WIDTH, GAME_HEIGHT);
}

function draw() {
    if (images.background) {
        image(images.background, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
        background(50, 150, 200);
    }
    
    // 遊戲準備畫面
    if (gameState === 'preparing') {
        drawStartScreen();
        return;
    }
    
    // 遊戲進行中
    player.move();
    
    questioners.forEach(q => { if (q.active) q.update(); });

    // 更新火球
    for (let fb of fireballs) {
        fb.update();
        // 檢查與玩家碰撞
        if (fb.active && dist(fb.x, fb.y, player.x, player.y - player.displayH/2) < fb.radius + 10) {
            fb.active = false;
            // 如果目前沒有正在進行的題目，則以發射者作為來源顯示題目
            if (!questionActive && fb.owner) {
                currentQuestioner = fb.owner;
                currentQuestionerIndex = questioners.indexOf(fb.owner);
                fb.owner.currentState = 'attack';
                let qData = fb.owner.askQuestion();
                if (qData) displayQuestion(qData, 'questioner');
            }
        }
    }
    // 清理已失效的火球
    fireballs = fireballs.filter(fb => fb.active);

    // 繪製提問者與火球（火球在提問者之上顯示）
    questioners.forEach(q => { if (q.active) q.display(); });
    for (let fb of fireballs) fb.display();

    // ...existing code...

    // --- 提示角色與對話框繪製在最上層 ---
    if (hintCharacterVisible && currentQuestion && currentQuestion.hint) {
        // 固定顯示在螢幕中間偏左
        let cx = GAME_WIDTH * 0.28;
        let cy = GAME_HEIGHT * 0.4;
        hintCharacter.x = cx;
        hintCharacter.y = cy;
        hintCharacter.currentState = 'idle';
        hintCharacter.display();

        // 對話框樣式
        let dialogW = 340;
        let dialogH = 80;
        let dialogX = cx - dialogW/2;
        let dialogY = cy - hintCharacter.displayH/2 - dialogH - 18;

        push();
        stroke(80,80,80,180);
        strokeWeight(2);
        fill(255,245,220,240);
        rect(dialogX, dialogY, dialogW, dialogH, 18);
        // 對話框小三角
        noStroke();
        fill(255,245,220,240);
        triangle(cx-18, dialogY+dialogH, cx+18, dialogY+dialogH, cx, dialogY+dialogH+18);

        // 文字
        fill(60,40,20);
        textSize(16);
        textAlign(LEFT, TOP);
        textStyle(BOLD);
        text('💡 提示角色說：', dialogX+16, dialogY+10);
        textStyle(NORMAL);
        textSize(15);
        text(currentQuestion.hint, dialogX+16, dialogY+32, dialogW-32, dialogH-40);
        pop();
    }
    potion.display();
    player.display(); 
    
    checkCollisions();
    drawUIHealthBar();
    
    if (player.health <= 0) {
        gameOver(false); 
    }
}

function checkCollisions() {
    if (potion.visible && dist(player.x, player.y - player.displayH/2, potion.x, potion.y) < TILE_SIZE/2) {
        // 這裡可以加入自動觸發藥水的邏輯，或者保留按空白鍵觸發
    }
}

function displayQuestion(qData, type) {
    questionActive = true;
    currentQuestion = qData;
    currentQuestionType = type; 
    
    let sourceText = (type === 'potion') ? "🧪 藥水問題" : `⚔️ 來自 ${currentQuestioner.name} 的挑戰`;
    select('#question-source').html(sourceText);
    
    let questionHtml = qData.question + '<br>';
    qData.options.forEach(option => {
        questionHtml += `<input type="radio" name="user-choice" value="${option.charAt(0).toLowerCase()}">${option}<br>`;
    });
    
    select('#question-text').html(questionHtml);
    select('#answer-input').value(''); 
    select('#answer-input').hide(); 
    
    select('#hint-area').html(''); 
    select('#question-overlay').removeClass('hidden');
}

function hideQuestion() {
    questionActive = false;
    currentQuestion = null;
    currentQuestionType = null;
    select('#question-overlay').addClass('hidden');
    select('#answer-input').show(); 
    
    if (currentQuestioner && currentQuestioner.health > 0) {
        currentQuestioner.currentState = 'walk';
        currentQuestioner.triggered = false;
        currentQuestioner.vx = -currentQuestioner.vx;
        currentQuestioner.direction = currentQuestioner.vx >= 0 ? 1 : -1;
    }
    
    hintCharacterVisible = false;
    hintCharacter.x = TILE_SIZE + HINT_DISPLAY_W / 2;
    hintCharacter.y = GROUND_Y;
    hintCharacter.currentState = 'idle';
    if (hintTimeoutId) {
        clearTimeout(hintTimeoutId);
        hintTimeoutId = null;
    }
    
    currentQuestioner = null; 
}

function handleSubmitAnswer() {
    if (!currentQuestion) return;

    let userAnswer;
    
    if (currentQuestionType === 'potion' || currentQuestion.options) {
        let selected = selectAll('input[name="user-choice"]:checked');
        userAnswer = selected.length > 0 ? selected[0].value() : '';
    } else {
        userAnswer = select('#answer-input').value().toLowerCase().trim();
    }
    
    let correctAnswer = currentQuestion.answer;
    
    if (userAnswer === correctAnswer) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
    
    hideQuestion();
}

function handleCorrectAnswer() {
    if (currentQuestionType === 'potion') {
        player.health = constrain(player.health + 1, 0, MAX_PLAYER_HEALTH);
        potion.visible = false; 
        setTimeout(() => {
            potion = Potion.generateRandom();
        }, 8000); 
        console.log("藥水問題正確！玩家回血！");
    } else if (currentQuestionType === 'questioner') {
        currentQuestioner.takeDamage();
        if (currentQuestioner) currentQuestioner.currentQuestionIndex++;
    }
}

function spawnNextQuestioner() {
    if (questioners[currentQuestionerIndex]) {
        questioners[currentQuestionerIndex].active = false;
    }
    currentQuestionerIndex++;
    if (currentQuestionerIndex >= questioners.length) {
        gameOver(true);
        return;
    }
    let next = questioners[currentQuestionerIndex];
    let fromLeft = random() < 0.5;
    next.active = true;
    next.health = next.maxHealth; 
    next.triggered = false;
    
    if (fromLeft) {
        next.x = -next.displayW;
        next.vx = random(0.8, 2);
        next.direction = 1; 
    } else {
        next.x = GAME_WIDTH + next.displayW;
        next.vx = -random(0.8, 2);
        next.direction = -1; 
    }
    next.y = GROUND_Y;
    next.currentState = 'walk';
}

function handleWrongAnswer() {
    player.health = constrain(player.health - 1, 0, MAX_PLAYER_HEALTH);
    player.currentState = 'hurt';
    
    if (currentQuestioner && currentQuestioner.health > 0) {
            currentQuestioner.currentState = 'attack';
            setTimeout(() => {
            currentQuestioner.currentState = 'idle';
            }, 500);
    }
    
    setTimeout(() => {
        player.currentState = 'idle';
    }, 500); 
}

function keyPressed() {
    // 遊戲準備階段：空白鍵開始
    if (gameState === 'preparing' && keyCode === 32) {
        gameState = 'playing';
        return;
    }
    
    if (key === 'w' || key === 'W' || keyCode === 87) {
        if (player && typeof player.jump === 'function') {
            player.jump();
        }
        return;
    }
    if (questionActive) {
        if (keyCode === 75 && currentQuestion) { 
            // 清除舊的隱藏計時
            if (hintTimeoutId) {
                clearTimeout(hintTimeoutId);
                hintTimeoutId = null;
            }

            hintCharacterVisible = true;
            // 直接顯示在螢幕中間偏左，無需滑動
            hintCharacter.x = GAME_WIDTH * 0.28;
            hintCharacter.y = GAME_HEIGHT * 0.4;
            hintCharacter.currentState = 'idle';
            // 清除舊的隱藏計時
            if (hintTimeoutId) {
                clearTimeout(hintTimeoutId);
                hintTimeoutId = null;
            }
            // 自動在 4 秒後隱藏提示角色與文字
            hintTimeoutId = setTimeout(() => {
                hintCharacterVisible = false;
                hintTimeoutId = null;
            }, 4000);
        }
        return;
    }

    if (keyCode === 32) { 
        playerAttacking = true;
        player.currentState = 'attack';
        
        if (potion.visible && dist(player.x, player.y - player.displayH/2, potion.x, potion.y) < TILE_SIZE*1.5) {
            player.direction = (potion.x > player.x) ? 1 : -1;
            displayQuestion(potion.question, 'potion');
        } 
        else if (currentQuestionerIndex < questioners.length) {
            let q = questioners[currentQuestionerIndex];
            if (q.health > 0 && dist(player.x, player.y, q.x, q.y) < TILE_SIZE * 1.5) { 
                player.direction = (q.x > player.x) ? 1 : -1;

                let qData = q.askQuestion();
                if (qData) {
                    currentQuestioner = q;
                    displayQuestion(qData, 'questioner');
                    q.currentState = 'attack'; 
                }
            }
        }
        
        setTimeout(() => {
            player.currentState = 'idle';
            playerAttacking = false;
        }, 500); 
    }
}

function drawUIHealthBar() {
    let barWidth = 150;
    let barHeight = 20;
    let x = 10;
    let y = 10;
    
    fill(0, 70, 0);
    rect(x, y, barWidth, barHeight);
    
    let healthRatio = player.health / MAX_PLAYER_HEALTH;
    fill(0, 200, 0);
    rect(x, y, barWidth * healthRatio, barHeight);
    
    fill(255);
    textSize(14);
    textAlign(LEFT, CENTER);
    text(`玩家 HP`, x + 5, y + barHeight/2);
    
    textAlign(RIGHT, CENTER);
    text(`${player.health}/${MAX_PLAYER_HEALTH}`, x + barWidth - 5, y + barHeight/2);
}

function drawStartScreen() {
    // 半透明暗色背景
    push();
    fill(0, 0, 0, 100);
    rect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    pop();
    
    // 標題
    push();
    fill(255, 220, 100);
    textAlign(CENTER, CENTER);
    textSize(72);
    textStyle(BOLD);
    text('知識冒險', GAME_WIDTH / 2, GAME_HEIGHT * 0.25);
    
    // 副標題
    fill(200, 220, 255);
    textSize(28);
    textStyle(NORMAL);
    text('答題擊敗提問者，收集藥水回血！', GAME_WIDTH / 2, GAME_HEIGHT * 0.38);
    
    // 遊戲說明
    fill(220, 220, 220);
    textSize(18);
    textAlign(CENTER, TOP);
    let instructions = [
        '⬅️ ➡️ 移動   W 跳躍   Space 攻擊',
        'K 顯示提示   選擇答案',
        '',
        '擊敗 3 位提問者即可獲勝！'
    ];
    let startY = GAME_HEIGHT * 0.52;
    instructions.forEach((line, idx) => {
        text(line, GAME_WIDTH / 2, startY + idx * 28);
    });
    
    // 開始按鈕提示（閃爍效果）
    let alpha = 150 + 105 * sin(frameCount * 0.05);
    fill(255, 200, 100, alpha);
    textSize(32);
    textStyle(BOLD);
    text('按空白鍵開始遊戲', GAME_WIDTH / 2, GAME_HEIGHT * 0.85);
    
    pop();
}

function drawUIHealthBar() {
    let barWidth = 150;
    let barHeight = 20;
    let x = 10;
    let y = 10;
    
    fill(0, 70, 0);
    rect(x, y, barWidth, barHeight);
    
    let healthRatio = player.health / MAX_PLAYER_HEALTH;
    fill(0, 200, 0);
    rect(x, y, barWidth * healthRatio, barHeight);
    
    fill(255);
    textSize(14);
    textAlign(LEFT, CENTER);
    text(`玩家 HP`, x + 5, y + barHeight/2);
    
    textAlign(RIGHT, CENTER);
    text(`${player.health}/${MAX_PLAYER_HEALTH}`, x + barWidth - 5, y + barHeight/2);
}

function gameOver(win) {
    noLoop(); 
    let message = win ? "🏆 恭喜你！擊敗了所有提問者！遊戲勝利！" : "💀 很可惜，玩家血量歸零，遊戲失敗！";
    setTimeout(() => {
        alert(message);
    }, 500);
}