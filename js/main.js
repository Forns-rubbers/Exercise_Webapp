import { supabase } from "./supabase.js";

const form = document.getElementById("login-form");
const message = document.getElementById("message");
const { data: { user } } = await supabase.auth.getUser();
if (user) window.location.replace(await nextPage(user.id));

async function nextPage(userId) {
  const { data } = await supabase.from("profiles").select("weekly_goal_days").eq("id", userId).maybeSingle();
  return data?.weekly_goal_days ? "mission.html" : "charactor.html";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  const submit = form.querySelector("button");
  submit.disabled = true;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: document.getElementById("email").value.trim(),
      password: document.getElementById("password").value,
    });
    if (error) throw error;
    window.location.replace(await nextPage(data.user.id));
  } catch (error) {
    message.textContent = error.message === "Invalid login credentials" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : error.message;
  } finally {
    submit.disabled = false;
  }
});
