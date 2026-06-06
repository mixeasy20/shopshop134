const translations = {
    th: {
        nav_home: '<i class="fa-solid fa-house"></i> หน้าหลัก',
        nav_home_text: 'หน้าหลัก',
        nav_add: '<i class="fa-solid fa-circle-plus"></i> เพิ่มรายการ',
        nav_add_text: 'เพิ่ม',
        nav_history: '<i class="fa-solid fa-clock-rotate-left"></i> ประวัติ',
        nav_history_text: 'ประวัติ',
        nav_dashboard: '<i class="fa-solid fa-chart-pie"></i> สรุปรายเดือน',
        nav_dashboard_text: 'สรุป',
        nav_profile: '<i class="fa-solid fa-user"></i> โปรไฟล์',
        nav_profile_text: 'โปรไฟล์',
        hero_title: 'สวัสดี, <span id="hero-username">เพื่อน</span>! <i class="fa-regular fa-hand-spock"></i>',
        hero_subtitle: 'ยินดีต้อนรับกลับมา! เริ่มบันทึกรายจ่ายวันนี้กันเลย <i class="fa-solid fa-cart-shopping"></i>',
        stat_member_since: "เป็นสมาชิกตั้งแต่",
        stat_monthly_budget: "งบประมาณรายเดือน",
        stat_profile: "โปรไฟล์",
        budget_this_month: 'งบประมาณเดือนนี้ <i class="fa-solid fa-coins" style="color: var(--accent);"></i>',
        budget_remaining: "คงเหลือ: ฿{val}",
        budget_spent_info: "ใช้ไป ฿{spent} / งบ ฿{budget}",
        news_title: '<i class="fa-solid fa-bullhorn"></i> ข่าวสาร & อัปเดต',
        news_dev_title: '<i class="fa-solid fa-circle-info"></i> ประกาศจากผู้พัฒนา',
        news_dev_desc: "เริ่มบันทึกรายจ่ายได้เลย สวัสดีครับทุกคน ผมได้ทำเจ้าเว็บไซต์นี้ขึ้นมาเพื่อช่วยสำหรับคนที่อยากบันทึกค่าใช้จ่ายต่างนะครับ ก็เจอปัญหาอะไรสามารถติดต่อได้ที่",
        guide_title: '<i class="fa-solid fa-lightbulb" style="color: var(--accent);"></i> วิธีใช้งานแอปเบื้องต้น',
        guide_subtitle: "ทำตามขั้นตอนง่ายๆ เพื่อเริ่มจัดการการเงินของคุณ",
        guide_step1_title: "เพิ่มรายการ",
        guide_step1_desc: "บันทึกรายจ่ายของคุณได้ง่ายๆ เพียงกรอกชื่อและราคา",
        guide_step2_title: "ดูสรุปรายเดือน",
        guide_step2_desc: "ตรวจสอบสถิติและกราฟเพื่อดูว่าคุณใช้เงินไปกับอะไรบ้าง",
        guide_step3_title: "ตั้งงบประมาณ",
        guide_step3_desc: "กำหนดงบต่อเดือนเพื่อควบคุมการใช้จ่ายไม่ให้เกินตัว",
        guide_step4_title: "ปรับแต่งโปรไฟล์",
        guide_step4_desc: "เปลี่ยนอวตาร์และธีมสีที่ชอบได้ในหน้าโปรไฟล์",
        add_title: 'จดบันทึกรายการสิ่งของ <i class="fa-solid fa-pen-to-square"></i>',
        add_subtitle: "กรอกข้อมูลสิ่งที่คุณซื้อวันนี้",
        label_item_name: "ชื่อสิ่งของ",
        label_price: "ราคา (บาท)",
        label_category: "หมวดหมู่",
        label_date: "วันที่ซื้อ",
        placeholder_item_name: "เช่น น้ำยาล้างจาน, ทิชชู่",
        btn_save_item: '<i class="fa-solid fa-floppy-disk"></i> บันทึกรายการ',
        history_title: 'ประวัติการซื้อของ <i class="fa-solid fa-list-ul"></i>',
        history_subtitle: "รายการทั้งหมดที่คุณบันทึกไว้",
        search_placeholder: "ค้นหาชื่อ...",
        opt_all: "ทั้งหมด",
        filter_fav: '<i class="fa-solid fa-star" style="color: var(--accent);"></i> รายการโปรดเท่านั้น',
        label_favorite: '<i class="fa-solid fa-star" style="color: var(--accent);"></i> รายการโปรด',
        btn_list: '<i class="fa-solid fa-list"></i> รายการ',
        btn_group: '<i class="fa-solid fa-folder-open"></i> จัดกลุ่ม',
        btn_export: '<i class="fa-solid fa-file-excel"></i> ส่งออก Excel',
        btn_clear_all: '<i class="fa-solid fa-trash-can"></i> ล้างทั้งหมด',
        dash_total_month: "ยอดรวมเดือนนี้",
        dash_item_count: "จำนวนรายการ",
        dash_fav_count: "รายการโปรด",
        dash_chart_title: 'กราฟค่าใช้จ่าย <i class="fa-solid fa-chart-column"></i>',
        dash_category_ratio: 'สัดส่วนหมวดหมู่ <i class="fa-solid fa-chart-pie"></i>',
        opt_daily: "รายวัน (14 วันล่าสุด)",
        opt_monthly: "รายเดือน (ปีนี้)",
        opt_yearly: "รายปี (ย้อนหลัง 5 ปี)",
        profile_loading: "โหลดข้อมูล...",
        profile_since: "สมาชิกตั้งแต่: {date}",
        profile_edit_title: 'แก้ไขโปรไฟล์ <i class="fa-solid fa-pen-to-square"></i>',
        label_choose_avatar: "เลือกอวตาร์",
        label_display_name: "ชื่อที่แสดง",
        placeholder_display_name: "ชื่อของคุณ",
        label_choose_theme: '<i class="fa-solid fa-palette"></i> เลือกธีม (Theme)',
        theme_light: "สว่าง (Light)",
        theme_dark: "มืด (Dark)",
        theme_monokai: "Monokai",
        theme_cool_blue: "Cool Blue",
        theme_dark_ocean: "Dark Ocean",
        btn_save_profile: '<i class="fa-solid fa-floppy-disk"></i> บันทึกการตั้งค่า',
        btn_save: "บันทึก",
        cat_manage_title: 'จัดการหมวดหมู่ <i class="fa-solid fa-folder-open"></i>',
        cat_manage_subtitle: "เพิ่มหรือลบหมวดหมู่ของคุณเอง",
        placeholder_new_cat: "เช่น ขนม",
        btn_add: "เพิ่ม",
        logout_title: 'Log out <i class="fa-solid fa-triangle-exclamation"></i>',
        btn_logout: '<i class="fa-solid fa-right-from-bracket"></i> ออกจากระบบ',
        toast_save_success: "บันทึกรายการสำเร็จ!",
        toast_error: "เกิดข้อผิดพลาด กรุณาลองใหม่",
        toast_profile_success: "บันทึกโปรไฟล์สำเร็จ!",
        toast_budget_success: "ตั้งงบประมาณสำเร็จ!",
        toast_theme_success: "เปลี่ยนธีมเรียบร้อย!",
        toast_cat_exists: "มีหมวดหมู่นี้อยู่แล้ว",
        toast_cat_min: "ต้องมีอย่างน้อย 1 หมวดหมู่",
        toast_cat_updated: "อัปเดตหมวดหมู่แล้ว",
        toast_no_data: "ไม่มีข้อมูลให้ส่งออก",
        toast_export_success: "ส่งออกไฟล์เรียบร้อย!",
        confirm_delete_item: "ลบรายการนี้?",
        confirm_clear_all: "ล้างทั้งหมด?",
        confirm_delete_cat: "ลบหมวดหมู่ \"{name}\"?",
        welcome_msg: "ยินดีต้อนรับ! กรุณาตั้งชื่อและเลือกอวตาร์ก่อนครับ",
        history_empty: "ไม่มีรายการ",
        items_count: "{count} รายการ",
        chart_daily_label: "รายวัน",
        chart_monthly_label: "รายเดือน",
        chart_yearly_label: "รายปี",
        month_names: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."],
        
        avatar_tab_icon: "ใช้ไอคอน",
        avatar_tab_upload: "อัปโหลดรูป",
        upload_placeholder: "ลากไฟล์มาวางที่นี่ หรือคลิกเพื่ออัปโหลด",
        upload_hint: "รองรับ PNG, JPG, GIF (สูงสุด 5MB)",
        btn_remove_photo: "ลบรูปภาพ",
        toast_uploading: "กำลังอัปโหลดรูปภาพ...",
        toast_upload_success: "อัปโหลดรูปภาพสำเร็จ!",
        toast_upload_error: "อัปโหลดรูปภาพไม่สำเร็จ",
        toast_file_limit: "ขนาดไฟล์ต้องไม่เกิน 5MB",
        toast_file_type: "กรุณาเลือกไฟล์รูปภาพเท่านั้น",
        
        // Login Page
        login_tab: "เข้าสู่ระบบ",
        register_tab: "สมัครสมาชิก",
        label_email: '<i class="fa-solid fa-envelope"></i> อีเมล',
        label_password: '<i class="fa-solid fa-lock"></i> รหัสผ่าน',
        label_password_min: '<i class="fa-solid fa-lock"></i> รหัสผ่าน (อย่างน้อย 6 ตัว)',
        label_confirm_password: '<i class="fa-solid fa-lock"></i> ยืนยันรหัสผ่าน',
        btn_login: '<i class="fa-solid fa-right-from-bracket"></i> เข้าสู่ระบบ',
        btn_register: '<i class="fa-solid fa-user-plus"></i> สมัครสมาชิก',
        auth_divider: "หรือ",
        btn_google: "ดำเนินการต่อด้วย Google",
        login_tagline: 'จดบันทึกรายการสิ่งของของคุณ <i class="fa-solid fa-book-open"></i>',
        error_login_failed: "เข้าสู่ระบบไม่สำเร็จ: ",
        error_register_failed: "สมัครสมาชิกไม่สำเร็จ: ",
        error_pass_mismatch: "รหัสผ่านไม่ตรงกัน",
        error_google_failed: "Google Sign-In ไม่สำเร็จ: "
    },
    en: {
        nav_home: '<i class="fa-solid fa-house"></i> Home',
        nav_home_text: 'Home',
        nav_add: '<i class="fa-solid fa-circle-plus"></i> Add Item',
        nav_add_text: 'Add',
        nav_history: '<i class="fa-solid fa-clock-rotate-left"></i> History',
        nav_history_text: 'History',
        nav_dashboard: '<i class="fa-solid fa-chart-pie"></i> Dashboard',
        nav_dashboard_text: 'Summary',
        nav_profile: '<i class="fa-solid fa-user"></i> Profile',
        nav_profile_text: 'Profile',
        hero_title: 'Hello, <span id="hero-username">Friend</span>! <i class="fa-regular fa-hand-spock"></i>',
        hero_subtitle: 'Welcome back! Start recording your expenses today <i class="fa-solid fa-cart-shopping"></i>',
        stat_member_since: "Member Since",
        stat_monthly_budget: "Monthly Budget",
        stat_profile: "Profile",
        budget_this_month: 'This Month\'s Budget <i class="fa-solid fa-coins" style="color: var(--accent);"></i>',
        budget_remaining: "Remaining: ฿{val}",
        budget_spent_info: "Spent ฿{spent} / Budget ฿{budget}",
        news_title: '<i class="fa-solid fa-bullhorn"></i> News & Updates',
        news_dev_title: '<i class="fa-solid fa-circle-info"></i> Dev Announcement',
        news_dev_desc: "Start recording your expenses now! Hello everyone. I created this website to help people track their expenses. If you encounter any issues, feel free to contact me at",
        guide_title: '<i class="fa-solid fa-lightbulb" style="color: var(--accent);"></i> Quick Guide',
        guide_subtitle: "Follow these simple steps to manage your finances",
        guide_step1_title: "Add Items",
        guide_step1_desc: "Easily record your expenses by entering name and price",
        guide_step2_title: "View Summary",
        guide_step2_desc: "Check statistics and charts to see where your money goes",
        guide_step3_title: "Set Budget",
        guide_step3_desc: "Set a monthly budget to control your spending",
        guide_step4_title: "Customize Profile",
        guide_step4_desc: "Change your avatar and theme in the profile page",
        add_title: 'Record Item <i class="fa-solid fa-pen-to-square"></i>',
        add_subtitle: "Enter the information for what you bought today",
        label_item_name: "Item Name",
        label_price: "Price (Baht)",
        label_category: "Category",
        label_date: "Purchase Date",
        placeholder_item_name: "e.g., Dish soap, Tissue",
        btn_save_item: '<i class="fa-solid fa-floppy-disk"></i> Save Item',
        history_title: 'Purchase History <i class="fa-solid fa-list-ul"></i>',
        history_subtitle: "All items you've recorded",
        search_placeholder: "Search name...",
        opt_all: "All",
        filter_fav: '<i class="fa-solid fa-star" style="color: var(--accent);"></i> Favorites Only',
        label_favorite: '<i class="fa-solid fa-star" style="color: var(--accent);"></i> Favorite',
        btn_list: '<i class="fa-solid fa-list"></i> List View',
        btn_group: '<i class="fa-solid fa-folder-open"></i> Group View',
        btn_export: '<i class="fa-solid fa-file-excel"></i> Export Excel',
        btn_clear_all: '<i class="fa-solid fa-trash-can"></i> Clear All',
        dash_total_month: "Total this Month",
        dash_item_count: "Item Count",
        dash_fav_count: "Favorites",
        dash_chart_title: 'Expense Chart <i class="fa-solid fa-chart-column"></i>',
        dash_category_ratio: 'Category Ratio <i class="fa-solid fa-chart-pie"></i>',
        opt_daily: "Daily (Last 14 days)",
        opt_monthly: "Monthly (This year)",
        opt_yearly: "Yearly (Last 5 years)",
        profile_loading: "Loading data...",
        profile_since: "Member Since: {date}",
        profile_edit_title: 'Edit Profile <i class="fa-solid fa-pen-to-square"></i>',
        label_choose_avatar: "Choose Avatar",
        label_display_name: "Display Name",
        placeholder_display_name: "Your Name",
        label_choose_theme: '<i class="fa-solid fa-palette"></i> Choose Theme',
        theme_light: "Light",
        theme_dark: "Dark",
        theme_monokai: "Monokai",
        theme_cool_blue: "Cool Blue",
        theme_dark_ocean: "Dark Ocean",
        btn_save_profile: '<i class="fa-solid fa-floppy-disk"></i> Save Settings',
        btn_save: "Save",
        cat_manage_title: 'Manage Categories <i class="fa-solid fa-folder-open"></i>',
        cat_manage_subtitle: "Add or remove your custom categories",
        placeholder_new_cat: "e.g., Snacks",
        btn_add: "Add",
        logout_title: 'Log out <i class="fa-solid fa-triangle-exclamation"></i>',
        btn_logout: '<i class="fa-solid fa-right-from-bracket"></i> Log Out',
        toast_save_success: "Item saved successfully!",
        toast_error: "Error occurred, please try again",
        toast_profile_success: "Profile saved successfully!",
        toast_budget_success: "Budget set successfully!",
        toast_theme_success: "Theme changed!",
        toast_cat_exists: "Category already exists",
        toast_cat_min: "Need at least 1 category",
        toast_cat_updated: "Categories updated",
        toast_no_data: "No data to export",
        toast_export_success: "Export successful!",
        confirm_delete_item: "Delete this item?",
        confirm_clear_all: "Clear all data?",
        confirm_delete_cat: "Delete category \"{name}\"?",
        welcome_msg: "Welcome! Please set your name and choose an avatar",
        history_empty: "No items found",
        items_count: "{count} items",
        chart_daily_label: "Daily",
        chart_monthly_label: "Monthly",
        chart_yearly_label: "Yearly",
        month_names: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        
        avatar_tab_icon: "Use Icon",
        avatar_tab_upload: "Upload Photo",
        upload_placeholder: "Drag & drop file here or click to upload",
        upload_hint: "Supports PNG, JPG, GIF (Max 5MB)",
        btn_remove_photo: "Remove Photo",
        toast_uploading: "Uploading image...",
        toast_upload_success: "Image uploaded successfully!",
        toast_upload_error: "Failed to upload image",
        toast_file_limit: "File size must not exceed 5MB",
        toast_file_type: "Please select an image file only",
        
        // Login Page
        login_tab: "Login",
        register_tab: "Register",
        label_email: '<i class="fa-solid fa-envelope"></i> Email',
        label_password: '<i class="fa-solid fa-lock"></i> Password',
        label_password_min: '<i class="fa-solid fa-lock"></i> Password (min 6 chars)',
        label_confirm_password: '<i class="fa-solid fa-lock"></i> Confirm Password',
        btn_login: '<i class="fa-solid fa-right-from-bracket"></i> Login',
        btn_register: '<i class="fa-solid fa-user-plus"></i> Register',
        auth_divider: "OR",
        btn_google: "Continue with Google",
        login_tagline: 'Record your daily expenses <i class="fa-solid fa-book-open"></i>',
        error_login_failed: "Login failed: ",
        error_register_failed: "Registration failed: ",
        error_pass_mismatch: "Passwords do not match",
        error_google_failed: "Google Sign-In failed: "
    }
};

let currentLang = localStorage.getItem('lang') || 'th';

function applyTranslations() {
    const lang = translations[currentLang];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (lang[key]) {
            if (el.tagName === 'INPUT' && el.type !== 'submit' && el.type !== 'button') {
                el.placeholder = lang[key];
            } else {
                const translation = lang[key];
                const hasHTML = /<[a-z][\s\S]*>/i.test(translation);
                
                // If the translation has HTML (like the hero greeting), we use innerHTML
                // BUT only if the element doesn't contain critical inputs/images
                const hasCriticalChildren = el.querySelector('input, img, button');

                if (hasCriticalChildren) {
                    // NON-DESTRUCTIVE UPDATE:
                    // We only want to change the TEXT nodes inside this element, 
                    // preserving the actual DOM objects of the children.
                    let textUpdated = false;
                    Array.from(el.childNodes).forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== "") {
                            node.textContent = ` ${translation.replace(/<[^>]*>?/gm, '')} `; // Strip HTML if any for plain text nodes
                            textUpdated = true;
                        }
                    });
                    
                    // If no existing text node was found to update, append a new one
                    if (!textUpdated) {
                        el.appendChild(document.createTextNode(` ${translation.replace(/<[^>]*>?/gm, '')}`));
                    }
                } else if (hasHTML) {
                    el.innerHTML = translation;
                } else {
                    el.textContent = translation;
                }
            }
        }
    });

    // Highlight active lang btn
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    
    // Header buttons
    const activeBtn = document.getElementById(`lang-${currentLang}`);
    if (activeBtn) activeBtn.classList.add('active');

    // Profile buttons
    const activeProfileBtn = document.getElementById(`lang-profile-${currentLang}`);
    if (activeProfileBtn) activeProfileBtn.classList.add('active');
}

window.changeLanguage = (lang) => {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    
    // Page specific refreshes
    if (typeof allExpenses !== 'undefined') {
        if (typeof renderHistory === 'function') renderHistory(allExpenses);
        if (typeof updateStats === 'function') updateStats(allExpenses);
        if (typeof loadProfile === 'function') loadProfile();
    }
};

document.addEventListener('DOMContentLoaded', applyTranslations);
