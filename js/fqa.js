import { requireUser, updateMyProfile } from "./auth.js";
await requireUser();
const choices = document.querySelectorAll('input[name="frequency"]');
const confirm = document.getElementById("confirm");
choices.forEach((radio) => radio.addEventListener("change", () => document.querySelectorAll(".choice").forEach((choice) => choice.classList.toggle("selected", choice.querySelector("input").checked))));
confirm.addEventListener("click", async () => {
  const exercise_frequency = Number(document.querySelector('input[name="frequency"]:checked')?.value);
  confirm.disabled = true;
  const { error } = await updateMyProfile({ exercise_frequency });
  if (error) { alert(`บันทึกข้อมูลไม่สำเร็จ: ${error.message}`); confirm.disabled = false; return; }
  window.location.href = "sqa.html";
});
