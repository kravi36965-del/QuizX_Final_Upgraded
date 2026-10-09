const r=JSON.parse(sessionStorage.getItem('result')||'{}');
const $=id=>document.getElementById(id);
$('resultTitle').textContent=r.quizName||'Your Result';
$('resultSubtitle').textContent=`${r.playerName||'Candidate'} • Submitted ${r.submittedAt?new Date(r.submittedAt).toLocaleString():''}`;
$('score').textContent=r.score??0;$('scoreTotal').textContent=`/ ${r.total||45}`;$('performanceLevel').textContent=r.performanceLevel||'Developing';
$('correct').textContent=r.correct??0;$('wrong').textContent=r.wrong??0;$('unanswered').textContent=r.unanswered??0;$('accuracy').textContent=`${r.accuracy??0}%`;
$('categories').innerHTML=Object.entries(r.categories||{}).map(([name,s])=>`<div class="category-card"><b>${name}</b><strong>${s.accuracy}%</strong><span>${s.correct}/${s.total} correct • ${s.wrong} wrong • ${s.unanswered} unanswered</span></div>`).join('');
$('guidance').innerHTML=(r.guidance||['Keep practising and review your mistakes before the next quiz.']).map(x=>`<div class="guidance-item">✓ ${x}</div>`).join('');
