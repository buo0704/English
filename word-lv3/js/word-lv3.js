const allWords = [
    "dense", "flaw", "obsolete", "evade", "tease",
    "hindrance", "hatch", "thread", "chill", "acid",

    "embrace", "roam", "announce", "steer", "rigorous",
    "hazard", "obscure", "obstacle", "yield", "punctual",
    
    "myth", "patrol", "cease", "cradle", "surface",
    "surmount", "surpass", "surplus", "superficial", "superior",
    
    "supreme", "artificial", "flee", "core", "spur",
    "sweep", "sweeping", "toxic", "prudent", "revenue",
    
    "barter", "auction", "peculiar", "queer", "lament",
    "discipline", "disgust", "embark", "vapor", "evaporate",
    
    "heap", "statistics", "naughty", "dose", "negative",
    "affirmative", "avalanche", "weave", "stifle", "decent",

    "incredible", "credible", "credulous", "creditable", "alternative",
    "obstruct", "plow", "stimulus", "smear", "smudge",
    
    "debt", "witshtand", "ban", "delicate", "fertile",
    "precise", "texture", "illusion", "tap", "singnificant"
];

let wordData = {}; // JSON에서 불러온 단어 데이터
const popupOverlay = document.getElementById('popupOverlay');
const popup = document.getElementById('popup');

// JSON 파일에서 단어 데이터 불러오기
async function loadWordData() {
    try {
        const response = await fetch('data/word-lv3-data.json');
        
        if (!response.ok) {
            throw new Error('JSON 파일을 찾을 수 없습니다');
        }
        
        wordData = await response.json();
        console.log('단어 데이터 로드 완료:', Object.keys(wordData).length + '개');
        
    } catch (error) {
        console.error('단어 데이터 로드 실패:', error);
        alert('단어 데이터를 불러오는데 실패했습니다. data/word-lv3-data.json 파일을 확인해주세요.');
    }
}

// 랜덤으로 40개 단어 선택
function getRandomWords(count = 40) {
    const shuffled = [...allWords];
    
    // Fisher-Yates 셔플 알고리즘
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
}

// 단어 카드 생성 및 표시
function displayWords() {
    const wordGrid = document.getElementById('wordGrid');
    const randomWords = getRandomWords(40);
    
    // 기존 카드 모두 제거
    wordGrid.innerHTML = '';
    
    // 40개 카드 생성
    randomWords.forEach(word => {
        const card = document.createElement('div');
        card.className = 'word-card';
        card.setAttribute('data-word', word);
        card.textContent = word;
        
        // 클릭 이벤트
        card.addEventListener('click', function(e) {
            e.stopPropagation();
            showPopup(word, this);
        });
        
        wordGrid.appendChild(card);
    });
}

// 팝업 표시 함수
function showPopup(wordKey, cardElement) {
    const data = wordData[wordKey];
    
    if (!data) {
        console.warn('단어 데이터 없음:', wordKey);
        
        // 데이터 없으면 기본 메시지
        document.getElementById('popupWord').textContent = wordKey;
        document.getElementById('popupMeaning').textContent = '(뜻 준비 중)';
        document.querySelector('.pronunciation-symbol').textContent = '';
        document.querySelector('.pronunciation-korean').textContent = '';
    } else {
        // 팝업 내용 업데이트
        document.getElementById('popupWord').textContent = data.word;
        document.getElementById('popupMeaning').textContent = data.meaning;
        document.querySelector('.pronunciation-symbol').textContent = data.pronunciation.symbol;
        document.querySelector('.pronunciation-korean').textContent = data.pronunciation.korean;
    }
    
    // 팝업 위치 계산 (클릭한 카드 위에)
    const cardRect = cardElement.getBoundingClientRect();
    const popupWidth = 830;
    const popupHeight = 340;
    
    // 카드 위에 배치
    let left = cardRect.left;
    let top = cardRect.top - popupHeight - 20; // 카드 위 20px 간격
    
    // 왼쪽으로 화면 밖으로 나가면 조정
    if (left < 20) {
        left = 20;
    }
    // 오른쪽으로 화면 밖으로 나가면 조정
    if (left + popupWidth > window.innerWidth - 20) {
        left = window.innerWidth - popupWidth - 20;
    }
    
    // 위로 화면 밖으로 나가면 카드 아래에 배치
    if (top < 20) {
        top = cardRect.bottom + 20;
    }

    // 팝업 위치 설정
    popup.style.left = left + 'px';
    popup.style.top = top + 'px';
    
    // 팝업 표시
    popupOverlay.classList.add('active');
}

// 팝업 닫기 함수
function closePopup() {
    popupOverlay.classList.remove('active');
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', async function() {
    // 1. JSON 데이터 먼저 불러오기
    await loadWordData();
    
    // 2. 단어 카드 표시
    displayWords();
});

// 배경(overlay) 클릭 시 팝업 닫기
popupOverlay.addEventListener('click', function(e) {
    if (e.target === popupOverlay) {
        closePopup();
    }
});

// 팝업 내부 클릭 시 닫히지 않도록
popup.addEventListener('click', function(e) {
    e.stopPropagation();
});

// ESC 키로 팝업 닫기
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
        closePopup();
    }
});
