const internshipsData = [
  {
    id: "int-1",
    title: "Frontend Web Developer Intern",
    company: "Google",
    logo: "G",
    location: "Remote",
    category: "Tech",
    stipend: 250000,
    duration: "3 Months",
    deadline: "2026-12-10",
    postedOrder: 6,
    skills: ["HTML", "CSS", "JavaScript", "React"],
    overview: "Build responsive user interfaces and reusable web components for our student productivity suite.",
    responsibilities: [
      "Convert Figma wireframes into clean, accessible HTML/CSS/JS pages.",
      "Optimize page load speeds and mobile responsiveness.",
      "Collaborate with backend developers on REST API integration."
    ],
    perks: ["Certificate of Completion", "Letter of Recommendation", "Flexible Hours"]
  },
  {
    id: "int-2",
    title: "UI/UX Product Design Intern",
    company: "VelvetPixel Studio",
    logo: "V",
    location: "Bengaluru (Hybrid)",
    category: "Design",
    stipend: 22000,
    duration: "4 Months",
    deadline: "2026-12-05",
    postedOrder: 5,
    skills: ["Figma", "Prototyping", "Design Systems"],
    overview: "Craft dark-mode mobile apps and interactive user flows for early-stage consumer startups.",
    responsibilities: [
      "Design user flows, wireframes, and high-fidelity mockups in Figma.",
      "Conduct quick usability tests with college students.",
      "Maintain consistent typography and color tokens."
    ],
    perks: ["PPO Opportunity", "Design Mentorship", "Remote Fridays"]
  },
  {
    id: "int-3",
    title: "Cyber Security Analyst Intern",
    company: "AegisVault Security",
    logo: "A",
    location: "Remote",
    category: "Tech",
    stipend: 35000,
    duration: "6 Months",
    deadline: "2026-12-02",
    postedOrder: 4,
    skills: ["Linux", "Networking", "OWASP", "Python"],
    overview: "Assist our security operations team in vulnerability scanning and web app penetration testing.",
    responsibilities: [
      "Run automated security audits on staging web applications.",
      "Document vulnerabilities and suggest remediation patches.",
      "Write small Python scripts to automate log monitoring."
    ],
    perks: ["₹35k Stipend", "Certification Voucher", "Pre-Placement Offer"]
  },
  {
    id: "int-4",
    title: "AI & Data Science Intern",
    company: "QuantMind AI",
    logo: "Q",
    location: "Hyderabad",
    category: "Data",
    stipend: 40000,
    duration: "6 Months",
    deadline: "2026-12-15",
    postedOrder: 3,
    skills: ["Python", "Pandas", "Machine Learning", "SQL"],
    overview: "Train and evaluate NLP models that summarize academic research papers for students.",
    responsibilities: [
      "Clean and preprocess large text datasets using Python.",
      "Fine-tune open-source transformer models and benchmark accuracy.",
      "Build simple dashboards to visualize model metrics."
    ],
    perks: ["₹40k Stipend", "GPU Cloud Credits", "Free Meals"]
  },
  {
    id: "int-5",
    title: "Full Stack JavaScript Intern",
    company: "PulseCart",
    logo: "P",
    location: "Remote",
    category: "Tech",
    stipend: 30000,
    duration: "3 Months",
    deadline: "2026-12-08",
    postedOrder: 2,
    skills: ["JavaScript", "Node.js", "MongoDB", "CSS"],
    overview: "Work across frontend and backend features for a fast-growing campus e-commerce platform.",
    responsibilities: [
      "Develop shopping cart and order tracking APIs.",
      "Build interactive checkout screens with vanilla JS and CSS.",
      "Participate in weekly sprint reviews."
    ],
    perks: ["Remote Setup", "Experience Letter", "Performance Bonus"]
  },
  {
    id: "int-6",
    title: "Product & Data Analytics Intern",
    company: "FinBloom",
    logo: "F",
    location: "Delhi NCR",
    category: "Data",
    stipend: 28000,
    duration: "4 Months",
    deadline: "2026-12-18",
    postedOrder: 1,
    skills: ["SQL", "Excel", "PowerBI", "Product Metrics"],
    overview: "Analyze student saving habits and help product managers improve app retention.",
    responsibilities: [
      "Write SQL queries to track daily active user funnels.",
      "Prepare weekly insight decks for the product team.",
      "Run A/B test evaluations on new app features."
    ],
    perks: ["Stipend + Incentives", "Mentorship", "PPO Track"]
  }
];

const STAGES = ["Applied", "Under Review", "Interview", "Offer"];

let savedIds = JSON.parse(localStorage.getItem("lavendr_saved")) || ["int-1"];
let applications = JSON.parse(localStorage.getItem("lavendr_apps")) || [
  {
    internshipId: "int-2",
    appliedDate: "20 Nov 2026",
    stageIndex: 1,
    applicantName: "Samriddhi",
    coverNote: "Passionate about dark-mode UI systems and Figma prototyping."
  }
];

let activeFilter = "All";
let searchQuery = "";
let sortBy = "newest";
let selectedInternshipForApply = null;

const internshipGrid = document.getElementById("internshipGrid");
const savedGrid = document.getElementById("savedGrid");
const trackerList = document.getElementById("trackerList");
const resultsCount = document.getElementById("resultsCount");

const searchInput = document.getElementById("searchInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const sortSelect = document.getElementById("sortSelect");

const detailsModal = document.getElementById("detailsModal");
const detailsContent = document.getElementById("detailsContent");
const applyModal = document.getElementById("applyModal");
const applyForm = document.getElementById("applyForm");
const coverNoteInput = document.getElementById("coverNote");
const charCount = document.getElementById("charCount");

function init() {
  updateBadges();
  renderInternships();
  renderSaved();
  renderTracker();
  setupEvents();
}

function saveState() {
  localStorage.setItem("lavendr_saved", JSON.stringify(savedIds));
  localStorage.setItem("lavendr_apps", JSON.stringify(applications));
  updateBadges();
}

function updateBadges() {
  document.getElementById("appCountBadge").textContent = applications.length;
  document.getElementById("savedCountBadge").textContent = savedIds.length;
}

function getFilteredInternships() {
  return internshipsData
    .filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery) ||
        item.company.toLowerCase().includes(searchQuery) ||
        item.skills.some((s) => s.toLowerCase().includes(searchQuery));

      if (!matchesSearch) return false;

      if (activeFilter === "All") return true;
      if (activeFilter === "Remote") return item.location.toLowerCase().includes("remote");
      if (activeFilter === "HighStipend") return item.stipend >= 30000;
      return item.category === activeFilter;
    })
    .sort((a, b) => {
      if (sortBy === "stipend") return b.stipend - a.stipend;
      if (sortBy === "deadline") return new Date(a.deadline) - new Date(b.deadline);
      return b.postedOrder - a.postedOrder;
    });
}

function createCardHTML(item) {
  const isSaved = savedIds.includes(item.id);
  const isApplied = applications.some((app) => app.internshipId === item.id);

  return `
    <article class="card">
      <div>
        <div class="card-top">
          <div class="company-info">
            <div class="company-logo">${item.logo}</div>
            <div>
              <h3 class="card-title">${item.title}</h3>
              <p class="card-company">${item.company} • ${item.location}</p>
            </div>
          </div>
          <button
            class="bookmark-btn ${isSaved ? "saved" : ""}"
            onclick="toggleSave('${item.id}')"
            title="${isSaved ? "Remove bookmark" : "Save internship"}"
          >
            ${isSaved ? "♥" : "♡"}
          </button>
        </div>

        <div class="card-meta">
          <span class="meta-item">₹${item.stipend.toLocaleString("en-IN")}/mo</span>
          <span class="meta-item">${item.duration}</span>
          <span class="meta-item">Apply by ${formatDate(item.deadline)}</span>
        </div>

        <div class="skill-tags">
          ${item.skills.map((skill) => `<span class="skill-tag">${skill}</span>`).join("")}
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-outline" onclick="openDetails('${item.id}')">View Details</button>
        <button
          class="btn-gradient"
          onclick="openApplyModal('${item.id}')"
          ${isApplied ? "disabled" : ""}
        >
          ${isApplied ? "Applied ✓" : "Apply Now"}
        </button>
      </div>
    </article>
  `;
}

function renderInternships() {
  const list = getFilteredInternships();
  resultsCount.textContent = `Showing ${list.length} internship${list.length === 1 ? "" : "s"}`;

  if (list.length === 0) {
    internshipGrid.innerHTML = `
      <div class="empty-state">
        <p>No internships matched your filters. Try clearing your search.</p>
      </div>
    `;
    return;
  }

  internshipGrid.innerHTML = list.map(createCardHTML).join("");
}

function renderSaved() {
  const savedList = internshipsData.filter((item) => savedIds.includes(item.id));
  if (savedList.length === 0) {
    savedGrid.innerHTML = `
      <div class="empty-state">
        <p>You haven't saved any internships yet. Click the heart icon on any card to bookmark it.</p>
      </div>
    `;
    return;
  }
  savedGrid.innerHTML = savedList.map(createCardHTML).join("");
}

function renderTracker() {
  document.getElementById("statTotal").textContent = applications.length;
  document.getElementById("statReview").textContent = applications.filter((a) => a.stageIndex === 1).length;
  document.getElementById("statInterview").textContent = applications.filter((a) => a.stageIndex === 2).length;
  document.getElementById("statOffer").textContent = applications.filter((a) => a.stageIndex === 3).length;

  if (applications.length === 0) {
    trackerList.innerHTML = `
      <div class="empty-state">
        <p>No applications submitted yet. Explore internships and click "Apply Now" to start tracking!</p>
      </div>
    `;
    return;
  }

  trackerList.innerHTML = applications
    .map((app) => {
      const role = internshipsData.find((i) => i.id === app.internshipId);
      if (!role) return "";

      const currentStageName = STAGES[app.stageIndex];
      const isFinal = app.stageIndex === STAGES.length - 1;

      return `
        <div class="tracker-card">
          <div class="tracker-head">
            <div class="company-info">
              <div class="company-logo">${role.logo}</div>
              <div>
                <h3 class="card-title">${role.title}</h3>
                <p class="card-company">${role.company} • Applied on ${app.appliedDate}</p>
              </div>
            </div>
            <span class="status-pill">${currentStageName}</span>
          </div>

          <div class="progress-steps">
            ${STAGES.map(
              (stage, idx) => `
              <div class="step ${idx <= app.stageIndex ? "done" : ""}">
                <div class="step-bar"></div>
                <span>${stage}</span>
              </div>
            `
            ).join("")}
          </div>

          <div class="tracker-foot">
            <span>Note: "${app.coverNote}"</span>
            <div>
              ${
                !isFinal
                  ? `<button class="btn-outline" onclick="advanceStage('${app.internshipId}')">Simulate Next Stage →</button>`
                  : `<span style="color: var(--lavender-main); font-weight: 600;">🎉 Offer Received!</span>`
              }
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function toggleSave(id) {
  if (savedIds.includes(id)) {
    savedIds = savedIds.filter((item) => item !== id);
    showToast("Removed from saved internships");
  } else {
    savedIds.push(id);
    showToast("Saved to your bookmarks");
  }
  saveState();
  renderInternships();
  renderSaved();
}

function openDetails(id) {
  const item = internshipsData.find((i) => i.id === id);
  if (!item) return;

  const isApplied = applications.some((app) => app.internshipId === item.id);

  detailsContent.innerHTML = `
    <span class="modal-tag">${item.category} • ${item.location}</span>
    <h3 style="font-size: 1.4rem; margin: 6px 0 4px;">${item.title}</h3>
    <p style="color: var(--text-muted); margin-bottom: 16px;">
      ${item.company} • ₹${item.stipend.toLocaleString("en-IN")}/month • ${item.duration}
    </p>

    <h4 style="color: var(--lavender-light); margin-bottom: 6px;">Role Overview</h4>
    <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 16px;">${item.overview}</p>

    <h4 style="color: var(--lavender-light);">Key Responsibilities</h4>
    <ul class="detail-list">
      ${item.responsibilities.map((r) => `<li>${r}</li>`).join("")}
    </ul>

    <h4 style="color: var(--lavender-light); margin-bottom: 8px;">Perks & Benefits</h4>
    <div class="skill-tags" style="margin-bottom: 20px;">
      ${item.perks.map((p) => `<span class="skill-tag">${p}</span>`).join("")}
    </div>

    <button
      class="btn-gradient"
      style="width: 100%; padding: 12px;"
      onclick="closeModals(); openApplyModal('${item.id}')"
      ${isApplied ? "disabled" : ""}
    >
      ${isApplied ? "Already Applied ✓" : "Apply for this Internship"}
    </button>
  `;

  detailsModal.classList.add("open");
}

function openApplyModal(id) {
  const item = internshipsData.find((i) => i.id === id);
  if (!item) return;

  selectedInternshipForApply = item;
  document.getElementById("applyRoleTitle").textContent = `Apply: ${item.title}`;
  document.getElementById("applyCompanySub").textContent = `${item.company} • ${item.location} • ₹${item.stipend.toLocaleString("en-IN")}/mo`;
  applyModal.classList.add("open");
}

function closeModals() {
  detailsModal.classList.remove("open");
  applyModal.classList.remove("open");
}

function advanceStage(internshipId) {
  const app = applications.find((a) => a.internshipId === internshipId);
  if (app && app.stageIndex < STAGES.length - 1) {
    app.stageIndex += 1;
    saveState();
    renderTracker();
    showToast(`Status updated to: ${STAGES[app.stageIndex]}`);
  }
}

function setupEvents() {
  document.querySelectorAll(".nav-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".nav-tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".view-section").forEach((v) => v.classList.remove("active"));

      tab.classList.add("active");
      const targetView = tab.dataset.view + "View";
      document.getElementById(targetView).classList.add("active");
    });
  });

  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.trim().toLowerCase();
    clearSearchBtn.classList.toggle("hidden", searchQuery === "");
    renderInternships();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchQuery = "";
    clearSearchBtn.classList.add("hidden");
    renderInternships();
  });

  document.querySelectorAll("#categoryPills .pill").forEach((pill) => {
    pill.addEventListener("click", () => {
      document.querySelectorAll("#categoryPills .pill").forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      activeFilter = pill.dataset.filter;
      renderInternships();
    });
  });

  sortSelect.addEventListener("change", (e) => {
    sortBy = e.target.value;
    renderInternships();
  });

  document.getElementById("closeDetailsBtn").addEventListener("click", closeModals);
  document.getElementById("closeApplyBtn").addEventListener("click", closeModals);
  document.getElementById("cancelApplyBtn").addEventListener("click", closeModals);

  coverNoteInput.addEventListener("input", () => {
    charCount.textContent = coverNoteInput.value.length;
  });

  applyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!selectedInternshipForApply) return;

    const newApplication = {
      internshipId: selectedInternshipForApply.id,
      appliedDate: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      stageIndex: 0,
      applicantName: document.getElementById("applicantName").value.trim(),
      coverNote: coverNoteInput.value.trim()
    };

    applications.unshift(newApplication);
    saveState();
    renderInternships();
    renderSaved();
    renderTracker();

    applyForm.reset();
    charCount.textContent = "0";
    closeModals();
    showToast(`Applied to ${selectedInternshipForApply.company}!`);
  });

  document.getElementById("resetDemoBtn").addEventListener("click", () => {
    localStorage.removeItem("lavendr_saved");
    localStorage.removeItem("lavendr_apps");
    location.reload();
  });
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}

init();
