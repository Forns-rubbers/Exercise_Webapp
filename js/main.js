import { supabase } from "./supabase.js";

const form = document.getElementById("login-form");
const message = document.getElementById("message");
const resendConfirmation = document.getElementById("resend-confirmation");
const { data: { user } } = await supabase.auth.getUser();
if (user) window.location.replace(await nextPage(user.id));

async function nextPage(userId) {
  const { data } = await supabase.from("profiles").select("weekly_goal_days").eq("id", userId).maybeSingle();
  return data?.weekly_goal_days ? "mission.html" : "charactor.html";
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  message.textContent = "";
  resendConfirmation.hidden = true;
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
    if (error.code === "email_not_confirmed") {
      message.textContent = "กรุณายืนยันอีเมลจากลิงก์ที่ Supabase ส่งให้ก่อนเข้าสู่ระบบ";
      resendConfirmation.hidden = false;
    } else {
      message.textContent = error.message === "Invalid login credentials" ? "อีเมลหรือรหัสผ่านไม่ถูกต้อง" : error.message;
    }
  } finally {
    submit.disabled = false;
  }
});

resendConfirmation.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  if (!email) {
    message.textContent = "กรุณากรอกอีเมลก่อนส่งลิงก์ยืนยันอีกครั้ง";
    return;
  }

  resendConfirmation.disabled = true;
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: { emailRedirectTo: new URL("index.html", window.location.href).href },
  });
  message.textContent = error
    ? `ส่งอีเมลยืนยันไม่สำเร็จ: ${error.message}`
    : "ส่งอีเมลยืนยันอีกครั้งแล้ว กรุณาตรวจ Inbox และ Spam";
  resendConfirmation.disabled = false;
});
