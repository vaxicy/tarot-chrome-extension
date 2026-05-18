# add_bindings.ps1 - Append event bindings to decision-spread.js
$path = "c:\Users\16704\Desktop\tarot\decision-spread.js"

# Read existing content
$content = Get-Content $path -Encoding UTF8

# Build event binding code
$bindings = @'

// =========== 事件绑定 ===========
(function bindDecisionEvents() {
  // 欢迎页按钮：进入抉择牌阵
  var btn = document.getElementById('"decision-spread-btn'");
  if (btn && !btn._bound) {
    btn.addEventListener('"click'", function() { if (typeof showDecisionPage === '""function'"') showDecisionPage(); });
    btn._bound = true;
  }

  // 抽牌按钮
  var drawBtn = document.getElementById('"decision-draw-btn'");
  if (drawBtn && !drawBtn._bound) {
    drawBtn.addEventListener('"click'", function() { if (typeof decisionDraw === '""function'"') decisionDraw(); });
    drawBtn._bound = true;
  }

  // 返回按钮
  var backBtn = document.getElementById('"decision-back-btn'");
  if (backBtn && !backBtn._bound) {
    backBtn.addEventListener('"click'", function() { if (typeof app !== '""undefined'"') app.showPage('""welcome-page'"'); });
    backBtn._bound = true;
  }

  // 重新抉择按钮
  var redoBtn = document.getElementById('"decision-redo-btn'");
  if (redoBtn && !redoBtn._bound) {
    redoBtn.addEventListener('"click'", function() { if (typeof decisionDraw === '""function'"') decisionDraw(); });
    redoBtn._bound = true;
  }

  // 猜拳按钮
  var rpsRock = document.getElementById('"decision-rps-rock'");
  if (rpsRock && !rpsRock._bound) {
    rpsRock.addEventListener('"click'", function() { if (typeof playRPS === '""function'"') playRPS(0); });
    rpsRock._bound = true;
  }
  var rpsPaper = document.getElementById('"decision-rps-paper'");
  if (rpsPaper && !rpsPaper._bound) {
    rpsPaper.addEventListener('"click'", function() { if (typeof playRPS === '""function'"') playRPS(1); });
    rpsPaper._bound = true;
  }
  var rpsScissors = document.getElementById('"decision-rps-scissors'");
  if (rpsScissors && !rpsScissors._bound) {
    rpsScissors.addEventListener('"click'", function() { if (typeof playRPS === '""function'"') playRPS(2); });
    rpsScissors._bound = true;
  }

  // 摇骰子按钮
  var diceHigh = document.getElementById('"decision-dice-high'");
  if (diceHigh && !diceHigh._bound) {
    diceHigh.addEventListener('"click'", function() { if (typeof playDice === '""function'"') playDice(true); });
    diceHigh._bound = true;
  }
  var diceLow = document.getElementById('"decision-dice-low'");
  if (diceLow && !diceLow._bound) {
    diceLow.addEventListener('"click'", function() { if (typeof playDice === '""function'"') playDice(false); });
    diceLow._bound = true;
  }
}

if (document.readyState === '""loading'"') {
  document.addEventListener('"DOMContentLoaded'", bindDecisionEvents);
} else {
  bindDecisionEvents();
}
'@

Add-Content $path -Value $bindings -Encoding UTF8
Write-Host "Event bindings appended successfully"
