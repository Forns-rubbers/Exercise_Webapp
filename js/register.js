import { supabase } from "./supabase.js";

// เลือก Form และ Message
const form = document.getElementById("register-form");
const msg = document.getElementById("msg");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    msg.className = "msg";
    msg.textContent = "";

    // รับข้อมูลจาก HTML
    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
        // สมัครสมาชิกผ่าน Supabase
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    username: username
                }
            }
        });

        // ตรวจสอบ Error
        if (error) {
            throw error;
        }

        // สมัครสำเร็จ
        msg.className = "msg ok";
        msg.textContent =
            "สมัครสมาชิกสำเร็จ! กำลังไปหน้า Login...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);

    } catch (error) {

        msg.className = "msg";
        msg.textContent = error.message;

        console.error("Register error:", error);
    }
});


