const slots = [document.getElementById('slot1'), document.getElementById('slot2')];
const symbols = ['2', '3']; // スロットに表示するシンボル
let isSpinning = [false, false]; // 各リールの状態を管理
let spinInterval = null; // 回転用のインターバル
let currentPosition = 0; // 現在の位置

// スロットを開始する関数
function startSlot() {
    document.getElementById('result').textContent = ''; // 結果をクリア
    currentPosition = 0; // 位置をリセット
    
    // スロット1は常に「2」を表示
    slots[0].textContent = '2';
    
    // スロット2のみ回転させる
    if (!isSpinning[1]) {
        isSpinning[1] = true;
        const slotElement = slots[1];
        
        // スロットの内容を設定
        slotElement.innerHTML = `
            <div class="slot-content">2</div>
            <div class="slot-content">3</div>
            <div class="slot-content">2</div>
        `;
        
        const contents = slotElement.querySelectorAll('.slot-content');
        contents.forEach((content, index) => {
            content.style.transform = `translateY(${index * 100}%)`;
        });

        // 回転を開始
        spinInterval = setInterval(() => {
            currentPosition = (currentPosition + 1) % 3;
            contents.forEach((content, index) => {
                const position = (index - currentPosition + 3) % 3;
                content.style.transform = `translateY(${position * 100}%)`;
            });
        }, 100);
    }
}

// スロットを停止する関数（リールごと）
function stopSlot(reelIndex) {
    if (isSpinning[reelIndex]) {
        isSpinning[reelIndex] = false;
        
        if (reelIndex === 1) {
            // 回転を停止
            if (spinInterval) {
                clearInterval(spinInterval);
                spinInterval = null;
            }
            
            const slotElement = slots[1];
            // 最終的な位置を設定
            const finalNumber = Math.random() < 0.3 ? '3' : '2';
            slotElement.innerHTML = `<div class="slot-content">${finalNumber}</div>`;
            
            // 結果を判定
            checkResult();
        }
    }
}

// 結果の判定関数
function checkResult() {
    // スロット2が「3」の場合に成功
    if (slots[1].textContent === '3') {
        document.getElementById('result').textContent = '大当たり！';
        console.log('大当たり!');
    } else {
        document.getElementById('result').textContent = '残念！';
        console.log('残念!');
    }
}

// イベントリスナーをボタンに追加
document.getElementById('startButton').addEventListener('click', startSlot);
document.getElementById('stopButton2').addEventListener('click', () => stopSlot(1));
