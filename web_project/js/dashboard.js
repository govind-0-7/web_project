console.log("dashboard.js loaded");

// Sample Course Data
const coursesData = [
    { code: "CS101", name: "Web Programming", credits: 3, instructor: "Dr. Arul Kumar", seats: 30 },
    { code: "CS201", name: "Data Structures", credits: 4, instructor: "Prof. Meera", seats: 25 },
    { code: "CS301", name: "Database Systems", credits: 3, instructor: "Dr. Rajesh", seats: 20 },
    { code: "CS401", name: "Machine Learning", credits: 3, instructor: "Dr. Anjali", seats: 15 },
    { code: "CS501", name: "Cloud Computing", credits: 3, instructor: "Prof. Vikram", seats: 18 }
];

// Get current user from localStorage
let currentUser = JSON.parse(localStorage.getItem('currentUser'));
let users = JSON.parse(localStorage.getItem('users'));

// If no currentUser, redirect to login (already handled in auth.js, but safe check)
if (!currentUser && window.location.pathname.includes('dashboard')) {
    window.location.href = 'login.html';
}

// Update user data in localStorage
function updateUserInStorage(updatedUser) {
    const index = users.findIndex(u => u.email === updatedUser.email);
    if (index !== -1) {
        users[index] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        currentUser = updatedUser;
    }
}

// Render Available Courses Table
function renderAvailableCourses() {
    const tbody = document.querySelector('#coursesTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    coursesData.forEach(course => {
        const isRegistered = currentUser.registeredCourses.includes(course.code);
        const row = `<tr>
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>${course.instructor}</td>
            <td>${course.seats}</td>
            <td>${!isRegistered ? `<button class="btn-register" data-code="${course.code}">Register</button>` : `<button class="btn-drop" data-code="${course.code}">Drop</button>`}</td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    // Register button listeners
    document.querySelectorAll('.btn-register').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const code = btn.getAttribute('data-code');
            if (!currentUser.registeredCourses.includes(code)) {
                currentUser.registeredCourses.push(code);
                updateUserInStorage(currentUser);
                renderAvailableCourses();
                renderMyCourses();
                updateDashboardStats();
                alert(`Registered for ${code} successfully!`);
            }
        });
    });

    // Drop button listeners (available courses table)
    document.querySelectorAll('#coursesTable .btn-drop').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const code = btn.getAttribute('data-code');
            currentUser.registeredCourses = currentUser.registeredCourses.filter(c => c !== code);
            updateUserInStorage(currentUser);
            renderAvailableCourses();
            renderMyCourses();
            updateDashboardStats();
            alert(`Dropped ${code}`);
        });
    });
}

// Render My Registered Courses
function renderMyCourses() {
    const tbody = document.querySelector('#mycoursesTable tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const registered = currentUser.registeredCourses;
    const myCourses = coursesData.filter(c => registered.includes(c.code));
    if (myCourses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No courses registered yet.</td></tr>';
        return;
    }
    myCourses.forEach(course => {
        const row = `<tr>
            <td>${course.code}</td>
            <td>${course.name}</td>
            <td>${course.credits}</td>
            <td>${course.instructor}</td>
            <td><button class="btn-drop" data-code="${course.code}">Drop</button></td>
        </tr>`;
        tbody.insertAdjacentHTML('beforeend', row);
    });

    // Drop button listeners (my courses table)
    document.querySelectorAll('#mycoursesTable .btn-drop').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const code = btn.getAttribute('data-code');
            currentUser.registeredCourses = currentUser.registeredCourses.filter(c => c !== code);
            updateUserInStorage(currentUser);
            renderAvailableCourses();
            renderMyCourses();
            updateDashboardStats();
            alert(`Dropped ${code}`);
        });
    });
}

// Update dashboard statistics and profile info
function updateDashboardStats() {
    document.getElementById('regCount').innerText = currentUser.registeredCourses.length;
    document.getElementById('availCount').innerText = coursesData.length;
    document.getElementById('profileRegCount').innerText = currentUser.registeredCourses.length;
    document.getElementById('studentName').innerText = currentUser.name;
    document.getElementById('profileName').innerText = currentUser.name;
    document.getElementById('profileEmail').innerText = currentUser.email;
}

// Sidebar Navigation (exclude logout button)
function initDashboard() {
    if (!currentUser) return;

    updateDashboardStats();
    renderAvailableCourses();
    renderMyCourses();

    const sections = ['dashboardSection', 'coursesSection', 'mycoursesSection', 'profileSection'];

    document.querySelectorAll('.sidebar .nav-link').forEach(link => {
        // Skip the logout button
        if (link.id === 'logoutBtn') return;

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-section');

            // Hide all sections
            sections.forEach(section => {
                const el = document.getElementById(section);
                if (el) el.classList.add('d-none');
            });

            // Show selected section
            if (target === 'dashboard') {
                const dashboardSec = document.getElementById('dashboardSection');
                if (dashboardSec) dashboardSec.classList.remove('d-none');
            } else if (target === 'courses') {
                const coursesSec = document.getElementById('coursesSection');
                if (coursesSec) coursesSec.classList.remove('d-none');
            } else if (target === 'mycourses') {
                const mycoursesSec = document.getElementById('mycoursesSection');
                if (mycoursesSec) mycoursesSec.classList.remove('d-none');
            } else if (target === 'profile') {
                const profileSec = document.getElementById('profileSection');
                if (profileSec) profileSec.classList.remove('d-none');
            }

            // Update active class
            document.querySelectorAll('.sidebar .nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

// Run dashboard initialization only on dashboard page
if (window.location.pathname.includes('dashboard')) {
    document.addEventListener('DOMContentLoaded', initDashboard);
}