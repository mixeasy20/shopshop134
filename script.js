// script.js — Main App Logic (Firebase compat CDN)
let currentUser = null;
let allExpenses = [];
let selectedAvatar = "👤";
let expenseChartInstance = null;
let categoryChartInstance = null;

// ========================
// 1. Auth State
// ========================
auth.onAuthStateChanged(async (user) => {
    if (!user) {
        window.location.href = "login.html";
        return;
    }
    currentUser = user;
    document.getElementById("item-date").valueAsDate = new Date();
    await loadProfile();
    loadData();
});

document.getElementById("logout-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    await auth.signOut();
    window.location.href = "login.html";
});

// ========================
// 2. Tab Navigation
// ========================
function switchTab(targetId) {
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    const activeNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
    if (activeNav) activeNav.classList.add("active");

    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
    document.getElementById(targetId).classList.add("active");
}

document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const target = item.getAttribute("data-target");
        switchTab(target);
    });
});

// ========================
// 3. Add Item
// ========================
document.getElementById("add-item-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("item-name").value;
    const price = parseFloat(document.getElementById("item-price").value);
    const category = document.getElementById("item-category").value;
    const date = document.getElementById("item-date").value;

    try {
        await db.collection("purchases").add({
            userId: currentUser.uid,
            name,
            price,
            category,
            date,
            isFavorite: false,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast("✨ บันทึกรายการสำเร็จ!");
        e.target.reset();
        document.getElementById("item-date").valueAsDate = new Date();
    } catch (err) {
        console.error(err);
        showToast("❌ เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
});

// ========================
// 4. Data Loading
// ========================
function loadData() {
    // แก้ไข: เอา orderBy ออกก่อนเพื่อป้องกันปัญหาเรื่อง Index ใน Firebase
    db.collection("purchases")
        .where("userId", "==", currentUser.uid)
        .onSnapshot((snapshot) => {
            allExpenses = [];
            snapshot.forEach((doc) => {
                allExpenses.push({ id: doc.id, ...doc.data() });
            });
            
            // เรียงข้อมูลในเครื่องแทน (เรียงตามวันที่ล่าสุดขึ้นก่อน)
            allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
            
            renderHistory(allExpenses);
            updateStats(allExpenses);
            renderCharts();
        }, (error) => {
            console.error("Error loading data:", error);
            document.getElementById("history-list").innerHTML = '<p class="error-msg">❌ โหลดข้อมูลไม่สำเร็จ กรุณาเช็ค Firestore Rules</p>';
        });
}

// ========================
// 5. Render History
// ========================
let viewMode = "list";

function renderHistory(items) {
    const filterCat = document.getElementById("filter-category").value;
    const filterFav = document.getElementById("filter-fav").checked;
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    let filtered = items;
    if (filterCat !== "all") filtered = filtered.filter(i => i.category === filterCat);
    if (filterFav) filtered = filtered.filter(i => i.isFavorite);

    if (filtered.length === 0) {
        historyList.innerHTML = '<p class="loading-text">ไม่มีรายการ 🔍</p>';
        return;
    }

    if (viewMode === "group") renderGroupedView(filtered, historyList);
    else renderListView(filtered, historyList);
}

function renderListView(filtered, container) {
    filtered.forEach(item => container.appendChild(createHistoryItemEl(item)));
    attachItemButtons(container);
}

function renderGroupedView(filtered, container) {
    const groups = {};
    filtered.forEach(i => {
        const cat = i.category || "อื่นๆ";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(i);
    });
    const catMap = { "อาหาร": "🍔", "ของใช้": "🧴", "เครื่องดื่ม": "☕", "เสื้อผ้า": "👔", "อื่นๆ": "📦" };
    for (const [cat, items] of Object.entries(groups)) {
        const total = items.reduce((sum, i) => sum + i.price, 0);
        const header = document.createElement("div");
        header.className = "group-header";
        header.innerHTML = `<div class="group-title">${catMap[cat]||"📦"} ${cat}</div><div class="group-meta"><span>${items.length} รายการ</span><strong>฿${total.toLocaleString()}</strong></div>`;
        container.appendChild(header);
        items.forEach(i => container.appendChild(createHistoryItemEl(i)));
    }
    attachItemButtons(container);
}

function createHistoryItemEl(item) {
    const div = document.createElement("div");
    div.className = "history-item";
    const favIcon = item.isFavorite ? "⭐" : "☆";
    const favClass = item.isFavorite ? "active" : "";
    const catMap = { "อาหาร": "🍔", "ของใช้": "🧴", "เครื่องดื่ม": "☕", "เสื้อผ้า": "👔", "อื่นๆ": "📦" };
    div.innerHTML = `
        <div class="item-info">
            <span class="item-name">${catMap[item.category]||"📦"} ${item.name}</span>
            <span class="item-date">${formatDate(item.date)}</span>
        </div>
        <div class="item-right">
            <span class="item-price">฿${item.price.toLocaleString()}</span>
            <button class="btn-fav ${favClass}" data-id="${item.id}">${favIcon}</button>
            <button class="btn-delete" data-id="${item.id}">🗑️</button>
        </div>`;
    return div;
}

function attachItemButtons(container) {
    container.querySelectorAll(".btn-fav").forEach(b => b.onclick = toggleFavorite);
    container.querySelectorAll(".btn-delete").forEach(b => b.onclick = deleteItem);
}

async function toggleFavorite(e) {
    const id = e.currentTarget.dataset.id;
    const isFav = !e.currentTarget.classList.contains("active");
    await db.collection("purchases").doc(id).update({ isFavorite: isFav });
}

async function deleteItem(e) {
    if (!confirm("ลบรายการนี้?")) return;
    await db.collection("purchases").doc(e.currentTarget.dataset.id).delete();
}

document.getElementById("clear-all-btn").onclick = async () => {
    if (!confirm("ล้างทั้งหมด?")) return;
    const batch = db.batch();
    allExpenses.forEach(i => batch.delete(db.collection("purchases").doc(i.id)));
    await batch.commit();
};

document.getElementById("view-list-btn").onclick = () => { viewMode = "list"; renderHistory(allExpenses); };
document.getElementById("view-group-btn").onclick = () => { viewMode = "group"; renderHistory(allExpenses); };
document.getElementById("filter-category").onchange = () => renderHistory(allExpenses);
document.getElementById("filter-fav").onchange = () => renderHistory(allExpenses);

// ========================
// 6. Profile
// ========================
async function loadProfile() {
    const snap = await db.collection("profiles").doc(currentUser.uid).get();
    const email = currentUser.email;
    document.getElementById("profile-email-display").innerText = email;
    
    let name = email.split("@")[0], avatar = "👤";
    let isNewProfile = false;

    if (snap.exists) {
        const data = snap.data();
        name = data.displayName || name;
        avatar = data.avatar || "👤";
        selectedAvatar = avatar;
        highlightAvatar(avatar);
    } else {
        isNewProfile = true;
    }
    document.getElementById("profile-avatar-display").innerText = avatar;
    document.getElementById("profile-name-display").innerText = name;
    document.getElementById("hero-username").innerText = name;
    document.getElementById("profile-display-name").value = name;

    if (isNewProfile) {
        switchTab("tab-profile");
        showToast("👋 ยินดีต้อนรับ! กรุณาตั้งชื่อและเลือกอวตาร์ก่อนครับ");
    }
}

document.getElementById("profile-form").onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("profile-display-name").value.trim();
    try {
        await db.collection("profiles").doc(currentUser.uid).set({
            displayName: name,
            avatar: selectedAvatar,
            userId: currentUser.uid
        }, { merge: true });
        showToast("✅ บันทึกโปรไฟล์สำเร็จ!");
        loadProfile();
        switchTab("tab-add");
    } catch (err) {
        showToast("❌ เกิดข้อผิดพลาด");
    }
};

document.querySelectorAll(".avatar-option").forEach(opt => {
    opt.onclick = () => {
        document.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        selectedAvatar = opt.dataset.emoji;
        document.getElementById("profile-avatar-display").innerText = selectedAvatar;
    };
});
function highlightAvatar(emoji) {
    document.querySelectorAll(".avatar-option").forEach(opt => opt.classList.toggle("selected", opt.dataset.emoji === emoji));
}

// Theme Switcher Logic
const themeSelect = document.getElementById("theme-select");
if (themeSelect) {
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeSelect.value = savedTheme;

    themeSelect.addEventListener("change", (e) => {
        const selectedTheme = e.target.value;
        document.documentElement.setAttribute('data-theme', selectedTheme);
        localStorage.setItem('theme', selectedTheme);
        showToast("🎨 เปลี่ยนธีมเรียบร้อย!");
    });
}

// ========================
// 7. Helpers & Charts
// ========================
function showToast(msg) {
    const t = document.getElementById("toast");
    t.innerText = msg; t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
}
function formatDate(s) { if(!s) return ""; const [y,m,d] = s.split("-"); return `${d}/${m}/${y}`; }
function updateStats(items) {
    const month = new Date().toISOString().slice(0, 7);
    let total = 0, count = 0, favs = 0;
    items.forEach(i => {
        if (i.date.startsWith(month)) { total += i.price; count++; }
        if (i.isFavorite) favs++;
    });
    document.getElementById("monthly-total").innerText = `฿${total.toLocaleString()}`;
    document.getElementById("monthly-count").innerText = count;
    document.getElementById("fav-count").innerText = favs;
}
function renderCharts() { renderBarChart(); renderCategoryChart(); }
function renderBarChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const mode = document.getElementById("chart-view-mode")?.value || "daily";
    
    let labels = [];
    let data = [];
    
    if (mode === "daily") {
        const byD = {}; 
        allExpenses.forEach(i => byD[i.date] = (byD[i.date]||0) + i.price);
        const sortedDates = Object.keys(byD).sort().slice(-14);
        labels = sortedDates.map(formatDate);
        data = sortedDates.map(d => byD[d]);
    } else {
        const byM = {};
        const currentYear = new Date().getFullYear().toString();
        allExpenses.forEach(i => {
            if (i.date.startsWith(currentYear)) {
                const month = i.date.substring(0, 7); // YYYY-MM
                byM[month] = (byM[month]||0) + i.price;
            }
        });
        const monthNames = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
        const sortedMonths = Object.keys(byM).sort();
        labels = sortedMonths.map(m => {
            const mIndex = parseInt(m.split("-")[1]) - 1;
            return monthNames[mIndex] || m;
        });
        data = sortedMonths.map(m => byM[m]);
    }

    if (expenseChartInstance) expenseChartInstance.destroy();
    expenseChartInstance = new Chart(ctx, { 
        type: 'bar', 
        data: { 
            labels: labels, 
            datasets: [{ label: '฿', data: data, backgroundColor: '#7c3aed80', borderRadius: 4 }] 
        }, 
        options: { responsive: true, maintainAspectRatio: false } 
    });
}

// ผูก Event Listener เมื่อเปลี่ยนโหมดกราฟ
if (document.getElementById("chart-view-mode")) {
    document.getElementById("chart-view-mode").addEventListener("change", renderBarChart);
}
function renderCategoryChart() {
    const ctx = document.getElementById("categoryChart").getContext("2d");
    const byC = {}; allExpenses.forEach(i => byC[i.category] = (byC[i.category]||0) + i.price);
    if (categoryChartInstance) categoryChartInstance.destroy();
    categoryChartInstance = new Chart(ctx, { type: 'doughnut', data: { labels: Object.keys(byC), datasets: [{ data: Object.values(byC), backgroundColor: ['#7c3aed','#ec4899','#f59e0b','#10b981','#3b82f6'] }] }, options: { responsive: true, maintainAspectRatio: false } });
}
