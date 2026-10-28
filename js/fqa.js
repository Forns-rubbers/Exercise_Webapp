
const choices = document.querySelectorAll(
    'input[name="frequency"]'
);

const confirmBtn = document.getElementById("confirm");

// เมื่อผู้ใช้เลือก radio ให้ปรับสถานะ selected
choices.forEach((radio) => {
    radio.addEventListener("change", () => {
        document.querySelectorAll(".choice").forEach((choice) => {
            const input = choice.querySelector(
                'input[name="frequency"]'
            );

            choice.classList.toggle(
                "selected",
                input.checked
            );
        });

        // บันทึกค่าที่เลือกไว้ทันที
        localStorage.setItem(
            "exerciseFrequency",
            radio.value
        );
    });
});

// เมื่อกดปุ่ม CONFIRM
confirmBtn.addEventListener("click", () => {
    // หาตัวเลือก radio ที่ถูกเลือกอยู่
    const selectedRadio = document.querySelector(
        'input[name="frequency"]:checked'
    );

    // ป้องกันกรณีที่ยังไม่ได้เลือก
    if (!selectedRadio) {
        alert("กรุณาเลือกความถี่ในการออกกำลังกาย");
        return;
    }

    // บันทึกข้อมูลที่เลือก
    localStorage.setItem(
        "exerciseFrequency",
        selectedRadio.value
    );

    // ไปหน้าถัดไป
    window.location.href = "sqa.html";
});
