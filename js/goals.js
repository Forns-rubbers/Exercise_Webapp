
const options = document.querySelectorAll(".goal-option");
const form = document.getElementById("goalForm");
const errorMessage = document.getElementById("errorMessage");

let selectedGoal = null;

// เลือกเป้าหมาย
options.forEach((option) => {
    option.addEventListener("click", () => {
        // ล้างสถานะ selected ของทุกปุ่ม
        options.forEach((item) => {
            item.classList.remove("selected");
            item.setAttribute("aria-pressed", "false");
        });

        // กำหนดปุ่มที่คลิกให้เป็น selected
        option.classList.add("selected");
        option.setAttribute("aria-pressed", "true");

        // เก็บรหัสเป้าหมายที่เลือก
        selectedGoal = option.dataset.goal;

        // ล้างข้อความแจ้งเตือน
        errorMessage.textContent = "";
    });
});

// กด CONFIRM

form.addEventListener("submit", (event) => {
    event.preventDefault();

    // 1. ตรวจสอบว่าผู้ใช้เลือกเป้าหมายหรือยัง
    if (!selectedGoal) {
        errorMessage.textContent =
            "กรุณาเลือกเป้าหมายการออกกำลังกายก่อน";
        return;
    }

    try {
        // 2. บันทึกเป้าหมายลง localStorage
        localStorage.setItem("fitnessGoal", selectedGoal);

        // 3. ตรวจสอบว่าบันทึกข้อมูลสำเร็จ
        const savedGoal = localStorage.getItem("fitnessGoal");

        if (savedGoal === selectedGoal) {
            // 4. บันทึกสำเร็จแล้ว ไปหน้าถัดไป
            window.location.href = "fgoal.html";
        } else {
            errorMessage.textContent =
                "บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง";
        }

    } catch (error) {
        errorMessage.textContent =
            "ไม่สามารถบันทึกข้อมูลได้ กรุณาลองอีกครั้ง";
    }
});


// ตั้งค่าเริ่มต้นให้ทุกปุ่ม
options.forEach((option) => {
    option.setAttribute("aria-pressed", "false");
});
