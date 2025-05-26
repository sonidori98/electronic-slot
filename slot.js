const slots = [document.getElementById('slot1'), document.getElementById('slot2')];
const symbols = ['2', '3']; // スロットに表示するシンボル
let isSpinning = [false, false]; // 各リールの状態を管理
let spinInterval = null; // 回転用のインターバル
let currentPosition = 0; // 現在の位置
let isBattleMode = false; // 押し合いモード
let battleTimer = null; // 押し合い用タイマー
let clickCount = 0; // クリック数
let battleDuration = 3000; // 押し合い時間（ミリ秒）
let requiredClicks = 10; // 必要なクリック数

// 音声要素の取得
const battleSound = document.getElementById('battleSound');
const successSound = document.getElementById('successSound');
const failSound = document.getElementById('failSound');

// 音量設定
battleSound.volume = 1.0;  // 最大音量
successSound.volume = 1.0; // 最大音量
failSound.volume = 1.0;    // 最大音量

// スロットを開始する関数
function startSlot() {
    document.getElementById('result').textContent = ''; // 結果をクリア
    currentPosition = 0; // 位置をリセット
    clickCount = 0; // クリック数をリセット
    
    // スロット1は常に「2」を表示
    slots[0].textContent = '3';
    
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
    if (isSpinning[reelIndex] && !isBattleMode) {
        isSpinning[reelIndex] = false;
        
        if (reelIndex === 1) {
            // 回転を停止
            if (spinInterval) {
                clearInterval(spinInterval);
                spinInterval = null;
            }
            
            const slotElement = slots[1];
            // 押し合いモードを開始
            startBattleMode(slotElement);
            // 結果テキストを変更
            document.getElementById('result').textContent = '連打しろ!！';
            // 押し合い音声を再生
            battleSound.volume = 1.0;
            battleSound.currentTime = 0;
            battleSound.play();
        }
    } else if (isBattleMode) {
        // 押し合いモード中のクリック
        clickCount++;
    }
}

// 押し合いモードを開始する関数
function startBattleMode(slotElement) {
    isBattleMode = true;
    clickCount = 0;
    
    // 2と3を表示
    slotElement.innerHTML = `
        <div class="slot-content">2</div>
        <div class="slot-content">3</div>
    `;
    
    // 押し合いモードのクラスを追加
    slotElement.classList.add('battle-mode');
    
    // 押し合い時間の設定
    battleTimer = setTimeout(() => {
        isBattleMode = false;
        slotElement.classList.remove('battle-mode');
        
        // 結果を判定
        const finalNumber = clickCount >= requiredClicks ? '3' : '2';
        slotElement.innerHTML = `<div class="slot-content">${finalNumber}</div>`;
        
        // 結果を表示
        checkResult();
    }, battleDuration);
}

// 結果の判定関数
function checkResult() {
    // スロット2が「3」の場合に成功
    if (slots[1].textContent === '3') {
        document.getElementById('result').textContent = 'やった！33点だ!';
        console.log('大当たり!');
        // 成功音声を再生
        successSound.volume = 1.0;
        successSound.currentTime = 0;
        successSound.play();
    } else {
        document.getElementById('result').textContent = '残念！32点のままだ!';
        console.log('残念!');
        // 失敗音声を再生
        failSound.volume = 1.0;
        failSound.currentTime = 0;
        failSound.play();
    }
}

// イベントリスナーをボタンに追加
document.getElementById('startButton').addEventListener('click', startSlot);
document.getElementById('stopButton2').addEventListener('click', () => stopSlot(1));
