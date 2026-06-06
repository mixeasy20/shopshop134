// auth.js — Login, Register & Google Sign-In Logic (Firebase compat CDN)

// Tab Switching
document.getElementById("tab-login-btn").addEventListener("click", () => {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("tab-login-btn").classList.add("active");
    document.getElementById("tab-register-btn").classList.remove("active");
});

document.getElementById("tab-register-btn").addEventListener("click", () => {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
    document.getElementById("tab-register-btn").classList.add("active");
    document.getElementById("tab-login-btn").classList.remove("active");
});

// Login
document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
        await auth.signInWithEmailAndPassword(email, password);
        window.location.href = "index.html";
    } catch (err) {
        console.error("Login error:", err);
        document.getElementById("login-error").innerText = translations[currentLang].error_login_failed + (err.message || "error");
    }
});

// Register
document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;
    const confirm = document.getElementById("reg-confirm").value;
    
    if (password !== confirm) {
        document.getElementById("register-error").innerText = translations[currentLang].error_pass_mismatch;
        return;
    }
    try {
        await auth.createUserWithEmailAndPassword(email, password);
        window.location.href = "index.html";
    } catch (err) {
        console.error("Register error:", err);
        document.getElementById("register-error").innerText = translations[currentLang].error_register_failed + (err.message || "error");
    }
});

// Google Sign-In
document.getElementById("google-btn").addEventListener("click", async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
        await auth.signInWithPopup(provider);
        window.location.href = "index.html";
    } catch (err) {
        console.error("Google Sign-In error:", err);
        document.getElementById("google-error").innerText = translations[currentLang].error_google_failed + (err.message || "error");
    }
});
