<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>เข้าสู่ระบบ - shopshop134 🥧</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Floating Blobs -->
    <div class="blob blob-1"></div>
    <div class="blob blob-2"></div>
    <div class="blob blob-3"></div>

    <div class="login-container">
        <div class="login-card">
            <div class="login-logo">🥧</div>
            <h1 class="login-brand">shopshop134</h1>
            <p class="login-tagline">จดบันทึกรายการสิ่งของของคุณ 📕</p>

            <!-- Tab Toggle -->
            <div class="auth-tabs">
                <button class="auth-tab active" id="tab-login-btn">เข้าสู่ระบบ</button>
                <button class="auth-tab" id="tab-register-btn">สมัครสมาชิก</button>
            </div>

            <!-- Login Form -->
            <form id="login-form" class="auth-form">
                <div class="input-group">
                    <label for="login-email">📧 อีเมล</label>
                    <input type="email" id="login-email" placeholder="example@email.com" required>
                </div>
                <div class="input-group">
                    <label for="login-password">🔒 รหัสผ่าน</label>
                    <input type="password" id="login-password" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-glow">🚀 เข้าสู่ระบบ</button>
                <p id="login-error" class="error-msg"></p>
            </form>

            <!-- Register Form -->
            <form id="register-form" class="auth-form" style="display:none;">
                <div class="input-group">
                    <label for="reg-email">📧 อีเมล</label>
                    <input type="email" id="reg-email" placeholder="example@email.com" required>
                </div>
                <div class="input-group">
                    <label for="reg-password">🔒 รหัสผ่าน (อย่างน้อย 6 ตัว)</label>
                    <input type="password" id="reg-password" placeholder="••••••••" required>
                </div>
                <div class="input-group">
                    <label for="reg-confirm">🔒 ยืนยันรหัสผ่าน</label>
                    <input type="password" id="reg-confirm" placeholder="••••••••" required>
                </div>
                <button type="submit" class="btn btn-glow">✨ สมัครสมาชิก</button>
                <p id="register-error" class="error-msg"></p>
            </form>

            <!-- Divider -->
            <div class="auth-divider"><span>หรือ</span></div>

            <!-- Google Sign-In Button -->
            <button id="google-btn" class="btn-google">
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20">
                ดำเนินการต่อด้วย Google
            </button>
            <p id="google-error" class="error-msg"></p>

        </div>
    </div>

    <!-- Firebase CDN -->
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore-compat.js"></script>
    <script src="firebase-init.js"></script>
    <script src="auth.js"></script>
</body>
</html>