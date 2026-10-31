import { getMyMissionProgress, requireUser, signOut } from "./auth.js";
import { supabase } from "./supabase.js";

await requireUser();
const levels = document.getElementById("levels");
const summary = document.getElementById("summary");
const message = document.getElementById("message");
document.getElementById("logout").addEventListener("click", signOut);

async function load() {
  const { data, error } = await getMyMissionProgress();
  if (error) { message.textContent = `โหลดความคืบหน้าไม่สำเร็จ: ${error.message}`; return; }
  summary.textContent = `คุณปลดล็อกถึงด่าน ${data.unlocked_level} จาก 8`;
  levels.replaceChildren(...Array.from({ length: 8 }, (_, index) => {
    const level = index + 1;
    const button = document.createElement("button");
    const isUnlocked = level <= data.unlocked_level;
    const isCompleted = level <= data.completed_level;
    button.className = `level${isCompleted ? " completed" : ""}`;
    button.disabled = !isUnlocked || isCompleted;
    button.textContent = isCompleted ? `ด่าน ${level} ✓` : isUnlocked ? `เริ่มด่าน ${level}` : `ด่าน ${level} 🔒`;
    if (isUnlocked && !isCompleted) button.addEventListener("click", () => complete(level));
    return button;
  }));
}

async function complete(level) {
  message.textContent = "";
  const { error } = await supabase.rpc("complete_mission_level", { p_level: level });
  if (error) { message.textContent = `บันทึกด่านไม่สำเร็จ: ${error.message}`; return; }
  await load();
}
load();
