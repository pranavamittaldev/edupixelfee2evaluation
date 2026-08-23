/**
 * SchoolPad / EduPixel - Authentication & Dynamic Navigation Management
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

// Toggle Mobile Slide-Out Drawer Overlay
function toggleMobileMenu() {
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (backdrop) {
        backdrop.classList.toggle('active');
    }
}

// Close Mobile Slide-Out Drawer Overlay
function closeMobileMenu() {
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (backdrop) {
        backdrop.classList.remove('active');
    }
}

// Render dynamic navbar, hamburger toggle, and mobile elements
function renderNavbar() {
    const headerElement = document.querySelector('header');
    const navElement = document.querySelector('header nav');
    const role = getUserRole();
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    const hash = window.location.hash;

    // Remove any existing hamburger button first
    const existingHamburger = document.querySelector('.hamburger-btn');
    if (existingHamburger) {
        existingHamburger.remove();
    }

    if (role === 'student' || role === 'admin') {
        // AUTHENTICATED USER (AFTER LOGIN) -> Show Hamburger Button ☰ and Mobile Drawer
        if (headerElement) {
            const hamburgerBtn = document.createElement('button');
            hamburgerBtn.className = 'hamburger-btn';
            hamburgerBtn.setAttribute('onclick', 'toggleMobileMenu()');
            hamburgerBtn.setAttribute('aria-label', 'Open Mobile Drawer Menu');
            hamburgerBtn.innerHTML = `<span class="material-symbols-outlined text-2xl font-bold">menu</span>`;
            headerElement.appendChild(hamburgerBtn);
        }

        // Render Desktop Nav Links
        if (navElement) {
            if (role === 'student') {
                const isDashboard = (page === 'profile.html' || page === 'student.html');
                const isAcademicProfile = (page === 'student-academic-profile.html');
                const isAcademics = (page === 'academics.html' || page === 'student-academics.html' || page === 'grades.html' || page === 'subjects.html' || page === 'timetable.html');
                const isAttendance = (page === 'attendance.html');
                const isFees = (page === 'student-fees.html');
                const isDocs = (page === 'student-documents.html' || page === 'certificates.html');
                const isRequests = (page === 'student-requests.html');
                const isCirculars = (page === 'circulars.html');
                const isMore = (page === 'student-campus.html' || page === 'student-career.html' || page === 'student-library.html' || page === 'student-hostel.html' || page === 'student-support.html' || page === 'student-settings.html');

                navElement.innerHTML = `
                    <a href="profile.html" class="${isDashboard ? 'nav-active' : ''}">Dashboard</a>
                    <a href="student-academic-profile.html" class="${isAcademicProfile ? 'nav-active' : ''}">Academic Profile</a>
                    <a href="academics.html" class="${isAcademics ? 'nav-active' : ''}">Academics</a>
                    <a href="attendance.html" class="${isAttendance ? 'nav-active' : ''}">Attendance</a>
                    <a href="student-fees.html" class="${isFees ? 'nav-active' : ''}">Fees</a>
                    <a href="student-documents.html" class="${isDocs ? 'nav-active' : ''}">Documents</a>
                    <a href="student-requests.html" class="${isRequests ? 'nav-active' : ''}">Requests</a>
                    <a href="circulars.html" class="${isCirculars ? 'nav-active' : ''}">Announcements</a>
                    <a href="student-career.html" class="${isMore ? 'nav-active' : ''}">Career & Campus</a>
                    <a href="student-settings.html" class="hover:text-primary font-bold">⚙️ Settings</a>
                    <a href="#" onclick="logout(); return false;" class="nav-logout-btn">Logout</a>
                `;
            } else if (role === 'admin') {
                const isDashboard = (page === 'admin.html');
                const isProfile = (page === 'admin-profile.html');
                const isAttendance = (page === 'admin-classes.html' || page === 'class-detail.html');
                const isSearch = (page === 'admin-search.html');
                const isLeaves = (page === 'admin-leaves.html');
                const isFeedback = (page === 'admin-feedback.html');
                const isLeaderboard = (page === 'admin-leaderboard.html');
                const isEscalation = (page === 'admin-escalations.html');
                const isActivity = (page === 'admin-activity.html');

                navElement.innerHTML = `
                    <a href="admin.html" class="${isDashboard ? 'nav-active' : ''}">Dashboard</a>
                    <a href="admin-profile.html" class="${isProfile ? 'nav-active' : ''}">Profile</a>
                    <a href="admin-classes.html" class="${isAttendance ? 'nav-active' : ''}">Attendance</a>
                    <a href="admin-search.html" class="${isSearch ? 'nav-active' : ''}">Search</a>
                    <a href="admin-leaves.html" class="${isLeaves ? 'nav-active' : ''}">Leaves</a>
                    <a href="admin-feedback.html" class="${isFeedback ? 'nav-active' : ''}">Feedback</a>
                    <a href="admin-leaderboard.html" class="${isLeaderboard ? 'nav-active' : ''}">LeetCode Rank</a>
                    <a href="admin-escalations.html" class="${isEscalation ? 'nav-active' : ''}">Escalate</a>
                    <a href="admin-activity.html" class="${isActivity ? 'nav-active' : ''}">Activity Log</a>
                    <a href="#" onclick="logout(); return false;" class="nav-logout-btn">Logout</a>
                `;
            }
        }

        // Render Mobile Drawer Overlay & Bottom Bar for Authenticated Users
        renderMobileDrawer(role, page);
        renderMobileBottomBar(role, page);

    } else {
        // PUBLIC GUEST (LOGIN / LANDING PAGE) -> NO Hamburger Button ☰ and NO Mobile Drawer
        if (navElement) {
            const isSignUp = (page === 'login.html');
            const isFeatures = (!isSignUp && hash === '#features');
            const isHome = (!isSignUp && !isFeatures);

            navElement.innerHTML = `
                <a href="index.html#home" class="${isHome ? 'nav-active' : ''}">Home</a>
                <a href="index.html#features" class="${isFeatures ? 'nav-active' : ''}">Features</a>
                <a href="login.html" class="${isSignUp ? 'nav-active' : ''}">Sign In</a>
            `;
        }

        // Remove mobile drawer & bottom bar if present
        const backdrop = document.getElementById('mobile-drawer-backdrop');
        if (backdrop) backdrop.remove();

        const bottomBar = document.getElementById('mobile-bottom-bar');
        if (bottomBar) bottomBar.remove();
    }
}

// Render Mobile Drawer Overlay (Shown AFTER Login)
function renderMobileDrawer(role, page) {
    let backdrop = document.getElementById('mobile-drawer-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'mobile-drawer-backdrop';
        backdrop.className = 'mobile-drawer-backdrop';
        backdrop.onclick = function(e) {
            if (e.target === backdrop) closeMobileMenu();
        };
        document.body.appendChild(backdrop);
    }

    let drawerContent = '';

    if (role === 'student') {
        drawerContent = `
            <a href="profile.html" class="mobile-drawer-link ${page === 'profile.html' ? 'active' : ''}">🎓 Dashboard</a>
            <a href="student-academic-profile.html" class="mobile-drawer-link ${page === 'student-academic-profile.html' ? 'active' : ''}">👤 Academic Profile</a>
            <a href="academics.html" class="mobile-drawer-link ${page === 'academics.html' ? 'active' : ''}">📖 Academic Details</a>
            <a href="attendance.html" class="mobile-drawer-link ${page === 'attendance.html' ? 'active' : ''}">🕐 Attendance Details</a>
            <a href="student-fees.html" class="mobile-drawer-link ${page === 'student-fees.html' ? 'active' : ''}">💰 Fees & Payments</a>
            <a href="student-documents.html" class="mobile-drawer-link ${page === 'student-documents.html' ? 'active' : ''}">📄 Documents Vault</a>
            <a href="student-requests.html" class="mobile-drawer-link ${page === 'student-requests.html' ? 'active' : ''}">📝 Applications & Leaves</a>
            <div class="mobile-drawer-divider"></div>
            <a href="circulars.html" class="mobile-drawer-link">📢 Announcements</a>
            <a href="student-career.html" class="mobile-drawer-link">💼 Career & Jobs</a>
            <a href="student-support.html" class="mobile-drawer-link">💬 Support & FAQs</a>
            <div class="mobile-drawer-divider"></div>
            <a href="student-settings.html" class="mobile-drawer-link">⚙️ Settings</a>
            <a href="#" onclick="logout(); return false;" class="mobile-drawer-link text-error" style="color: #ba1a1a;">🚪 Logout</a>
        `;
    } else if (role === 'admin') {
        drawerContent = `
            <a href="admin.html" class="mobile-drawer-link ${page === 'admin.html' ? 'active' : ''}">🛡️ Faculty Dashboard</a>
            <a href="admin-profile.html" class="mobile-drawer-link ${page === 'admin-profile.html' ? 'active' : ''}">👤 Faculty Profile</a>
            <a href="admin-classes.html" class="mobile-drawer-link ${page === 'admin-classes.html' ? 'active' : ''}">🏫 Attendance Roster</a>
            <a href="admin-search.html" class="mobile-drawer-link ${page === 'admin-search.html' ? 'active' : ''}">🔍 Student Search</a>
            <a href="admin-leaves.html" class="mobile-drawer-link ${page === 'admin-leaves.html' ? 'active' : ''}">🩺 Approve Leaves</a>
            <a href="admin-feedback.html" class="mobile-drawer-link ${page === 'admin-feedback.html' ? 'active' : ''}">💬 Student Feedback</a>
            <a href="admin-leaderboard.html" class="mobile-drawer-link ${page === 'admin-leaderboard.html' ? 'active' : ''}">🏆 LeetCode Rank</a>
            <a href="admin-escalations.html" class="mobile-drawer-link ${page === 'admin-escalations.html' ? 'active' : ''}">🚨 Higher Authorities</a>
            <a href="admin-activity.html" class="mobile-drawer-link ${page === 'admin-activity.html' ? 'active' : ''}">📜 Activity Edit Log</a>
            <div class="mobile-drawer-divider"></div>
            <a href="#" onclick="logout(); return false;" class="mobile-drawer-link text-error" style="color: #ba1a1a;">🚪 Logout</a>
        `;
    }

    backdrop.innerHTML = `
        <div class="mobile-drawer-container">
            <div class="mobile-drawer-header">
                <div class="flex items-center gap-2">
                    <span class="material-symbols-outlined text-primary text-2xl font-bold">grid_view</span>
                    <span class="font-headline-md text-2xl text-primary uppercase font-bold">EduPixel</span>
                </div>
                <button class="mobile-drawer-close" onclick="closeMobileMenu()">✕</button>
            </div>
            <div class="mobile-drawer-body">
                ${drawerContent}
            </div>
        </div>
    `;
}

// Render Fixed Mobile Bottom Bar (Shown AFTER Login)
function renderMobileBottomBar(role, page) {
    let bottomBar = document.getElementById('mobile-bottom-bar');
    if (!bottomBar) {
        bottomBar = document.createElement('nav');
        bottomBar.id = 'mobile-bottom-bar';
        bottomBar.className = 'mobile-bottom-bar';
        document.body.appendChild(bottomBar);
    }

    if (role === 'student') {
        bottomBar.innerHTML = `
            <a href="profile.html" class="mobile-bottom-tab ${page === 'profile.html' ? 'active' : ''}">
                <span class="material-symbols-outlined">dashboard</span>
                <span>Home</span>
            </a>
            <a href="academics.html" class="mobile-bottom-tab ${page === 'academics.html' ? 'active' : ''}">
                <span class="material-symbols-outlined">school</span>
                <span>Academics</span>
            </a>
            <a href="attendance.html" class="mobile-bottom-tab ${page === 'attendance.html' ? 'active' : ''}">
                <span class="material-symbols-outlined">event_available</span>
                <span>Attendance</span>
            </a>
            <a href="student-settings.html" class="mobile-bottom-tab ${page === 'student-settings.html' ? 'active' : ''}">
                <span class="material-symbols-outlined">settings</span>
                <span>Settings</span>
            </a>
        `;
    } else if (role === 'admin') {
        bottomBar.innerHTML = `
            <a href="admin.html" class="mobile-bottom-tab ${page === 'admin.html' ? 'active' : ''}">
                <span class="material-symbols-outlined">admin_panel_settings</span>
                <span>Admin</span>
            </a>
            <a href="admin-classes.html" class="mobile-bottom-tab ${page === 'admin-classes.html' ? 'active' : ''}">
                <span class="material-symbols-outlined">groups</span>
                <span>Roster</span>
            </a>
            <a href="admin-search.html" class="mobile-bottom-tab ${page === 'admin-search.html' ? 'active' : ''}">
                <span class="material-symbols-outlined">search</span>
                <span>Search</span>
            </a>
            <a href="admin-leaves.html" class="mobile-bottom-tab ${page === 'admin-leaves.html' ? 'active' : ''}">
                <span class="material-symbols-outlined">medical_services</span>
                <span>Leaves</span>
            </a>
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

// Handle Admin Login
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
    window.location.href = 'admin.html';
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

// Automatically render navbar & mobile elements when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    renderNavbar();
});

window.addEventListener('hashchange', function() {
    renderNavbar();
});
