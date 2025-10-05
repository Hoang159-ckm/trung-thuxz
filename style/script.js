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

// --- File handle + IndexedDB helpers (shared) ---
async function verifyPermission(fileHandle, withWrite) {
    const opts = { mode: withWrite ? 'readwrite' : 'read' };
    try {
        if (await fileHandle.queryPermission(opts) === 'granted') return true;
        if (await fileHandle.requestPermission(opts) === 'granted') return true;
    } catch (e) { /* ignore */ }
    return false;
}

function openHandleDB() {
    return new Promise((resolve, reject) => {
        const rq = indexedDB.open('dieuUocDB', 1);
        rq.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('handles')) db.createObjectStore('handles');
        };
        rq.onsuccess = () => resolve(rq.result);
        rq.onerror = () => reject(rq.error);
    });
}

async function getStoredHandle() {
    try {
        const db = await openHandleDB();
        return await new Promise((resolve, reject) => {
            const tx = db.transaction('handles', 'readonly');
            const store = tx.objectStore('handles');
            const req = store.get('fileHandle');
            req.onsuccess = () => resolve(req.result);
            req.onerror = () => resolve(undefined);
        });
    } catch (e) { return undefined; }
}

async function storeHandle(handle) {
    try {
        const db = await openHandleDB();
        return await new Promise((resolve, reject) => {
            const tx = db.transaction('handles', 'readwrite');
            const store = tx.objectStore('handles');
            const req = store.put(handle, 'fileHandle');
            req.onsuccess = () => resolve(true);
            req.onerror = () => resolve(false);
        });
    } catch (e) { return false; }
}

// --- Logging helpers: append single-line logs into dieu-uoc.txt silently when possible ---
async function silentAppendToDieuUoc(line) {
    const filename = 'dieu-uoc.txt';
    const entry = `${line} (${new Date().toLocaleString()})\r\n`;

    // Try File System Access API + stored handle first
    if (window.showSaveFilePicker) {
        try {
            let handle = window.dieuUocHandle || await (async function(){
                // try get from IndexedDB if helper exists
                try { return await getStoredHandle(); } catch(e){ return undefined; }
            })();
            if (handle) {
                // try writing if permission available
                try {
                    const ok = await (async function(){
                        try { return await handle.queryPermission({mode:'readwrite'}) === 'granted' || await handle.requestPermission({mode:'readwrite'}) === 'granted'; } catch(e){ return false; }
                    })();
                    if (ok) {
                        let existing = '';
                        try { const f = await handle.getFile(); existing = await f.text(); } catch (e) { existing = ''; }
                        const newContent = existing + (existing && !existing.endsWith('\n') ? '\r\n' : '') + entry;
                        const writable = await handle.createWritable();
                        await writable.write(newContent);
                        await writable.close();
                        window.dieuUocHandle = handle;
                        return true;
                    }
                } catch (e) { /* fallthrough to picker */ }
            }
        } catch (e) { /* ignore and fallback */ }
    }

    // fallback append to localStorage buffer
    try {
        const key = 'dieuUoc_buffer';
        let buffer = localStorage.getItem(key) || '';
        buffer = buffer + (buffer && !buffer.endsWith('\n') ? '\r\n' : '') + entry;
        localStorage.setItem(key, buffer);
        return true;
    } catch (e) {
        return false;
    }
}

function logToFile(message) {
    // fire-and-forget
    silentAppendToDieuUoc(message).catch(()=>{});
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
    // Show wish modal first. After saving (or skipping), start releasing lanterns.
    if (!lanternInterval) {
        openWishModal();
    }
});

function closePopup() {
    document.getElementById("popup").classList.remove("show");
    document.getElementById("overlay").classList.remove("show");
    // also close wish modal if it's open
    try { if (typeof closeWishModal === 'function') closeWishModal(); } catch (e) { /* ignore */ }
}
document.getElementById("overlay").addEventListener("click", closePopup);

// --- Wish modal logic ---
const wishModal = document.getElementById('wishModal');
const wishInput = document.getElementById('wishInput');
const wishName = document.getElementById('wishName');
const saveWishBtn = document.getElementById('saveWishBtn');
const cancelWishBtn = document.getElementById('cancelWishBtn');

function openWishModal() {
    wishInput.value = '';
    wishName.value = '';
    wishModal.classList.add('show');
    // also show overlay to block background
    document.getElementById('overlay').classList.add('show');
    // log action
    try { logToFile('Opened wish modal'); } catch(e){ /* ignore */ }
}

function closeWishModal() {
    wishModal.classList.remove('show');
    document.getElementById('overlay').classList.remove('show');
}

cancelWishBtn.addEventListener('click', () => {
    closeWishModal();
    try { logToFile('Wish cancelled'); } catch(e){ }
    startRelease();
});

saveWishBtn.addEventListener('click', async () => {
    const text = wishInput.value.trim();
    if (!text) {
        // if empty, treat as canceled but still start release
        closeWishModal();
        try { logToFile('Wish empty - treated as cancelled'); } catch(e){}
        startRelease();
        return;
    }
    try {
        await saveWishToFile(text);
        try { logToFile(`Saved wish${wishName.value ? ' by ' + wishName.value : ''}`); } catch(e){}
    } catch (e) {
        console.error('Save failed:', e);
    }
    closeWishModal();
    startRelease();
});

async function saveWishToFile(text) {
    const filename = 'dieu-uoc.txt';
    const nameLine = wishName && wishName.value.trim() ? `Người ước: ${wishName.value.trim()}\r\n` : '';
    const entry = `${nameLine}Điều ước (${new Date().toLocaleString()}):\r\n${text}\r\n----\r\n`;

    // If File System Access API is available, attempt to use stored handle silently
    if (window.showSaveFilePicker) {
        try {
            let handle = window.dieuUocHandle || await getStoredHandle();
            if (handle) {
                // If we have permission, write without showing picker
                const ok = await verifyPermission(handle, true);
                if (ok) {
                    // read existing content (if any)
                    let existing = '';
                    try { const f = await handle.getFile(); existing = await f.text(); } catch (e) { existing = ''; }
                    const newContent = existing + (existing && !existing.endsWith('\n') ? '\r\n' : '') + entry;
                    const writable = await handle.createWritable();
                    await writable.write(newContent);
                    await writable.close();
                    // store in session
                    window.dieuUocHandle = handle;
                    return;
                }
            }

            // If we reach here, either no handle or no permission -> show save picker once
            const opts = { suggestedName: filename, types: [{ description: 'Text file', accept: { 'text/plain': ['.txt'] } }] };
            const picked = await window.showSaveFilePicker(opts);
            // request permission and store
            const perm = await verifyPermission(picked, true);
            if (perm) {
                // read existing and append
                let existing = '';
                try { const f = await picked.getFile(); existing = await f.text(); } catch (e) { existing = ''; }
                const newContent = existing + (existing && !existing.endsWith('\n') ? '\r\n' : '') + entry;
                const writable = await picked.createWritable();
                await writable.write(newContent);
                await writable.close();
                window.dieuUocHandle = picked;
                try { await storeHandle(picked); } catch (e) { /* ignore store errors */ }
                return;
            }
        } catch (e) {
            console.warn('File System Access flow failed, falling back:', e);
        }
    }

    // Final fallback: localStorage buffer + force download of dieu-uoc.txt
    try {
        const key = 'dieuUoc_buffer';
        let buffer = localStorage.getItem(key) || '';
        buffer = buffer + (buffer && !buffer.endsWith('\n') ? '\r\n' : '') + entry;
        localStorage.setItem(key, buffer);

        const blob = new Blob([buffer], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    } catch (e) {
        console.error('Fallback save failed', e);
    }
}

function startRelease() {
    // reuse original release behavior
    song.currentTime = 57;
    song.play();
    lanternInterval = setInterval(() => {
        let count = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < count; i++) createLantern();
    }, 1200);
    document.getElementById("releaseBtn").style.display = "none";
};

