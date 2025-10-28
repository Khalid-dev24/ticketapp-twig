// public/js/auth.js
// handles signup/login/logout using localStorage (key: ticketapp_session)
// users stored in localStorage under 'ticketapp_users'

function showToast(id, message, duration = 2500) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', duration);
}

function handleSignup(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim().toLowerCase();
  const password = document.getElementById('signupPassword').value;

  if (!name || !email || password.length < 6) {
    showToast('signupError', 'Fill all fields and use password >= 6 chars');
    return false;
  }

  const users = JSON.parse(localStorage.getItem('ticketapp_users') || '[]');
  if (users.some(u => u.email === email)) {
    showToast('signupError', 'User already exists. Login instead.');
    return false;
  }

  users.push({ name, email, password });
  localStorage.setItem('ticketapp_users', JSON.stringify(users));
  // auto-redirect to login
  window.location.href = '?page=login';
  return false;
}

function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const users = JSON.parse(localStorage.getItem('ticketapp_users') || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    showToast('loginError', 'Invalid email or password.');
    return false;
  }

  // create session token (simple)
  localStorage.setItem('ticketapp_session', JSON.stringify({ email: user.email, name: user.name, token: Date.now() }));
  window.location.href = '?page=dashboard';
  return false;
}

function logout() {
  localStorage.removeItem('ticketapp_session');
  window.location.href = '?page=login';
}

// Export functions for inline form handlers (older browsers)
window.handleSignup = handleSignup;
window.handleLogin = handleLogin;
window.logout = logout;
