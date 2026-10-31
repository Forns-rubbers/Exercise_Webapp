import { requireUser, updateMyProfile } from "./auth.js";
await requireUser();
const options = document.querySelectorAll(".option");
const form = document.getElementById("locationForm");
let exercise_location = "fitness";
options.forEach((option) => option.addEventListener("click", () => {
  options.forEach((item) => { item.classList.remove("selected"); item.setAttribute("aria-pressed", "false"); });
  option.classList.add("selected"); option.setAttribute("aria-pressed", "true"); exercise_location = option.dataset.location;
}));
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const submit = form.querySelector("button[type='submit']"); submit.disabled = true;
  const { error } = await updateMyProfile({ exercise_location });
  if (error) { alert(`บันทึกข้อมูลไม่สำเร็จ: ${error.message}`); submit.disabled = false; return; }
  window.location.href = "goals.html";
});
