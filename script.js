// script.js — Main App Logic for PHP Version
let currentUserEmail = "";
let allExpenses = [];
let selectedAvatar = "👤";
let expenseChartInstance = null;
let categoryChartInstance = null;

// ========================
// 1. Check Auth & Load Data
// ========================
async function initApp() {
    try {
        const resp = await fetch('api_profile.php?action=load');
        const user = await resp.json();
        
        if (!user || user.error) {
            window.location.href = "login.php";
            return;
        }

        currentUserEmail = user.email;
        document.getElementById("item-date").valueAsDate = new Date();

        renderProfile(user);
        loadData();
    } catch (err) {
        window.location.href = "login.php";
    }
}

async function loadData() {
    const resp = await fetch('api_expenses.php?action=list');
    allExpenses = await resp.json();
    renderHistory(allExpenses);
    updateStats(allExpenses);
    renderCharts();
}

initApp();

// Logout
document.getElementById("logout-btn").addEventListener("click", async (e) => {
    e.preventDefault();
    await fetch('auth_api.php?action=logout');
    window.location.href = "login.php";
});

// ========================
// 2. Add Item
// ========================
document.getElementById("add-item-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById("item-name").value);
    formData.append('price', document.getElementById("item-price").value);
    formData.append('category', document.getElementById("item-category").value);
    formData.append('date', document.getElementById("item-date").value);

    const resp = await fetch('api_expenses.php?action=add', {
        method: 'POST',
        body: formData
    });
    const res = await resp.json();

    if (res.success) {
        showToast("✨ บันทึกสำเร็จ!");
        e.target.reset();
        document.getElementById("item-date").valueAsDate = new Date();
        loadData();
    } else {
        showToast("❌ " + res.message);
    }
});

// ========================
// 3. Render History
// ========================
let viewMode = "list";

function renderHistory(items) {
    const filterCat = document.getElementById("filter-category").value;
    const filterFav = document.getElementById("filter-fav").checked;
    const historyList = document.getElementById("history-list");
    historyList.innerHTML = "";

    let filtered = items;
    if (filterCat !== "all") filtered = filtered.filter(i => i.category === filterCat);
    if (filterFav) filtered = filtered.filter(i => i.is_favorite);

    if (filtered.length === 0) {
        historyList.innerHTML = '<p class="loading-text">ไม่มีรายการที่ตรงกับเงื่อนไข 🔍</p>';
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
    filtered.forEach(item => {
        const cat = item.category || "อื่นๆ";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(item);
    });

    const catMap = { "อาหาร": "🍔", "ของใช้": "🧴", "เครื่องดื่ม": "☕", "เสื้อผ้า": "👔", "อื่นๆ": "📦" };
    for (const [cat, items] of Object.entries(groups)) {
        const total = items.reduce((sum, i) => sum + i.price, 0);
        const header = document.createElement("div");
        header.className = "group-header";
        header.innerHTML = `<div class="group-title">${catMap[cat]||"📦"} ${cat}</div><div class="group-meta"><span>${items.length} รายการ</span><strong>฿${total.toLocaleString()}</strong></div>`;
        container.appendChild(header);
        items.forEach(item => container.appendChild(createHistoryItemEl(item)));
    }
    attachItemButtons(container);
}

function createHistoryItemEl(item) {
    const div = document.createElement("div");
    div.className = "history-item";
    const favIcon = item.is_favorite ? "⭐" : "☆";
    const favClass = item.is_favorite ? "active" : "";
    const catMap = { "อาหาร": "🍔", "ของใช้": "🧴", "เครื่องดื่ม": "☕", "เสื้อผ้า": "👔", "อื่นๆ": "📦" };
    
    div.innerHTML = `
        <div class="item-info">
            <span class="item-name">${catMap[item.category]||"📦"} ${item.name}</span>
            <span class="item-date">${formatDate(item.date)} · ${item.category}</span>
        </div>
        <div class="item-right">
            <span class="item-price">฿${item.price.toLocaleString()}</span>
            <button class="btn-fav ${favClass}" data-id="${item.id}">${favIcon}</button>
            <button class="btn-delete" data-id="${item.id}">🗑️</button>
        </div>`;
    return div;
}

function attachItemButtons(container) {
    container.querySelectorAll(".btn-fav").forEach(btn => btn.addEventListener("click", toggleFavorite));
    container.querySelectorAll(".btn-delete").forEach(btn => btn.addEventListener("click", deleteItem));
}

async function toggleFavorite(e) {
    const btn = e.currentTarget;
    const id = btn.dataset.id;
    const isNowFav = !btn.classList.contains("active");
    
    const formData = new FormData();
    formData.append('id', id);
    formData.append('is_favorite', isNowFav);
    
    await fetch('api_expenses.php?action=toggle_fav', { method: 'POST', body: formData });
    loadData();
}

async function deleteItem(e) {
    if(!confirm("ลบรายการนี้ใช่ไหม?")) return;
    const formData = new FormData();
    formData.append('id', e.currentTarget.dataset.id);
    await fetch('api_expenses.php?action=delete', { method: 'POST', body: formData });
    loadData();
}

document.getElementById("clear-all-btn").addEventListener("click", async () => {
    if(!confirm("ล้างทั้งหมดใช่ไหม?")) return;
    await fetch('api_expenses.php?action=clear_all');
    loadData();
});

// View mode toggle
document.getElementById("view-list-btn").addEventListener("click", () => { viewMode = "list"; renderHistory(allExpenses); });
document.getElementById("view-group-btn").addEventListener("click", () => { viewMode = "group"; renderHistory(allExpenses); });
document.getElementById("filter-category").addEventListener("change", () => renderHistory(allExpenses));
document.getElementById("filter-fav").addEventListener("change", () => renderHistory(allExpenses));

// ========================
// 4. Profile & Photo
// ========================
let pendingPhotoFile = null;

function renderProfile(user) {
    document.getElementById("profile-email-display").innerText = user.email;
    const created = new Date(user.created_at);
    document.getElementById("profile-since").innerText = `สมาชิกตั้งแต่: ${created.getDate()}/${created.getMonth()+1}/${created.getFullYear()}`;
    
    const name = user.display_name || user.email.split("@")[0];
    document.getElementById("profile-name-display").innerText = name;
    document.getElementById("hero-username").innerText = name;
    document.getElementById("profile-display-name").value = user.display_name || "";
    
    selectedAvatar = user.avatar_emoji || "👤";
    highlightAvatar(selectedAvatar);

    if (user.profile_photo) {
        showProfilePhoto(user.profile_photo);
    } else {
        hideProfilePhoto();
    }
}

function showProfilePhoto(url) {
    const photoDisplay = document.getElementById("profile-photo-display");
    const avatarDisplay = document.getElementById("profile-avatar-display");
    const preview = document.getElementById("photo-preview");
    const placeholder = document.getElementById("photo-placeholder");
    
    photoDisplay.src = url;
    photoDisplay.style.display = "block";
    avatarDisplay.style.display = "none";
    
    preview.src = url;
    preview.style.display = "block";
    placeholder.style.display = "none";
    document.getElementById("photo-actions").style.display = "flex";
}

function hideProfilePhoto() {
    document.getElementById("profile-photo-display").style.display = "none";
    document.getElementById("profile-avatar-display").style.display = "flex";
    document.getElementById("profile-avatar-display").innerText = selectedAvatar;
    document.getElementById("photo-preview").style.display = "none";
    document.getElementById("photo-placeholder").style.display = "flex";
    document.getElementById("photo-actions").style.display = "none";
    pendingPhotoFile = null;
}

// Photo Input Handlers
const uploadArea = document.getElementById("photo-upload-area");
const photoInput = document.getElementById("photo-input");
uploadArea.onclick = () => photoInput.click();
photoInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
        pendingPhotoFile = file;
        const reader = new FileReader();
        reader.onload = (ev) => {
            document.getElementById("photo-preview").src = ev.target.result;
            document.getElementById("photo-preview").style.display = "block";
            document.getElementById("photo-placeholder").style.display = "none";
            document.getElementById("photo-actions").style.display = "flex";
        };
        reader.readAsDataURL(file);
    }
};

document.getElementById("remove-photo-btn").onclick = () => {
    hideProfilePhoto();
    showToast("📷 รูปถูกเลือกให้ออกแล้ว (กดบันทึกเพื่อยืนยัน)");
};

document.getElementById("profile-form").onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('displayName', document.getElementById("profile-display-name").value);
    formData.append('avatar', selectedAvatar);
    
    if (pendingPhotoFile) {
        formData.append('photo', pendingPhotoFile);
    }
    
    if (document.getElementById("photo-preview").style.display === "none") {
        formData.append('removePhoto', 'true');
    }

    const resp = await fetch('api_profile.php?action=update', {
        method: 'POST',
        body: formData
    });
    const res = await resp.json();
    if(res.success) {
        showToast("✅ บันทึกโปรไฟล์สำเร็จ!");
        if (res.photoURL) showProfilePhoto(res.photoURL);
        else hideProfilePhoto();
        initApp();
    }
};

// Avatar Picker logic
document.querySelectorAll(".avatar-option").forEach(opt => {
    opt.onclick = () => {
        document.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        selectedAvatar = opt.dataset.emoji;
        document.getElementById("profile-avatar-display").innerText = selectedAvatar;
    };
});
function highlightAvatar(emoji) {
    document.querySelectorAll(".avatar-option").forEach(opt => {
        opt.classList.toggle("selected", opt.dataset.emoji === emoji);
    });
}

// ========================
// 5. Helper & Charts
// ========================
function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2800);
}

function formatDate(dateStr) {
    if (!dateStr) return "";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
}

function updateStats(items) {
    const currentMonth = new Date().toISOString().slice(0, 7);
    let total = 0, count = 0, favs = 0;
    items.forEach(i => {
        if (i.date.startsWith(currentMonth)) { total += i.price; count++; }
        if (i.is_favorite) favs++;
    });
    document.getElementById("monthly-total").innerText = `฿${total.toLocaleString()}`;
    document.getElementById("monthly-count").innerText = `${count} รายการ`;
    document.getElementById("fav-count").innerText = `${favs} รายการ`;
}

// Charts
function renderCharts() {
    renderBarChart();
    renderCategoryChart();
}

function renderBarChart() {
    const ctx = document.getElementById("expenseChart").getContext("2d");
    const byDate = {};
    allExpenses.forEach(i => { byDate[i.date] = (byDate[i.date]||0) + i.price; });
    const labels = Object.keys(byDate).sort().slice(-14);
    if (expenseChartInstance) expenseChartInstance.destroy();
    expenseChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(formatDate),
            datasets: [{ label: '฿', data: labels.map(d => byDate[d]), backgroundColor: '#7c3aed80' }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}

function renderCategoryChart() {
    const ctx = document.getElementById("categoryChart").getContext("2d");
    const byCat = {};
    allExpenses.forEach(i => { byCat[i.category] = (byCat[i.category]||0) + i.price; });
    if (categoryChartInstance) categoryChartInstance.destroy();
    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(byCat),
            datasets: [{ data: Object.values(byCat), backgroundColor: ['#7c3aed','#ec4899','#f59e0b','#10b981','#3b82f6'] }]
        },
        options: { responsive: true, maintainAspectRatio: false }
    });
}
