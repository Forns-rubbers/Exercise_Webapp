import { requireUser, signOut } from "./auth.js";
import { supabase } from "./supabase.js";

const TOTAL_LEVELS = 30;
const tasks = [
  "เดินออกกำลังกายอย่างน้อย 20 นาที", "เล่นกีฬาอะไรก็ได้กับเพื่อนอย่างน้อย 30 นาที", "ยืดเหยียดร่างกาย 10 นาที",
  "วิ่งหรือปั่นจักรยานอย่างน้อย 20 นาที", "ทำท่าออกกำลังกายที่ชอบ 15 นาที", "เดินขึ้นบันไดแทนลิฟต์ 10 นาที"
];
const map = document.getElementById("mission-map");
const dialog = document.getElementById("mission-dialog");
const uploadScreen = document.getElementById("upload-screen");
const evidence = document.getElementById("evidence");
const preview = document.getElementById("preview");
const submit = document.getElementById("submit-evidence");
const uploadMessage = document.getElementById("upload-message");
let user, progress, selectedLevel, selectedFile;

const taskFor = (level) => tasks[(level - 1) % tasks.length];
function showDialog(level) {
  selectedLevel = level;
  document.getElementById("dialog-number").textContent = String(level).padStart(2, "0");
  document.getElementById("dialog-title").textContent = `MISSION ${String(level).padStart(2, "0")}`;
  document.getElementById("dialog-task").textContent = `ภารกิจ : ${taskFor(level)}`;
  dialog.showModal();
}
function render(submitted = new Set()) {
  map.replaceChildren();
  for (let level = 1; level <= TOTAL_LEVELS; level += 1) {
    const node = document.createElement("button");
    node.className = "mission-node";
    node.style.setProperty("--x", level % 2 ? "25%" : "75%");
    node.style.setProperty("--y", `${30 + (level - 1) * 158}px`);
    node.textContent = level;
    const completed = level <= progress.completed_level;
    const unlocked = level <= progress.unlocked_level;
    if (completed) node.classList.add("completed");
    if (level === progress.unlocked_level) node.classList.add("current");
    if (submitted.has(level)) node.classList.add("submitted");
    if (!unlocked || submitted.has(level)) { node.classList.add("locked"); node.disabled = true; }
    if (unlocked && !submitted.has(level)) node.addEventListener("click", () => showDialog(level));
    map.appendChild(node);
  }
}
async function load() {
  const [{ data: profile }, { data: mission, error }, { data: submissions }] = await Promise.all([
    supabase.from("profiles").select("username").eq("id", user.id).maybeSingle(),
    supabase.from("mission_progress").select("unlocked_level, completed_level").eq("user_id", user.id).single(),
    supabase.from("mission_submissions").select("level").eq("user_id", user.id).eq("status", "pending"),
  ]);
  if (error) { document.getElementById("journey-status").textContent = "ยังไม่ได้ตั้งค่าฐานข้อมูล Mission"; return; }
  progress = mission;
  document.getElementById("username").textContent = profile?.username?.toUpperCase() || "USERNAME";
  document.getElementById("userId").textContent = `ID : ${user.id.slice(0, 6).toUpperCase()}`;
  document.getElementById("journey-status").textContent = `ปลดล็อกถึงด่าน ${progress.unlocked_level} / ${TOTAL_LEVELS}`;
  render(new Set((submissions || []).map((item) => item.level)));
}
document.getElementById("logout").addEventListener("click", signOut);
document.getElementById("home").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
document.getElementById("close-dialog").addEventListener("click", () => dialog.close());
document.getElementById("start-mission").addEventListener("click", () => {
  dialog.close(); uploadScreen.hidden = false; document.body.style.overflow = "hidden";
  document.getElementById("upload-task").textContent = `ภารกิจ : ${taskFor(selectedLevel)}`;
});
document.getElementById("back-to-map").addEventListener("click", () => { uploadScreen.hidden = true; document.body.style.overflow = ""; });
evidence.addEventListener("change", () => {
  selectedFile = evidence.files?.[0]; preview.replaceChildren(); uploadMessage.textContent = ""; submit.disabled = !selectedFile;
  if (!selectedFile) { preview.hidden = true; return; }
  const media = document.createElement(selectedFile.type.startsWith("video/") ? "video" : "img");
  media.src = URL.createObjectURL(selectedFile); if (media.tagName === "VIDEO") media.controls = true;
  preview.appendChild(media); preview.hidden = false;
});
submit.addEventListener("click", async () => {
  if (!selectedFile || !selectedLevel) return;
  submit.disabled = true; uploadMessage.textContent = "กำลังส่งหลักฐาน…";
  const safeName = selectedFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const evidence_path = `${user.id}/${selectedLevel}/${Date.now()}-${safeName}`;
  const { error: uploadError } = await supabase.storage.from("mission-evidence").upload(evidence_path, selectedFile, { contentType: selectedFile.type, upsert: false });
  if (uploadError) { uploadMessage.textContent = `ส่งไฟล์ไม่สำเร็จ: ${uploadError.message}`; submit.disabled = false; return; }
  const { error: recordError } = await supabase.from("mission_submissions").insert({ user_id: user.id, level: selectedLevel, evidence_path });
  if (recordError) { uploadMessage.textContent = `บันทึกหลักฐานไม่สำเร็จ: ${recordError.message}`; submit.disabled = false; return; }
  uploadMessage.textContent = "ส่งหลักฐานแล้ว กำลังรอการตรวจสอบ";
  setTimeout(async () => { uploadScreen.hidden = true; document.body.style.overflow = ""; await load(); }, 1300);
});
user = await requireUser();
if (user) load();
