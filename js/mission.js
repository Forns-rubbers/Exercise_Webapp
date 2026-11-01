import { getMyProfile, requireUser } from "./auth.js";

const user = await requireUser();
const { data: profile } = user ? await getMyProfile() : { data: null };
const avatar = document.querySelector(".avatar");
const username = document.querySelector(".who b");
const characterImage = {
  Tomato: "media/img/tomato.png", Cheese: "media/img/cheese.png",
  Vegetable: "media/img/vegetable.png", Watermelon: "media/img/watermelon.png",
  Blue: "media/img/blue.png", Avocado: "media/img/avocado.png", Banana: "media/img/banana.png",
};
if (username) username.textContent = profile?.username || user?.user_metadata?.username || localStorage.getItem("fitzUsername") || "";
if (avatar) {
  const selectedCharacter = profile?.selected_character || localStorage.getItem("fitzCharacter");
  if (characterImage[selectedCharacter]) {
    const image = document.createElement("img");
    image.src = characterImage[selectedCharacter];
    image.alt = selectedCharacter;
    image.style.cssText = "width:100%;height:100%;object-fit:contain;border-radius:50%";
    avatar.replaceChildren(image);
  }
}

const M=[
["TU Native","เดินออกกำลังกายอย่างน้อย 20 นาที","👣"],["Morning Stretch","ยืดเหยียดร่างกายอย่างน้อย 10 นาที","🧘"],
["Team Player","เล่นกีฬาอะไรก็ได้กับเพื่อน อย่างน้อย 30 นาที","⚽"],["Stair Master","เดินขึ้นบันไดแทนลิฟต์ อย่างน้อย 5 ชั้น","🪜"],
["Jump Start","กระโดดเชือกอย่างน้อย 5 นาที","🪢"],["Push It","วิดพื้นสะสมอย่างน้อย 20 ครั้ง","💪"],
["Cardio Day","วิ่งเหยาะๆ อย่างน้อย 15 นาที","🏃"],["Plank Time","แพลงก์รวมอย่างน้อย 3 นาที","🧱"],
["Bike Ride","ปั่นจักรยานอย่างน้อย 30 นาที","🚴"],["Squat Up","สควอทอย่างน้อย 30 ครั้ง","🦵"],
["Dance Party","เต้นออกกำลังกายอย่างน้อย 15 นาที","💃"],["Swim Fun","ว่ายน้ำอย่างน้อย 20 นาที","🏊"],
["Core Power","ทำท่าซิทอัพอย่างน้อย 30 ครั้ง","🔥"],["Park Walk","เดินเล่นที่สวนสาธารณะ 30 นาที","🌳"],
["Yoga Flow","เล่นโยคะอย่างน้อย 20 นาที","🧘"],["Badminton","เล่นแบดมินตันกับเพื่อน 30 นาที","🏸"],
["Run 3K","วิ่งให้ครบ 3 กิโลเมตร","🏅"],["Lunge Walk","ทำท่า Lunge อย่างน้อย 20 ครั้ง","🚶"],
["Hydrate","ดื่มน้ำให้ครบ 8 แก้ว พร้อมออกกำลังกาย 10 นาที","💧"],["Basketball","เล่นบาสเกตบอลอย่างน้อย 30 นาที","🏀"],
["Burpee Boss","เบอร์พีอย่างน้อย 15 ครั้ง","⚡"],["Night Walk","เดินตอนเย็นอย่างน้อย 30 นาที","🌙"],
["Football","เตะฟุตบอลกับเพื่อนอย่างน้อย 30 นาที","⚽"],["HIIT","ออกกำลังกายแบบ HIIT อย่างน้อย 15 นาที","🔥"],
["Table Tennis","เล่นปิงปองอย่างน้อย 30 นาที","🏓"],["Hill Climb","เดินขึ้นเนินหรือสะพานลอย 10 นาที","⛰️"],
["Volleyball","เล่นวอลเลย์บอลอย่างน้อย 30 นาที","🏐"],["Run 5K","วิ่งให้ครบ 5 กิโลเมตร","🏆"],
["Active Friends","ชวนเพื่อนออกกำลังกายด้วยกัน 45 นาที","🤝"],["Champion","ออกกำลังกายต่อเนื่องอย่างน้อย 60 นาที","👑"]];
const N=M.length;
let cur=1,sel=0,fileUrl=null;
try{cur=Math.min(N,parseInt(localStorage.getItem('fitzCur'))||1)}catch(e){}
const $=id=>document.getElementById(id);
$('pattern').textContent=("🥑🍌🍅🍉🥦🍕⭐").repeat(400);
function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',1800)}
function pos(i,W){const j=[0,.01,.02,-.01,.015][i%5];return{x:W*(i%2===0?.24+j:.73+j),y:110+i*118}}
function draw(){
  const map=$('map'),W=map.clientWidth,H=110+N*118+40;
  map.style.height=H+'px';
  const svg=$('lines');svg.setAttribute('viewBox',`0 0 ${W} ${H}`);svg.style.height=H+'px';
  let s='';
  for(let i=0;i<N-1;i++){const a=pos(i,W),b=pos(i+1,W);
    s+=`<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}" stroke="${i+1<cur?'#13a557':'#ff9300'}" stroke-width="22" stroke-linecap="round"/>`}
  svg.innerHTML=s;
  map.querySelectorAll('.node').forEach(n=>n.remove());
  for(let i=0;i<N;i++){const p=pos(i,W),n=i+1,b=document.createElement('button');
    b.className='node'+(n<=cur?' cur':'')+(n>cur?' lock':'');
    if(n<cur){b.classList.remove('cur');b.style.cssText+=';border-color:#13a557;background:radial-gradient(circle at 35% 30%,#7dffb0,#21e87c);color:#0e9f4f'}
    b.style.left=p.x+'px';b.style.top=p.y+'px';b.textContent=n;
    b.onclick=()=>openCard(n);$('map').appendChild(b)}
}
function openCard(n){
  if(n>cur){toast('🔒 ต้องผ่านด่าน '+(n-1)+' ก่อน');return}
  sel=n;const m=M[n-1];
  $('card').innerHTML=`<div class="top"><span class="no">${String(n).padStart(2,'0')}</span><span class="ic">${m[2]}</span><span style="width:42px"></span></div>
  <div class="in"><h2>${m[0]}</h2><p>ภารกิจ : ${m[1]}</p><button class="btn go" id="start">เริ่ม</button></div>`;
  $('modalBg').classList.add('show');
  $('start').onclick=startMission;
}
$('modalBg').onclick=e=>{if(e.target.id==='modalBg')$('modalBg').classList.remove('show')};
function resetUp(){
  fileUrl&&URL.revokeObjectURL(fileUrl);fileUrl=null;$('file').value='';
  $('drop').innerHTML='<div class="plus">+</div><div>เพิ่มรูปภาพ/คลิปวิดิโอ</div>';
  $('send').disabled=true;$('send').textContent='ส่งหลักฐานเพื่อตรวจสอบ';
}
function startMission(){
  $('modalBg').classList.remove('show');resetUp();
  $('umission').innerHTML='ภารกิจ : '+M[sel-1][1].replace(/ อย่างน้อย/,'<br>อย่างน้อย');
  $('up').classList.add('show');
}
$('back').onclick=()=>$('up').classList.remove('show');
$('drop').onclick=()=>$('file').click();
$('file').onchange=e=>{
  const f=e.target.files[0];if(!f)return;
  fileUrl&&URL.revokeObjectURL(fileUrl);fileUrl=URL.createObjectURL(f);
  $('drop').innerHTML=f.type.startsWith('video')?`<video src="${fileUrl}" controls playsinline></video>`:`<img src="${fileUrl}" alt="หลักฐาน">`;
  $('send').disabled=false;
};
$('send').onclick=()=>{
  $('send').disabled=true;$('send').textContent='กำลังส่ง...';
  setTimeout(()=>{
    if(sel===cur&&cur<N){cur++;try{localStorage.setItem('fitzCur',cur)}catch(e){}}
    $('up').classList.remove('show');draw();toast('✅ ส่งหลักฐานแล้ว รอการตรวจสอบ');
    const y=pos(Math.min(cur,N)-1,$('map').clientWidth).y;$('scroll').scrollTo({top:y-200,behavior:'smooth'});
  },900);
};
addEventListener('resize',draw);draw();
$('scroll').scrollTop=Math.max(0,pos(cur-1,$('map').clientWidth).y-250);
