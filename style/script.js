const starCount = window.innerWidth < 600 ? 80 : 200;
for (let i = 0; i < starCount; i++) {
    let star = document.createElement("div");
    star.className = "star";
    star.style.top = Math.random() * 100 + "vh";
    star.style.left = Math.random() * 100 + "vw";
    star.style.animationDuration = (1 + Math.random() * 2) + "s";
    star.style.opacity = Math.random();
    document.body.appendChild(star);
}

const lanternImages = [];
for (let i = 1; i <= 9; i++) lanternImages.push(`./style/img/lantern/ld (${i}).png`);

const messages = [
    { text: "Chúc em Trung Thu vui vẻ!", img: "https://i.pinimg.com/originals/81/66/c3/8166c341a2030a2a0d28a5a6e1bf961b.gif" },
    { text: "Trung Thu này có quà chưa!", img: "https://i.pinimg.com/originals/33/76/db/3376dbdfc1b6e8b71a2ea7353e4fc0f2.gif" },
    { text: "Trung thu có muốn đi chơi cùng anh hông nè", img: "https://i.pinimg.com/originals/3a/fc/12/3afc12d6744a68594d29eb565c62244c.gif" },
    { text: "Trung Thu vui vẻ nha bé 💖🌙", img: "https://i.pinimg.com/originals/2f/82/bb/2f82bb5524663e046922d08a1cdb2ddd.gif" },
    { text: "Tối nay đi dạo phố đèn với anh heng? 🏮", img: "./style/img/Anh (1).jpg" }, 
    { text: "Em là món quà trung thu ý nghĩa nhất của anh 🏮", img: "./style/img/Anh (2).jpg" }, 
    { text: "Trung Thu này, có em là đủ ngọt hơn mọi loại bánh 🍰", img: "./style/img/Anh (3).jpg" }, 
    { text: "Chị Hằng xinh đẹp ơi, có muốn cùng cuội đi chơi không nè", img: "./style/img/Anh (4).jpg" }, 
    { text: "Anh sẽ là 'đèn hộ mệnh' dẫn em đi chơi nhé", img: "https://i.pinimg.com/originals/e8/9f/b9/e89fb9588567a3d1f89d881d9e6abcb9.gif" }, 
    { text: "Em chính là chiếc lồng đèn đặc biệt nhất của anh", img: "./style/img/Anh (5).jpg" }, 
    { text: "Trung Thu này không cần nhiều, chỉ cần em thôi 😘", img: "./style/img/Anh (6).jpg" }, 
    { text: "Em chính là điều ước của anh dưới trăng 🌌", img: "./style/img/Anh (7).jpg" },
    { text: "Trung Thu này, anh ước mình sẽ mãi bên nhau 💑", img: "./style/img/Anh (2).jpg" },
    { text: "Chúc em luôn xinh đẹp và hạnh phúc nhé! 🌸", img: "https://i.pinimg.com/originals/3a/5e/7e/3a5e7e2f1f6e4c3f1e8b9c6f0c8e4b1a.gif" },
    { text: "Mong rằng Trung Thu này sẽ mang lại nhiều niềm vui cho em! 🎉", img: "https://i.pinimg.com/originals/5b/7e/3c/5b7e3c1f4e6e4c3f1e8b9c6f0c8e4b1a.gif" },
    { text: "Chúc em có một mùa Trung Thu ấm áp bên gia đình và bạn bè! 🏮", img: "https://i.pinimg.com/originals/7c/8e/4d/7c8e4d2f1f6e4c3f1e8b9c6f0c8e4b1a.gif"
    }
];

const lanternsContainer = document.getElementById("lanternsContainer");
let maxLanterns = window.innerWidth < 600 ? 15 : 30;
let lanternInterval = null;

function createLantern() {
    if (lanternsContainer.querySelectorAll(".lantern").length >= maxLanterns) return;

    let lantern = document.createElement("img");
    lantern.src = lanternImages[Math.floor(Math.random() * lanternImages.length)];
    lantern.className = "lantern";

    // Giới hạn lantern không tràn màn hình
    let startX = Math.random() * 85; // 0% -> 85%
    lantern.style.left = startX + "vw";

    // random horizontal drift
    let driftX = (Math.random() - 0.5) * 50; // ±25vw
    lantern.style.setProperty('--x', driftX + 'vw');

    let duration = 10 + Math.random() * 10;
    lantern.style.animationDuration = duration + "s";

    lantern.addEventListener("click", () => {
    let randomMsg = messages[Math.floor(Math.random() * messages.length)];
    document.getElementById("popupText").innerText = randomMsg.text;
    document.getElementById("popupImg").src = randomMsg.img;
    document.getElementById("popup").classList.add("show");
    document.getElementById("overlay").classList.add("show");
    });

    lanternsContainer.appendChild(lantern);
    lantern.addEventListener("animationend", () => lantern.remove());
}

const song = document.getElementById("bgMusic");
document.getElementById("releaseBtn").addEventListener("click", () => {
    if (!lanternInterval) {
    song.currentTime = 57;
    song.play();
    lanternInterval = setInterval(() => {
        let count = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) createLantern();
    }, 1200);
    document.getElementById("releaseBtn").style.display = "none";
    }
});

function closePopup() {
    document.getElementById("popup").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
}
document.getElementById("overlay").addEventListener("click", closePopup);
