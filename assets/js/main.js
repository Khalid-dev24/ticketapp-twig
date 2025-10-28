window.TicketApp = {
  tickets: [],

  init: function () {
    // Only initialize if we're on the tickets page
    if (!document.getElementById("ticketForm")) return;

    this.loadTickets();
    this.setupEventListeners();
  },

  setupEventListeners: function () {
    const form = document.getElementById("ticketForm");
    if (form) {
      form.addEventListener("submit", this.submitForm.bind(this));
    }
  },

  loadTickets: function () {
    // Load tickets from localStorage or initialize empty array
    const savedTickets = localStorage.getItem("tickets");
    this.tickets = savedTickets ? JSON.parse(savedTickets) : [];
    this.renderTickets();
  },

  submitForm: function (event) {
    event.preventDefault();

    const ticketId = document.getElementById("ticketId").value;
    const title = document.getElementById("title").value;
    const status = document.getElementById("status").value;
    const description = document.getElementById("description").value;

    if (!title || !status) {
      this.showMessage("Please fill in all required fields", "error");
      return false;
    }

    const ticket = {
      id: ticketId || Date.now().toString(),
      title,
      status,
      description,
      created_at: ticketId
        ? this.findTicket(ticketId).created_at
        : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (ticketId) {
      // Update existing ticket
      const index = this.tickets.findIndex((t) => t.id === ticketId);
      if (index !== -1) {
        this.tickets[index] = ticket;
      }
    } else {
      // Create new ticket
      this.tickets.push(ticket);
    }

    // Save to localStorage
    localStorage.setItem("tickets", JSON.stringify(this.tickets));

    // Update UI
    this.renderTickets();
    this.resetForm();
    this.showMessage(
      ticketId
        ? "Ticket updated successfully!"
        : "Ticket created successfully!",
      "success"
    );

    return false;
  },

  editTicket: function (id) {
    const ticket = this.findTicket(id);
    if (!ticket) return;

    document.getElementById("ticketId").value = ticket.id;
    document.getElementById("title").value = ticket.title;
    document.getElementById("status").value = ticket.status;
    document.getElementById("description").value = ticket.description;
    document.getElementById("saveBtn").textContent = "Update Ticket";
  },

  deleteTicket: function (id) {
    if (!confirm("Are you sure you want to delete this ticket?")) return;

    this.tickets = this.tickets.filter((ticket) => ticket.id !== id);
    localStorage.setItem("tickets", JSON.stringify(this.tickets));
    this.renderTickets();
    this.showMessage("Ticket deleted successfully!", "success");
  },

  findTicket: function (id) {
    return this.tickets.find((ticket) => ticket.id === id);
  },

  renderTickets: function () {
    const grid = document.getElementById("ticketsGrid");
    if (!grid) return;

    grid.innerHTML = this.tickets.length
      ? ""
      : '<p class="no-tickets">No tickets found. Create one above!</p>';

    this.tickets.forEach((ticket) => {
      const card = document.createElement("div");
      card.className = `ticket-card status-${ticket.status}`;
      card.innerHTML = `
                <h3>${ticket.title}</h3>
                <p class="status">Status: ${ticket.status}</p>
                <p class="description">${
                  ticket.description || "No description provided."
                }</p>
                <div class="ticket-footer">
                    <small>Created: ${new Date(
                      ticket.created_at
                    ).toLocaleDateString()}</small>
                    <div class="ticket-actions">
                        <button onclick="TicketApp.editTicket('${
                          ticket.id
                        }')" class="btn-small">Edit</button>
                        <button onclick="TicketApp.deleteTicket('${
                          ticket.id
                        }')" class="btn-small btn-danger">Delete</button>
                    </div>
                </div>
            `;
      grid.appendChild(card);
    });
  },

  resetForm: function () {
    document.getElementById("ticketForm").reset();
    document.getElementById("ticketId").value = "";
    document.getElementById("saveBtn").textContent = "Create Ticket";
  },

  showMessage: function (message, type = "success") {
    const messageEl = document.getElementById("ticketMessage");
    if (!messageEl) return;

    messageEl.textContent = message;
    messageEl.className = `toast ${type}`;
    messageEl.style.display = "block";

    setTimeout(() => {
      messageEl.style.display = "none";
    }, 3000);
  },
  
};

// Handle login and signup
document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");

  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(signupForm);
      const res = await fetch("signup.php", { method: "POST", body: formData });
      const data = await res.json();

      alert(data.message);
      if (data.success) window.location.href = "login.php";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const res = await fetch("login.php", { method: "POST", body: formData });
      const data = await res.json();

      alert(data.message);
      if (data.success) {
        localStorage.setItem("ticketapp_session", "active");
        window.location.href = "../dashboard/index.php";
      }
    });
  }
});

