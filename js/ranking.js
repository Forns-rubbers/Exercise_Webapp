import { supabase } from "./supabase.js";
const {data:{user}}=await supabase.auth.getUser();
if(!user) location.replace("index.html");
else {
  await supabase.rpc("record_user_visit");
  const {data,error}=await supabase.rpc("get_leaderboard");
  const message=document.querySelector("#message");
  if(error)message.textContent=error.message;
  else {
    message.textContent=data?.length?"": "No ranking data yet.";
    document.querySelector("#rows").innerHTML=(data||[]).map((row,index)=>`<tr><td class="rank">${index+1}</td><td>${String(row.username||"User").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}</td><td>${row.completed_level}</td><td>${row.visits}</td></tr>`).join("");
  }
}
