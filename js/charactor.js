import { requireUser, updateMyProfile } from "./auth.js";

const characters = [
  { name: "Tomato", image: "media/img/tomato.png" }, { name: "Cheese", image: "media/img/cheese.png" },
  { name: "Vegetable", image: "media/img/vegetable.png" }, { name: "Watermelon", image: "media/img/watermelon.png" },
  { name: "Blue", image: "media/img/blue.png" }, { name: "Avocado", image: "media/img/avocado.png" },
  { name: "Banana", image: "media/img/banana.png" },
];
await requireUser();
let currentIndex = 0;
const image = document.getElementById("characterImage");
const confirm = document.getElementById("confirm");
const show = () => { image.src = characters[currentIndex].image; image.alt = characters[currentIndex].name; };
document.getElementById("prebtn").addEventListener("click", () => { currentIndex = (currentIndex - 1 + characters.length) % characters.length; show(); });
document.getElementById("nextbtn").addEventListener("click", () => { currentIndex = (currentIndex + 1) % characters.length; show(); });
confirm.addEventListener("click", async () => {
  confirm.disabled = true;
  const { error } = await updateMyProfile({ selected_character: characters[currentIndex].name });
  if (error) { alert(`บันทึกตัวละครไม่สำเร็จ: ${error.message}`); confirm.disabled = false; return; }
  window.location.href = "fqa.html";
});
show();
