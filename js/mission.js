import { getMyProfile, requireUser, signOut } from "./auth.js";
import * as auth from "./auth.js";

const user = await requireUser();
const { data: profile } = user ? await getMyProfile() : { data: null };
const avatar = document.querySelector(".avatar");
const username = document.querySelector(".who b");
const settingsBg = document.getElementById("settingsBg");
document.querySelector(".gear").addEventListener("click", () => {
  settingsBg.classList.add("show");
  settingsBg.setAttribute("aria-hidden", "false");
});
document.getElementById("closeSettings").addEventListener("click", () => {
  settingsBg.classList.remove("show");
  settingsBg.setAttribute("aria-hidden", "true");
});
settingsBg.addEventListener("click", (event) => {
  if (event.target === settingsBg) {
    settingsBg.classList.remove("show");
    settingsBg.setAttribute("aria-hidden", "true");
  }
});
document.getElementById("logout").addEventListener("click", signOut);
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

/* ---------- Supabase ----------
   ใช้ client ตัวเดียวกับ auth.js ถ้ามีการ export ไว้ (supabase / sb / client)
   ถ้าไม่มี ใช้ window.sb ที่สร้างไว้ใน mission.html */
const sb = auth.supabase || auth.sb || auth.client || auth.supabaseClient || window.sb;
const levelStatuses = new Map();
if (sb && user) sb.rpc('record_user_visit').then(({error}) => { if (error) console.warn(error.message); });
document.querySelectorAll('nav button')[0].onclick=()=>location.href='ranking.html';
document.querySelectorAll('nav button')[2].onclick=()=>location.href='ranking.html';
const leaderboardLink=document.createElement('a');
leaderboardLink.href='ranking.html'; leaderboardLink.textContent='🏆 Ranking';
leaderboardLink.style.cssText='display:block;text-align:center;padding:12px;margin:10px 0;background:#00d4b1;color:#07213c;border-radius:12px;text-decoration:none;font-weight:bold';
document.querySelector('#settingsSidebar').append(leaderboardLink);
if(user){
  const {data:roleData}=await sb.from('profiles').select('role').eq('id',user.id).maybeSingle();
  if(roleData?.role==='admin'){const link=document.createElement('a');link.href='admin.html';link.textContent='Admin dashboard';link.style.cssText=leaderboardLink.style.cssText;document.querySelector('#settingsSidebar').append(link);}
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
let cur=1,sel=0,fileUrl=null,selectedFile=null;
try{cur=Math.min(N,parseInt(localStorage.getItem('fitzCur'))||1)}catch(e){}
const $=id=>document.getElementById(id);
$('pattern').textContent=("🥑🍌🍅🍉🥦🍕⭐").repeat(400);
function toast(t,ms=1800){const e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toast.t);toast.t=setTimeout(()=>e.style.display='none',ms)}
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
    const status=levelStatuses.get(n)||'pending';
    b.classList.remove('cur','lock'); b.title=`Level ${n}: ${status}`;
    if(status==='rejected')b.style.cssText+=';border-color:#c62828;background:#ef5350;color:#fff';
    else if(status==='pending')b.style.cssText+=';border-color:#168bd2;background:#42b9f5;color:#fff';
    else if(status==='approved')b.style.cssText+=';border-color:#13a557;background:#21e87c;color:#0e9f4f';
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
  fileUrl&&URL.revokeObjectURL(fileUrl);fileUrl=null;selectedFile=null;$('file').value='';
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
  if(f.size>50*1024*1024){toast('❌ ไฟล์ใหญ่เกิน 50MB',3000);$('file').value='';return}
  selectedFile=f;
  fileUrl&&URL.revokeObjectURL(fileUrl);fileUrl=URL.createObjectURL(f);
  $('drop').innerHTML=f.type.startsWith('video')?`<video src="${fileUrl}" controls playsinline></video>`:`<img src="${fileUrl}" alt="หลักฐาน">`;
  $('send').disabled=false;
};

/* ---------- ส่งหลักฐานจริงไป Supabase ---------- */
$('send').onclick=async()=>{
  if(!sb){toast('❌ ไม่พบการเชื่อมต่อ Supabase',3500);return}
  if(!selectedFile){toast('กรุณาเลือกไฟล์ก่อน');return}
  $('send').disabled=true;$('send').textContent='กำลังส่ง...';
  try{
    const uid=user?.id||(await sb.auth.getUser()).data?.user?.id;
    if(!uid)throw new Error('กรุณาเข้าสู่ระบบก่อน');
    // 1) อัปโหลดไฟล์ (โฟลเดอร์แรกต้องเป็น user id ตาม policy)
    const ext=(selectedFile.type.split('/')[1]||'bin').replace('quicktime','mov');
    const path=`${uid}/level-${sel}-${Date.now()}.${ext}`;
    const up=await sb.storage.from('mission-evidence').upload(path,selectedFile,{contentType:selectedFile.type});
    if(up.error)throw up.error;
    // 2) บันทึกการส่งงาน
    const sub=await sb.from('mission_submissions').insert({user_id:uid,level:sel,evidence_path:path,status:'pending'});
    if(sub.error)throw sub.error;
    // 3) ปลดล็อกด่านถัดไป (เฉพาะด่านปัจจุบัน)
    levelStatuses.set(sel,'pending');
    $('up').classList.remove('show');draw();toast('Evidence submitted for review');
    $('up').classList.remove('show');draw();toast('✅ ส่งหลักฐานแล้ว รอการตรวจสอบ');
    const y=pos(Math.min(cur,N)-1,$('map').clientWidth).y;$('scroll').scrollTo({top:y-200,behavior:'smooth'});
  }catch(err){
    console.error(err);
    toast('❌ ส่งไม่สำเร็จ: '+(err.message||'เกิดข้อผิดพลาด'),4000);
    $('send').disabled=false;$('send').textContent='ส่งหลักฐานเพื่อตรวจสอบ';
  }
};

/* ---------- โหลดความคืบหน้าจาก Supabase ---------- */
async function loadProgress(){
  if(!sb||!user)return;
  try{
    let {data,error}=await sb.from('mission_progress').select('unlocked_level').eq('user_id',user.id).maybeSingle();
    if(error)throw error;
    if(!data){
      const ins=await sb.from('mission_progress').insert({user_id:user.id,unlocked_level:1,completed_level:0});
      if(ins.error)console.warn('สร้าง mission_progress ไม่ได้:',ins.error.message);
      data={unlocked_level:1};
    }
    cur=Math.min(N,data.unlocked_level||1);
    const {data:submissions,error:submissionError}=await sb.from('mission_submissions').select('level,status').eq('user_id',user.id).order('created_at',{ascending:false});
    if(submissionError)throw submissionError;
    levelStatuses.clear();
    for(const row of submissions||[])if(!levelStatuses.has(row.level))levelStatuses.set(row.level,row.status);
    try{localStorage.setItem('fitzCur',cur)}catch(e){}
    draw();
    $('scroll').scrollTop=Math.max(0,pos(cur-1,$('map').clientWidth).y-250);
  }catch(err){
    console.error(err);
    toast('❌ โหลดความคืบหน้าไม่สำเร็จ: '+(err.message||''),3500);
  }
}
async function refreshStatuses(){
  if(!sb||!user)return;
  const {data,error}=await sb.from('mission_submissions').select('level,status').eq('user_id',user.id).order('created_at',{ascending:false});
  if(error)return;
  levelStatuses.clear();
  for(const row of data||[])if(!levelStatuses.has(row.level))levelStatuses.set(row.level,row.status);
  draw();
}
setInterval(refreshStatuses,20000);

addEventListener('resize',draw);draw();
$('scroll').scrollTop=Math.max(0,pos(cur-1,$('map').clientWidth).y-250);
loadProgress();
