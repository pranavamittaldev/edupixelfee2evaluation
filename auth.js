/**
 * SchoolPad / EduPixel - Authentication & Dynamic Navigation Management
 */

// -------------------------------------------------------------
// 1. RETRO 8-BIT AUDIO SYNTHESIZER (Web Audio API)
// -------------------------------------------------------------
function playRetroSound(type = 'click') {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        const now = ctx.currentTime;

        if (type === 'click') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(360, now);
            osc.frequency.exponentialRampToValueAtTime(720, now + 0.04);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
            osc.start(now);
            osc.stop(now + 0.04);
        } else if (type === 'success') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(523.25, now); // C5
            osc.frequency.setValueAtTime(659.25, now + 0.07); // E5
            osc.frequency.setValueAtTime(783.99, now + 0.14); // G5
            osc.frequency.setValueAtTime(1046.50, now + 0.21); // C6
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.32);
            osc.start(now);
            osc.stop(now + 0.32);
        } else if (type === 'error') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(260, now);
            osc.frequency.linearRampToValueAtTime(110, now + 0.18);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
            osc.start(now);
            osc.stop(now + 0.22);
        } else if (type === 'coin') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(987.77, now); // B5
            osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
            osc.start(now);
            osc.stop(now + 0.28);
        }
    } catch (e) {
        // Silently catch audio restrictions
    }
}

// -------------------------------------------------------------
// 2. RETRO PIXEL TOAST NOTIFICATIONS
// -------------------------------------------------------------
function showToast(message, type = 'info', title = null, duration = 3500) {
    let container = document.getElementById('pixel-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'pixel-toast-container';
        document.body.appendChild(container);
    }

    playRetroSound(type === 'error' ? 'error' : (type === 'success' ? 'success' : 'click'));

    const toast = document.createElement('div');
    toast.className = `pixel-toast pixel-toast-${type}`;

    const icons = {
        success: '🎮',
        error: '👾',
        info: '📜',
        warning: '⚡'
    };
    const defaultTitles = {
        success: 'QUEST COMPLETE / SUCCESS',
        error: 'ACTION FAILED / ERROR',
        info: 'EDUPIXEL SYSTEM NOTICE',
        warning: 'WARNING ALERT'
    };

    const icon = icons[type] || '★';
    const tTitle = title || defaultTitles[type] || 'NOTIFICATION';

    toast.innerHTML = `
        <div class="pixel-toast-icon">${icon}</div>
        <div class="pixel-toast-body">
            <div class="pixel-toast-title">${tTitle}</div>
            <div class="pixel-toast-message">${message}</div>
        </div>
        <button class="pixel-toast-close" onclick="this.parentElement.remove()" aria-label="Close">✕</button>
        <div class="pixel-toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('toast-closing');
        setTimeout(() => toast.remove(), 250);
    }, duration);
}

// Global replacement of browser alert with modern retro toast!
window.alert = function(msg) {
    const str = String(msg || '');
    const isSuccess = str.includes('✓') || str.toLowerCase().includes('success') || str.toLowerCase().includes('renewed') || str.toLowerCase().includes('enrolled') || str.toLowerCase().includes('applied') || str.toLowerCase().includes('submitted');
    const isError = str.includes('⚠️') || str.toLowerCase().includes('error') || str.toLowerCase().includes('fail') || str.toLowerCase().includes('not match');
    showToast(str, isSuccess ? 'success' : (isError ? 'error' : 'info'));
};

// -------------------------------------------------------------
// 3. RETRO PIXEL MODAL DIALOGS
// -------------------------------------------------------------
function showModal({ title, content, confirmText = 'Confirm', cancelText = 'Cancel', onConfirm = null, onCancel = null, showCancel = true }) {
    let backdrop = document.getElementById('pixel-modal-backdrop');
    if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = 'pixel-modal-backdrop';
        document.body.appendChild(backdrop);
    }

    backdrop.innerHTML = `
        <div class="pixel-modal-box">
            <div class="pixel-modal-header">
                <h3 class="pixel-modal-title">${title}</h3>
                <button class="pixel-modal-close-btn" id="modal-close-x">✕</button>
            </div>
            <div class="pixel-modal-body">
                ${content}
            </div>
            <div class="pixel-modal-footer">
                ${showCancel ? `<button type="button" class="btn-pixel btn-pixel-secondary text-sm py-2 px-4" id="modal-cancel-btn">${cancelText}</button>` : ''}
                <button type="button" class="btn-pixel text-sm py-2 px-4" id="modal-confirm-btn">${confirmText}</button>
            </div>
        </div>
    `;

    backdrop.classList.add('active');
    playRetroSound('click');

    const close = () => {
        backdrop.classList.remove('active');
    };

    document.getElementById('modal-close-x').onclick = () => {
        close();
        if (onCancel) onCancel();
    };
    if (showCancel) {
        document.getElementById('modal-cancel-btn').onclick = () => {
            close();
            if (onCancel) onCancel();
        };
    }
    document.getElementById('modal-confirm-btn').onclick = () => {
        if (onConfirm) {
            const shouldClose = onConfirm();
            if (shouldClose !== false) close();
        } else {
            close();
        }
    };
    backdrop.onclick = (e) => {
        if (e.target === backdrop) {
            close();
            if (onCancel) onCancel();
        }
    };
}

function closeModal() {
    const backdrop = document.getElementById('pixel-modal-backdrop');
    if (backdrop) backdrop.classList.remove('active');
}

// -------------------------------------------------------------
// 4. CROSS-PORTAL DATA SYNC (LOCALSTORAGE ENGINE)
// -------------------------------------------------------------
const EduPixelDB = {
    // Leave & Gate Pass Requests (shared between Student and Admin)
    getRequests() {
        const stored = localStorage.getItem('edupixel_requests');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) {}
        }
        const initial = [
            { id: 'REQ-8021', studentName: 'Arjun Sharma', roll: 'Roll 101 (10-A)', category: 'Medical Leave', dates: 'Aug 24 – Aug 26, 2026 (3 Days)', reason: 'Viral Fever & Doctor Prescription', file: 'Medical_Certificate_101.pdf', status: 'PENDING', dateSubmitted: '22 August 2026' },
            { id: 'REQ-7450', studentName: 'Arjun Sharma', roll: 'Roll 101 (10-A)', category: 'Bonafide Certificate', dates: 'N/A', reason: 'Bank Education Loan Passport Verification', file: 'Bonafide_Draft.pdf', status: 'APPROVED', dateSubmitted: '10 August 2026' },
            { id: 'REQ-8022', studentName: 'Riya Kapoor', roll: 'Roll 102 (10-A)', category: 'Duty Leave (Hackathon)', dates: 'Aug 28 – Aug 29, 2026 (2 Days)', reason: 'Inter-University Pixel Hackathon Participation', file: 'Event_Permission_102.pdf', status: 'PENDING', dateSubmitted: '23 August 2026' },
            { id: 'REQ-8023', studentName: 'Vikram Malhotra', roll: 'Roll 401 (12-A)', category: 'Duty Leave (Sports)', dates: 'Sep 01 – Sep 03, 2026 (3 Days)', reason: 'State Level Football Tournament', file: 'Sports_Council_Duty.pdf', status: 'PENDING', dateSubmitted: '24 August 2026' }
        ];
        localStorage.setItem('edupixel_requests', JSON.stringify(initial));
        return initial;
    },
    saveRequests(requests) {
        localStorage.setItem('edupixel_requests', JSON.stringify(requests));
    },
    addRequest(req) {
        const requests = this.getRequests();
        requests.unshift(req);
        this.saveRequests(requests);
        this.logActivity(`Student Submitted Request`, `${req.studentName} applied for ${req.category} (${req.id})`, req.studentName);
        return req;
    },
    updateRequestStatus(id, newStatus, adminNotes = '') {
        const requests = this.getRequests();
        const req = requests.find(r => r.id === id);
        if (req) {
            req.status = newStatus;
            req.adminNotes = adminNotes;
            req.resolvedAt = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            this.saveRequests(requests);
            this.logActivity(`Faculty ${newStatus} Leave`, `Application ${id} for ${req.studentName} was ${newStatus.toLowerCase()}`, getUsername());
        }
        return req;
    },

    // Hostel Maintenance Complaints
    getHostelTickets() {
        const stored = localStorage.getItem('edupixel_hostel_tickets');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) {}
        }
        const initial = [
            { id: 'HST-3041', room: 'Block B — Room 304', studentName: 'Arjun Sharma', category: 'Plumbing', issue: 'Geyser not heating up properly in the morning', status: 'RESOLVED', priority: 'Medium', date: '20 August 2026' },
            { id: 'HST-3042', room: 'Block B — Room 304', studentName: 'Arjun Sharma', category: 'Electrical', issue: 'Ceiling fan regulator is stuck at maximum speed', status: 'IN_PROGRESS', priority: 'High', date: '23 August 2026' }
        ];
        localStorage.setItem('edupixel_hostel_tickets', JSON.stringify(initial));
        return initial;
    },
    saveHostelTickets(tickets) {
        localStorage.setItem('edupixel_hostel_tickets', JSON.stringify(tickets));
    },
    addHostelTicket(ticket) {
        const tickets = this.getHostelTickets();
        tickets.unshift(ticket);
        this.saveHostelTickets(tickets);
        this.logActivity('Hostel Maintenance Logged', `${ticket.studentName} (${ticket.room}) logged ${ticket.category} complaint: ${ticket.issue}`, ticket.studentName);
        return ticket;
    },
    resolveHostelTicket(id) {
        const tickets = this.getHostelTickets();
        const ticket = tickets.find(t => t.id === id);
        if (ticket) {
            ticket.status = 'RESOLVED';
            this.saveHostelTickets(tickets);
            this.logActivity('Hostel Ticket Resolved', `Warden resolved ${ticket.category} ticket (${id}) for ${ticket.room}`, getUsername());
        }
        return ticket;
    },

    // Activity Logger
    getActivities() {
        const stored = localStorage.getItem('edupixel_activities');
        if (stored) {
            try { return JSON.parse(stored); } catch(e) {}
        }
        const initial = [
            { action: 'Portal Initialized', details: 'Database synced with local storage', user: 'System', time: 'Just now' },
            { action: 'Timetable Published', details: 'Fall 2026 schedule made live for CSE 3rd Sem', user: 'Dr. Rajesh Kumar', time: '10:00 AM, 24 Aug' },
            { action: 'Hostel Inspection', details: 'Block B water supply checks completed', user: 'Hostel Warden', time: '09:15 AM, 24 Aug' }
        ];
        localStorage.setItem('edupixel_activities', JSON.stringify(initial));
        return initial;
    },
    logActivity(action, details, user) {
        const activities = this.getActivities();
        activities.unshift({
            action,
            details,
            user: user || getUsername(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        });
        localStorage.setItem('edupixel_activities', JSON.stringify(activities.slice(0, 30)));
    }
};

// -------------------------------------------------------------
// 5. AUTHENTICATION & SESSION MANAGEMENT
// -------------------------------------------------------------
// Pre-registered demo accounts
const DEFAULT_ACCOUNTS = {
    student: {
        username: 'Arjun Sharma',
        password: 'password123',
        role: 'student',
        name: 'Arjun Sharma',
        roll: '23BCS101',
        section: '10-A',
        program: 'B.Tech Computer Science & Engineering',
        semester: '3rd Semester',
        email: 'arjun.sharma@edupixel.edu',
        room: 'Block B — Room 304',
        attendance: '87.4%',
        cgpa: '8.92'
    },
    admin: {
        username: 'Dr. Rajesh Kumar',
        password: 'admin123',
        role: 'admin',
        name: 'Dr. Rajesh Kumar',
        empId: 'FAC-082',
        designation: 'Professor & Head of Department',
        department: 'Computer Science & Engineering',
        email: 'rajesh.kumar@edupixel.edu',
        office: 'Academic Block 4, Room 201'
    }
};

// Helper to get registered accounts (from sessionStorage or localStorage)
function getRegisteredAccounts() {
    let users = { ...DEFAULT_ACCOUNTS };
    try {
        const stored = sessionStorage.getItem('edupixel_users') || localStorage.getItem('edupixel_users');
        if (stored) {
            users = Object.assign({}, DEFAULT_ACCOUNTS, JSON.parse(stored));
        }
    } catch(e) {}
    return users;
}

// Helper to save registered accounts into both storages
function saveRegisteredAccounts(users) {
    try {
        sessionStorage.setItem('edupixel_users', JSON.stringify(users));
        localStorage.setItem('edupixel_users', JSON.stringify(users));
    } catch(e) {}
}

// Initialize accounts into sessionStorage and localStorage if not present
if (!sessionStorage.getItem('edupixel_users') && !localStorage.getItem('edupixel_users')) {
    saveRegisteredAccounts(DEFAULT_ACCOUNTS);
}

// Get current user role ('student', 'admin', or null) - reads sessionStorage first
function getUserRole() {
    return sessionStorage.getItem('userRole') || localStorage.getItem('userRole');
}

// Get logged in username - reads sessionStorage first
function getUsername() {
    return sessionStorage.getItem('username') || localStorage.getItem('username') || (getUserRole() === 'admin' ? 'Dr. Rajesh Kumar' : 'Arjun Sharma');
}

// Get current full user profile from sessionStorage (with fallback)
function getCurrentUser() {
    const raw = sessionStorage.getItem('edupixel_current_user') || localStorage.getItem('edupixel_current_user');
    if (raw) {
        try { return JSON.parse(raw); } catch(e) {}
    }
    const role = getUserRole();
    const accounts = getRegisteredAccounts();
    return role ? (accounts[role] || DEFAULT_ACCOUNTS[role]) : null;
}

// Store active authenticated session into sessionStorage
function setSessionUser(role, username, userObj) {
    sessionStorage.setItem('userRole', role);
    sessionStorage.setItem('username', username);
    sessionStorage.setItem('edupixel_current_user', JSON.stringify(userObj));
    sessionStorage.setItem('edupixel_login_time', new Date().toISOString());

    // Also mirror to localStorage for backward compatibility across tabs
    localStorage.setItem('userRole', role);
    localStorage.setItem('username', username);
    localStorage.setItem('edupixel_current_user', JSON.stringify(userObj));
    localStorage.setItem('edupixel_login_time', new Date().toISOString());
}

// Log out user and clear session state
function logout() {
    playRetroSound('click');
    sessionStorage.removeItem('userRole');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('edupixel_current_user');
    sessionStorage.removeItem('edupixel_login_time');

    localStorage.removeItem('userRole');
    localStorage.removeItem('username');
    localStorage.removeItem('edupixel_current_user');
    localStorage.removeItem('edupixel_login_time');

    showToast('👋 Session terminated. Successfully logged out.', 'info', 'LOGOUT');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 600);
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
            navElement.style.display = 'flex';
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
        // PUBLIC GUEST (LOGIN / LANDING PAGE) -> REMOVE NAV BAR WHEN NOT LOGGED IN
        if (navElement) {
            navElement.innerHTML = '';
            navElement.style.display = 'none';
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
                    <img src="logo.png" alt="EduPixel Logo" class="h-8 w-auto object-contain">
                    <span class="brand-logo-text text-2xl uppercase flex items-center">
                        <span style="color: #366a19;">EDU</span><span style="color: #365e9f;">PIXEL</span>
                    </span>
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

// Handle Student Login with SessionStorage Authentication
function handleStudentLogin(event) {
    if (event) event.preventDefault();
    const usernameInput = document.getElementById('student-username');
    const passwordInput = document.getElementById('student-password');

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!username) {
        showToast('Please enter your student username or roll number.', 'warning', 'MISSING INPUT');
        if (usernameInput) usernameInput.focus();
        return;
    }

    if (!password) {
        showToast('Please enter your account password.', 'warning', 'MISSING INPUT');
        if (passwordInput) passwordInput.focus();
        return;
    }

    const accounts = getRegisteredAccounts();
    const query = username.toLowerCase();

    // Check registered accounts for matching student
    let matchedStudent = Object.values(accounts).find(u => 
        u.role === 'student' && (
            (u.username && u.username.toLowerCase() === query) ||
            (u.name && u.name.toLowerCase() === query) ||
            (u.roll && u.roll.toLowerCase() === query)
        )
    );

    const isDemo = (query === 'arjun' || query === 'arjun sharma' || query === '23bcs101');
    if (!matchedStudent && isDemo) {
        matchedStudent = accounts.student || DEFAULT_ACCOUNTS.student;
    }

    if (matchedStudent) {
        if (password !== matchedStudent.password && password !== 'password123') {
            showToast('⚠️ Incorrect password! (Default: password123)', 'error', 'AUTHENTICATION FAILED');
            if (passwordInput) passwordInput.focus();
            return;
        }
    } else {
        // Allow flexible sign-in for new custom student entries
        matchedStudent = {
            ...DEFAULT_ACCOUNTS.student,
            username: username,
            name: username,
            roll: '23BCS' + Math.floor(100 + Math.random() * 900)
        };
    }

    const activeStudent = {
        ...matchedStudent,
        loginTime: new Date().toISOString()
    };

    // Save Session to SessionStorage
    setSessionUser('student', activeStudent.name, activeStudent);

    // Log Activity in Cross-Portal DB
    if (typeof EduPixelDB !== 'undefined') {
        EduPixelDB.logActivity('Student Logged In', `${activeStudent.name} logged in to Student Portal (sessionStorage)`, activeStudent.name);
    }

    playRetroSound('success');
    showToast(`🎮 Welcome back, ${activeStudent.name}! Stored in sessionStorage.`, 'success', 'LOGIN SUCCESS');

    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 600);
}

// Handle Admin Login with SessionStorage Authentication
function handleAdminLogin(event) {
    if (event) event.preventDefault();
    const usernameInput = document.getElementById('admin-username');
    const passwordInput = document.getElementById('admin-password');

    const username = usernameInput ? usernameInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!username) {
        showToast('Please enter your faculty/admin username.', 'warning', 'MISSING INPUT');
        if (usernameInput) usernameInput.focus();
        return;
    }

    if (!password) {
        showToast('Please enter your admin password.', 'warning', 'MISSING INPUT');
        if (passwordInput) passwordInput.focus();
        return;
    }

    const accounts = getRegisteredAccounts();
    const query = username.toLowerCase();

    // Check registered accounts for matching faculty/admin
    let matchedAdmin = Object.values(accounts).find(u => 
        u.role === 'admin' && (
            (u.username && u.username.toLowerCase() === query) ||
            (u.name && u.name.toLowerCase() === query) ||
            (u.empId && u.empId.toLowerCase() === query)
        )
    );

    const isDemo = (query === 'admin' || query === 'dr. rajesh kumar' || query === 'rajesh');
    if (!matchedAdmin && isDemo) {
        matchedAdmin = accounts.admin || DEFAULT_ACCOUNTS.admin;
    }

    if (matchedAdmin) {
        if (password !== matchedAdmin.password && password !== 'admin123') {
            showToast('⚠️ Invalid faculty password! (Default: admin123)', 'error', 'AUTHENTICATION FAILED');
            if (passwordInput) passwordInput.focus();
            return;
        }
    } else {
        matchedAdmin = {
            ...DEFAULT_ACCOUNTS.admin,
            username: username,
            name: username,
            empId: 'FAC-' + Math.floor(100 + Math.random() * 900)
        };
    }

    const activeAdmin = {
        ...matchedAdmin,
        loginTime: new Date().toISOString()
    };

    // Save Session to SessionStorage
    setSessionUser('admin', activeAdmin.name, activeAdmin);

    // Log Activity in Cross-Portal DB
    if (typeof EduPixelDB !== 'undefined') {
        EduPixelDB.logActivity('Faculty Logged In', `${activeAdmin.name} accessed Admin Console (sessionStorage)`, activeAdmin.name);
    }

    playRetroSound('success');
    showToast(`🛡️ Guildmaster verified! Welcome, ${activeAdmin.name}. (sessionStorage active)`, 'success', 'ADMIN AUTHORIZED');

    setTimeout(() => {
        window.location.href = 'admin.html';
    }, 600);
}

// Handle Sign Up with SessionStorage
function handleSignUp(event) {
    if (event) event.preventDefault();

    const roleInput = document.querySelector('input[name="signup-role"]:checked');
    const role = roleInput ? roleInput.value : 'student';

    const nameInput = document.getElementById('signup-name');
    const usernameInput = document.getElementById('signup-username');
    const idInput = document.getElementById('signup-id');
    const passwordInput = document.getElementById('signup-password');

    const name = nameInput ? nameInput.value.trim() : '';
    const username = usernameInput ? usernameInput.value.trim() : '';
    const idVal = idInput ? idInput.value.trim() : '';
    const password = passwordInput ? passwordInput.value : '';

    if (!name) {
        showToast('Please enter your full name.', 'warning', 'MISSING INPUT');
        if (nameInput) nameInput.focus();
        return;
    }
    if (!username) {
        showToast('Please choose a username.', 'warning', 'MISSING INPUT');
        if (usernameInput) usernameInput.focus();
        return;
    }
    if (!password || password.length < 4) {
        showToast('Please enter a password (min 4 characters).', 'warning', 'MISSING INPUT');
        if (passwordInput) passwordInput.focus();
        return;
    }

    const accounts = getRegisteredAccounts();
    const userKey = username.toLowerCase();

    // Check if username already exists
    const existing = Object.values(accounts).find(acc => 
        acc.username && acc.username.toLowerCase() === userKey
    );

    if (existing) {
        showToast(`⚠️ Username "${username}" is already taken! Try another username or sign in.`, 'error', 'ALREADY REGISTERED');
        if (usernameInput) usernameInput.focus();
        return;
    }

    // Build new user profile
    let newUser;
    if (role === 'admin') {
        newUser = {
            username: username,
            password: password,
            role: 'admin',
            name: name,
            empId: idVal || `FAC-${Math.floor(100 + Math.random() * 900)}`,
            designation: 'Assistant Professor',
            department: 'Computer Science & Engineering',
            email: `${userKey}@edupixel.edu`,
            office: 'Academic Block 3, Room 102'
        };
    } else {
        newUser = {
            username: username,
            password: password,
            role: 'student',
            name: name,
            roll: idVal || `23BCS${Math.floor(100 + Math.random() * 900)}`,
            section: '10-A',
            program: 'B.Tech Computer Science & Engineering',
            semester: '3rd Semester',
            email: `${userKey}@edupixel.edu`,
            room: 'Block B — Room 202',
            attendance: '94.2%',
            cgpa: '8.80'
        };
    }

    // Save new account into registered accounts
    accounts[userKey] = newUser;
    saveRegisteredAccounts(accounts);

    // Save active session into sessionStorage
    setSessionUser(role, newUser.name, newUser);

    // Log Activity
    if (typeof EduPixelDB !== 'undefined') {
        EduPixelDB.logActivity('New Account Created', `${newUser.name} registered as a new ${role} (sessionStorage)`, newUser.name);
    }

    playRetroSound('success');
    showToast(`🎉 Welcome to EduPixel, ${newUser.name}! Signed in via sessionStorage.`, 'success', 'REGISTRATION SUCCESS');

    setTimeout(() => {
        window.location.href = (role === 'admin' ? 'admin.html' : 'profile.html');
    }, 700);
}

// Switch between Sign In and Sign Up tabs
function showAuthMode(mode) {
    const signinContainer = document.getElementById('signin-container');
    const signupCard = document.getElementById('signup-card');
    const tabSignIn = document.getElementById('tab-btn-signin');
    const tabSignUp = document.getElementById('tab-btn-signup');

    if (!signinContainer || !signupCard) return;

    if (mode === 'signup') {
        signinContainer.style.display = 'none';
        signupCard.style.display = 'block';
        if (tabSignIn && tabSignUp) {
            tabSignIn.className = 'flex-1 py-2 font-bold uppercase text-sm border-2 border-transparent hover:border-on-surface text-on-surface transition-all';
            tabSignUp.className = 'flex-1 py-2 font-bold uppercase text-sm border-2 border-on-surface bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all';
        }
    } else {
        signinContainer.style.display = 'block';
        signupCard.style.display = 'none';
        if (tabSignIn && tabSignUp) {
            tabSignIn.className = 'flex-1 py-2 font-bold uppercase text-sm border-2 border-on-surface bg-primary text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all';
            tabSignUp.className = 'flex-1 py-2 font-bold uppercase text-sm border-2 border-transparent hover:border-on-surface text-on-surface transition-all';
        }
    }
}

// Update extra form field label when switching role in sign up
function updateSignUpRoleUI(role) {
    const idLabel = document.getElementById('signup-id-label');
    const idInput = document.getElementById('signup-id');
    if (!idLabel || !idInput) return;

    if (role === 'admin') {
        idLabel.textContent = 'Faculty / Employee ID';
        idInput.placeholder = 'e.g. FAC-105';
    } else {
        idLabel.textContent = 'Roll Number';
        idInput.placeholder = 'e.g. 23BCS205';
    }
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
