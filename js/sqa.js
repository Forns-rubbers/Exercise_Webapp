import { requireUser, updateMyProfile } from "./auth.js";
await requireUser();
const slider = document.getElementById("daySlider");
const number = document.getElementById("dayNumber");
const label = document.getElementById("dayLabel");
const confirm = document.getElementById("confirmBtn");
function render() { const value = Number(slider.value); number.textContent = value; label.textContent = value === 1 ? "DAY" : "DAYS"; }
slider.addEventListener("input", render);
confirm.addEventListener("click", async () => {
  confirm.disabled = true;
  const { error } = await updateMyProfile({ exercise_experience_days: Number(slider.value) });
  if (error) { alert(`บันทึกข้อมูลไม่สำเร็จ: ${error.message}`); confirm.disabled = false; return; }
  window.location.href = "tqa.html";
});
render();
