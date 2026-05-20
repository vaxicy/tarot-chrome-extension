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
      var readingRedo = document.getElementById('dilemma-reading-redo');
      if (resultDiv) { resultDiv.innerHTML = ''; resultDiv.classList.add('hidden'); }
      if (readingDiv) { readingDiv.classList.add('hidden'); }
      if (gameArea) gameArea.classList.add('hidden');
      if (rpsArea) rpsArea.classList.add('hidden');
      if (diceArea) diceArea.classList.add('hidden');
      if (redoBtn) redoBtn.classList.add('hidden');
      if (readingRedo) readingRedo.classList.add('hidden');
    }

    function showResult(html) {
      var resultDiv = document.getElementById('dilemma-result');
      var redoBtn = document.getElementById('dilemma-redo-btn');
      var readingRedo = document.getElementById('dilemma-reading-redo');
      if (resultDiv) {
        // 非塔罗方式在结果卡片右上角添加「再来一次」按钮
        var redoHtml = '';
        if (redoBtn && currentMethod !== 'tarot') {
          redoHtml = '<button type="button" class="dilemma-redo-inline" title="' + (app.t('dilemma_redo') || '再来一次') + '">&#128260;</button>';
        }
        resultDiv.innerHTML = redoHtml + html;
        resultDiv.classList.remove('hidden');

        // 绑定内联再来一次按钮（非塔罗）
        var inlineRedo = resultDiv.querySelector('.dilemma-redo-inline');
        if (inlineRedo) {
          inlineRedo.addEventListener('click', function() {
            if (currentMethod === 'rps') { resetResultArea(); chooseMethod('rps'); }
            else if (currentMethod === 'dice') { resetResultArea(); chooseMethod('dice'); }
          });
        }
      }
      // 塔罗方式：显示解读区右上角的刷新按钮
      if (readingRedo) {
        if (currentMethod === 'tarot') {
          readingRedo.classList.remove('hidden');
        } else {
          readingRedo.classList.add('hidden');
        }
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

      // 渲染卡牌
      var slot = document.getElementById('dilemma-card-slot');
      if (slot && app.createCardEl) {
        slot.innerHTML = '';
        var el = app.createCardEl(card, isRev, true, 80, 126);
        slot.appendChild(el);
        el.addEventListener('click', function() { el.classList.toggle('flipped'); });
      }

      // 生成解读（卡片化）
      var html = '';
      html += '<div class="dilemma-result-game">';
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
      html += '</div>';

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
        slot.style.gap = '24px';
        slot.style.justifyContent = 'center';
        slot.style.alignItems = 'flex-start';

        function makeCardWrap(card, isReversed, labelText) {
          var wrap = document.createElement('div');
          wrap.className = 'dilemma-card-wrap';
          var label = document.createElement('div');
          label.className = 'dilemma-card-label';
          label.textContent = labelText;
          var el = app.createCardEl(card, isReversed, true, 90, 140);
          var nameEl = document.createElement('div');
          nameEl.className = 'dilemma-card-name';
          var cName = getCardName(card);
          nameEl.textContent = cName + (isReversed ? (lang === 'en' ? ' (Reversed)' : ' · 逆位') : (lang === 'en' ? ' (Upright)' : ' · 正位'));
          wrap.appendChild(label);
          wrap.appendChild(el);
          wrap.appendChild(nameEl);
          el.addEventListener('click', function() { el.classList.toggle('flipped'); });
          return wrap;
        }

        slot.appendChild(makeCardWrap(cardA, isRevA, texts.a));

        var vsBadge = document.createElement('div');
        vsBadge.className = 'dilemma-vs-badge';
        vsBadge.textContent = 'VS';
        slot.appendChild(vsBadge);

        slot.appendChild(makeCardWrap(cardB, isRevB, texts.b));
      }

      var html = '';
      html += '<div class="dilemma-tarot-readings">';
      html += '<div class="dilemma-tarot-reading-col">';
      html += '<div class="dilemma-tarot-reading-title"><span style="color:var(--color-gold);font-weight:700;">' + texts.a + '</span> <span style="color:var(--color-text-muted);">→</span> <span style="color:var(--color-gold-light);">' + nameA + '</span></div>';
      html += '<div class="dilemma-tarot-reading-text">' + meaningA + '</div>';
      html += '</div>';
      html += '<div class="dilemma-tarot-reading-col">';
      html += '<div class="dilemma-tarot-reading-title"><span style="color:var(--color-gold);font-weight:700;">' + texts.b + '</span> <span style="color:var(--color-text-muted);">→</span> <span style="color:var(--color-gold-light);">' + nameB + '</span></div>';
      html += '<div class="dilemma-tarot-reading-text">' + meaningB + '</div>';
      html += '</div>';
      html += '</div>';
      html += '<div class="dilemma-tarot-recommend"><span style="color:var(--color-gold);font-weight:700;">' + (lang === 'en' ? 'Recommendation: ' : '综合推荐：') + '</span><span style="color:var(--color-gold-light);font-weight:700;">' + recommended + '</span><span style="color:var(--color-text-muted);">' + (lang === 'en' ? ' has more positive energy' : ' 的牌面能量更积极') + '</span></div>';

      var contentEl = document.getElementById('dilemma-reading-content');
      if (contentEl) contentEl.innerHTML = html;
      var readingDiv = document.getElementById('dilemma-reading');
      if (readingDiv) readingDiv.classList.remove('hidden');

      return recommended;
    }

    // ============ 猜拳（带动画） ============
    function playRPS(userChoice) {
      var texts = validateInputs();
      if (!texts) return;

      var choices = ['\u270A', '\u270B', '\u270C'];
      var lang = app.currentLang || 'zh';

      // 禁用猜拳按钮
      var rpsBtns = document.querySelectorAll('.dilemma-rps-btn');
      rpsBtns.forEach(function(b) { b.disabled = true; });

      // 显示动画区域
      var animDiv = document.getElementById('dilemma-rps-animation');
      var countdownEl = animDiv ? animDiv.querySelector('.dilemma-rps-countdown') : null;
      var userHand = animDiv ? animDiv.querySelector('.dilemma-rps-user') : null;
      var compHand = animDiv ? animDiv.querySelector('.dilemma-rps-computer') : null;

      if (animDiv) animDiv.classList.remove('hidden');
      if (userHand) { userHand.textContent = '\u270A'; userHand.classList.remove('rps-reveal'); }
      if (compHand) { compHand.textContent = '\u270A'; compHand.classList.remove('rps-reveal'); }

      // 倒计时动画
      var steps = lang === 'en' ? ['Rock', 'Paper', 'Scissors', 'Go!'] : ['石头', '布', '剪刀', '出！'];
      var idx = 0;
      if (countdownEl) countdownEl.textContent = steps[0];

      var countInterval = setInterval(function() {
        idx++;
        if (idx < steps.length) {
          if (countdownEl) { countdownEl.textContent = steps[idx]; countdownEl.style.animation = 'none'; void countdownEl.offsetWidth; countdownEl.style.animation = ''; }
          // 手势摇动
          if (userHand) userHand.classList.add('rps-shake');
          if (compHand) compHand.classList.add('rps-shake');
          setTimeout(function() {
            if (userHand) userHand.classList.remove('rps-shake');
            if (compHand) compHand.classList.remove('rps-shake');
          }, 120);
        } else {
          clearInterval(countInterval);
          // 揭晓
          var computerChoice = Math.floor(Math.random() * 3);
          var beats = { 0: 2, 1: 0, 2: 1 };
          var userWins = beats[userChoice] === computerChoice;
          var isTie = userChoice === computerChoice;

          if (userHand) { userHand.textContent = choices[userChoice]; userHand.classList.add('rps-reveal'); }
          if (compHand) { compHand.textContent = choices[computerChoice]; compHand.classList.add('rps-reveal'); }

          setTimeout(function() {
            if (countdownEl) countdownEl.textContent = '';

            var html = '';
            html += '<div class="dilemma-result-game">';
            html += '<div class="dilemma-result-row">' + app.t('dilemma_you_chose') + choices[userChoice] + '</div>';
            html += '<div class="dilemma-result-row">' + app.t('dilemma_computer_chose') + choices[computerChoice] + '</div>';

            var winnerOption = '';
            if (isTie) {
              html += '<div class="dilemma-result-winner">' + app.t('decision_tie') + '</div>';
              html += '</div>';
              showResult(html);
            } else if (userWins) {
              winnerOption = texts.a;
              html += '<div class="dilemma-result-winner">' + app.t('dilemma_winner_is') + winnerOption + '</div>';
              html += '</div>';
              showResult(html);
              drawTarotForWinner(winnerOption);
            } else {
              winnerOption = texts.b;
              html += '<div class="dilemma-result-winner">' + app.t('dilemma_winner_is') + winnerOption + '</div>';
              html += '</div>';
              showResult(html);
              drawTarotForWinner(winnerOption);
            }

            rpsBtns.forEach(function(b) { b.disabled = false; });
          }, 500);
        }
      }, 500);
    }

    // ============ 摇骰子（带动画） ============
    function playDice(userHighLow) {
      var texts = validateInputs();
      if (!texts) return;

      var lang = app.currentLang || 'zh';

      // 禁用骰子按钮
      var diceBtns = document.querySelectorAll('.dilemma-dice-btn');
      diceBtns.forEach(function(b) { b.disabled = true; });

      // 显示动画区域
      var animDiv = document.getElementById('dilemma-dice-animation');
      var rollingEl = animDiv ? animDiv.querySelector('.dilemma-dice-rolling') : null;
      if (animDiv) animDiv.classList.remove('hidden');
      if (rollingEl) {
        rollingEl.textContent = '\u9855';
        rollingEl.classList.remove('dice-stop');
        rollingEl.style.animation = 'diceRoll 0.12s linear infinite';
      }

      // 模拟滚动 1.2 秒后停止
      setTimeout(function() {
        var userDice = Math.floor(Math.random() * 6) + 1;
        var compDice = Math.floor(Math.random() * 6) + 1;
        var diceEmojis = ['\u2680', '\u2681', '\u2682', '\u2683', '\u2684', '\u2685'];

        if (rollingEl) {
          rollingEl.style.animation = 'none';
          rollingEl.textContent = diceEmojis[userDice - 1];
          rollingEl.classList.add('dice-stop');
        }

        // 判断输赢
        var userWins;
        if (userHighLow) {
          userWins = userDice > compDice;
        } else {
          userWins = userDice < compDice;
        }
        var isTie = userDice === compDice;
        var userBetLabel = userHighLow ? app.t('dilemma_dice_result_high') : app.t('dilemma_dice_result_low');

        // 用结果卡片展示
        var html = '';
        html += '<div class="dilemma-result-game">';
        html += '<div style="margin-bottom:10px;font-size:13px;color:var(--color-gold);font-weight:700;">' + app.t('dilemma_you_bet') + userBetLabel + '</div>';
        html += '<div class="dilemma-result-dice-wrap">';
        html += '  <div class="dilemma-result-dice">';
        html += '    <div class="dilemma-result-dice-emoji">' + diceEmojis[userDice - 1] + '</div>';
        html += '    <div class="dilemma-result-dice-label">' + (lang === 'en' ? 'You (' + texts.a + ')' : '你（' + texts.a + '）') + '</div>';
        html += '    <div class="dilemma-result-dice-value">' + userDice + '</div>';
        html += '  </div>';
        html += '  <div style="font-size:20px;color:var(--color-gold);align-self:center;">VS</div>';
        html += '  <div class="dilemma-result-dice">';
        html += '    <div class="dilemma-result-dice-emoji">' + diceEmojis[compDice - 1] + '</div>';
        html += '    <div class="dilemma-result-dice-label">' + (lang === 'en' ? 'Computer (' + texts.b + ')' : '电脑（' + texts.b + '）') + '</div>';
        html += '    <div class="dilemma-result-dice-value">' + compDice + '</div>';
        html += '  </div>';
        html += '</div>';

        var winnerOption = '';
        if (isTie) {
          html += '<div class="dilemma-result-winner">' + app.t('decision_tie') + '</div>';
          html += '</div>';
          showResult(html);
          diceBtns.forEach(function(b) { b.disabled = false; });
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
        diceBtns.forEach(function(b) { b.disabled = false; });
      }, 1200);
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

    // ============ 选择方式（Tab 切换）============
    function chooseMethod(method) {
      var texts = getOptionTexts();
      currentMethod = method;
      optionA = texts.a;
      optionB = texts.b;

      // Tab 按钮激活态
      var tabBtns = document.querySelectorAll('.dilemma-method-btn');
      tabBtns.forEach(function(btn) {
        if (btn.dataset.method === method) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      var gameArea = document.getElementById('dilemma-game-area');
      var rpsArea = document.getElementById('dilemma-rps-area');
      var diceArea = document.getElementById('dilemma-dice-area');
      var rpsAnim = document.getElementById('dilemma-rps-animation');
      var diceAnim = document.getElementById('dilemma-dice-animation');
      var resultDiv = document.getElementById('dilemma-result');
      var readingDiv = document.getElementById('dilemma-reading');
      var redoBtn = document.getElementById('dilemma-redo-btn');
      var readingRedo = document.getElementById('dilemma-reading-redo');

      // 重置所有区域
      if (resultDiv) { resultDiv.innerHTML = ''; resultDiv.classList.add('hidden'); }
      if (readingDiv) { readingDiv.classList.add('hidden'); }
      if (rpsAnim) { rpsAnim.classList.add('hidden'); rpsAnim.querySelector('.dilemma-rps-countdown').textContent = ''; }
      if (diceAnim) { diceAnim.classList.add('hidden'); }
      if (readingRedo) readingRedo.classList.add('hidden');

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

      // 塔罗解读区再来一次
      var readingRedoBtn = document.getElementById('dilemma-reading-redo');
      if (readingRedoBtn && !readingRedoBtn._bound) {
        readingRedoBtn.addEventListener('click', function() {
          if (currentMethod === 'tarot') { resetResultArea(); chooseMethod('tarot'); }
        });
        readingRedoBtn._bound = true;
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
