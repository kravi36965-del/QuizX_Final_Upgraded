const socket=io();
const room=JSON.parse(sessionStorage.getItem('room')||'null');
const roomCode=sessionStorage.getItem('roomCode'), token=sessionStorage.getItem('sessionToken');
if(!room||!roomCode||!token||sessionStorage.getItem('isHost')!=='true') location.href='/';
let endAt=Number(sessionStorage.getItem('quizEndAt')||0), currentRoom=room;
const $=id=>document.getElementById(id);
function render(r){
 currentRoom=r; sessionStorage.setItem('room',JSON.stringify(r));
 $('quizName').textContent=r.quizName; $('roomCode').textContent='Room '+r.code;
 const ps=r.players.filter(p=>p.name!=='Host');
 $('participantCount').textContent=ps.length; $('capacity').textContent=`${ps.length} / ${r.maxPlayers}`;
 $('submittedCount').textContent=r.submittedCount||0;
 $('pendingCount').textContent=Math.max(0, ps.length-(r.submittedCount||0));
 $('statusText').textContent=r.ended?'ENDED':'LIVE';
 $('players').innerHTML=ps.map((p,i)=>`<div class="player"><span class="player-number">${i+1}</span><span>${escapeHtml(p.name)}</span><span class="lang">${p.language}</span><span class="${p.submitted?'host-tag':'pending-tag'}">${p.submitted?'SUBMITTED':'IN PROGRESS'}</span></div>`).join('')||'<div class="empty-state">No participants.</div>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function endQuiz(){if(confirm('End the quiz for everyone now?'))socket.emit('endQuiz')}
function tick(){const ms=Math.max(0,endAt-Date.now());const sec=Math.floor(ms/1000);$('timer').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;if(ms<=0)$('timer').textContent='00:00'}
socket.on('connect',()=>socket.emit('claimSession',{code:roomCode,token}));
socket.on('sessionClaimed',r=>{if(!r.isHost)return;render(r);if(r.endAt){endAt=r.endAt;sessionStorage.setItem('quizEndAt',r.endAt)}});
socket.on('roomUpdated',render);
socket.on('quizState',d=>{endAt=d.endAt;sessionStorage.setItem('quizEndAt',d.endAt);$('quizName').textContent=d.quizName});
socket.on('quizEnded',()=>location.href='/host-dashboard.html');
setInterval(tick,500);tick();render(room);
