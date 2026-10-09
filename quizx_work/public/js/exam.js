const state={current:0,answers:[],statuses:[],submitted:false,questions:[]};
const language=sessionStorage.getItem('language')||'English';
const playerName=sessionStorage.getItem('playerName')||'Candidate';
let quizName=sessionStorage.getItem('quizName')||'QuizX';
let endAt=Number(sessionStorage.getItem('quizEndAt')||0);
const socket=io();
const $=id=>document.getElementById(id);
$('candidateName').textContent=playerName;$('candidateLang').textContent=language;$('quizTitle').textContent=quizName;$('examQuizName').textContent=quizName;
function initQuiz(d){
  quizName=d.quizName||quizName; endAt=Number(d.endAt||endAt);
  sessionStorage.setItem('quizName',quizName);sessionStorage.setItem('quizEndAt',endAt);
  state.questions=d.questions||state.questions;
  state.answers=Array(state.questions.length).fill(null);
  state.statuses=Array(state.questions.length).fill('notVisited');
  $('quizTitle').textContent=quizName;$('examQuizName').textContent=quizName;
  loadQuestion(0);
}
function loadQuestion(index){
 if(!state.questions.length)return;
 state.current=Math.max(0,Math.min(state.questions.length-1,index));
 const q=state.questions[state.current];
 if(state.statuses[state.current]==='notVisited')state.statuses[state.current]='notAnswered';
 $('qNumber').textContent=state.current+1;$('questionTotal').textContent=state.questions.length;
 $('questionText').textContent=language==='Hindi'&&q.hi?q.hi:q.en;
 $('questionStatus').textContent=statusLabel(state.statuses[state.current]);
 const options=$('options');options.innerHTML='';
 q.options.forEach((opt,i)=>{const row=document.createElement('button');row.type='button';row.className='exam-option';if(state.answers[state.current]===i)row.classList.add('selected');row.innerHTML=`<span class="option-letter">${String.fromCharCode(65+i)}</span><span>${opt}</span>`;row.onclick=()=>selectOption(i);options.appendChild(row)});
 renderPalette();updateCounts();
}
function sendProgress(){if(!state.questions.length||state.submitted)return;socket.emit('saveProgress',{answers:state.answers})}
function selectOption(i){state.answers[state.current]=i;state.statuses[state.current]='answered';loadQuestion(state.current);sendProgress()}
function clearResponse(){state.answers[state.current]=null;state.statuses[state.current]='notAnswered';loadQuestion(state.current);sendProgress()}
function saveNext(){state.statuses[state.current]=state.answers[state.current]!==null?'answered':'notAnswered';goNext()}
function saveMark(){state.statuses[state.current]=state.answers[state.current]!==null?'answeredReview':'review';goNext()}
function markNext(){state.statuses[state.current]=state.answers[state.current]!==null?'answeredReview':'review';goNext()}
function nextWithoutSave(){goNext()}function goNext(){if(state.current<state.questions.length-1)loadQuestion(state.current+1);else openSubmit()}
function previousQuestion(){if(state.current>0)loadQuestion(state.current-1)}
function renderPalette(){const p=$('palette');p.innerHTML='';state.statuses.forEach((status,i)=>{const b=document.createElement('button');b.className='palette-btn '+status;b.textContent=i+1;b.onclick=()=>loadQuestion(i);p.appendChild(b)})}
function statusLabel(s){return({notVisited:'Not Visited',notAnswered:'Not Answered',answered:'Answered',review:'Marked for Review',answeredReview:'Answered & Marked'})[s]||s}
function counts(){return state.statuses.reduce((a,s)=>(a[s]++,a),{notVisited:0,notAnswered:0,answered:0,review:0,answeredReview:0})}
function updateCounts(){const c=counts();$('notVisitedCount').textContent=c.notVisited;$('notAnsweredCount').textContent=c.notAnswered;$('answeredCount').textContent=c.answered;$('reviewCount').textContent=c.review;$('answeredReviewCount').textContent=c.answeredReview}
function openSubmit(){const c=counts();$('sAnswered').textContent=c.answered;$('sUnanswered').textContent=c.notAnswered+c.notVisited;$('sReview').textContent=c.review;$('sAnsweredReview').textContent=c.answeredReview;$('submitModal').classList.remove('hidden')}
function closeSubmit(){$('submitModal').classList.add('hidden')}
function submitTest(){if(state.submitted)return;state.submitted=true;sendProgress();socket.emit('submitQuiz',{answers:state.answers})}
function showResult(r){sessionStorage.setItem('result',JSON.stringify(r));location.href='/result.html'}
function tick(){if(!endAt)return;const remaining=Math.max(0,endAt-Date.now()),sec=Math.floor(remaining/1000);$('timer').textContent=`${String(Math.floor(sec/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;if(remaining<=0&&!state.submitted){state.submitted=true;socket.emit('submitQuiz',{answers:state.answers})}}
socket.on('connect',()=>socket.emit('claimSession',{code:sessionStorage.getItem('roomCode'),token:sessionStorage.getItem('sessionToken')}));
socket.on('sessionClaimed',r=>{if(r.isHost){location.href='/host-live.html';return} if(r.started){}});
socket.on('quizState',initQuiz);
socket.on('quizStarted',initQuiz);
socket.on('participantResult',showResult);
socket.on('quizEnded',()=>{if(!state.submitted)socket.emit('submitQuiz',{answers:state.answers});});
socket.on('submitError',m=>{state.submitted=false;alert(m)});
setInterval(tick,500);tick();
