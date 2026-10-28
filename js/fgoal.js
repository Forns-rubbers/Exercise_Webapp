
const carousel = document.getElementById("characterCarousel");
const cards = [...document.querySelectorAll(".character-card")];
const confirmButton = document.getElementById("confirmGoal");
const statusMessage = document.getElementById("statusMessage");

let selectedCard = null;
let scrollFrame = null;

// หาตัวละครที่อยู่ใกล้จุดกึ่งกลางของ Carousel มากที่สุด
function getCenterCard() {
    const carouselCenter =
        carousel.getBoundingClientRect().left +
        carousel.clientWidth / 2;

    let nearestCard = null;
    let shortestDistance = Infinity;

    cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const cardCenter = rect.left + rect.width / 2;
        const distance = Math.abs(carouselCenter - cardCenter);

        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestCard = card;
        }
    });

    return nearestCard;
}

// เปลี่ยนสถานะตัวละครที่เลือก
function updateSelection(card) {
    if (!card) return;

    selectedCard = card;

    cards.forEach((item) => {
        const isActive = item === card;

        item.classList.toggle("active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
    });
}

// เลื่อนให้ตัวละครที่เลือกอยู่ตรงกลางพอดี
function centerCard(card, behavior = "smooth") {
    const carouselCenter =
        carousel.getBoundingClientRect().left +
        carousel.clientWidth / 2;

    const rect = card.getBoundingClientRect();
    const cardCenter = rect.left + rect.width / 2;

    carousel.scrollBy({
        left: cardCenter - carouselCenter,
        behavior
    });
}

// เมื่อผู้ใช้เลื่อน Carousel
carousel.addEventListener("scroll", () => {
    cancelAnimationFrame(scrollFrame);

    scrollFrame = requestAnimationFrame(() => {
        updateSelection(getCenterCard());
    });
});

// เมื่อคลิกตัวละคร ให้เลื่อนไปอยู่ตรงกลาง
cards.forEach((card) => {
    card.addEventListener("click", () => {
        updateSelection(card);
        centerCard(card);
    });
});

// เมื่อเปิดหน้า ให้เลือก 6 วันเป็นค่าเริ่มต้น
const savedDays = Number(localStorage.getItem("fitzGoalDays"));

const initialCard =
    cards.find((card) => Number(card.dataset.days) === savedDays) ||
    cards.find((card) => card.dataset.days === "6") ||
    cards[0];

updateSelection(initialCard);

// จัดตำแหน่งเริ่มต้นหลังจากโหลดหน้า
window.addEventListener("load", () => {
    centerCard(initialCard, "instant");
});

// ป้องกันตำแหน่งเริ่มต้นคลาดเคลื่อนเมื่อขนาดหน้าจอเปลี่ยน
window.addEventListener("resize", () => {
    if (selectedCard) {
        centerCard(selectedCard, "instant");
    }
});

// กด GOAL เพื่อบันทึกเป้าหมายและไปหน้า Mission
confirmButton.addEventListener("click", () => {
    if (!selectedCard) {
        statusMessage.textContent = "กรุณาเลือกจำนวนวันก่อน";
        return;
    }

    const days = Number(selectedCard.dataset.days);

    // บันทึกจำนวนวันที่เลือก
    localStorage.setItem("fitzGoalDays", String(days));

    // บันทึกชื่อตัวละครที่เลือกด้วย
    localStorage.setItem(
        "fitzGoalCharacter",
        selectedCard.querySelector("img").getAttribute("src")
    );

    // ไปยังหน้าถัดไป
    window.location.href = "mission.html";
});
