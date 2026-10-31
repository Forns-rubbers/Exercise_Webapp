import { requireUser, updateMyProfile } from "./auth.js";
await requireUser();
const options = document.querySelectorAll(".goal-option");
const form = document.getElementById("goalForm");
const errorMessage = document.getElementById("errorMessage");
let fitness_goal = null;
options.forEach((option) => option.addEventListener("click", () => {
  options.forEach((item) => { item.classList.remove("selected"); item.setAttribute("aria-pressed", "false"); });
  option.classList.add("selected"); option.setAttribute("aria-pressed", "true"); fitness_goal = option.dataset.goal; errorMessage.textContent = "";
}));
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!fitness_goal) { errorMessage.textContent = "กรุณาเลือกเป้าหมายการออกกำลังกายก่อน"; return; }
  const submit = form.querySelector("button[type='submit']"); submit.disabled = true;
  const { error } = await updateMyProfile({ fitness_goal });
  if (error) { errorMessage.textContent = `บันทึกข้อมูลไม่สำเร็จ: ${error.message}`; submit.disabled = false; return; }
  window.location.href = "fgoal.html";
});
options.forEach((option) => option.setAttribute("aria-pressed", "false"));
