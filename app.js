(function(){
"use strict";
const $=id=>document.getElementById(id);
const STORAGE_KEY="jwnhLuckyDrawPwaV1";
let people=[],history=[],excluded=new Set(),busy=false,audioCtx=null,firstPrizeName="Sal",adminNoRepeat=true;
const prizeNames={1:"1st Prize",2:"2nd Prize",3:"3rd Prize",4:"4th Prize",5:"5th Prize"};
function eligible(){return people.filter(n=>!excluded.has(n)&&(!$("noRepeat").checked||!history.some(h=>h.name===n)));}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function message(s){$("drawMessage").textContent=s;}
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify({people,history,excluded:[...excluded],firstPrizeName,adminNoRepeat}));}catch(e){message("Could not save data in this browser. Export a backup.");}}
function load(){try{const d=JSON.parse(localStorage.getItem(STORAGE_KEY)||"{}");people=Array.isArray(d.people)?d.people:[];history=Array.isArray(d.history)?d.history:[];excluded=new Set(Array.isArray(d.excluded)?d.excluded:[]);firstPrizeName=d.firstPrizeName||"Sal";adminNoRepeat=d.adminNoRepeat!==false;}catch(e){}}
function soundTone(freq,duration,when,type,gain){if(!$("soundEnabled").checked)return;try{const Ctx=window.AudioContext||window.webkitAudioContext;if(!Ctx)return;audioCtx=audioCtx||new Ctx();if(audioCtx.state==="suspended")audioCtx.resume();const osc=audioCtx.createOscillator(),amp=audioCtx.createGain(),start=audioCtx.currentTime+(when||0);osc.type=type||"sine";osc.frequency.setValueAtTime(freq,start);amp.gain.setValueAtTime(.0001,start);amp.gain.exponentialRampToValueAtTime(gain||.07,start+.015);amp.gain.exponentialRampToValueAtTime(.0001,start+duration);osc.connect(amp);amp.connect(audioCtx.destination);osc.start(start);osc.stop(start+duration+.03);}catch(e){}}
function spinSound(){soundTone(520,.09,0,"triangle",.04);soundTone(680,.09,.1,"triangle",.04);}
function winSound(){[523,659,784,1047].forEach((f,i)=>soundTone(f,.3,i*.13,"sine",.085));}
function download(filename,content,type){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([content],{type:type||"text/csv;charset=utf-8"}));a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function render(){
 $("participantCount").textContent=people.length;$("eligibleCount").textContent=eligible().length;$("winnerCount").textContent=history.length;
 $("peopleList").innerHTML=people.length?people.map((n,i)=>'<div class="row"><span>'+(i+1)+'. '+esc(n)+(excluded.has(n)?' <span class="pill">Excluded</span>':'')+'</span><button data-person="'+esc(n)+'">'+(excluded.has(n)?"Include":"Exclude")+'</button></div>').join(""):"No participants added.";
 $("firstPrizeName").innerHTML=people.map(n=>'<option value="'+esc(n)+'">'+esc(n)+'</option>').join("");
 if(people.includes(firstPrizeName))$("firstPrizeName").value=firstPrizeName;else if(people.some(n=>n.toLowerCase()==="sal")){$("firstPrizeName").value=people.find(n=>n.toLowerCase()==="sal");firstPrizeName=$("firstPrizeName").value;}
 $("adminNoRepeat").checked=adminNoRepeat;
 $("historyList").innerHTML=history.length?[...history].reverse().map(h=>'<div class="row"><div><b>'+esc(h.name)+'</b><div class="muted">'+esc(h.prize)+' · '+esc(h.method)+' · '+esc(h.time)+'</div></div></div>').join(""):"No records yet.";
 $("latest").innerHTML=history.length?[...history].reverse().slice(0,5).map(h=>'<div class="row"><b>'+esc(h.name)+'</b><span class="muted">'+esc(h.prize)+'</span></div>').join(""):"No winners yet.";
}
function setTab(tab){document.querySelectorAll("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));["draw","people","admin","history"].forEach(id=>$(id).classList.toggle("hidden",id!==tab));}
document.querySelectorAll("[data-tab]").forEach(b=>b.addEventListener("click",()=>setTab(b.dataset.tab)));
$("addNames").addEventListener("click",()=>{const arr=$("nameInput").value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean);let added=0;arr.forEach(n=>{if(!people.some(p=>p.toLowerCase()===n.toLowerCase())){people.push(n);added++;}});$("nameInput").value="";render();save();message(added+" participant(s) added.");});
$("importBtn").addEventListener("click",()=>$("fileInput").click());
$("fileInput").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;const txt=await f.text(),arr=txt.split(/\r?\n/).map(line=>line.split(",")[0].replace(/^"|"$/g,"").trim()).filter(Boolean);let added=0;arr.forEach(n=>{if(!people.some(p=>p.toLowerCase()===n.toLowerCase())){people.push(n);added++;}});render();save();message(added+" participant(s) imported.");e.target.value="";});
$("peopleList").addEventListener("click",e=>{const n=e.target.dataset.person;if(!n)return;if(excluded.has(n))excluded.delete(n);else excluded.add(n);render();save();});
$("clearPeople").addEventListener("click",()=>{if(confirm("Clear all participant names?")){people=[];excluded.clear();render();save();}});
$("exportPeople").addEventListener("click",()=>download("JWNH_participants.csv","Name\n"+people.map(n=>'"'+n.replace(/"/g,'""')+'"').join("\n")));
$("noRepeat").addEventListener("change",render);
$("soundTest").addEventListener("click",()=>{winSound();message("Sound test played. Check device volume if silent.");});
$("presentationBtn").addEventListener("click",()=>{document.body.classList.toggle("presenting");$("presentationBtn").textContent=document.body.classList.contains("presenting")?"Exit presentation view":"Presentation view";});
$("firstPrizeName").addEventListener("change",()=>{firstPrizeName=$("firstPrizeName").value;save();});
$("adminNoRepeat").addEventListener("change",()=>{adminNoRepeat=$("adminNoRepeat").checked;save();});
$("drawBtn").addEventListener("click",async()=>{
 if(busy)return;const prize=$("prizeSelect").value,qty=Number($("winnerQty").value);let pool=eligible(),picked=[],method="RANDOM";
 if(prize==="1"){const selected=$("firstPrizeName").value;if(!selected){message("Add participants and select the 1st Prize recipient in Admin Settings.");return;}if(!people.includes(selected)){message("The selected recipient is not on the participant list.");return;}if(adminNoRepeat&&history.some(h=>h.name===selected)){message("That person has already won. The no-repeat rule is enabled.");return;}if(excluded.has(selected)){message("The selected recipient is excluded. Include them in Participants first.");return;}picked=[selected];method="ORGANISER-SELECTED";}
 else{if(pool.length<qty){message("Not enough eligible participants for this draw.");return;}let available=[...pool];for(let i=0;i<qty;i++){const index=Math.floor(Math.random()*available.length);picked.push(available.splice(index,1)[0]);}}
 busy=true;$("drawBtn").disabled=true;const start=Date.now();while(Date.now()-start<1500){$("winnerDisplay").textContent=pool.length?pool[Math.floor(Math.random()*pool.length)]:"";spinSound();await new Promise(r=>setTimeout(r,220));}
 $("winnerDisplay").textContent=picked.join(" · ");$("prizeLabel").textContent=prizeNames[prize];picked.forEach(name=>history.push({name,prize:prizeNames[prize],method,time:new Date().toLocaleString()}));winSound();message("Winner revealed!");render();save();busy=false;$("drawBtn").disabled=false;
});
$("exportHistory").addEventListener("click",()=>{const rows=[["Name","Prize","Method","Time"],...history.map(h=>[h.name,h.prize,h.method,h.time])];download("JWNH_winner_history.csv",rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(",")).join("\n"));});
$("resetHistory").addEventListener("click",()=>{if(confirm("Clear all winner records?")){history=[];$("winnerDisplay").textContent="GOOD LUCK!";render();save();message("History reset.");}});
$("prizeSelect").addEventListener("change",()=>{$("prizeLabel").textContent=prizeNames[$("prizeSelect").value];$("winnerQty").disabled=$("prizeSelect").value==="1";if($("prizeSelect").value==="1")$("winnerQty").value="1";});
$("backupBtn").addEventListener("click",()=>download("JWNH_Lucky_Draw_Backup.json",JSON.stringify({people,history,excluded:[...excluded],firstPrizeName,adminNoRepeat},null,2),"application/json"));
$("restoreBtn").addEventListener("click",()=>$("backupFile").click());
$("backupFile").addEventListener("change",async e=>{const f=e.target.files[0];if(!f)return;try{const d=JSON.parse(await f.text());if(!Array.isArray(d.people)||!Array.isArray(d.history))throw new Error("Invalid backup");people=d.people;history=d.history;excluded=new Set(d.excluded||[]);firstPrizeName=d.firstPrizeName||"Sal";adminNoRepeat=d.adminNoRepeat!==false;render();save();message("Backup restored.");}catch(err){alert("Could not restore this backup file.");}e.target.value="";});
let installPrompt=null;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installPrompt=e;$("installBtn").classList.remove("hidden");});
$("installBtn").addEventListener("click",async()=>{if(!installPrompt)return;installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$("installBtn").classList.add("hidden");});
load();render();
if("serviceWorker" in navigator && location.protocol!=="file:"){window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));}
})();