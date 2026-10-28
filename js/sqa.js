
const daySlider = document.getElementById("daySlider");
const dayNumber = document.getElementById("dayNumber");
const dayLabel = document.getElementById("dayLabel");
const confirmBtn = document.getElementById("confirmBtn");

// อัปเดตตัวเลขตามตำแหน่ง Slider
function updateDay() {
    const days = Number(daySlider.value);

    dayNumber.textContent = days;
    dayLabel.textContent = days === 1 ? "DAY" : "DAYS";
}

// เมื่อผู้ใช้เลื่อน Slider
daySlider.addEventListener("input", updateDay);

// แสดงค่าเริ่มต้น
updateDay();

// เมื่อผู้ใช้กด CONFIRM
confirmBtn.addEventListener("click", function () {
    const selectedDays = Number(daySlider.value);

    // บันทึกจำนวนวันที่เลือกไว้
    localStorage.setItem("exerciseDays", selectedDays);

    // ไปหน้าถัดไป
    window.location.href = "tqa.html";
});
