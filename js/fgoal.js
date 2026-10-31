import { requireUser, updateMyProfile } from "./auth.js";
await requireUser();
const carousel = document.getElementById("characterCarousel");
const cards = [...document.querySelectorAll(".character-card")];
const confirm = document.getElementById("confirmGoal");
const status = document.getElementById("statusMessage");
let selected = cards.find((card) => card.classList.contains("active")) || cards[0];
function select(card) { selected = card; cards.forEach((item) => { const active = item === card; item.classList.toggle("active", active); item.setAttribute("aria-pressed", active); }); }
cards.forEach((card) => card.addEventListener("click", () => { select(card); card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" }); }));
select(selected);
confirm.addEventListener("click", async () => {
  confirm.disabled = true;
  const weekly_goal_days = Number(selected.dataset.days);
  const { error } = await updateMyProfile({ weekly_goal_days });
  if (error) { status.textContent = `บันทึกข้อมูลไม่สำเร็จ: ${error.message}`; confirm.disabled = false; return; }
  window.location.href = "mission.html";
});
