(function(){
"use strict";
const $=id=>document.getElementById(id);
const STORAGE_KEY="jwnhLuckyDrawPwaV1";
let people=[],history=[],audit=[],excluded=new Set(),busy=false,audioCtx=null,firstPrizeName="Sal",adminNoRepeat=true,pending=null,musicTimer=null,musicStep=0;
let prizeOverrides={1:{enabled:true,name:"Sal"},2:{enabled:false,name:""},3:{enabled:false,name:""},4:{enabled:false,name:""},5:{enabled:false,name:""}};
const prizeNames={1:"1st Prize",2:"2nd Prize",3:"3rd Prize",4:"4th Prize",5:"5th Prize"};
const melody=[392,494,587,494,440,523,659,523,392,494,587,784,659,587,494,440];
function eligible(){return people.filter(n=>!excluded.has(n)&&(!$('noRepeat').checked||!history.some(h=>h.name===n)));}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function message(s){$('drawMessage').textContent=s;}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({people,history,audit,excluded:[...excluded],firstPrizeName,adminNoRepeat,prizeOverrides}));}catch(e){message("Could not save data in this browser. Export a backup.");}}
function load(){try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");people=Array.isArray(d.people)?d.people:[];history=Array.isArray(d.history)?d.history:[];audit=Array.isArray(d.audit)?d.audit:[];excluded=new Set(Array.isArray(d.excluded)?d.excluded:[]);firstPrizeName=d.firstPrizeName||"Sal";adminNoRepeat=d.adminNoRepeat!==false;
 if(d.prizeOverrides&&typeof d.prizeOverrides==="object"){
  [1,2,3,4,5].forEach(k=>{const v=d.prizeOverrides[k]||d.prizeOverrides[String(k)];if(v)prizeOverrides[k]={enabled:!!v.enabled,name:typeof v.name==="string"?v.name:""};});
 } else {prizeOverrides[1]={enabled:true,name:firstPrizeName};}
}catch(e){}}
function context(){const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return null;audioCtx=audioCtx||new Ctx();if(audioCtx.state==="suspended")audioCtx.resume();return audioCtx;}
function tone(freq,duration,when,type,gain){if(!$('soundEnabled').checked)return;try{const c=context();if(!c)return;const osc=c.createOscillator(),amp=c.createGain(),start=c.currentTime+(when||0);osc.type=type||"sine";osc.frequency.setValueAtTime(freq,start);amp.gain.setValueAtTime(.0001,start);amp.gain.exponentialRampToValueAtTime(gain||.06,start+.02);amp.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(amp);amp.connect(c.destination);osc.start(start);osc.stop(start+duration+.03);}catch(e){}}
function tick(){
 if(!$('soundEnabled').checked)return;
 try{
  const c=context();if(!c)return;const t=c.currentTime;
  // Two-part mechanical reel click with a short metallic spring tail.
  const o=c.createOscillator(),g=c.createGain(),f=c.createBiquadFilter();
  o.type="square";o.frequency.setValueAtTime(1850+Math.random()*650,t);
  o.frequency.exponentialRampToValueAtTime(430,t+.045);
  f.type="bandpass";f.frequency.setValueAtTime(2100,t);f.Q.value=1.8;
  g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.055,t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+.075);
  o.connect(f);f.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.08);
  const sub=c.createOscillator(),sg=c.createGain();sub.type="sine";sub.frequency.setValueAtTime(1250+Math.random()*350,t+.012);
  sg.gain.setValueAtTime(.0001,t+.012);sg.gain.exponentialRampToValueAtTime(.018,t+.016);sg.gain.exponentialRampToValueAtTime(.0001,t+.055);
  sub.connect(sg);sg.connect(c.destination);sub.start(t+.012);sub.stop(t+.06);
 }catch(e){}
}
function fanfare(){
 if(!$('soundEnabled').checked)return;
 // Original jackpot sequence: rising siren, bright bell cascade, then a full celebratory chord.
 try{
  const c=context();if(!c)return;const t=c.currentTime;
  const sweep=c.createOscillator(),sg=c.createGain();sweep.type="sawtooth";
  sweep.frequency.setValueAtTime(520,t);sweep.frequency.exponentialRampToValueAtTime(1560,t+.62);
  sg.gain.setValueAtTime(.0001,t);sg.gain.exponentialRampToValueAtTime(.045,t+.08);sg.gain.exponentialRampToValueAtTime(.0001,t+.72);
  sweep.connect(sg);sg.connect(c.destination);sweep.start(t);sweep.stop(t+.74);
 }catch(e){}
 [784,988,1175,1568,1976,2349].forEach((f,i)=>tone(f,.42,.48+i*.095,"sine",.09));
 [1047,1319,1568,2093,2637].forEach((f,i)=>tone(f,.72,1.18+i*.075,"triangle",.075));
 [523,659,784,1047].forEach(f=>tone(f,1.05,1.72,"sine",.065));
 // Sparkling high notes over the final chord.
 [2637,3136,3520].forEach((f,i)=>tone(f,.38,1.85+i*.12,"sine",.025));
}
function startMusic(){
 if(musicTimer)return;
 context();$('musicBtn').textContent="♫ Stop background music";
 // Original upbeat casino-show loop: bass pulse, chord stabs, rolling arpeggio and bell accents.
 const bass=[110,110,146.83,130.81,98,98,130.81,123.47];
 const arp=[659,784,988,1175,1319,1175,988,784,587,784,988,1175,1568,1319,1175,988];
 const chords=[[261.63,329.63,392],[293.66,369.99,440],[220,261.63,329.63],[246.94,311.13,369.99]];
 let step=0;
 musicTimer=setInterval(()=>{
  if(!$('musicEnabled').checked){stopMusic();return;}
  const c=context();if(!c)return;const t=c.currentTime;
  try{
   const f=arp[step%arp.length],b=bass[Math.floor(step/2)%bass.length];
   const note=c.createOscillator(),ng=c.createGain();note.type="triangle";note.frequency.setValueAtTime(f,t);
   ng.gain.setValueAtTime(.0001,t);ng.gain.exponentialRampToValueAtTime(.022,t+.008);ng.gain.exponentialRampToValueAtTime(.0001,t+.17);
   note.connect(ng);ng.connect(c.destination);note.start(t);note.stop(t+.18);
   if(step%2===0){
    const bo=c.createOscillator(),bg=c.createGain();bo.type="sawtooth";bo.frequency.setValueAtTime(b,t);
    bg.gain.setValueAtTime(.0001,t);bg.gain.exponentialRampToValueAtTime(.028,t+.012);bg.gain.exponentialRampToValueAtTime(.0001,t+.24);
    bo.connect(bg);bg.connect(c.destination);bo.start(t);bo.stop(t+.25);
   }
   if(step%4===0){
    const chord=chords[Math.floor(step/4)%chords.length];
    chord.forEach((hz,j)=>{const co=c.createOscillator(),cg=c.createGain();co.type="sine";co.frequency.setValueAtTime(hz,t);
     cg.gain.setValueAtTime(.0001,t);cg.gain.exponentialRampToValueAtTime(.009,t+.015);cg.gain.exponentialRampToValueAtTime(.0001,t+.31);
     co.connect(cg);cg.connect(c.destination);co.start(t);co.stop(t+.32);});
   }
   if(step%2===1){
    const bell=c.createOscillator(),bg=c.createGain();bell.type="sine";bell.frequency.setValueAtTime(1760+(step%4)*220,t);
    bg.gain.setValueAtTime(.0001,t);bg.gain.exponentialRampToValueAtTime(.014,t+.004);bg.gain.exponentialRampToValueAtTime(.0001,t+.14);
    bell.connect(bg);bg.connect(c.destination);bell.start(t);bell.stop(t+.15);
   }
   step++;
  }catch(e){}
 },145);
}
function stopMusic(){if(musicTimer){clearInterval(musicTimer);musicTimer=null;}$('musicBtn').textContent="♫ Start background music";}
function download(filename,content,type){const a=document.createElement('a'),url=URL.createObjectURL(new Blob([content],{type:type||'text/csv;charset=utf-8'}));a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function log(action,details){audit.push({action,details,time:new Date().toLocaleString()});}
function renderPrizeAdminControls(){
 const host=$('prizeAdminControls');if(!host)return;
 host.innerHTML=[5,4,3,2,1].map(k=>{
  const cfg=prizeOverrides[k]||{enabled:false,name:""};
  const options=people.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join('');
  return '<div class="card" style="padding:12px;margin:10px 0;border-radius:10px"><div class="row" style="padding-top:0"><b>'+prizeNames[k]+'</b><button type="button" data-override-toggle="'+k+'">'+(cfg.enabled?'Disable':'Enable')+'</button></div><label>Preselected participant<select data-override-name="'+k+'" '+(!cfg.enabled?'disabled':'')+'><option value="">Select participant</option>'+options+'</select></label><div class="muted">'+(cfg.enabled?'Preselected winner is enabled for this prize.':'Disabled — this prize will use random selection.')+'</div></div>';
 }).join('');
 [1,2,3,4,5].forEach(k=>{const sel=host.querySelector('[data-override-name="'+k+'"]');if(sel)sel.value=(prizeOverrides[k]&&prizeOverrides[k].name)||'';});
}
function render(){
 $('participantCount').textContent=people.length;$('eligibleCount').textContent=eligible().length;$('winnerCount').textContent=history.length;
 $('peopleList').innerHTML=people.length?people.map((n,i)=>'<div class="row"><span>'+(i+1)+'. '+esc(n)+(excluded.has(n)?' <span class="pill">Excluded</span>':'')+'</span><button data-person="'+esc(n)+'">'+(excluded.has(n)?'Include':'Exclude')+'</button></div>').join(''):'No participants added.';
 renderPrizeAdminControls();
 $('adminNoRepeat').checked=adminNoRepeat;
 $('historyList').innerHTML=history.length?[...history].reverse().map(h=>'<div class="row"><div><b>'+esc(h.name)+'</b><div class="muted">'+esc(h.prize)+' · '+esc(h.time)+'</div></div></div>').join(''):'No records yet.';
 $('latest').innerHTML=history.length?[...history].reverse().slice(0,5).map(h=>'<div class="row"><b>'+esc(h.name)+'</b><span class="muted">'+esc(h.prize)+'</span></div>').join(''):'No winners yet.';
}
function setTab(tab){document.querySelectorAll('[data-tab]').forEach(b=>b.classList.toggle('active',b.dataset.tab===tab));['draw','people','admin','history'].forEach(id=>$(id).classList.toggle('hidden',id!==tab));}
document.querySelectorAll('[data-tab]').forEach(b=>b.addEventListener('click',()=>setTab(b.dataset.tab)));
// Admin settings are intentionally hidden from the main navigation. Open with Ctrl+Shift+A, or click the title five times.
let titleTapCount=0,titleTapReset=null;
document.addEventListener('keydown',e=>{if(e.ctrlKey&&e.shiftKey&&e.key.toLowerCase()==='a'){e.preventDefault();setTab('admin');}});
$('appTitle').addEventListener('click',()=>{titleTapCount++;clearTimeout(titleTapReset);titleTapReset=setTimeout(()=>titleTapCount=0,1800);if(titleTapCount>=5){titleTapCount=0;setTab('admin');message('');}});
$('closeAdminBtn').addEventListener('click',()=>setTab('draw'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('admin').classList.contains('hidden'))setTab('draw');});
function showConfetti(){const layer=$('confetti');layer.innerHTML='';for(let i=0;i<90;i++){const p=document.createElement('i');p.textContent=['✦','●','■','★'][i%4];p.style.left=Math.random()*100+'%';p.style.animationDelay=(Math.random()*.9)+'s';p.style.setProperty('--drift',(Math.random()*180-90)+'px');layer.appendChild(p);}layer.classList.remove('hidden');setTimeout(()=>layer.classList.add('hidden'),4200);}
function animateReveal(names,prize){busy=true;$('drawBtn').disabled=true;$('prizeLabel').textContent=prizeNames[prize];$('winnerDisplay').classList.remove('winner-pop');$('winnerDisplay').textContent='GET READY!';let pool=eligible();if(!pool.length)pool=people;let elapsed=0;const duration=3600;return new Promise(resolve=>{function frame(){const progress=elapsed/duration;const wait=70+Math.pow(progress,2)*270;$('winnerDisplay').textContent=pool.length?pool[Math.floor(Math.random()*pool.length)]:'—';tick();elapsed+=wait;if(elapsed<duration){setTimeout(frame,wait);}else{$('winnerDisplay').textContent=names.join('  •  ');$('winnerDisplay').classList.add('winner-pop');fanfare();showConfetti();busy=false;$('drawBtn').disabled=false;resolve();}}frame();});}
function poolFor(prize,qty,avoid=[]){
 const currentPrize=Number(prize);
 const reserved=new Set([1,2,3,4,5]
  .filter(k=>k!==currentPrize)
  .map(k=>prizeOverrides[k])
  .filter(cfg=>cfg&&cfg.enabled&&cfg.name)
  .map(cfg=>cfg.name));
 let pool=eligible().filter(n=>!avoid.includes(n)&&!reserved.has(n));
 const cfg=prizeOverrides[currentPrize]||{enabled:false,name:""};
 if(cfg.enabled){
  const selected=cfg.name;
  if(!selected)throw Error('Select a preselected participant for '+prizeNames[prize]+' or disable preselection in Admin Settings.');
  if(!people.includes(selected))throw Error('The selected recipient is not on the participant list.');
  if(excluded.has(selected))throw Error('The selected recipient is excluded. Include them in Participants first.');
  if(adminNoRepeat&&history.some(h=>h.name===selected))throw Error('That person has already won. The no-repeat rule is enabled.');
  const picked=[selected];
  if(qty>1){const rest=pool.filter(n=>n!==selected);if(rest.length<qty-1)throw Error('Not enough eligible participants for this draw.');while(picked.length<qty)picked.push(rest.splice(Math.floor(Math.random()*rest.length),1)[0]);}
  return {picked,method:'ORGANISER-SELECTED'};
 }
 if(pool.length<qty)throw Error('Not enough eligible participants for this draw.');
 const picked=[],available=[...pool];for(let i=0;i<qty;i++)picked.push(available.splice(Math.floor(Math.random()*available.length),1)[0]);
 return {picked,method:'RANDOM'};
}
async function beginDraw(isRetry){if(busy)return;let prize=$('prizeSelect').value,qty=Number($('winnerQty').value),result;try{if(isRetry&&pending&&prize===pending.prize&&pending.method==='ORGANISER-SELECTED'){result={picked:pending.picked,method:pending.method};}else result=poolFor(prize,qty,isRetry&&pending?pending.picked:[]);}catch(e){message(e.message);return;}
 pending={prize,prizeLabel:prizeNames[prize],picked:result.picked,method:result.method,drawId:pending&&isRetry?pending.drawId:Date.now()+'-'+Math.random().toString(36).slice(2)};
 await animateReveal(pending.picked,prize);log('WINNER REVEALED',pending.prizeLabel+' · '+pending.picked.join(', ')+' · '+pending.method);save();$('confirmNames').textContent=pending.picked.join(' · ');$('confirmPrize').textContent=pending.prizeLabel;$('retryBtn').textContent=prize==='1'?'Reveal Again':'Try Again';$('confirmModal').classList.remove('hidden');message('Winner revealed. Confirm the result or try again.');}
$('addNames').addEventListener('click',()=>{const arr=$('nameInput').value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);let added=0;arr.forEach(n=>{if(!people.some(p=>p.toLowerCase()===n.toLowerCase())){people.push(n);added++;}});$('nameInput').value='';render();save();message(added+' participant(s) added.');});
$('importBtn').addEventListener('click',()=>$('fileInput').click());
$('fileInput').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;const txt=await f.text(),arr=txt.split(/\r?\n/).map(line=>line.split(',')[0].replace(/^"|"$/g,'').trim()).filter(Boolean);let added=0;arr.forEach(n=>{if(!people.some(p=>p.toLowerCase()===n.toLowerCase())){people.push(n);added++;}});render();save();message(added+' participant(s) imported.');e.target.value='';});
$('peopleList').addEventListener('click',e=>{const n=e.target.dataset.person;if(!n)return;if(excluded.has(n))excluded.delete(n);else excluded.add(n);render();save();});
$('clearPeople').addEventListener('click',()=>{if(confirm('Clear all participant names?')){people=[];excluded.clear();render();save();}});
$('exportPeople').addEventListener('click',()=>download('JWNH_participants.csv','Name\n'+people.map(n=>'"'+n.replace(/"/g,'""')+'"').join('\n')));
$('noRepeat').addEventListener('change',render);
$('soundTest').addEventListener('click',()=>{fanfare();message('Dramatic sound test played. Check device volume if silent.');});
$('musicBtn').addEventListener('click',()=>musicTimer?stopMusic():startMusic());
$('musicEnabled').addEventListener('change',()=>{if(!$('musicEnabled').checked)stopMusic();});
$('presentationBtn').addEventListener('click',()=>{document.body.classList.toggle('presenting');$('presentationBtn').textContent=document.body.classList.contains('presenting')?'Exit presentation view':'Presentation view';});
// In presentation view, clicking anywhere on the screen starts the current prize draw.
// Keep the exit control and winner-confirmation dialog interactive without triggering an extra draw.
document.addEventListener('click',e=>{
 if(!document.body.classList.contains('presenting'))return;
 if(e.target.closest('#presentationBtn, #confirmModal'))return;
 if(busy||pending||!$('confirmModal').classList.contains('hidden'))return;
 if(!$('draw').classList.contains('hidden'))beginDraw(false);
});

$('prizeAdminControls').addEventListener('click',e=>{const k=Number(e.target.dataset.overrideToggle);if(!k)return;const cfg=prizeOverrides[k]||{enabled:false,name:""};cfg.enabled=!cfg.enabled;prizeOverrides[k]=cfg;save();renderPrizeAdminControls();});
$('prizeAdminControls').addEventListener('change',e=>{const k=Number(e.target.dataset.overrideName);if(!k)return;prizeOverrides[k]=prizeOverrides[k]||{enabled:false,name:""};prizeOverrides[k].name=e.target.value;if(k===1)firstPrizeName=e.target.value;save();});
$('adminNoRepeat').addEventListener('change',()=>{adminNoRepeat=$('adminNoRepeat').checked;save();});
$('drawBtn').addEventListener('click',()=>beginDraw(false));
$('retryBtn').addEventListener('click',()=>{if(pending){log('REDRAW REQUESTED',pending.prizeLabel+' · previous reveal: '+pending.picked.join(', '));save();$('confirmModal').classList.add('hidden');beginDraw(true);}});
$('nextPrizeBtn').addEventListener('click',()=>{if(!pending)return;const completedPrize=Number(pending.prize);pending.picked.forEach(name=>history.push({name,prize:pending.prizeLabel,method:pending.method,time:new Date().toLocaleString(),drawId:pending.drawId}));log('WINNER CONFIRMED',pending.prizeLabel+' · '+pending.picked.join(', ')+' · '+pending.method);$('confirmModal').classList.add('hidden');$('winnerDisplay').textContent=pending.picked.join('  •  ');pending=null;render();save();if(completedPrize>1){$('prizeSelect').value=String(completedPrize-1);$('prizeSelect').dispatchEvent(new Event('change'));message('Winner confirmed. Next up: '+prizeNames[completedPrize-1]+'.');$('drawMessage').textContent='Winner confirmed. Ready for '+prizeNames[completedPrize-1]+'.';}else{$('drawMessage').textContent='All five main prizes have been drawn. Congratulations!';$('nextPrizeBtn').textContent='Finish Draw';message('All five main prizes have been drawn.');}});
$('prizeSelect').addEventListener('change',()=>{$('prizeLabel').textContent=prizeNames[$('prizeSelect').value];$('winnerQty').disabled=$('prizeSelect').value==='1';if($('prizeSelect').value==='1')$('winnerQty').value='1';$('nextPrizeBtn').textContent='Next Prize';});
$('restartBtn').addEventListener('click',()=>{if(busy)return;if(!confirm('Restart the lucky draw? This will clear all confirmed winners and reset the prize order to 5th Prize. Your participant list and admin settings will be kept.'))return;const cleared=history.length;history=[];pending=null;$('confirmModal').classList.add('hidden');$('prizeSelect').value='5';$('prizeSelect').dispatchEvent(new Event('change'));$('nextPrizeBtn').textContent='Next Prize';$('winnerDisplay').textContent='GOOD LUCK!';$('winnerDisplay').classList.remove('winner-pop');$('drawMessage').textContent='Ready to restart from 5th Prize.';log('DRAW RESTARTED','Cleared '+cleared+' confirmed winner record(s); prize order reset to 5th Prize. Participant list and settings retained.');render();save();message('Draw restarted. Starting again from 5th Prize.');});
$('undoBtn').addEventListener('click',()=>{if(!history.length){message('There is no confirmed draw to undo.');return;}const last=history[history.length-1],id=last.drawId;const removed=id?history.filter(h=>h.drawId===id):[last];history=id?history.filter(h=>h.drawId!==id):history.slice(0,-1);log('UNDO DRAW',last.prize+' · removed '+removed.map(h=>h.name).join(', '));render();save();message('Last confirmed draw undone.');});
$('exportHistory').addEventListener('click',()=>{const rows=[['Name','Prize','Time'],...history.map(h=>[h.name,h.prize,h.time])];download('JWNH_winner_history.csv',rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n'));});
$('resetHistory').addEventListener('click',()=>{if(confirm('Clear all winner records?')){history=[];log('HISTORY RESET','All winner history cleared');$('winnerDisplay').textContent='GOOD LUCK!';render();save();message('History reset.');}});
$('backupBtn').addEventListener('click',()=>download('JWNH_Lucky_Draw_Backup.json',JSON.stringify({people,history,audit,excluded:[...excluded],firstPrizeName,adminNoRepeat,prizeOverrides},null,2),'application/json'));
$('restoreBtn').addEventListener('click',()=>$('backupFile').click());
$('backupFile').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.people)||!Array.isArray(d.history))throw new Error('Invalid backup');people=d.people;history=d.history;audit=Array.isArray(d.audit)?d.audit:[];excluded=new Set(d.excluded||[]);firstPrizeName=d.firstPrizeName||'Sal';adminNoRepeat=d.adminNoRepeat!==false;
 prizeOverrides=d.prizeOverrides&&typeof d.prizeOverrides==='object'?d.prizeOverrides:{1:{enabled:true,name:firstPrizeName},2:{enabled:false,name:''},3:{enabled:false,name:''},4:{enabled:false,name:''},5:{enabled:false,name:''}};
 [1,2,3,4,5].forEach(k=>{if(!prizeOverrides[k])prizeOverrides[k]={enabled:false,name:''};});render();save();message('Backup restored.');}catch(err){alert('Could not restore this backup file.');}e.target.value='';});
let installPrompt=null;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('installBtn').classList.remove('hidden');});$('installBtn').addEventListener('click',async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('installBtn').classList.add('hidden');});
load();render();if('serviceWorker'in navigator&&location.protocol!=='file:'){window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));}
})();
