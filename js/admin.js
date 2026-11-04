import { supabase } from "./supabase.js";
const message = document.querySelector("#message");
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const { data: { user } } = await supabase.auth.getUser();
if (!user) { location.replace("index.html"); throw new Error("Sign-in required"); }
const { data: profile, error: profileError } = await supabase.from("profiles").select("role").eq("id", user.id).maybeSingle();
if (profileError || profile?.role !== "admin") { await supabase.auth.signOut(); location.replace("index.html"); }
else {
  await supabase.rpc("record_user_visit");
  document.querySelector("#logout").onclick = async () => { await supabase.auth.signOut(); location.replace("index.html"); };
  async function refresh() {
    const [{data: stats,error:statsError},{data: submissions,error}] = await Promise.all([
      supabase.rpc("admin_dashboard_stats"),
      supabase.from("mission_submissions").select("id,user_id,level,evidence_path,status,created_at").order("created_at",{ascending:false})
    ]);
    if(statsError||error){message.textContent=(statsError||error).message;message.className="error";return;}
    document.querySelector("#visits").textContent=stats.visits;
    document.querySelector("#returning").textContent=stats.returning_users;
    document.querySelector("#users").textContent=stats.users;
    const {data: profiles}=await supabase.from("profiles").select("id,username");
    const names=new Map((profiles||[]).map(p=>[p.id,p.username||"User"]));
    const root=document.querySelector("#submissions");root.replaceChildren();
    if(!submissions?.length){root.textContent="No mission submissions yet.";return;}
    for(const item of submissions){
      const card=document.createElement("article");card.className="submission";
      const title=document.createElement("h3");title.textContent=`${names.get(item.user_id)||"User"} · Level ${item.level}`;
      const meta=document.createElement("p");meta.className="muted";meta.textContent=`${new Date(item.created_at).toLocaleString()} · Status: ${item.status}`;
      card.append(title,meta);
      const {data:file}=await supabase.storage.from("mission-evidence").createSignedUrl(item.evidence_path,300);
      if(file?.signedUrl){const media=document.createElement(item.evidence_path.match(/\.(mp4|webm|mov)$/i)?"video":"img");media.src=file.signedUrl;if(media.tagName==="VIDEO")media.controls=true;else media.alt="Mission evidence";card.append(media);}
      if(item.status==="pending"){
        const actions=document.createElement("div");actions.className="actions";
        for(const [label,status,cls] of [["Accept","approved","accept"],["Deny","rejected","deny"]]){
          const button=document.createElement("button");button.textContent=label;button.className=cls;
          button.onclick=async()=>{button.disabled=true;const {error:reviewError}=await supabase.rpc("review_mission_submission",{p_submission_id:item.id,p_status:status});if(reviewError){message.textContent=reviewError.message;message.className="error";button.disabled=false;}else await refresh();};actions.append(button);
        }card.append(actions);
      }
      root.append(card);
    }
    message.textContent="Admin access verified.";message.className="muted";
  }
  await refresh();
}
