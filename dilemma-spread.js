/**
 * 选择困难症功能模块
 * 依赖 popup.js 中已创建的全局 app 实例
 */
(function () {
  'use strict';

  function init() {
    if (typeof app === 'undefined') return;

    var currentMethod = '';
    var optionA = '';
    var optionB = '';

    // ============ 辅助函数 ============
    function getCardName(card) {
      if (typeof deckManager !== 'undefined' && deckManager.getCardName) {
        return deckManager.getCardName(card);
      }
      return (card && (card.name || card.originalName)) || 'Unknown';
    }

    function getOptionTexts() {
      var inputA = document.getElementById('dilemma-input-a');
      var inputB = document.getElementById('dilemma-input-b');
      var a = inputA ? inputA.value.trim() : '';
      var b = inputB ? inputB.value.trim() : '';
      var lang = app.currentLang || 'zh';
      if (!a) a = lang === 'en' ? 'Option A' : '选项A';
      if (!b) b = lang === 'en' ? 'Option B' : '选项B';
      return { a: a, b: b };
    }

    function validateInputs() {
      var texts = getOptionTexts();
      if (!texts.a || !texts.b) {
        alert(app.t('dilemma_enter_both'));
        return null;
      }
      return texts;
    }

    function resetResultArea() {
      var resultDiv = document.getElementById('dilemma-result');
      var readingDiv = document.getElementById('dilemma-reading');
      var gameArea = document.getElementById('dilemma-game-area');
      var rpsArea = document.getElementById('dilemma-rps-area');
      var diceArea = document.getElementById('dilemma-dice-area');
      var redoBtn = document.getElementById('dilemma-redo-btn');
      if (resultDiv) { resultDiv.innerHTML = ''; resultDiv.classList.add('hidden'); }
      if (readingDiv) { readingDiv.classList.add('hidden'); }
      if (gameArea) gameArea.classList.add('hidden');
      if (rpsArea) rpsArea.classList.add('hidden');
      if (diceArea) diceArea.classList.add('hidden');
      if (redoBtn) redoBtn.classList.add('hidden');
    }

    function showResult(html) {
      var resultDiv = document.getElementById('dilemma-result');
      var redoBtn = document.getElementById('dilemma-redo-btn');
      if (resultDiv) {
        resultDiv.innerHTML = html;
        resultDiv.classList.remove('hidden');
      }
      if (redoBtn) redoBtn.classList.remove('hidden');
    }

    // ============ 塔罗抽牌与解读 ============
    function drawTarotForWinner(winnerOption) {
      var cards = app.getDeckData();
      if (!cards || cards.length === 0) return;
      var idx = Math.floor(Math.random() * cards.length);
      var isRev = Math.random() < 0.5;
      var card = cards[idx];
      var meaning = app.getMeaningText(card, isRev);
      var lang = app.currentLang || 'zh';
      var cardName = getCardName(card);
      var position = lang === 'en' ? 'Fate Guidance' : '命运指引';

      // 渲染卡牌
      var slot = document.getElementById('dilemma-card-slot');
      if (slot && app.createCardEl) {
        slot.innerHTML = '';
        var el = app.createCardEl(card, isRev, true, 80, 126);
        slot.appendChild(el);
        el.addEventListener('click', function() { el.classList.toggle('flipped'); });
      }

      // 生成解读
      var html = '';
      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">' + (lang === 'en' ? 'Winner: ' : '胜出选项：') + '</span><span style="color:var(--color-gold-light);font-weight:700;">' + winnerOption + '</span></div>';
      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">' + (lang === 'en' ? 'Fate Card: ' : '命运之牌：') + '</span><span style="color:var(--color-gold-light);">' + cardName + (isRev ? (lang === 'en' ? ' (Reversed)' : '（逆位）') : (lang === 'en' ? ' (Upright)' : '（正位）')) + '</span></div>';
      html += '<div style="line-height:1.8;">' + meaning + '</div>';
      html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,215,0,0.2);color:var(--color-gold);font-weight:700;">' + (lang === 'en' ? 'Guidance: ' : '命运指引：') + '</div>';
      if (lang === 'en') {
        html += '<div style="line-height:1.8;">The ' + cardName + ' reveals the energy surrounding your choice of <span style="color:var(--color-gold-light);font-weight:700;">' + winnerOption + '</span>. ';
        if (!isRev) {
          html += 'This upright card carries positive energy, suggesting that "' + winnerOption + '" aligns well with your current path. Trust this direction and move forward with confidence.';
        } else {
          html += 'This reversed card suggests some reflection is needed. While "' + winnerOption + '" is the chosen path, consider potential obstacles and prepare accordingly.';
        }
        html += '</div>';
      } else {
        html += '<div style="line-height:1.8;">' + cardName + ' 揭示了「<span style="color:var(--color-gold-light);font-weight:700;">' + winnerOption + '</span>」这一选择背后的能量。';
        if (!isRev) {
          html += '这张正位牌充满积极能量，暗示「' + winnerOption + '」与当下的路径高度契合。请坚定信心，勇敢前行。';
        } else {
          html += '这张逆位牌提示需要一些反思。虽然命运选择了「' + winnerOption + '」，但也要注意可能存在的阻碍，做好相应准备。';
        }
        html += '</div>';
      }

      var contentEl = document.getElementById('dilemma-reading-content');
      if (contentEl) contentEl.innerHTML = html;
      var readingDiv = document.getElementById('dilemma-reading');
      if (readingDiv) readingDiv.classList.remove('hidden');
    }

    function drawTarotComparison() {
      var texts = getOptionTexts();
      var cards = app.getDeckData();
      if (!cards || cards.length === 0) return;
      var idxA = Math.floor(Math.random() * cards.length);
      var idxB = Math.floor(Math.random() * cards.length);
      var isRevA = Math.random() < 0.5;
      var isRevB = Math.random() < 0.5;
      var cardA = cards[idxA];
      var cardB = cards[idxB];
      var meaningA = app.getMeaningText(cardA, isRevA);
      var meaningB = app.getMeaningText(cardB, isRevB);
      var lang = app.currentLang || 'zh';
      var nameA = getCardName(cardA);
      var nameB = getCardName(cardB);

      // 计算推荐
      function getScore(card, isReversed) {
        var num = (card && card.id) || 0;
        return isReversed ? -num : num;
      }
      var scoreA = getScore(cardA, isRevA);
      var scoreB = getScore(cardB, isRevB);
      var recommended = scoreA >= scoreB ? texts.a : texts.b;

      // 渲染卡牌
      var slot = document.getElementById('dilemma-card-slot');
      if (slot && app.createCardEl) {
        slot.innerHTML = '';
        slot.style.display = 'flex';
        slot.style.gap = '20px';
        slot.style.justifyContent = 'center';
        var wrapA = document.createElement('div');
        wrapA.style.display = 'flex';
        wrapA.style.flexDirection = 'column';
        wrapA.style.alignItems = 'center';
        wrapA.style.gap = '6px';
        var elA = app.createCardEl(cardA, isRevA, true, 60, 96);
        var labelA = document.createElement('div');
        labelA.style.fontSize = '11px';
        labelA.style.color = 'var(--color-gold)';
        labelA.style.fontWeight = '700';
        labelA.textContent = texts.a;
        wrapA.appendChild(labelA);
        wrapA.appendChild(elA);
        elA.addEventListener('click', function() { elA.classList.toggle('flipped'); });

        var wrapB = document.createElement('div');
        wrapB.style.display = 'flex';
        wrapB.style.flexDirection = 'column';
        wrapB.style.alignItems = 'center';
        wrapB.style.gap = '6px';
        var elB = app.createCardEl(cardB, isRevB, true, 60, 96);
        var labelB = document.createElement('div');
        labelB.style.fontSize = '11px';
        labelB.style.color = 'var(--color-gold)';
        labelB.style.fontWeight = '700';
        labelB.textContent = texts.b;
        wrapB.appendChild(labelB);
        wrapB.appendChild(elB);
        elB.addEventListener('click', function() { elB.classList.toggle('flipped'); });

        slot.appendChild(wrapA);
        slot.appendChild(wrapB);
      }

      var html = '';
      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">' + texts.a + '</span> → <span style="color:var(--color-gold-light);">' + nameA + (isRevA ? (lang === 'en' ? ' (Reversed)' : '（逆位）') : (lang === 'en' ? ' (Upright)' : '（正位）')) + '</span></div>';
      html += '<div style="margin-bottom:12px;line-height:1.7;">' + meaningA + '</div>';
      html += '<div style="margin-bottom:10px;"><span style="color:var(--color-gold);font-weight:700;">' + texts.b + '</span> → <span style="color:var(--color-gold-light);">' + nameB + (isRevB ? (lang === 'en' ? ' (Reversed)' : '（逆位）') : (lang === 'en' ? ' (Upright)' : '（正位）')) + '</span></div>';
      html += '<div style="margin-bottom:12px;line-height:1.7;">' + meaningB + '</div>';
      html += '<div style="margin-top:10px;padding-top:8px;border-top:1px solid rgba(255,215,0,0.2);"><span style="color:var(--color-gold);font-weight:700;">' + (lang === 'en' ? 'Recommendation: ' : '综合推荐：') + '</span><span style="color:var(--color-gold-light);font-weight:700;">' + recommended + '</span>' + (lang === 'en' ? ' has more positive energy.' : ' 的牌面能量更积极。') + '</div>';

      var contentEl = document.getElementById('dilemma-reading-content');
      if (contentEl) contentEl.innerHTML = html;
      var readingDiv = document.getElementById('dilemma-reading');
      if (readingDiv) readingDiv.classList.remove('hidden');

      return recommended;
    }

    // ============ 猜拳 ============
    function playRPS(userChoice) {
      var texts = validateInputs();
      if (!texts) return;

      var choices = ['\u270A', '\u270B', '\u270C'];
      var computerChoice = Math.floor(Math.random() * 3);
      var beats = { 0: 2, 1: 0, 2: 1 };
      var userWins = beats[userChoice] === computerChoice;
      var isTie = userChoice === computerChoice;
      var lang = app.currentLang || 'zh';

      var html = '';
      html += '<div class="dilemma-result-game">';
      html += '<div class="dilemma-result-row">' + app.t('dilemma_you_chose') + choices[userChoice] + '</div>';
      html += '<div class="dilemma-result-row">' + app.t('dilemma_computer_chose') + choices[computerChoice] + '</div>';

      var winnerOption = '';
      if (isTie) {
        html += '<div class="dilemma-result-winner">' + app.t('decision_tie') + '</div>';
        html += '</div>';
        showResult(html);
        return;
      } else if (userWins) {
        winnerOption = texts.a;
        html += '<div class="dilemma-result-winner">' + app.t('dilemma_winner_is') + winnerOption + '</div>';
      } else {
        winnerOption = texts.b;
        html += '<div class="dilemma-result-winner">' + app.t('dilemma_winner_is') + winnerOption + '</div>';
      }
      html += '</div>';
      showResult(html);

      // 塔罗解读
      drawTarotForWinner(winnerOption);
    }

    // ============ 摇骰子 ============
    function playDice(userHighLow) {
      // userHighLow: true=押大, false=押小
      // 选项A = 你，选项B = 电脑
      // 押大 → 点数大者赢；押小 → 点数小者赢
      var texts = validateInputs();
      if (!texts) return;

      var userDice = Math.floor(Math.random() * 6) + 1;
      var compDice = Math.floor(Math.random() * 6) + 1;
      var diceEmojis = ['\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'];
      var lang = app.currentLang || 'zh';

      // 判断谁赢：押大→点数大者胜；押小→点数小者胜
      var userWins;
      if (userHighLow) {
        // 押大
        userWins = userDice > compDice;
      } else {
        // 押小
        userWins = userDice < compDice;
      }

      var isTie = userDice === compDice;
      var userBetLabel = userHighLow ? app.t('dilemma_dice_result_high') : app.t('dilemma_dice_result_low');

      var html = '';
      html += '<div class="dilemma-result-game">';
      html += '<div style="margin-bottom:8px;font-size:13px;color:var(--color-gold);font-weight:700;">' + app.t('dilemma_you_bet') + userBetLabel + '</div>';
      html += '<div style="display:flex;justify-content:space-around;align-items:center;margin:10px 0;">';
      html += '  <div style="text-align:center;"><div style="font-size:36px;">' + diceEmojis[userDice - 1] + '</div><div style="font-size:11px;color:var(--color-gold);">' + (lang === 'en' ? 'You (' + texts.a + ')' : '你（' + texts.a + '）') + '</div><div style="font-size:18px;font-weight:700;color:var(--color-text);">' + userDice + '</div></div>';
      html += '  <div style="font-size:20px;color:var(--color-gold);">VS</div>';
      html += '  <div style="text-align:center;"><div style="font-size:36px;">' + diceEmojis[compDice - 1] + '</div><div style="font-size:11px;color:var(--color-gold-light);">' + (lang === 'en' ? 'Computer (' + texts.b + ')' : '电脑（' + texts.b + '）') + '</div><div style="font-size:18px;font-weight:700;color:var(--color-text);">' + compDice + '</div></div>';
      html += '</div>';

      var winnerOption = '';
      if (isTie) {
        html += '<div class="dilemma-result-winner">' + app.t('decision_tie') + '</div>';
        html += '</div>';
        showResult(html);
        return;
      } else if (userWins) {
        winnerOption = texts.a;
        html += '<div class="dilemma-result-winner">' + app.t('dilemma_winner_is') + winnerOption + '</div>';
      } else {
        winnerOption = texts.b;
        html += '<div class="dilemma-result-winner">' + app.t('dilemma_winner_is') + winnerOption + '</div>';
      }
      html += '</div>';
      showResult(html);

      // 塔罗解读
      drawTarotForWinner(winnerOption);
    }

    // ============ 塔罗抽牌对比 ============
    function playTarot() {
      var texts = validateInputs();
      if (!texts) return;

      var recommended = drawTarotComparison();

      // 显示推荐结果
      var lang = app.currentLang || 'zh';
      var html = '';
      html += '<div class="dilemma-result-game">';
      html += '<div class="dilemma-result-winner">' + (lang === 'en' ? 'Recommendation: ' : '综合推荐：') + recommended + '</div>';
      html += '</div>';
      showResult(html);
    }

    // ============ 选择方式 ============
    function chooseMethod(method) {
      var texts = getOptionTexts();
      currentMethod = method;
      optionA = texts.a;
      optionB = texts.b;

      var gameArea = document.getElementById('dilemma-game-area');
      var rpsArea = document.getElementById('dilemma-rps-area');
      var diceArea = document.getElementById('dilemma-dice-area');
      var resultDiv = document.getElementById('dilemma-result');
      var readingDiv = document.getElementById('dilemma-reading');
      var redoBtn = document.getElementById('dilemma-redo-btn');

      if (resultDiv) { resultDiv.innerHTML = ''; resultDiv.classList.add('hidden'); }
      if (readingDiv) { readingDiv.classList.add('hidden'); }

      if (method === 'rps') {
        if (gameArea) gameArea.classList.remove('hidden');
        if (rpsArea) rpsArea.classList.remove('hidden');
        if (diceArea) diceArea.classList.add('hidden');
      } else if (method === 'dice') {
        if (gameArea) gameArea.classList.remove('hidden');
        if (rpsArea) rpsArea.classList.add('hidden');
        if (diceArea) diceArea.classList.remove('hidden');
      } else if (method === 'tarot') {
        if (gameArea) gameArea.classList.add('hidden');
        if (rpsArea) rpsArea.classList.add('hidden');
        if (diceArea) diceArea.classList.add('hidden');
        playTarot();
      }
      if (redoBtn) redoBtn.classList.remove('hidden');
    }

    // ============ 事件绑定 ============
    function bindDilemmaEvents() {
      var rpsBtn = document.getElementById('dilemma-rps-btn');
      if (rpsBtn && !rpsBtn._bound) {
        rpsBtn.addEventListener('click', function() { chooseMethod('rps'); });
        rpsBtn._bound = true;
      }
      var diceBtn = document.getElementById('dilemma-dice-btn');
      if (diceBtn && !diceBtn._bound) {
        diceBtn.addEventListener('click', function() { chooseMethod('dice'); });
        diceBtn._bound = true;
      }
      var tarotBtn = document.getElementById('dilemma-tarot-btn');
      if (tarotBtn && !tarotBtn._bound) {
        tarotBtn.addEventListener('click', function() { chooseMethod('tarot'); });
        tarotBtn._bound = true;
      }

      // 猜拳
      var rpsRock = document.getElementById('dilemma-rps-rock');
      if (rpsRock && !rpsRock._bound) {
        rpsRock.addEventListener('click', function() { playRPS(0); });
        rpsRock._bound = true;
      }
      var rpsPaper = document.getElementById('dilemma-rps-paper');
      if (rpsPaper && !rpsPaper._bound) {
        rpsPaper.addEventListener('click', function() { playRPS(1); });
        rpsPaper._bound = true;
      }
      var rpsScissors = document.getElementById('dilemma-rps-scissors');
      if (rpsScissors && !rpsScissors._bound) {
        rpsScissors.addEventListener('click', function() { playRPS(2); });
        rpsScissors._bound = true;
      }

      // 摇骰子
      var diceHigh = document.getElementById('dilemma-dice-high');
      if (diceHigh && !diceHigh._bound) {
        diceHigh.addEventListener('click', function() { playDice(true); });
        diceHigh._bound = true;
      }
      var diceLow = document.getElementById('dilemma-dice-low');
      if (diceLow && !diceLow._bound) {
        diceLow.addEventListener('click', function() { playDice(false); });
        diceLow._bound = true;
      }

      // 再来一次
      var redoBtn = document.getElementById('dilemma-redo-btn');
      if (redoBtn && !redoBtn._bound) {
        redoBtn.addEventListener('click', function() {
          if (currentMethod === 'rps') { resetResultArea(); chooseMethod('rps'); }
          else if (currentMethod === 'dice') { resetResultArea(); chooseMethod('dice'); }
          else if (currentMethod === 'tarot') { resetResultArea(); chooseMethod('tarot'); }
        });
        redoBtn._bound = true;
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindDilemmaEvents);
    } else {
      bindDilemmaEvents();
    }
    setTimeout(bindDilemmaEvents, 500);
  }

  if (typeof app !== 'undefined') {
    init();
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function() { init(); });
    } else {
      setTimeout(init, 100);
    }
  }
})();
