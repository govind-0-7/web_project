console.log("auth.js loaded");

// Initialize users in localStorage if not exists
if (!localStorage.getItem('users')) {
    const defaultUser = {
        name: "Shaurya Pandey",
        email: "shaurya@vit.ac.in",
        password: "123456",
        registeredCourses: []
    };
    localStorage.setItem('users', JSON.stringify([defaultUser]));
    console.log("Default user created");
}

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready");

    // Registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        console.log("Register form found");
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Register submitted");

            const name = document.getElementById('regName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value;
            const confirm = document.getElementById('regConfirmPassword').value;
            const emailError = document.getElementById('emailError');
            const passError = document.getElementById('passwordError');
            const regError = document.getElementById('regError');

            emailError.innerText = '';
            passError.innerText = '';
            regError.classList.add('d-none');

            let valid = true;
            if (name === '') valid = false;
            if (email === '') {
                emailError.innerText = 'Email is required';
                valid = false;
            }
            if (password.length < 6) {
                passError.innerText = 'Password must be at least 6 characters';
                valid = false;
            }
            if (password !== confirm) {
                passError.innerText = 'Passwords do not match';
                valid = false;
            }

            const users = JSON.parse(localStorage.getItem('users'));
            if (users.find(u => u.email === email)) {
                regError.innerText = 'Email already registered';
                regError.classList.remove('d-none');
                valid = false;
            }

            if (!valid) return;

            const newUser = { name, email, password, registeredCourses: [] };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        });
    } else {
        console.log("Register form not on this page");
    }

    // Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log("Login form found");
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log("Login submitted");

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                console.log("Login success");
                window.location.href = 'dashboard.html';
            } else {
                const errorDiv = document.getElementById('loginError');
                errorDiv.innerText = 'Invalid email or password';
                errorDiv.classList.remove('d-none');
                console.log("Login failed");
            }
        });
    } else {
        console.log("Login form not on this page");
    }
});

// Dashboard protection
if (window.location.pathname.includes('dashboard')) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
    }
}

// Logout
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}