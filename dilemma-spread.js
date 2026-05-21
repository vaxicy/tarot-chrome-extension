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

    // ============ 选项历史管理 ============
    var DILEMMA_HISTORY_KEY = 'dilemma_history';
    var MAX_HISTORY = 6;

    function saveDilemmaHistory() {
      var texts = getOptionTexts();
      if (!texts.a || !texts.b) return;
      // 跳过默认选项
      var defA = app.currentLang === 'en' ? 'Option A' : '选项A';
      var defB = app.currentLang === 'en' ? 'Option B' : '选项B';
      if (texts.a === defA && texts.b === defB) return;

      try {
        var stored = JSON.parse(localStorage.getItem(DILEMMA_HISTORY_KEY) || '[]');
        // 去重：如果已有相同选项对，移到最前
        stored = stored.filter(function(item) {
          return !(item.a === texts.a && item.b === texts.b);
        });
        stored.unshift({ a: texts.a, b: texts.b, time: Date.now() });
        if (stored.length > MAX_HISTORY) stored = stored.slice(0, MAX_HISTORY);
        localStorage.setItem(DILEMMA_HISTORY_KEY, JSON.stringify(stored));
      } catch (e) {}
    }

    function loadDilemmaHistory() {
      try {
        return JSON.parse(localStorage.getItem(DILEMMA_HISTORY_KEY) || '[]');
      } catch (e) { return []; }
    }

    function renderDilemmaHistory() {
      var bar = document.getElementById('dilemma-history-bar');
      var tagsContainer = document.getElementById('dilemma-history-tags');
      if (!bar || !tagsContainer) return;
      var list = loadDilemmaHistory();
      if (list.length === 0) {
        bar.classList.add('hidden');
        return;
      }
      tagsContainer.innerHTML = '';
      list.forEach(function(item) {
        var tag = document.createElement('div');
        tag.className = 'dilemma-history-tag';
        var label = item.a + ' vs ' + item.b;
        if (label.length > 14) label = label.substring(0, 13) + '…';
        tag.textContent = label;
        tag.title = item.a + ' vs ' + item.b;
        tag.addEventListener('click', function() {
          var inputA = document.getElementById('dilemma-input-a');
          var inputB = document.getElementById('dilemma-input-b');
          if (inputA) inputA.value = item.a;
          if (inputB) inputB.value = item.b;
          // 触发 input 事件让 glow 效果响应
          if (inputA) inputA.dispatchEvent(new Event('input'));
          if (inputB) inputB.dispatchEvent(new Event('input'));
        });
        tagsContainer.appendChild(tag);
      });
      bar.classList.remove('hidden');
    }

    // ============ Confetti 庆祝动画 ============
    function triggerConfetti(originEl) {
      var container = document.createElement('div');
      container.className = 'dilemma-confetti-container';
      document.body.appendChild(container);

      var colors = ['#FFD700', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4', '#FF5722'];
      var rect = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0, height: 0 };
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;

      for (var i = 0; i < 24; i++) {
        var piece = document.createElement('div');
        piece.className = 'dilemma-confetti-piece';
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = cx + 'px';
        piece.style.top = cy + 'px';
        var angle = (Math.PI * 2 * i) / 24 + (Math.random() - 0.5) * 0.5;
        var dist = 40 + Math.random() * 80;
        var tx = Math.cos(angle) * dist;
        var ty = Math.sin(angle) * dist + 60 + Math.random() * 40;
        var rot = Math.random() * 720;
        piece.style.setProperty('--tx', tx + 'px');
        piece.style.setProperty('--ty', ty + 'px');
        piece.style.setProperty('--rot', rot + 'deg');
        // 覆盖默认动画，使用动态终点
        piece.style.animation = 'none';
        piece.style.transition = 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        piece.style.transform = 'translate(0,0) rotate(0deg) scale(1)';
        piece.style.opacity = '1';
        container.appendChild(piece);
        (function(p, x, y, r) {
          requestAnimationFrame(function() {
            p.style.transform = 'translate(' + x + ',' + y + ') rotate(' + r + ') scale(0.2)';
            p.style.opacity = '0';
          });
        })(piece, tx + 'px', ty + 'px', rot + 'deg');
      }
      setTimeout(function() { if (container.parentNode) container.parentNode.removeChild(container); }, 1100);
    }

    // ============ 让命运决定（随机方式） ============
    function playRandomDecision() {
      var texts = validateInputs();
      if (!texts) return;
      var methods = ['rps', 'dice', 'tarot'];
      var method = methods[Math.floor(Math.random() * methods.length)];
      // 先显示决定方式，再做决定
      chooseMethod(method);
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

        // 胜出时撒 confetti
        var winnerEl = resultDiv.querySelector('.dilemma-result-winner');
        if (winnerEl) {
          setTimeout(function() { triggerConfetti(winnerEl); }, 200);
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
            saveDilemmaHistory();
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

    // ============ CSS 骰子组件 ============
    function makeDiceFace(pips) {
      var positions = {
        1: ['c'],
        2: ['tl', 'br'],
        3: ['tl', 'c', 'br'],
        4: ['tl', 'tr', 'bl', 'br'],
        5: ['tl', 'tr', 'c', 'bl', 'br'],
        6: ['tl', 'tr', 'cl', 'cr', 'bl', 'br']
      };
      var html = '<div class="dice-face">';
      (positions[pips] || []).forEach(function(pos) {
        html += '<span class="dice-pip" data-pos="' + pos + '"></span>';
      });
      html += '</div>';
      return html;
    }

    // ============ 摇骰子（带动画） ============
    function playDice(userHighLow) {
      var texts = validateInputs();
      if (!texts) return;

      var lang = app.currentLang || 'zh';

      // 禁用骰子按钮
      var diceBtns = document.querySelectorAll('.dilemma-dice-btn');
      diceBtns.forEach(function(b) { b.disabled = true; });

      // 显示动画区域，放入滚动骰子
      var animDiv = document.getElementById('dilemma-dice-animation');
      if (animDiv) {
        animDiv.classList.remove('hidden');
        animDiv.innerHTML = '<div class="dice-face rolling" id="dilemma-rolling-dice"><span class="dice-pip" data-pos="c"></span></div>';
      }

      // 滚动动画：快速切换点数
      var rollingDice = document.getElementById('dilemma-rolling-dice');
      var rollInterval;
      if (rollingDice) {
        rollInterval = setInterval(function() {
          var rnd = Math.floor(Math.random() * 6) + 1;
          rollingDice.outerHTML = makeDiceFace(rnd).replace('dice-face', 'dice-face rolling');
          rollingDice = document.getElementById('dilemma-rolling-dice');
        }, 80);
      }

      // 模拟滚动 1.2 秒后停止
      setTimeout(function() {
        if (rollInterval) clearInterval(rollInterval);
        var userDice = Math.floor(Math.random() * 6) + 1;
        var compDice = Math.floor(Math.random() * 6) + 1;

        // 动画区域显示最终结果（你的骰子）
        if (animDiv) {
          animDiv.innerHTML = makeDiceFace(userDice);
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
        html += '  <div class="dilemma-result-dice-card">';
        html += makeDiceFace(userDice);
        html += '    <div class="dilemma-result-dice-label">' + (lang === 'en' ? 'You (' + texts.a + ')' : '你（' + texts.a + '）') + '</div>';
        html += '    <div class="dilemma-result-dice-value">' + userDice + '</div>';
        html += '  </div>';
        html += '  <div class="dilemma-result-dice-vs">VS</div>';
        html += '  <div class="dilemma-result-dice-card">';
        html += makeDiceFace(compDice);
        html += '    <div class="dilemma-result-dice-label">' + (lang === 'en' ? 'Computer (' + texts.b + ')' : '电脑（' + texts.b + '）') + '</div>';
        html += '    <div class="dilemma-result-dice-value">' + compDice + '</div>';
        html += '  </div>';
        html += '</div>';

        var winnerOption = '';
        saveDilemmaHistory();
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
      saveDilemmaHistory();
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

      // 让命运决定
      var fateBtn = document.getElementById('dilemma-fate-btn');
      if (fateBtn && !fateBtn._bound) {
        fateBtn.addEventListener('click', function() { playRandomDecision(); });
        fateBtn._bound = true;
      }

      // 输入框 blur 时保存历史并渲染
      var inputA = document.getElementById('dilemma-input-a');
      var inputB = document.getElementById('dilemma-input-b');
      if (inputA && !inputA._bound) {
        inputA.addEventListener('blur', function() { saveDilemmaHistory(); renderDilemmaHistory(); });
        inputA._bound = true;
      }
      if (inputB && !inputB._bound) {
        inputB.addEventListener('blur', function() { saveDilemmaHistory(); renderDilemmaHistory(); });
        inputB._bound = true;
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

    // 暴露历史管理函数供 popup.js 调用
    window.renderDilemmaHistory = renderDilemmaHistory;
    window.saveDilemmaHistory = saveDilemmaHistory;
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
