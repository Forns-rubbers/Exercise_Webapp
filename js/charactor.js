
const characters = [
    {
        name: "Tomato",
        image: "media/img/tomato.png"
    },
    {
        name: "Cheese",
        image: "media/img/cheese.png"
    },
    {
        name: "vegetavle",
        image: "media/img/vegetable.png"
    },
    {
        name: "watermelon",
        image:"media/img/vegetable.png"
    },
    {
        name: "Blue",
        image: "media/img/blue.png"
    },
    {
        name: "Avocado",
        image: "media/img/avocado.png"
    }, 
    {
        name: "Banana",
        image: "media/img/banana.png"
    }
];

// ตำแหน่งตัวละครปัจจุบัน
let currentIndex = 0;

// เชื่อม JavaScript กับ HTML
const characterImage = document.getElementById("characterImage");
const prebtn = document.getElementById("prebtn");
const nextbtn = document.getElementById("nextbtn");
const confirmBtn = document.getElementById("confirm");

// แสดงตัวละครที่เลือกอยู่
function showCharacter() {
    const character = characters[currentIndex];

    characterImage.src = character.image;
    characterImage.alt = character.name;
}

// กดปุ่มย้อนกลับ
prebtn.addEventListener("click", function () {
    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = characters.length - 1;
    }

    showCharacter();
});

// กดปุ่มถัดไป
nextbtn.addEventListener("click", function () {
    currentIndex++;

    if (currentIndex >= characters.length) {
        currentIndex = 0;
    }

    showCharacter();
});

// กดปุ่มยืนยัน
confirmBtn.addEventListener("click", function () {
    const selectedCharacter = characters[currentIndex];

    localStorage.setItem(
        "selectedCharacter",
        JSON.stringify(selectedCharacter)
    );

    alert("You selected " + selectedCharacter.name + "!");
});

// แสดงตัวละครเมื่อเปิดหน้าเว็บ
showCharacter();
