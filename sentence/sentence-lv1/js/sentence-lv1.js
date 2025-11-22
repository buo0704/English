let sentenceData = {};

// JSON 파일 불러오기
fetch('./data/sentence-lv1.json')
    .then(response => response.json())
    .then(data => {
        sentenceData = data;
    })
    .catch(error => console.error('JSON 로드 오류:', error));

const cards = document.querySelectorAll('.sentence-card');
const popupOverlay = document.getElementById('sentencePopupOverlay');
const popup = document.getElementById('sentencePopup');

const popupSentence = document.getElementById('popupSentence');
const popupSub = document.getElementById('popupSub');
const popupMeaning = document.getElementById('popupMeaning');

const popupClose = document.getElementById('popupClose');

cards.forEach(card => {
    card.addEventListener('click', () => {
        const rect = card.getBoundingClientRect();

        // 카드에서 문장 키 가져오기
        const sentenceKey = card.dataset.sentence;
        const data = sentenceData[sentenceKey];

        // JSON 데이터로 텍스트 적용
        if (data) {
            popupSentence.textContent = data.title;
            popupSub.textContent = data.sub;
            
            // desc 각 항목을 div로 감싸기
            popupMeaning.innerHTML = data.desc
                .map(item => `<div class="desc-item">${item}</div>`)
                .join('');
        }

        // 팝업을 먼저 표시해서 높이를 계산할 수 있도록
        popupOverlay.style.display = "block";
        popup.style.display = "block";

        // 팝업 위치 계산
        let popupLeft = rect.left;
        let popupTop = rect.top - popup.offsetHeight - 20;

        // 화면 왼쪽 경계 체크
        if (popupLeft < 10) {
            popupLeft = 10;
        }

        // 화면 오른쪽 경계 체크
        if (popupLeft + popup.offsetWidth > window.innerWidth - 10) {
            popupLeft = window.innerWidth - popup.offsetWidth - 10;
        }

        // 화면 위쪽으로 넘어가는 경우 카드 아래로 표시
        if (popupTop < 10) {
            popupTop = rect.bottom + 20;
        }

        // 화면 아래쪽으로 넘어가는 경우 위로 표시하되, 여전히 넘으면 최대한 위로
        if (popupTop + popup.offsetHeight > window.innerHeight - 10) {
            popupTop = rect.top - popup.offsetHeight - 20;
            
            // 그래도 넘으면 화면 상단에 고정
            if (popupTop < 10) {
                popupTop = 10;
            }
        }

        // 팝업 위치 적용
        popup.style.left = popupLeft + 'px';
        popup.style.top = popupTop + 'px';
    });
});

popupClose.addEventListener('click', () => {
    popupOverlay.style.display = "none";
    popup.style.display = "none";
});

// 오버레이 클릭시 닫기
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        popupOverlay.style.display = "none";
        popup.style.display = "none";
    }
});
