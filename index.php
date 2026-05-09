<?php require_once 'config.php'; checkLogin(); ?>
<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>shopshop134 🥧 - หน้าหลัก</title>
    <link rel="stylesheet" href="style.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>

    <!-- Floating Blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <!-- Navbar -->
    <nav class="navbar">
        <div class="nav-brand">🥧 shopshop134 🍦</div>
        <ul class="nav-links">
            <li><a href="#" class="nav-item active" data-target="tab-add">➕ เพิ่มรายการ</a></li>
            <li><a href="#" class="nav-item" data-target="tab-history">📋 ประวัติ</a></li>
            <li><a href="#" class="nav-item" data-target="tab-dashboard">📊 สรุปรายเดือน</a></li>
            <li><a href="#" class="nav-item" data-target="tab-profile">👤 โปรไฟล์</a></li>
            <li><a href="#" class="nav-btn-logout" id="logout-btn">🚪 ออกจากระบบ</a></li>
        </ul>
    </nav>

    <main class="app-container">

        <!-- TAB 1: Add Item -->
        <section id="tab-add" class="tab-content active">
            <!-- Hero -->
            <div class="hero-section slide-in">
                <div class="hero-text">
                    <h1>สวัสดี, <span id="hero-username">เพื่อน</span>! 👋</h1>
                    <p>บันทึกของที่ซื้อวันนี้ไว้เพื่ออนาคตที่ดีกว่านะ 🛒</p>
                </div>
                <img src="hero_shopping.png" alt="Shopping Illustration" class="hero-img" onerror="this.style.display='none'">
            </div>
            <!-- Form -->
            <div class="card slide-in">
                <h2>จดบันทึกรายการสิ่งของ 📝</h2>
                <p class="subtitle">กรอกข้อมูลสิ่งที่คุณซื้อวันนี้</p>
                <form id="add-item-form">
                    <div class="input-group">
                        <label for="item-name">ชื่อสิ่งของ</label>
                        <input type="text" id="item-name" placeholder="เช่น น้ำยาล้างจาน, ทิชชู่" required>
                    </div>
                    <div class="form-row">
                        <div class="input-group">
                            <label for="item-price">ราคา (บาท)</label>
                            <input type="number" id="item-price" min="0" step="0.01" placeholder="0.00" required>
                        </div>
                        <div class="input-group">
                            <label for="item-category">หมวดหมู่</label>
                            <select id="item-category">
                                <option value="อาหาร">🍔 อาหาร</option>
                                <option value="ของใช้">🧴 ของใช้</option>
                                <option value="เครื่องดื่ม">☕ เครื่องดื่ม</option>
                                <option value="เสื้อผ้า">👔 เสื้อผ้า</option>
                                <option value="อื่นๆ">📦 อื่นๆ</option>
                            </select>
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="item-date">วันที่ซื้อ</label>
                        <input type="date" id="item-date" required>
                    </div>
                    <button type="submit" class="btn btn-glow">💾 บันทึกรายการ</button>
                </form>
            </div>
        </section>

        <!-- TAB 2: History -->
        <section id="tab-history" class="tab-content">
            <div class="card slide-in">
                <div class="history-header">
                    <div>
                        <h2>ประวัติการซื้อของ 📋</h2>
                        <p class="subtitle">รายการทั้งหมดที่คุณบันทึกไว้</p>
                    </div>
                    <div class="filter-group">
                        <select id="filter-category">
                            <option value="all">ทั้งหมด</option>
                            <option value="อาหาร">🍔 อาหาร</option>
                            <option value="ของใช้">🧴 ของใช้</option>
                            <option value="เครื่องดื่ม">☕ เครื่องดื่ม</option>
                            <option value="เสื้อผ้า">👔 เสื้อผ้า</option>
                            <option value="อื่นๆ">📦 อื่นๆ</option>
                        </select>
                        <label class="fav-filter-label">
                            <input type="checkbox" id="filter-fav"> ⭐ รายการโปรดเท่านั้น
                        </label>
                    </div>
                </div>

                <!-- View Mode Toggle + Clear All -->
                <div class="history-toolbar">
                    <div class="view-mode-toggle">
                        <button class="view-mode-btn active" id="view-list-btn" title="แสดงแบบรายการ">📋 รายการ</button>
                        <button class="view-mode-btn" id="view-group-btn" title="แสดงแบบกลุ่มหมวดหมู่">📂 จัดกลุ่ม</button>
                    </div>
                    <button class="btn-clear-all" id="clear-all-btn">🗑️ ล้างรายการทั้งหมด</button>
                </div>

                <div class="history-list" id="history-list">
                    <p class="loading-text">กำลังโหลดข้อมูล...</p>
                </div>
            </div>
        </section>

        <!-- TAB 3: Dashboard -->
        <section id="tab-dashboard" class="tab-content">
            <div class="stats-grid slide-in">
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-info">
                        <h3>ยอดรวมเดือนนี้</h3>
                        <p class="stat-value" id="monthly-total">฿0</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">🛒</div>
                    <div class="stat-info">
                        <h3>จำนวนรายการเดือนนี้</h3>
                        <p class="stat-value" id="monthly-count">0 รายการ</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">⭐</div>
                    <div class="stat-info">
                        <h3>รายการโปรดทั้งหมด</h3>
                        <p class="stat-value" id="fav-count">0 รายการ</p>
                    </div>
                </div>
            </div>
            <div class="card slide-in" style="margin-top:20px;">
                <h2>กราฟค่าใช้จ่ายรายวัน 📊</h2>
                <p class="subtitle">แสดงข้อมูล 14 วันล่าสุด</p>
                <div class="chart-container">
                    <canvas id="expenseChart"></canvas>
                </div>
            </div>
            <div class="card slide-in" style="margin-top:20px;">
                <h2>สัดส่วนหมวดหมู่ 🍩</h2>
                <div class="chart-container" style="height:260px;">
                    <canvas id="categoryChart"></canvas>
                </div>
            </div>
        </section>

        <!-- TAB 4: Profile -->
        <section id="tab-profile" class="tab-content">
            <div class="profile-card slide-in">
                <div class="profile-avatar-wrapper">
                    <div class="profile-avatar" id="profile-avatar-display">👤</div>
                    <img class="profile-photo" id="profile-photo-display" style="display:none;" alt="Profile">
                    <div class="avatar-ring"></div>
                </div>
                <div class="profile-details">
                    <h2 id="profile-name-display">โหลดข้อมูล...</h2>
                    <p id="profile-email-display" style="color:var(--text-muted);margin:4px 0 0;font-size:14px;"></p>
                    <p class="profile-since" id="profile-since">สมาชิกตั้งแต่: -</p>
                </div>
            </div>

            <div class="card slide-in" style="margin-top:24px;">
                <h2>แก้ไขโปรไฟล์ ✏️</h2>
                <p class="subtitle">เลือกอวตาร์และตั้งชื่อที่แสดงผล</p>
                <form id="profile-form">
                    <div class="input-group">
                        <label>เลือกอวตาร์</label>
                        <div class="avatar-grid" id="avatar-grid">
                            <span class="avatar-option" data-emoji="🐱">🐱</span>
                            <span class="avatar-option" data-emoji="🐶">🐶</span>
                            <span class="avatar-option" data-emoji="🐻">🐻</span>
                            <span class="avatar-option" data-emoji="🦊">🦊</span>
                            <span class="avatar-option" data-emoji="🐼">🐼</span>
                            <span class="avatar-option" data-emoji="🐸">🐸</span>
                            <span class="avatar-option" data-emoji="🦋">🦋</span>
                            <span class="avatar-option" data-emoji="🌸">🌸</span>
                            <span class="avatar-option" data-emoji="⭐">⭐</span>
                            <span class="avatar-option" data-emoji="🎀">🎀</span>
                            <span class="avatar-option" data-emoji="🍀">🍀</span>
                            <span class="avatar-option" data-emoji="🎸">🎸</span>
                        </div>
                    </div>

                    <!-- Photo Upload -->
                    <div class="input-group" style="margin-top:16px;">
                        <label>📷 อัปโหลดรูปโปรไฟล์</label>
                        <div class="photo-upload-area" id="photo-upload-area">
                            <img id="photo-preview" class="photo-preview" style="display:none;" alt="Preview">
                            <div class="photo-upload-placeholder" id="photo-placeholder">
                                <span class="upload-icon">📷</span>
                                <span>คลิกเพื่อเลือกรูป หรือลากไฟล์มาวาง</span>
                                <span style="font-size:12px;color:var(--text-muted);">รองรับ JPG, PNG (สูงสุด 2MB)</span>
                            </div>
                            <input type="file" id="photo-input" accept="image/jpeg,image/png,image/webp" hidden>
                        </div>
                        <div class="photo-actions" id="photo-actions" style="display:none;">
                            <button type="button" class="btn-photo-remove" id="remove-photo-btn">❌ ลบรูป</button>
                        </div>
                    </div>

                    <div class="input-group" style="margin-top:16px;">
                        <label for="profile-display-name">ชื่อที่แสดง</label>
                        <input type="text" id="profile-display-name" placeholder="ชื่อเล่นของคุณ">
                    </div>
                    <button type="submit" class="btn btn-glow">💾 บันทึกโปรไฟล์</button>
                </form>
            </div>
        </section>

    </main>

    <!-- Toast -->
    <div id="toast" class="toast"></div>

    <!-- Firebase CDN -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-storage-compat.js"></script>
    <!-- Firebase init removed, using local PHP APIs -->
    <script src="script.js"></script>
</body>
</html>