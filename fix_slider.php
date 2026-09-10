<?php
$htmlPath = '/home/h417440/public_html/live_about_us.html';
$content = file_get_contents($htmlPath);

// Expose next and prev globally
$content = str_replace(
    "function startTeamAutoPlay() {",
    "window.nextTeamCard = function() { logicalIndex++; updateTeamCards(); resetTeamAutoPlay(); };\n          window.prevTeamCard = function() { logicalIndex--; updateTeamCards(); resetTeamAutoPlay(); };\n          function startTeamAutoPlay() {",
    $content
);

// Add the HTML arrows around the progress bar
$arrowsHtml = '
        <div class="nav-controls" style="display:flex; align-items:center; justify-content:center; gap:20px;">
          <button id="team-prev-btn" onclick="window.prevTeamCard()" style="background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:50%; width:44px; height:44px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.3s ease;" onmouseover="this.style.background=\'rgba(204,255,0,0.1)\'; this.style.borderColor=\'#CCFF00\';" onmouseout="this.style.background=\'transparent\'; this.style.borderColor=\'rgba(255,255,255,0.1)\';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          <div class="progress-bar" id="progress">';

$content = str_replace(
    '<div class="nav-controls">
          <div class="progress-bar" id="progress">',
    $arrowsHtml,
    $content
);

$endArrowsHtml = '</div>
          <button id="team-next-btn" onclick="window.nextTeamCard()" style="background:transparent; border:1px solid rgba(255,255,255,0.1); border-radius:50%; width:44px; height:44px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.3s ease;" onmouseover="this.style.background=\'rgba(204,255,0,0.1)\'; this.style.borderColor=\'#CCFF00\';" onmouseout="this.style.background=\'transparent\'; this.style.borderColor=\'rgba(255,255,255,0.1)\';">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CCFF00" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
          </button>
        </div>';

$content = str_replace(
    '</div>
        </div>
      </div>
      <script>',
    $endArrowsHtml . '
      </div>
      <script>',
    $content
);

file_put_contents($htmlPath, $content);
echo "SUCCESS";
