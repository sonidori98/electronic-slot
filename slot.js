const slots = [document.getElementById('slot1'), document.getElementById('slot2')];
const symbols = ['2', '3']; // スロットに表示するシンボル
let slotTimers = [];
let isSpinning = [false, false]; // 各リールの状態を管理

// スロットを開始する関数
function startSlot() {
    document.getElementById('result').textContent = ''; // 結果をクリア
    
    // スロット1は常に「2」を表示
    slots[0].textContent = '2';
    
    // スロット2のみ回転させる
    if (!isSpinning[1]) {
        isSpinning[1] = true;
        slotTimers[1] = setInterval(() => {
            slots[1].textContent = symbols[Math.floor(Math.random() * symbols.length)];
        }, 100);
    }
}

// スロットを停止する関数（リールごと）
function stopSlot(reelIndex) {
    if (isSpinning[reelIndex]) {
        clearInterval(slotTimers[reelIndex]);
        isSpinning[reelIndex] = false;

        // 全てのリールが停止したら結果を判定
        if (!isSpinning.includes(true)) {
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
