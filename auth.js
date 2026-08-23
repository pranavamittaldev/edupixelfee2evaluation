/**
 * SchoolPad - Authentication & Session Management
 * Basic Vanilla JavaScript without external dependencies (adheres to rules.md)
 */

// Get current user role ('student', 'admin', or null)
function getUserRole() {
    return localStorage.getItem('userRole');
}

// Get logged in username
function getUsername() {
    return localStorage.getItem('username') || (getUserRole() === 'admin' ? 'Dr. Rajesh Kumar' : 'Arjun Sharma');
}

// Log out user and return to public home page
function logout() {
    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Render dynamic navbar based on user authentication state and active page
function renderNavbar() {
    const navElement = document.querySelector('header nav');
    if (!navElement) return;

    const role = getUserRole();
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    const hash = window.location.hash;

    if (role === 'student') {
        // Authenticated Student Navbar: Profile | Circulars | Academics | Logout
        const isProfile = (page === 'profile.html' || page === 'student.html');
        const isCirculars = (page === 'circulars.html');
        const isAcademics = (
            page === 'academics.html' ||
            page === 'grades.html' ||
            page === 'certificates.html' ||
            page === 'subjects.html' ||
            page === 'timetable.html' ||
            page === 'attendance.html' ||
            page === 'academic-calendar.html'
        );

        navElement.innerHTML = `
            <a href="profile.html" class="${isProfile ? 'nav-active' : ''}">Profile</a>
            <a href="circulars.html" class="${isCirculars ? 'nav-active' : ''}">Circulars</a>
            <a href="academics.html" class="${isAcademics ? 'nav-active' : ''}">Academics</a>
            <a href="#" onclick="logout(); return false;" class="nav-logout-btn">Logout</a>
        `;
    } else if (role === 'admin') {
        // Authenticated Admin/Teacher Navbar: Profile | Attendance | Logout
        const isProfile = (page === 'admin-profile.html');
        const isAttendance = (page === 'admin-classes.html' || page === 'class-detail.html' || page === 'admin.html');

        navElement.innerHTML = `
            <a href="admin-profile.html" class="${isProfile ? 'nav-active' : ''}">Profile</a>
            <a href="admin-classes.html" class="${isAttendance ? 'nav-active' : ''}">Attendance</a>
            <a href="#" onclick="logout(); return false;" class="nav-logout-btn">Logout</a>
        `;
    } else {
        // Public Navbar: Home | Features | Sign Up (links directly to Student Sign In / login.html)
        const isSignUp = (page === 'login.html');
        const isFeatures = (!isSignUp && hash === '#features');
        const isHome = (!isSignUp && !isFeatures);

        navElement.innerHTML = `
            <a href="index.html#home" class="${isHome ? 'nav-active' : ''}">Home</a>
            <a href="index.html#features" class="${isFeatures ? 'nav-active' : ''}">Features</a>
            <a href="login.html" class="${isSignUp ? 'nav-active' : ''}">Sign Up</a>
        `;
    }
}

// Handle Student Login
function handleStudentLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('student-username');
    const username = usernameInput ? usernameInput.value.trim() : 'Arjun Sharma';

    if (!username) {
        alert('Please enter your username.');
        return;
    }

    localStorage.setItem('userRole', 'student');
    localStorage.setItem('username', username);
    window.location.href = 'profile.html';
}

// Handle Admin Login -> Redirects to Admin Profile by default
function handleAdminLogin(event) {
    event.preventDefault();
    const usernameInput = document.getElementById('admin-username');
    const username = usernameInput ? usernameInput.value.trim() : 'Dr. Rajesh Kumar';

    if (!username) {
        alert('Please enter your admin username.');
        return;
    }

    localStorage.setItem('userRole', 'admin');
    localStorage.setItem('username', username);
    window.location.href = 'admin-profile.html';
}

// Switch between Student and Admin Login forms on login.html
function showLoginTab(tab) {
    const studentCard = document.getElementById('student-login-card');
    const adminCard = document.getElementById('admin-login-card');

    if (!studentCard || !adminCard) return;

    if (tab === 'admin') {
        studentCard.style.display = 'none';
        adminCard.style.display = 'block';
    } else {
        studentCard.style.display = 'block';
        adminCard.style.display = 'none';
    }
}

// Automatically render navbar when DOM content is loaded or hash changes
document.addEventListener('DOMContentLoaded', function() {
    renderNavbar();
});

window.addEventListener('hashchange', function() {
    renderNavbar();
});
