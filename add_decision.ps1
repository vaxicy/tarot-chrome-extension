# add_decision.ps1 - Add decision spread feature to popup.js
$path = "c:\Users\16704\Desktop\tarot\popup.js"
$lines = Get-Content $path -Encoding UTF8

# Build the decision spread methods as a single string
$methods = @'
    // ============ 抉择牌阵 ============
    showDecisionPage() {
      const inputA = document.getElementById('decision-input-a');
      const inputB = document.getElementById('decision-input-b');
      const resultDiv = document.getElementById('decision-result');
      const compDiv = document.getElementById('decision-comprehensive');
      const funDiv = document.getElementById('decision-fun-options');
      const rpsResult = document.getElementById('decision-rps-result');
      const diceResult = document.getElementById('decision-dice-result');
      const redoBtn = document.getElementById('decision-redo-btn');
      if (inputA) inputA.value = '';
      if (inputB) inputB.value = '';
      if (resultDiv) resultDiv.classList.add('hidden');
      if (compDiv) compDiv.classList.add('hidden');
      if (funDiv) funDiv.classList.add('hidden');
      if (rpsResult) rpsResult.classList.add('hidden');
      if (diceResult) diceResult.classList.add('hidden');
      if (redoBtn) redoBtn.classList.add('hidden');
      this.showPage('decision-page');
    }

    decisionDraw() {
      const inputA = document.getElementById('decision-input-a');
      const inputB = document.getElementById('decision-input-b');
      const labelA = document.getElementById('decision-label-a');
      const labelB = document.getElementById('decision-label-b');
      const slotA = document.getElementById('decision-card-slot-a');
      const slotB = document.getElementById('decision-card-slot-b');
      const resultDiv = document.getElementById('decision-result');
      const compDiv = document.getElementById('decision-comprehensive');
      const funDiv = document.getElementById('decision-fun-options');
      const readingA = document.getElementById('decision-reading-a');
      const readingB = document.getElementById('decision-reading-b');
      const compReading = document.getElementById('decision-comprehensive-reading');
      const recommendText = document.getElementById('decision-recommend-text');

      const textA = inputA ? inputA.value.trim() : '';
      const textB = inputB ? inputB.value.trim() : '';

      if (!textA || !textB) {
        alert(this.currentLang === 'en' ? 'Please enter both choices' : '请输入两个抉择');
        return;
      }

      const cards = this.getDeckData();
      const idxA = Math.floor(Math.random() * cards.length);
      const idxB = Math.floor(Math.random() * cards.length);
      const isRevA = Math.random() < 0.5;
      const isRevB = Math.random() < 0.5;

      this._decisionCards = [
        { card: cards[idxA], isReversed: isRevA, text: textA },
        { card: cards[idxB], isReversed: isRevB, text: textB }
      ];

      // Render labels
      if (labelA) labelA.textContent = textA;
      if (labelB) labelB.textContent = textB;

      // Render cards
      if (slotA) slotA.innerHTML = this.createCardElement(cards[idxA], isRevA, 0, 'decision').outerHTML;
      if (slotB) slotB.innerHTML = this.createCardElement(cards[idxB], isRevB, 0, 'decision').outerHTML;

      // Bind card click events
      if (slotA) {
        slotA.querySelectorAll('.tarot-card').forEach(cardEl => {
          cardEl.addEventListener('click', () => {
            const el = slotA.querySelector('.tarot-card');
            if (el) el.classList.toggle('flipped');
          });
        });
      }
      if (slotB) {
        slotB.querySelectorAll('.tarot-card').forEach(cardEl => {
          cardEl.addEventListener('click', () => {
            const el = slotB.querySelector('.tarot-card');
            if (el) el.classList.toggle('flipped');
          });
        });
      }

      // Generate readings
      const meaningA = this.getMeaningText(this._decisionCards[0].card, this._decisionCards[0].isReversed);
      const meaningB = this.getMeaningText(this._decisionCards[1].card, this._decisionCards[1].isReversed);

      if (readingA) {
        readingA.innerHTML = '<div style="font-weight:700;color:var(--color-gold);margin-bottom:6px;">' + (this.currentLang==='en'?'Choice A':'抉择一') + '</div>' + '<div>' + meaningA + '</div>';
      }
      if (readingB) {
        readingB.innerHTML = '<div style="font-weight:700;color:var(--color-gold);margin-bottom:6px;">' + (this.currentLang==='en'?'Choice B':'抉择二') + '</div>' + '<div>' + meaningB + '</div>';
      }

      // Comprehensive reading + recommendation
      if (compDiv) compDiv.classList.remove('hidden');
      if (funDiv) funDiv.classList.remove('hidden');
      if (resultDiv) resultDiv.classList.remove('hidden');
      const redoBtn = document.getElementById('decision-redo-btn');
      if (redoBtn) redoBtn.classList.remove('hidden');

      // Determine recommendation based on card "strength"
      const scoreA = this._getCardScore(this._decisionCards[0].card, this._decisionCards[0].isReversed);
      const scoreB = this._getCardScore(this._decisionCards[1].card, this._decisionCards[1].isReversed);
      const recommended = scoreA >= scoreB ? 0 : 1;
      const recommendedText = recommended === 0 ? textA : textB;

      if (recommendText) recommendText.textContent = recommendedText;

      // Comprehensive reading
      if (compReading) {
        let html = '';
        if (this.currentLang === 'en') {
          html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">Choice A (' + textA + ')</span> drew <span style="color:var(--color-gold-light);">' + deckManager.getCardName(this._decisionCards[0].card) + '</span>. ';
          html += this._decisionCardAdvice(textA, this._decisionCards[0].card, this._decisionCards[0].isReversed, 'en') + '</div>';
          html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">Choice B (' + textB + ')</span> drew <span style="color:var(--color-gold-light);">' + deckManager.getCardName(this._decisionCards[1].card) + '</span>. ';
          html += this._decisionCardAdvice(textB, this._decisionCards[1].card, this._decisionCards[1].isReversed, 'en') + '</div>';
          html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,215,0,0.2);"><span style="color:var(--color-gold);font-weight:700;">Recommendation:</span> ';
          html += recommended === 0 ? ('Favor ' + textA + ' because the card energy is more positive.') : ('Favor ' + textB + ' because the card energy is more positive.');
          html += '</div>';
        } else {
          html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">抉择一（' + textA + '）</span> 抽到 <span style="color:var(--color-gold-light);">' + deckManager.getCardName(this._decisionCards[0].card) + '</span>。';
          html += this._decisionCardAdvice(textA, this._decisionCards[0].card, this._decisionCards[0].isReversed, 'zh') + '</div>';
          html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">抉择二（' + textB + '）</span> 抽到 <span style="color:var(--color-gold-light);">' + deckManager.getCardName(this._decisionCards[1].card) + '</span>。';
          html += this._decisionCardAdvice(textB, this._decisionCards[1].card, this._decisionCards[1].isReversed, 'zh') + '</div>';
          html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,215,0,0.2);"><span style="color:var(--color-gold);font-weight:700;">综合建议：</span>';
          html += recommended === 0 ? ('建议优先选择「' + textA + '」，牌面能量更积极。') : ('建议优先选择「' + textB + '」，牌面能量更积极。');
          html += '</div>';
        }
        compReading.innerHTML = html;
      }
    }

    _getCardScore(card, isReversed) {
      // Simple scoring: lower card number = better for upright, reversed flips
      const num = card.id || 0;
      const baseScore = isReversed ? -num : num;
      return baseScore;
    }

    _decisionCardAdvice(choiceText, card, isReversed, lang) {
      const name = deckManager.getCardName(card);
      if (lang === 'en') {
        if (isReversed) return 'The reversed ' + name + ' suggests inner reflection is needed before proceeding with ' + choiceText + '.';
        return 'The upright ' + name + ' suggests positive energy for ' + choiceText + '.';
      }
      if (isReversed) return name + '（逆位）暗示在做出「' + choiceText + '」决定前需要内省和调整。';
      return name + '（正位）暗示「' + choiceText + '」充满积极能量，值得尝试。';
    }

    playRPS(userChoice) {
      // userChoice: 0=rock, 1=paper, 2=scissors
      const choices = ['\u270A', '\u270B', '\u270C'];
      const choiceNames = { zh: ['石头', '布', '剪刀'], en: ['Rock', 'Paper', 'Scissors'] };
      const computerChoice = Math.floor(Math.random() * 3);
      // 0 beats 2, 1 beats 0, 2 beats 1
      const beats = { 0: 2, 1: 0, 2: 1 };
      const userWins = beats[userChoice] === computerChoice;
      const isTie = userChoice === computerChoice;

      const resultDiv = document.getElementById('decision-rps-result');
      if (!resultDiv) return;

      let html = '';
      html += '<div>' + (this.currentLang==='en'?'You chose: ':'你出了：') + choices[userChoice] + '</div>';
      html += '<div>' + (this.currentLang==='en'?'Computer chose: ':'电脑出了：') + choices[computerChoice] + '</div>';
      if (isTie) {
        html += '<div class="rps-winner">' + (this.currentLang==='en'?'Tie! No winner.':'平局！不分胜负。') + '</div>';
      } else if (userWins) {
        const winChoice = this._decisionCards && this._decisionCards[0] ? this._decisionCards[0].text : (this.currentLang==='en'?'Choice A':'抉择一');
        html += '<div class="rps-winner">' + (this.currentLang==='en'?'You win! ':'你赢了！') + winChoice + (this.currentLang==='en'?' is recommended!':'被推荐！') + '</div>';
      } else {
        const winChoice = this._decisionCards && this._decisionCards[1] ? this._decisionCards[1].text : (this.currentLang==='en'?'Choice B':'抉择二');
        html += '<div class="rps-winner">' + (this.currentLang==='en'?'Computer wins! ':'电脑赢了！') + winChoice + (this.currentLang==='en'?' is recommended!':'被推荐！') + '</div>';
      }
      resultDiv.innerHTML = html;
      resultDiv.classList.remove('hidden');
    }

    playDice(userHighLow) {
      // userHighLow: true = user bets on "high" (4-6), false = "low" (1-3)
      const dice = Math.floor(Math.random() * 6) + 1;
      const isHigh = dice >= 4;
      const userWins = (userHighLow && isHigh) || (!userHighLow && !isHigh);

      const resultDiv = document.getElementById('decision-dice-result');
      if (!resultDiv) return;

      const diceEmojis = ['\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'];
      let html = '';
      html += '<div class="dice-emoji">' + diceEmojis[dice-1] + '</div>';
      html += '<div>' + (this.currentLang==='en'?'Dice: ':'骰子点数：') + dice + '</div>';
      if (userWins) {
        const winChoice = this._decisionCards && this._decisionCards[0] ? this._decisionCards[0].text : (this.currentLang==='en'?'Choice A':'抉择一');
        html += '<div class="dice-outcome">' + (this.currentLang==='en'?'You win! ':'你赢了！') + winChoice + (this.currentLang==='en'?' is recommended!':'被推荐！') + '</div>';
      } else {
        const winChoice = this._decisionCards && this._decisionCards[1] ? this._decisionCards[1].text : (this.currentLang==='en'?'Choice B':'抉择二');
        html += '<div class="dice-outcome">' + (this.currentLang==='en'?'You lose! ':'你输了！') + winChoice + (this.currentLang==='en'?' is recommended!':'被推荐！') + '</div>';
      }
      resultDiv.innerHTML = html;
      resultDiv.classList.remove('hidden');
    }
'@

# Find the insertion point (before the init method)
$insertIndex = -1
for ($i = 0; $i -lt $lines.Count; $i++) {
    if ($lines[$i] -match '\s*// ============ 初始化 ============\s*') {
        $insertIndex = $i
        break
    }
}

if ($insertIndex -ge 0) {
    $newLines = @()
    for ($i = 0; $i -lt $insertIndex; $i++) { $newLines += $lines[$i] }
    $newLines += $methods -split '\r?\n'
    for ($i = $insertIndex; $i -lt $lines.Count; $i++) { $newLines += $lines[$i] }
    Set-Content $path -Value $newLines -Encoding UTF8
    Write-Host "Decision methods added successfully"
} else {
    Write-Host "ERROR: Could not find insertion point"
}
