const base = require('./questions');

function q(en, hi, options, answer, category) { return { en, hi, options, answer, category }; }
function pct(a, p) {
  const v = a * p / 100;
  const opts = [v, v + 5, v - 5, v + 10].map(Number);
  const answer = opts.indexOf(v);
  return q(`What is ${p}% of ${a}?`, `${a} का ${p}% कितना है?`, opts.map(String), answer, 'Quantitative Aptitude');
}
function average(a,b,c){ const v=(a+b+c)/3; const opts=[v,v+2,v-2,v+3]; return q(`The average of ${a}, ${b} and ${c} is:`, `${a}, ${b} और ${c} का औसत है:`, opts.map(String),0,'Quantitative Aptitude'); }
function speed(distance,time){ const v=distance/time; return q(`A vehicle covers ${distance} km in ${time} hours. Its speed is:`, `एक वाहन ${time} घंटे में ${distance} किमी चलता है। उसकी गति है:`, [`${v-10} km/h`,`${v} km/h`,`${v+10} km/h`,`${v+20} km/h`],1,'Quantitative Aptitude'); }
function ratio(a,b,total){ const v=total*a/(a+b); return q(`A ratio is ${a}:${b} and the total is ${total}. The smaller part is:`, `अनुपात ${a}:${b} है और कुल ${total} है। छोटा भाग है:`, [String(v),String(v+4),String(v+8),String(v-4)],0,'Quantitative Aptitude'); }
function si(p,r,t){ const v=p*r*t/100; return q(`Simple interest on ₹${p} at ${r}% per year for ${t} years is:`,`₹${p} पर ${r}% वार्षिक दर से ${t} वर्ष का साधारण ब्याज है:`,[`₹${v}`,`₹${v+50}`,`₹${v+100}`,`₹${v-50}`],0,'Quantitative Aptitude'); }
function hcf(a,b){ function f(x,y){while(y){[x,y]=[y,x%y]}return x} const v=f(a,b); return q(`The HCF of ${a} and ${b} is:`,`${a} और ${b} का HCF है:`,[String(v),String(v*2),String(v+3),String(v+6)],0,'Quantitative Aptitude'); }
function lcm(a,b){ const g=(x,y)=>y?g(y,x%y):x; const v=a/g(a,b)*b; return q(`The LCM of ${a} and ${b} is:`,`${a} और ${b} का LCM है:`,[String(v),String(v/2),String(v+a),String(v+b)],0,'Quantitative Aptitude'); }
function work(workers,days){ const v=workers*days/(workers*2); return q(`${workers} workers finish a job in ${days} days. At the same rate, ${workers*2} workers need:`,` ${workers} श्रमिक कोई काम ${days} दिन में करते हैं। उसी दर से ${workers*2} श्रमिक कितने दिन लेंगे?`,[String(v),String(v+2),String(v+4),String(v-2)],0,'Quantitative Aptitude'); }
function seq(start,diff){ const a=[start,start+diff,start+2*diff,start+3*diff]; const v=start+4*diff; return q(`Find the next number: ${a.join(', ')}, ?`,`अगली संख्या ज्ञात करें: ${a.join(', ')}, ?`,[String(v),String(v+diff),String(v-diff),String(v+2*diff)],0,'Logical Reasoning'); }
function squareSeq(start){ const a=[start,start+3,start+8,start+15]; const v=start+24; return q(`Find the next number: ${a.join(', ')}, ?`,`अगली संख्या ज्ञात करें: ${a.join(', ')}, ?`,[String(v),String(v+2),String(v+4),String(v+6)],0,'Logical Reasoning'); }
function coding(word){ const out=[...word].map(c=>String.fromCharCode(c.charCodeAt(0)+1)).join(''); const opts=[out,out.slice(0,-1)+'X',out.split('').reverse().join(''),out.slice(0,1)+'X'+out.slice(2)]; return q(`If each letter is shifted one step forward, ${word} becomes:`,`यदि हर अक्षर को एक स्थान आगे किया जाए, तो ${word} बनेगा:`,opts,0,'Logical Reasoning'); }
function direction(x){ return q(`Riya walks ${x} metres north and then ${x/2} metres south. How far is she from the starting point?`,`रिया ${x} मीटर उत्तर और फिर ${x/2} मीटर दक्षिण चलती है। प्रारंभिक बिंदु से वह कितनी दूर है?`,[`${x/2} m`,`${x} m`,`${x*1.5} m`,`${x*2} m`],0,'Logical Reasoning'); }
function oddOne(){ return q('Which one is different from the others?','इनमें से अलग कौन है?',['Triangle','Square','Circle','Rectangle'],2,'Logical Reasoning'); }

const generated=[];
[120,180,240,320,450,560,720,840,950,1250].forEach((a,i)=>generated.push(pct(a,[10,15,20,25,30,40,50,12,18,22][i])));
[[14,22,30],[16,24,32],[21,27,33],[12,20,28],[18,30,42],[25,35,45],[32,40,48],[15,25,35]].forEach(x=>generated.push(average(...x)));
[[150,3],[240,4],[360,6],[280,4],[450,5],[600,8],[720,9],[525,7]].forEach(x=>generated.push(speed(...x)));
[[3,5,64],[2,3,75],[4,5,81],[3,7,100],[5,7,144],[4,9,104]].forEach(x=>generated.push(ratio(...x)));
[[1200,8,2],[1500,6,3],[2000,5,4],[2500,10,2],[1800,7,3],[3200,9,2]].forEach(x=>generated.push(si(...x)));
[[28,42],[36,48],[45,60],[54,72],[64,96],[75,105]].forEach(x=>generated.push(hcf(...x)));
[[6,15],[9,12],[10,25],[14,21],[16,24],[18,30]].forEach(x=>generated.push(lcm(...x)));
[[4,16],[6,18],[8,20],[10,15],[12,24],[15,18]].forEach(x=>generated.push(work(...x)));
[[4,3],[7,5],[11,4],[15,6],[22,7],[31,8],[40,9],[5,11],[18,4],[27,6]].forEach(x=>generated.push(seq(...x)));
[2,5,8,10,14,20,30,50].forEach(x=>generated.push(squareSeq(x)));
['CAT','DOG','BOOK','JAVA','QUIZ','CODE','MATH','LOGIC','TRAIN','APPLE'].forEach(c=>generated.push(coding(c)));
[20,30,40,50,60,80,100,120].forEach(x=>generated.push(direction(x)));
for(let i=0;i<8;i++) generated.push(oddOne());

module.exports = [...base, ...generated];
