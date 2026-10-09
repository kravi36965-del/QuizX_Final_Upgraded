const socket = io();
let room = JSON.parse(sessionStorage.getItem('room') || 'null');
let isHost = sessionStorage.getItem('isHost') === 'true';
const roomCode = sessionStorage.getItem('roomCode') || (room && room.code);
const sessionToken = sessionStorage.getItem('sessionToken');
if (!room || !roomCode || !sessionToken) location.href='/';

const $=id=>document.getElementById(id);
function render(r){
  room=r; sessionStorage.setItem('room',JSON.stringify(r));
  $('quizName').textContent=r.quizName; $('roomCode').textContent=r.code;
  $('count').textContent=r.players.filter(p=>p.name!=='Host').length;
  $('capacity').textContent=`${r.players.filter(p=>p.name!=='Host').length}/${r.maxPlayers} players`;
  $('timeMeta').textContent=`${r.durationMinutes} Minutes`;
  $('hostControls').style.display=isHost?'block':'none';$('hostKeyBox').style.display=isHost?'block':'none';if(isHost)$('hostKey').textContent=sessionStorage.getItem('sessionToken')||'Unavailable';
  $('players').innerHTML=r.players.filter(p=>p.name!=='Host').map((p,i)=>`<div class="player"><span class="player-number">${i+1}</span><span>${escapeHtml(p.name)}</span><span class="lang">${p.language}</span>${p.submitted?'<span class="host-tag">SUBMITTED</span>':''}</div>`).join('') || '<div class="empty-state">Waiting for participants to join…</div>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function startQuiz(){socket.emit('startQuiz')}
function copyHostKey(){const key=sessionStorage.getItem('sessionToken')||'';navigator.clipboard?.writeText(key);const b=document.querySelector('#hostKeyBox .copy-btn');if(b){b.textContent='COPIED ✓';setTimeout(()=>b.textContent='COPY HOST KEY',1200)}}
function copyCode(){navigator.clipboard?.writeText(room.code);const b=document.querySelector('.copy-btn');b.textContent='COPIED ✓';setTimeout(()=>b.textContent='COPY CODE',1200)}
function openHistory(){socket.emit('requestHostHistory')}
function closeHistory(){$('historyModal').classList.add('hidden')}
function showHistory(items){
  $('historyList').innerHTML=items.length?items.map(x=>`<div class="history-item"><div><b>${escapeHtml(x.quizName)}</b><small>${new Date(x.endedAt).toLocaleString()} • Room ${x.roomCode}</small></div><strong>${x.participants.length} participants</strong><button class="secondary" onclick="viewHistory('${x.roomCode}')">VIEW</button></div>`).join(''):'<div class="empty-state">No completed quizzes saved yet.</div>';
  $('historyModal').classList.remove('hidden');
}
function viewHistory(code){location.href='/host-dashboard.html?room='+encodeURIComponent(code)}
socket.on('connect',()=>socket.emit('claimSession',{code:roomCode,token:sessionToken}));
socket.on('sessionClaimed',r=>{isHost=r.isHost;sessionStorage.setItem('isHost',String(isHost));render(r);if(r.started&&isHost)location.href='/host-live.html';else if(r.started&&!isHost)location.href='/exam.html';});
socket.on('roomUpdated',render);
socket.on('hostQuizStarted',d=>{if(!isHost)return;sessionStorage.setItem('quizStartAt',d.startAt);sessionStorage.setItem('quizEndAt',d.endAt);sessionStorage.setItem('quizName',d.quizName);sessionStorage.setItem('durationMinutes',d.durationMinutes);location.href='/host-live.html'});
socket.on('quizStarted',d=>{sessionStorage.setItem('quizStartAt',d.startAt);sessionStorage.setItem('quizEndAt',d.endAt);sessionStorage.setItem('quizName',d.quizName);sessionStorage.setItem('durationMinutes',d.durationMinutes);if(isHost)location.href='/host-live.html';else location.href='/exam.html'});
socket.on('hostHistory',showHistory);
socket.on('sessionError',m=>$('message').textContent=m);
socket.on('quizEnded',()=>{if(isHost)location.href='/host-dashboard.html'});
render(room);
