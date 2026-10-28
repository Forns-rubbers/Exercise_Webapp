
const options = document.querySelectorAll(".option");
const form = document.getElementById("locationForm");

let selectedLocation = "fitness";

// เลือกได้ครั้งละ 1 ตัวเลือก
options.forEach((option) => {
    option.addEventListener("click", () => {
        options.forEach((item) => {
            item.classList.remove("selected");
            item.setAttribute("aria-pressed", "false");
        });

        option.classList.add("selected");
        option.setAttribute("aria-pressed", "true");

        // เก็บตัวเลือกที่ผู้ใช้กด
        selectedLocation = option.dataset.location;
    });
});

// เมื่อกด Confirm
form.addEventListener("submit", (event) => {
    event.preventDefault();

    // บันทึกข้อมูล
    localStorage.setItem("exerciseLocation", selectedLocation);

    // ไปหน้าถัดไป
    window.location.href = "goals.html";
});
