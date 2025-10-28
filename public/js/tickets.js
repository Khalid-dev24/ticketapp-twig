// public/js/tickets.js
// Simple TicketApp client-side module using localStorage
window.TicketApp = (function () {
  const STORAGE_KEY = 'tickets';
  const messageEl = () => document.getElementById('ticketMessage');

  function getTickets() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      console.error('Invalid tickets in localStorage', e);
      return [];
    }
  }

  function saveTickets(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function renderTickets() {
    const grid = document.getElementById('ticketsGrid');
    if (!grid) return;
    const tickets = getTickets();
    if (tickets.length === 0) {
      grid.innerHTML = '<p class="no-tickets">No tickets yet. Create one above.</p>';
      return;
    }

    grid.innerHTML = tickets.map(t => {
      const id = t.id;
      const escapedTitle = escapeHtml(t.title);
      const escapedDesc = escapeHtml(t.description || '');
      const statusClass = t.status;
      const statusLabel = t.status.replace('_', ' ');
      return `
      <div class="ticket-card ${statusClass}" data-id="${id}">
        <div class="ticket-header">
          <h3>${escapedTitle}</h3>
          <span class="status">${statusLabel}</span>
        </div>
        <p>${escapedDesc}</p>
        <div class="ticket-actions">
          <button class="btn-small edit" data-action="edit" data-id="${id}">Edit</button>
          <button class="btn-small delete" data-action="delete" data-id="${id}">Delete</button>
        </div>
      </div>`;
    }).join('');

    // attach listeners
    grid.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const action = e.currentTarget.dataset.action;
        if (action === 'edit') editTicket(id);
        if (action === 'delete') deleteTicket(id);
      });
    });
  }

  function showMessage(text, ms = 1800) {
    const el = messageEl();
    if (!el) return;
    el.textContent = text;
    el.style.display = 'block';
    clearTimeout(el._hideTimeout);
    el._hideTimeout = setTimeout(() => (el.style.display = 'none'), ms);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[m]));
  }

  function submitForm(e) {
    e.preventDefault();
    const title = document.getElementById('title').value.trim();
    const status = document.getElementById('status').value;
    const description = document.getElementById('description').value.trim();
    const id = document.getElementById('ticketId').value;

    if (!title) {
      showMessage('Title is required');
      return false;
    }
    if (!['open','in_progress','closed'].includes(status)) {
      showMessage('Select a valid status');
      return false;
    }

    const tickets = getTickets();

    if (id) {
      // update
      const idx = tickets.findIndex(t => String(t.id) === String(id));
      if (idx > -1) {
        tickets[idx] = { id: tickets[idx].id, title, description, status };
        saveTickets(tickets);
        showMessage('Ticket updated');
      }
    } else {
      // create
      const newId = Date.now();
      tickets.push({ id: newId, title, description, status });
      saveTickets(tickets);
      showMessage('Ticket created');
    }
    resetForm();
    renderTickets();
    return false;
  }

  function editTicket(id) {
    const tickets = getTickets();
    const ticket = tickets.find(t => String(t.id) === String(id));
    if (!ticket) return showMessage('Ticket not found');
    document.getElementById('ticketId').value = ticket.id;
    document.getElementById('title').value = ticket.title;
    document.getElementById('description').value = ticket.description || '';
    document.getElementById('status').value = ticket.status;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function deleteTicket(id) {
    if (!confirm('Delete this ticket?')) return;
    let tickets = getTickets();
    tickets = tickets.filter(t => String(t.id) !== String(id));
    saveTickets(tickets);
    renderTickets();
    showMessage('Ticket deleted');
  }

  function resetForm() {
    document.getElementById('ticketForm')?.reset();
    document.getElementById('ticketId').value = '';
    document.getElementById('saveBtn')?.textContent = 'Create Ticket';
  }

  // initialize (call after DOM ready)
  function init() {
    // attach submit
    const form = document.getElementById('ticketForm');
    if (form) form.addEventListener('submit', submitForm);
    const resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.addEventListener('click', resetForm);
    renderTickets();
  }

  // expose functions
  return {
    init,
    submitForm,
    resetForm,
    renderTickets
  };
})();
