// script.js — Main App Logic (Firebase compat CDN)
let currentUser = null;
let allExpenses = [];
let selectedAvatar = "fa-user";
let pendingProfilePhotoFile = null;
let profilePhotoDeleted = false;
let userCategories = ['อาหาร', 'ของใช้', 'เครื่องดื่ม', 'เสื้อผ้า', 'อื่นๆ'];
let expenseChartInstance = null;
let categoryChartInstance = null;

// ========================
// 1. Auth State & Initial Load
// ========================
document.addEventListener('DOMContentLoaded', () => {
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = "login.html";
            return;
        }
        currentUser = user;
        const dateInput = document.getElementById("item-date");
        if (dateInput) dateInput.valueAsDate = new Date();
        
        // Load data and profile independently
        loadData();
        try {
            await loadProfile();
        } catch (err) {
            console.error("Profile load error:", err);
        }
    });
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
    // Desktop Nav
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    const activeNav = document.querySelector(`.nav-item[data-target="${targetId}"]`);
    if (activeNav) activeNav.classList.add("active");

    // Mobile Nav
    document.querySelectorAll(".mobile-nav-item").forEach((n) => n.classList.remove("active"));
    const activeMobileNav = document.querySelector(`.mobile-nav-item[data-target="${targetId}"]`);
    if (activeMobileNav) activeMobileNav.classList.add("active");

    document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
    const targetTab = document.getElementById(targetId);
    if (targetTab) {
        targetTab.classList.add("active");
        window.scrollTo(0, 0); // Reset scroll to top
    }
}

// Listen to Desktop Nav
document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        const target = item.getAttribute("data-target");
        switchTab(target);
    });
});

// Listen to Mobile Nav
document.querySelectorAll(".mobile-nav-item").forEach((item) => {
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
    const isFav = document.getElementById("item-fav").checked;

    try {
        await db.collection("purchases").add({
            userId: currentUser.uid,
            name,
            price,
            category,
            date,
            isFavorite: isFav,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        showToast(translations[currentLang].toast_save_success);
        e.target.reset();
        document.getElementById("item-date").valueAsDate = new Date();
    } catch (err) {
        console.error(err);
        showToast(translations[currentLang].toast_error);
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
            const errMsg = error.code === 'permission-denied' ? "สิทธิ์การเข้าถึงถูกปฏิเสธ" : translations[currentLang].toast_error;
            document.getElementById("history-list").innerHTML = `<p class="error-msg">❌ ${errMsg}<br><small>${error.message}</small></p>`;
        });
}

// ========================
// 5. Render History
// ========================
let viewMode = "list";

function renderHistory(items) {
    const catEl = document.getElementById("filter-category");
    const favEl = document.getElementById("filter-fav");
    const searchEl = document.getElementById("search-input");
    const historyList = document.getElementById("history-list");
    
    if (!historyList) return; // Basic safety check

    const filterCat = catEl ? catEl.value : "all";
    const filterFav = favEl ? favEl.checked : false;
    const searchQuery = searchEl ? searchEl.value.toLowerCase() : "";
    
    historyList.innerHTML = "";

    let filtered = items;
    if (searchQuery) filtered = filtered.filter(i => i.name.toLowerCase().includes(searchQuery));
    if (filterCat !== "all") filtered = filtered.filter(i => i.category === filterCat);
    if (filterFav) filtered = filtered.filter(i => i.isFavorite);

    if (filtered.length === 0) {
        historyList.innerHTML = `<p class="loading-text">${translations[currentLang].history_empty}</p>`;
        return;
    }

    if (viewMode === "group") renderGroupedView(filtered, historyList);
    else renderListView(filtered, historyList);
}

function renderListView(filtered, container) {
    filtered.forEach(item => container.appendChild(createHistoryItemEl(item)));
    attachItemButtons(container);
}

function getAvatarHTML(avatar) {
    if (!avatar) {
        return `<i class="fa-solid fa-user"></i>`;
    }
    if (avatar.startsWith('fa-')) {
        return `<i class="fa-solid ${avatar}"></i>`;
    }
    if (avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('data:image/')) {
        return `<img src="${avatar}" alt="Avatar">`;
    }
    return avatar;
}

function renderGroupedView(filtered, container) {
    const groups = {};
    filtered.forEach(i => {
        const cat = i.category || "อื่นๆ";
        if (!groups[cat]) groups[cat] = [];
        groups[cat].push(i);
    });
    
    for (const [cat, items] of Object.entries(groups)) {
        const total = items.reduce((sum, i) => sum + i.price, 0);
        const header = document.createElement("div");
        header.className = "group-header";
        
        // Use a generic icon if the category string doesn't look like it has an emoji
        const displayCat = (cat.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\u200d|\u2705|\u2b50|\u2728/) || cat.length > 20) ? cat : `<i class="fa-solid fa-folder"></i> ${cat}`;

        header.innerHTML = `<div class="group-title">${displayCat}</div><div class="group-meta"><span>${translations[currentLang].items_count.replace('{count}', items.length)}</span><strong>฿${total.toLocaleString()}</strong></div>`;
        container.appendChild(header);
        items.forEach(i => container.appendChild(createHistoryItemEl(i)));
    }
    attachItemButtons(container);
}

function createHistoryItemEl(item) {
    const div = document.createElement("div");
    div.className = "history-item";
    const favIcon = item.isFavorite ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-regular fa-star"></i>';
    const favClass = item.isFavorite ? "active" : "";
    
    const cat = item.category || "อื่นๆ";
    const displayCatName = (cat.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|\u200d|\u2705|\u2b50|\u2728/) || cat.length > 20) ? item.name : `<i class="fa-solid fa-folder"></i> ${item.name}`;

    div.innerHTML = `
        <div class="item-info">
            <span class="item-name">${displayCatName}</span>
            <span class="item-date">${formatDate(item.date)} <small>• ${cat}</small></span>
        </div>
        <div class="item-right">
            <span class="item-price">฿${item.price.toLocaleString()}</span>
            <button class="btn-fav ${favClass}" data-id="${item.id}">${favIcon}</button>
            <button class="btn-delete" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
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
    if (!confirm(translations[currentLang].confirm_delete_item)) return;
    await db.collection("purchases").doc(e.currentTarget.dataset.id).delete();
}

document.getElementById("clear-all-btn").onclick = async () => {
    if (!confirm(translations[currentLang].confirm_clear_all)) return;
    const batch = db.batch();
    allExpenses.forEach(i => batch.delete(db.collection("purchases").doc(i.id)));
    await batch.commit();
};

document.getElementById("view-list-btn").onclick = () => { 
    viewMode = "list"; 
    document.getElementById("view-list-btn").classList.add("active");
    document.getElementById("view-group-btn").classList.remove("active");
    renderHistory(allExpenses); 
};
document.getElementById("view-group-btn").onclick = () => { 
    viewMode = "group"; 
    document.getElementById("view-group-btn").classList.add("active");
    document.getElementById("view-list-btn").classList.remove("active");
    renderHistory(allExpenses); 
};
document.getElementById("filter-category").onchange = () => renderHistory(allExpenses);
document.getElementById("filter-fav").onchange = () => renderHistory(allExpenses);

// ========================
// 6. Profile
// ========================
async function loadProfile() {
    const snap = await db.collection("profiles").doc(currentUser.uid).get();
    const email = currentUser.email;
    document.getElementById("profile-email-display").innerText = email;
    
    let name = email.split("@")[0], avatar = "fa-user";
    let isNewProfile = false;

    if (snap.exists) {
        const data = snap.data();
        name = data.displayName || name;
        avatar = data.avatar || "fa-user";
        selectedAvatar = avatar;
        
        if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
            showUploadedPreview(avatar);
        } else {
            clearUploadedPreview();
        }
    } else {
        isNewProfile = true;
        clearUploadedPreview();
    }
    document.getElementById("profile-avatar-display").innerHTML = getAvatarHTML(avatar);
    document.getElementById("profile-name-display").innerText = name;
    
    // Update Home tab profile card
    const homeAvatar = document.getElementById("home-avatar-icon");
    if (homeAvatar) homeAvatar.innerHTML = getAvatarHTML(avatar);
    const homeUserText = document.getElementById("home-username-text");
    if (homeUserText) homeUserText.innerText = name;

    // Update Home and Profile specific elements if they exist
    const heroUsername = document.getElementById("hero-username");
    if (heroUsername) heroUsername.innerText = name;
    
    document.getElementById("profile-display-name").value = name;

    const creationTime = currentUser.metadata.creationTime;
    const memberSinceStr = creationTime ? new Date(creationTime).toLocaleDateString(currentLang === 'th' ? 'th-TH' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "-";
    
    const homeSince = document.getElementById("home-member-since");
    if (homeSince) homeSince.innerText = memberSinceStr;

    const profileSince = document.getElementById("profile-since");
    if (profileSince) profileSince.innerText = translations[currentLang].profile_since.replace('{date}', memberSinceStr);

    // Load Budget from profile
    if (snap.exists && snap.data().monthlyBudget) {
        const budget = snap.data().monthlyBudget;
        document.getElementById("home-budget-input").value = budget;
        userBudget = budget; // Global variable
    } else {
        userBudget = 0;
    }
    updateBudgetDisplay();

    // Load Categories from profile
    if (snap.exists && snap.data().categories && snap.data().categories.length > 0) {
        userCategories = snap.data().categories;
    }
    renderCategoryOptions();
    renderCategoryManager();

    if (isNewProfile) {
        switchTab("tab-profile");
        showToast(translations[currentLang].welcome_msg);
    }
}
let userBudget = 0;

function updateBudgetDisplay() {
    const month = new Date().toISOString().slice(0, 7);
    const totalSpent = allExpenses.filter(i => i.date.startsWith(month)).reduce((sum, i) => sum + i.price, 0);
    
    const spentEl = document.getElementById("budget-spent-text");
    const barEl = document.getElementById("budget-progress-bar");
    const remainingEl = document.getElementById("budget-remaining-text");

    if (spentEl && barEl && remainingEl) {
        spentEl.innerText = translations[currentLang].budget_spent_info
            .replace('{spent}', totalSpent.toLocaleString())
            .replace('{budget}', userBudget.toLocaleString());
        
        const remaining = Math.max(0, userBudget - totalSpent);
        remainingEl.innerText = translations[currentLang].budget_remaining.replace('{val}', remaining.toLocaleString());

        if (userBudget > 0) {
            const percent = Math.min(100, (totalSpent / userBudget) * 100);
            barEl.style.width = `${percent}%`;
            
            // Change color based on percentage
            if (percent > 90) barEl.style.background = "linear-gradient(90deg, #ef4444, #f87171)";
            else if (percent > 70) barEl.style.background = "linear-gradient(90deg, #f59e0b, #fbbf24)";
            else barEl.style.background = "linear-gradient(90deg, #10b981, #3b82f6)";
        } else {
            barEl.style.width = "0%";
        }
    }
}

document.getElementById("profile-form").onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById("profile-display-name").value.trim();
    
    let avatarToSave = selectedAvatar;

    try {
        if (pendingProfilePhotoFile) {
            showToast(translations[currentLang].toast_uploading);
            avatarToSave = await uploadToCloudinary(pendingProfilePhotoFile);
            
            // Immediately update avatar displays so user sees the photo right away
            selectedAvatar = avatarToSave;
            document.getElementById("profile-avatar-display").innerHTML = getAvatarHTML(avatarToSave);
            const homeAvatar = document.getElementById("home-avatar-icon");
            if (homeAvatar) homeAvatar.innerHTML = getAvatarHTML(avatarToSave);
            
            showToast(translations[currentLang].toast_upload_success);
        } else if (profilePhotoDeleted) {
            avatarToSave = "fa-user";
        }
        // If neither pending file nor deleted, keep existing avatar (which might be the cloudinary URL or fa-user)

        await db.collection("profiles").doc(currentUser.uid).set({
            displayName: name,
            avatar: avatarToSave,
            userId: currentUser.uid
        }, { merge: true });
        
        // Reset state
        pendingProfilePhotoFile = null;
        profilePhotoDeleted = false;

        showToast(translations[currentLang].toast_profile_success);
        
        // Await loadProfile so all displays are updated before user sees the page
        await loadProfile();
    } catch (err) {
        console.error("Profile save error:", err);
        const errMsg = err.message ? `: ${err.message}` : '';
        showToast((translations[currentLang].toast_upload_error || translations[currentLang].toast_error) + errMsg);
    }
};

// Save Budget from Home Tab
const saveBudgetBtn = document.getElementById("save-budget-btn");
if (saveBudgetBtn) {
    saveBudgetBtn.onclick = async () => {
        const budget = parseFloat(document.getElementById("home-budget-input").value) || 0;
        try {
            await db.collection("profiles").doc(currentUser.uid).set({
                monthlyBudget: budget
            }, { merge: true });
            userBudget = budget;
            updateBudgetDisplay();
            showToast(translations[currentLang].toast_budget_success);
        } catch (err) {
            showToast(translations[currentLang].toast_error);
        }
    };
}

// Category Management
function renderCategoryOptions() {
    const itemSelect = document.getElementById("item-category");
    const filterSelect = document.getElementById("filter-category");
    
    // Backup current filter selection
    const currentFilter = filterSelect.value;

    const optionsHTML = userCategories.map(c => `<option value="${c}">${c}</option>`).join('');
    
    itemSelect.innerHTML = optionsHTML;
    filterSelect.innerHTML = `<option value="all">ทั้งหมด</option>` + optionsHTML;
    
    // Restore filter selection if it still exists
    if (userCategories.includes(currentFilter)) filterSelect.value = currentFilter;
}

function renderCategoryManager() {
    const list = document.getElementById("category-list-manager");
    if (!list) return;
    
    list.innerHTML = userCategories.map((cat, index) => `
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.03); padding: 8px 12px; border-radius: 10px;">
            <span style="font-size: 14px;">${cat}</span>
            <button onclick="deleteCategory(${index})" style="background: none; border: none; color: var(--danger); cursor: pointer; font-size: 14px; opacity: 0.6;">🗑️ ${translations[currentLang].btn_clear_all.split(' ')[1] || 'Delete'}</button>
        </div>
    `).join('');
}

async function saveCategories() {
    try {
        await db.collection("profiles").doc(currentUser.uid).set({
            categories: userCategories
        }, { merge: true });
        renderCategoryOptions();
        renderCategoryManager();
        showToast(translations[currentLang].toast_cat_updated);
    } catch (err) {
        showToast(translations[currentLang].toast_error);
    }
}

document.getElementById("add-category-btn").onclick = () => {
    const input = document.getElementById("new-category-input");
    const val = input.value.trim();
    if (!val) return;
    if (userCategories.includes(val)) {
        showToast(translations[currentLang].toast_cat_exists);
        return;
    }
    userCategories.push(val);
    input.value = "";
    saveCategories();
};

window.deleteCategory = (index) => {
    if (userCategories.length <= 1) {
        showToast(translations[currentLang].toast_cat_min);
        return;
    }
    if (!confirm(translations[currentLang].confirm_delete_cat.replace('{name}', userCategories[index]))) return;
    userCategories.splice(index, 1);
    saveCategories();
};

document.querySelectorAll(".avatar-option").forEach(opt => {
    opt.onclick = () => {
        document.querySelectorAll(".avatar-option").forEach(o => o.classList.remove("selected"));
        opt.classList.add("selected");
        selectedAvatar = opt.dataset.avatar || opt.dataset.emoji;
        document.getElementById("profile-avatar-display").innerHTML = getAvatarHTML(selectedAvatar);
    };
});
function highlightAvatar(avatar) {
    document.querySelectorAll(".avatar-option").forEach(opt => {
        const isSelected = opt.dataset.avatar === avatar || opt.dataset.emoji === avatar;
        opt.classList.toggle("selected", isSelected);
    });
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
        showToast(translations[currentLang].toast_theme_success);
        if (typeof renderCharts === 'function') renderCharts();
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
    const totalEl = document.getElementById("monthly-total");
    const countEl = document.getElementById("monthly-count");
    const favsEl = document.getElementById("fav-count");

    if (totalEl) totalEl.innerText = `฿${total.toLocaleString()}`;
    if (countEl) countEl.innerText = count;
    if (favsEl) favsEl.innerText = favs;
    updateBudgetDisplay();
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
    } else if (mode === "monthly") {
        const byM = {};
        const currentYear = new Date().getFullYear().toString();
        allExpenses.forEach(i => {
            if (i.date.startsWith(currentYear)) {
                const month = i.date.substring(0, 7); // YYYY-MM
                byM[month] = (byM[month]||0) + i.price;
            }
        });
        const monthNames = translations[currentLang].month_names;
        const sortedMonths = Object.keys(byM).sort();
        labels = sortedMonths.map(m => {
            const mIndex = parseInt(m.split("-")[1]) - 1;
            return monthNames[mIndex] || m;
        });
        data = sortedMonths.map(m => byM[m]);
    } else if (mode === "yearly") {
        const byY = {};
        allExpenses.forEach(i => {
            const year = i.date.substring(0, 4);
            byY[year] = (byY[year]||0) + i.price;
        });
        const sortedYears = Object.keys(byY).sort().slice(-5);
        labels = sortedYears.map(y => currentLang === 'th' ? parseInt(y) + 543 : y); // Convert to Buddhist Year only for Thai
        data = sortedYears.map(y => byY[y]);
    }

    const style = getComputedStyle(document.documentElement);
    const primary = style.getPropertyValue('--primary').trim() || '#7c3aed';
    const textColor = style.getPropertyValue('--text-muted').trim() || '#6b7280';
    const gridColor = style.getPropertyValue('--border-light').trim() || 'rgba(0,0,0,0.1)';

    Chart.defaults.color = textColor;

    if (expenseChartInstance) expenseChartInstance.destroy();
    expenseChartInstance = new Chart(ctx, { 
        type: 'bar', 
        data: { 
            labels: labels, 
            datasets: [{ 
                label: '฿', 
                data: data, 
                backgroundColor: primary + 'b3', // 70% opacity
                hoverBackgroundColor: primary,
                borderRadius: 6,
                borderSkipped: false
            }] 
        }, 
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                x: { grid: { color: gridColor, display: false } },
                y: { grid: { color: gridColor, borderDash: [4, 4] }, beginAtZero: true }
            },
            plugins: {
                legend: { display: false }
            }
        } 
    });
}

// ผูก Event Listener เมื่อเปลี่ยนโหมดกราฟ
if (document.getElementById("chart-view-mode")) {
    document.getElementById("chart-view-mode").addEventListener("change", renderBarChart);
}
function renderCategoryChart() {
    const ctx = document.getElementById("categoryChart").getContext("2d");
    const byC = {}; allExpenses.forEach(i => byC[i.category] = (byC[i.category]||0) + i.price);
    const style = getComputedStyle(document.documentElement);
    const c1 = style.getPropertyValue('--primary').trim() || '#7c3aed';
    const c2 = style.getPropertyValue('--secondary').trim() || '#ec4899';
    const c3 = style.getPropertyValue('--accent').trim() || '#f59e0b';
    const c4 = style.getPropertyValue('--success').trim() || '#10b981';
    const c5 = style.getPropertyValue('--primary-hover').trim() || '#3b82f6';
    const borderColor = style.getPropertyValue('--glass-bg').trim() || '#ffffff';

    if (categoryChartInstance) categoryChartInstance.destroy();
    categoryChartInstance = new Chart(ctx, { 
        type: 'doughnut', 
        data: { 
            labels: Object.keys(byC), 
            datasets: [{ 
                data: Object.values(byC), 
                backgroundColor: [c1, c2, c3, c4, c5],
                borderColor: borderColor,
                borderWidth: 2,
                hoverOffset: 4
            }] 
        }, 
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'right' }
            },
            cutout: '70%'
        } 
    });
}

// ========================
// 8. Search & Export
// ========================
const searchInput = document.getElementById("search-input");
if (searchInput) {
    searchInput.addEventListener("input", () => renderHistory(allExpenses));
}

const exportBtn = document.getElementById("export-csv-btn");
if (exportBtn) {
    exportBtn.onclick = () => {
        if (allExpenses.length === 0) {
            showToast(translations[currentLang].toast_no_data);
            return;
        }
        let csv = "\uFEFF"; // UTF-8 BOM for Thai support in Excel
        const headers = currentLang === 'th' ? "วันที่,ชื่อรายการ,หมวดหมู่,ราคา (บาท),รายการโปรด\n" : "Date,Item Name,Category,Price (Baht),Favorite\n";
        csv += headers;
        
        allExpenses.forEach(i => {
            const nameClean = i.name.replace(/,/g, ''); 
            const isFav = currentLang === 'th' ? (i.isFavorite ? 'ใช่' : 'ไม่ใช่') : (i.isFavorite ? 'Yes' : 'No');
            csv += `${i.date},${nameClean},${i.category},${i.price},${isFav}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `Shopshop_Data_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast(translations[currentLang].toast_export_success);
    };
}

// ========================
// 9. Profile Photo & Cloudinary Integration
// ========================

// Removed switchAvatarTab

function showUploadedPreview(url) {
    const section = document.getElementById("photo-change-section");
    const previewImg = document.getElementById("photo-preview");

    if (section) section.style.display = "block";
    if (previewImg) previewImg.src = url;
}

function clearUploadedPreview() {
    const section = document.getElementById("photo-change-section");
    const previewImg = document.getElementById("photo-preview");
    const fileInput = document.getElementById("profile-photo-input");

    if (previewImg) previewImg.src = "";
    if (fileInput) fileInput.value = "";
    if (section) section.style.display = "none";
    
    pendingProfilePhotoFile = null;
}

async function uploadToCloudinary(file) {
    const cloudName = 'dyw5iyaii';
    const uploadPreset = 'rkmivvly';
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData
    });

    if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("Cloudinary upload error response:", errData);
        throw new Error(errData.error?.message || "Upload failed");
    }

    const data = await res.json();
    return data.secure_url;
}

function handleSelectedFile(file) {
    if (!file) return;
    
    // File validation
    if (!file.type.startsWith("image/")) {
        showToast(translations[currentLang].toast_file_type);
        return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB
        showToast(translations[currentLang].toast_file_limit);
        return;
    }

    pendingProfilePhotoFile = file;
    profilePhotoDeleted = false;

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
        showUploadedPreview(e.target.result);
        
        // Update profile avatar display real-time preview
        const profileAvatarDisplay = document.getElementById("profile-avatar-display");
        if (profileAvatarDisplay) {
            profileAvatarDisplay.innerHTML = getAvatarHTML(e.target.result);
        }
    };
    reader.readAsDataURL(file);
}

// Bind events on load
document.addEventListener("DOMContentLoaded", () => {
    const addBtn = document.getElementById("avatar-add-btn");
    const fileInput = document.getElementById("profile-photo-input");
    const removePhotoBtn = document.getElementById("btn-photo-remove");

    // "+" button on avatar triggers file picker
    if (addBtn && fileInput) {
        addBtn.addEventListener("click", () => {
            fileInput.click();
        });

        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            handleSelectedFile(file);
        });
    }

    if (removePhotoBtn) {
        removePhotoBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            clearUploadedPreview();
            profilePhotoDeleted = true;
            selectedAvatar = "fa-user";
            const profileAvatarDisplay = document.getElementById("profile-avatar-display");
            if (profileAvatarDisplay) profileAvatarDisplay.innerHTML = getAvatarHTML(selectedAvatar);
        });
    }
});
