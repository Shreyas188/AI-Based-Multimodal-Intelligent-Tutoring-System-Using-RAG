const API_BASE_URL = "http://127.0.0.1:8000";

// State Management
let currentAdmin = null;
let topicsData = [];

// DOM Elements
const authContainer = document.getElementById("auth-container");
const dashboardContainer = document.getElementById("dashboard-container");
const loginForm = document.getElementById("login-form");
const displayAdminName = document.getElementById("display-admin-name");
const btnLogout = document.getElementById("btn-logout");

// File Upload Form Elements
const docxFileInput = document.getElementById("docx-file-input");
const docxFileInfo = document.getElementById("docx-file-info");
const docxFileName = document.getElementById("docx-file-name");
const docxRemoveBtn = document.getElementById("docx-remove-btn");
const formUploadDocx = document.getElementById("form-upload-docx");

const pdfFileInput = document.getElementById("pdf-file-input");
const pdfFileInfo = document.getElementById("pdf-file-info");
const pdfFileName = document.getElementById("pdf-file-name");
const pdfRemoveBtn = document.getElementById("pdf-remove-btn");
const formUploadPdf = document.getElementById("form-upload-pdf");

const videoFileInput = document.getElementById("video-file-input");
const videoFileInfo = document.getElementById("video-file-info");
const videoFileName = document.getElementById("video-file-name");
const videoRemoveBtn = document.getElementById("video-remove-btn");
const formUploadVideo = document.getElementById("form-upload-video");

// Modal Forms
const formRefUrl = document.getElementById("form-ref-url");
const refTopicId = document.getElementById("ref-topic-id");
const refTopicNameDisplay = document.getElementById("ref-topic-name-display");
const refUrlInput = document.getElementById("ref-url-input");

const videoTopicId = document.getElementById("video-topic-id");
const videoTopicNameDisplay = document.getElementById("video-topic-name-display");

// Nav Tab Elements
const sidebarLinks = document.querySelectorAll(".sidebar-link");
const tabPanes = document.querySelectorAll(".tab-pane");

// Setup Notification Toast
function showToast(message, type = "success") {
  const container = document.getElementById("toast-overlay");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  
  toast.innerHTML = `
    <div class="toast-content">${message}</div>
    <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
  `;
  
  container.appendChild(toast);
  
  // Auto remove
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Authentication Handlers
function checkAuth() {
  const adminSession = localStorage.getItem("admin");
  if (adminSession) {
    try {
      currentAdmin = JSON.parse(adminSession);
      displayDashboard();
    } catch (e) {
      localStorage.removeItem("admin");
      displayLogin();
    }
  } else {
    displayLogin();
  }
}

function displayLogin() {
  authContainer.style.display = "flex";
  dashboardContainer.style.display = "none";
}

function displayDashboard() {
  authContainer.style.display = "none";
  dashboardContainer.style.display = "flex";
  displayAdminName.textContent = currentAdmin.username;
  // Trigger initial tab loading
  const activeTab = document.querySelector(".sidebar-link.active").getAttribute("data-tab");
  loadTabData(activeTab);
}

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value;
  
  const submitBtn = document.getElementById("btn-login-submit");
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<div class="loader"></div>';
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      localStorage.setItem("admin", JSON.stringify(data.admin));
      currentAdmin = data.admin;
      showToast("Authentication successful! Welcome to the panel.", "success");
      displayDashboard();
    } else {
      showToast(data.detail || data.message || "Invalid credentials.", "error");
    }
  } catch (error) {
    console.error("Login Error:", error);
    showToast("Server connection failure.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("admin");
  currentAdmin = null;
  showToast("Logged out successfully.", "success");
  displayLogin();
});

// Tab Switcher
sidebarLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    sidebarLinks.forEach(l => l.classList.remove("active"));
    link.classList.add("active");
    
    const targetTab = link.getAttribute("data-tab");
    tabPanes.forEach(pane => {
      if (pane.id === targetTab) {
        pane.style.display = "block";
      } else {
        pane.style.display = "none";
      }
    });
    
    loadTabData(targetTab);
  });
});

function loadTabData(tabId) {
  if (tabId === "tab-topics") {
    fetchTopics();
  } else if (tabId === "tab-progress") {
    fetchStudentProgress();
  } else if (tabId === "tab-tests") {
    fetchChapterTests();
  } else if (tabId === "tab-evaluations") {
    fetchEvaluationHistory();
  }
}

// File Attachment Inputs Helper
function handleFileInputChange(inputEl, infoEl, nameEl, allowedExt) {
  inputEl.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (allowedExt && ext !== allowedExt.replace('.', '')) {
        showToast(`Invalid file type. Only ${allowedExt} is allowed.`, "error");
        inputEl.value = "";
        infoEl.classList.remove("active");
        return;
      }
      nameEl.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`;
      infoEl.classList.add("active");
    }
  });
}

function clearFileInput(inputEl, infoEl) {
  inputEl.value = "";
  infoEl.classList.remove("active");
}

handleFileInputChange(docxFileInput, docxFileInfo, docxFileName, ".docx");
docxRemoveBtn.addEventListener("click", () => clearFileInput(docxFileInput, docxFileInfo));

handleFileInputChange(pdfFileInput, pdfFileInfo, pdfFileName, ".pdf");
pdfRemoveBtn.addEventListener("click", () => clearFileInput(pdfFileInput, pdfFileInfo));

handleFileInputChange(videoFileInput, videoFileInfo, videoFileName, ".mp4");
videoRemoveBtn.addEventListener("click", () => clearFileInput(videoFileInput, videoFileInfo));

// Upload Forms Event Listeners
formUploadDocx.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = docxFileInput.files[0];
  if (!file) {
    showToast("Please choose a Word document file (.docx) first.", "error");
    return;
  }
  
  const chapterId = document.getElementById("chapter-select-uploads").value;
  const submitBtn = document.getElementById("btn-upload-docx");
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loader"></span> <span>Processing...</span>';
  
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/upload-chapter-study-material/${chapterId}`, {
      method: "POST",
      body: formData
    });
    
    const data = await response.json();
    if (response.ok && data.success) {
      showToast("DOCX uploaded successfully! Curriculum has been re-seeded.", "success");
      clearFileInput(docxFileInput, docxFileInfo);
      fetchTopics();
    } else {
      showToast(data.detail || "Failed to process the document.", "error");
    }
  } catch (error) {
    showToast("Network request failed.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

formUploadPdf.addEventListener("submit", async (e) => {
  e.preventDefault();
  const file = pdfFileInput.files[0];
  if (!file) {
    showToast("Please select a PDF document first.", "error");
    return;
  }
  
  const chapterId = document.getElementById("chapter-select-uploads").value;
  const submitBtn = document.getElementById("btn-upload-pdf");
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loader"></span> <span>Saving PDF...</span>';
  
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/upload-chapter-pdf/${chapterId}`, {
      method: "POST",
      body: formData
    });
    
    const data = await response.json();
    if (response.ok && data.success) {
      showToast("Textbook PDF uploaded successfully.", "success");
      clearFileInput(pdfFileInput, pdfFileInfo);
    } else {
      showToast(data.detail || "Failed to upload textbook.", "error");
    }
  } catch (error) {
    showToast("Network request failed.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// Fetch Curriculum Topics
async function fetchTopics() {
  const tableBody = document.getElementById("topics-table-body");
  tableBody.innerHTML = `
    <tr>
      <td colspan="6" style="text-align: center; padding: 2rem;">
        <div class="loader"></div>
        <p style="margin-top: 0.5rem; color: var(--text-muted);">Fetching database topics...</p>
      </td>
    </tr>
  `;
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/topics`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      topicsData = data.topics;
      renderTopicsTable(data.topics);
    } else {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--error)">Failed to fetch topics directory.</td></tr>`;
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--error)">Error connecting to server.</td></tr>`;
  }
}

function renderTopicsTable(topics) {
  const tableBody = document.getElementById("topics-table-body");
  const selectedChapter = Number(document.getElementById("chapter-select-topics").value);
  const filteredTopics = topics.filter(t => t.chapter_id === selectedChapter);

  if (!filteredTopics || filteredTopics.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; padding: 3rem; color: var(--text-muted)">
          <div style="font-size: 2rem; margin-bottom: 0.5rem">📂</div>
          No topics seeded in the database for this chapter. Please upload a curriculum DOCX first.
        </td>
      </tr>
    `;
    return;
  }
  
  tableBody.innerHTML = "";
  filteredTopics.forEach(topic => {
    const hasVideo = topic.video_path && topic.video_path.toLowerCase().endsWith('.mp4');
    const videoBadge = hasVideo 
      ? `<span style="display: inline-flex; align-items: center; gap: 0.25rem; font-size: 0.7rem; font-weight: 600; padding: 0.15rem 0.45rem; border-radius: 6px; background: rgba(16,185,129,0.12); color: var(--success); border: 1px solid rgba(16,185,129,0.25); margin-top: 0.25rem;">🎬 Video: ${escapeHtml(topic.video_path.split('/').pop())}</span>`
      : '';

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-family: var(--font-mono); color: var(--text-muted)">#${topic.id}</td>
      <td style="font-family: var(--font-mono)">${topic.order_no}</td>
      <td>
        <div style="font-weight: 500">${escapeHtml(topic.title)}</div>
        ${videoBadge}
      </td>
      <td>Chapter ${topic.chapter_id}</td>
      <td><span class="badge-count">${topic.material_count}</span></td>
      <td>
        <div class="flex-actions" style="flex-wrap: wrap; gap: 0.25rem;">
          <button class="btn btn-sm btn-secondary" onclick="openRefUrlModal(${topic.id}, '${escapeHtml(topic.title)}')">Reference URL</button>
          <button class="btn btn-sm btn-secondary" onclick="openVideoUploadModal(${topic.id}, '${escapeHtml(topic.title)}')">Upload Video</button>
          <button class="btn btn-sm btn-secondary" onclick="openEditContentModal(${topic.id}, '${escapeHtml(topic.title)}')">Edit Content</button>
          <button class="btn btn-sm" onclick="openManageQuizModal(${topic.id}, '${escapeHtml(topic.title)}')">Manage Quiz</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Fetch Student Progress Data
async function fetchStudentProgress() {
  const cardsContainer = document.getElementById("student-progress-cards");
  cardsContainer.innerHTML = `
    <div class="empty-state" style="grid-column: 1/-1;">
      <div class="loader"></div>
      <p style="margin-top: 1rem; color: var(--text-muted);">Fetching student records...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/student-progress`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      renderStudentProgress(data.progress);
    } else {
      cardsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; border-color: var(--error)">
          <p style="color: var(--error)">Failed to retrieve student statistics.</p>
        </div>
      `;
    }
  } catch (error) {
    cardsContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; border-color: var(--error)">
        <p style="color: var(--error)">Error connecting to server.</p>
      </div>
    `;
  }
}

function renderStudentProgress(progressList) {
  const cardsContainer = document.getElementById("student-progress-cards");
  if (!progressList || progressList.length === 0) {
    cardsContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1;">
        <div class="empty-state-icon">👥</div>
        <p class="empty-state-text">No student profiles registered in the system yet.</p>
      </div>
    `;
    return;
  }
  
  const selectedChapter = document.getElementById("chapter-select-progress").value;
  
  cardsContainer.innerHTML = "";
  progressList.forEach(student => {
    const card = document.createElement("div");
    card.className = "student-card";
    
    let displayChapters = student.chapters_progress || [];
    if (selectedChapter !== "all") {
      displayChapters = displayChapters.filter(ch => String(ch.chapter_id) === selectedChapter);
    }
    
    let chaptersHtml = "";
    if (displayChapters.length > 0) {
      chaptersHtml = `<div class="student-chapters">`;
      displayChapters.forEach(ch => {
        let badgeClass = "badge-locked";
        let label = "Locked";
        if (ch.is_completed === 1) {
          badgeClass = "badge-completed";
          label = "Passed";
        } else if (ch.is_unlocked === 1) {
          badgeClass = "badge-active";
          label = "Active";
        }
        
        const scoreInfo = ch.final_test_passed === 1 ? ` (${ch.final_test_score}%)` : "";
        chaptersHtml += `
          <div class="chapter-progress-row">
            <span class="title">${ch.title}</span>
            <span class="chapter-status-badge ${badgeClass}">${label}${scoreInfo}</span>
          </div>
        `;
      });
      chaptersHtml += `</div>`;
    }
    
    card.innerHTML = `
      <div class="student-card-header">
        <div>
          <h4 class="student-name">${escapeHtml(student.full_name)}</h4>
          <p class="student-email">${escapeHtml(student.email)}</p>
        </div>
        <span style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted)">ID: #${student.student_id}</span>
      </div>
      
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${student.progress_percentage}%"></div>
      </div>
      
      <div class="student-meta">
        <span>Completed Topics</span>
        <span><strong>${student.completed_topics}</strong> / ${student.total_topics} <span class="percentage">(${student.progress_percentage}%)</span></span>
      </div>
      
      ${chaptersHtml}

      <div style="margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; justify-content: flex-end;">
        <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.student_id}, '${escapeHtml(student.full_name)}')">Remove Student</button>
      </div>
    `;
    
    cardsContainer.appendChild(card);
  });
}

// Delete Student Profile
window.deleteStudent = async function(studentId, fullName) {
  if (!confirm(`Are you sure you want to permanently delete the profile of student "${fullName}"? This will clear all progress, quiz, and test records for this student and cannot be undone.`)) {
    return;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/delete-student/${studentId}`, {
      method: "DELETE"
    });
    const data = await response.json();
    
    if (response.ok && data.success) {
      showToast("Student profile and progress records deleted successfully.", "success");
      fetchStudentProgress(); // Refresh progress cards list
    } else {
      showToast(data.detail || "Failed to delete student.", "error");
    }
  } catch (error) {
    showToast("Error connecting to server.", "error");
  }
};


// Modal Management Helper Functions
window.openRefUrlModal = async function(topicId, topicTitle) {
  refTopicId.value = topicId;
  refTopicNameDisplay.textContent = topicTitle;
  refUrlInput.value = "";
  
  // Try to pre-populate current URL if available
  try {
    const response = await fetch(`${API_BASE_URL}/admin/study-materials/${topicId}`);
    const data = await response.json();
    if (response.ok && data.success && data.materials && data.materials.length > 0) {
      refUrlInput.value = data.materials[0].reference_url || "";
    }
  } catch (e) {
    console.error("Failed to load existing reference URL", e);
  }
  
  document.getElementById("modal-ref-url").classList.add("active");
};

window.openVideoUploadModal = async function(topicId, topicTitle) {
  videoTopicId.value = topicId;
  videoTopicNameDisplay.textContent = topicTitle;
  clearFileInput(videoFileInput, videoFileInfo);

  const statusDisplay = document.getElementById("video-current-status-display");
  if (statusDisplay) {
    statusDisplay.innerHTML = `<span style="color: var(--text-muted);">Checking video status...</span>`;
  }

  document.getElementById("modal-upload-video").classList.add("active");

  try {
    const response = await fetch(`${API_BASE_URL}/admin/study-materials/${topicId}`);
    const data = await response.json();
    if (response.ok && data.success && data.materials && data.materials.length > 0) {
      const mat = data.materials[0];
      if (mat.video_path && mat.video_path.toLowerCase().endsWith('.mp4')) {
        const filename = mat.video_path.split('/').pop();
        if (statusDisplay) {
          statusDisplay.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem;">
              <span style="color: var(--success); font-weight: 600; display: inline-flex; align-items: center; gap: 0.35rem;">
                🎬 Current Video:
              </span>
              <code style="font-family: var(--font-mono); color: var(--text-main); font-size: 0.75rem; background: rgba(0,0,0,0.2); padding: 0.2rem 0.5rem; border-radius: 4px;">${escapeHtml(filename)}</code>
              <span style="color: var(--success); font-size: 0.75rem; font-weight: bold;">(Active)</span>
            </div>
          `;
        }
      } else {
        if (statusDisplay) {
          statusDisplay.innerHTML = `<span style="color: var(--text-muted); font-size: 0.75rem;">⚪ No MP4 video linked yet for this topic.</span>`;
        }
      }
    }
  } catch (e) {
    if (statusDisplay) {
      statusDisplay.innerHTML = `<span style="color: var(--text-muted); font-size: 0.75rem;">Unable to check current video status.</span>`;
    }
  }
};

window.closeModal = function(modalId) {
  document.getElementById(modalId).classList.remove("active");
};

// Handle Update Reference URL Form Submit
formRefUrl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const topicIdVal = Number(refTopicId.value);
  const refUrlVal = refUrlInput.value.trim();
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/update-reference-url`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        topic_id: topicIdVal,
        reference_url: refUrlVal
      })
    });
    
    const data = await response.json();
    if (response.ok && data.success) {
      showToast("Reference URL updated successfully.", "success");
      closeModal("modal-ref-url");
      // Refresh list to show correct counts / references
      fetchTopics();
    } else {
      showToast(data.detail || "Failed to update URL.", "error");
    }
  } catch (error) {
    showToast("Network request failed.", "error");
  }
});

// Handle Upload Topic Video Form Submit
formUploadVideo.addEventListener("submit", async (e) => {
  e.preventDefault();
  const topicIdVal = Number(videoTopicId.value);
  const file = videoFileInput.files[0];
  
  if (!file) {
    showToast("Please choose an MP4 video file first.", "error");
    return;
  }
  
  const submitBtn = document.getElementById("btn-submit-video");
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loader"></span> <span>Uploading...</span>';
  
  const formData = new FormData();
  formData.append("file", file);
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/upload-topic-video/${topicIdVal}`, {
      method: "POST",
      body: formData
    });
    
    const data = await response.json();
    if (response.ok && data.success) {
      showToast("MP4 video uploaded and linked successfully.", "success");
      closeModal("modal-upload-video");
      fetchTopics();
    } else {
      showToast(data.detail || "Failed to upload video.", "error");
    }
  } catch (error) {
    showToast("Network request failed.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// Safe Escaping helper
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Rebuild RAG Index Click Handler
const btnRebuildRag = document.getElementById("btn-rebuild-rag");
if (btnRebuildRag) {
  btnRebuildRag.addEventListener("click", async () => {
    const originalText = btnRebuildRag.innerHTML;
    btnRebuildRag.disabled = true;
    btnRebuildRag.innerHTML = '<span class="loader"></span> <span>Indexing...</span>';
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/rebuild-rag-index`, {
        method: "POST"
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showToast(data.message || "RAG Search index rebuilt successfully!", "success");
      } else {
        showToast(data.detail || "Failed to rebuild RAG index.", "error");
      }
    } catch (error) {
      showToast("Network request failed.", "error");
    } finally {
      btnRebuildRag.disabled = false;
      btnRebuildRag.innerHTML = originalText;
    }
  });
}

// Chapter selectors change listeners
document.getElementById("chapter-select-topics").addEventListener("change", () => {
  renderTopicsTable(topicsData);
});

let studentProgressData = [];
async function fetchStudentProgress() {
  const cardsContainer = document.getElementById("student-progress-cards");
  cardsContainer.innerHTML = `
    <div class="empty-state" style="grid-column: 1/-1;">
      <div class="loader"></div>
      <p style="margin-top: 1rem; color: var(--text-muted);">Fetching student records...</p>
    </div>
  `;
  
  try {
    const response = await fetch(`${API_BASE_URL}/admin/student-progress`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      studentProgressData = data.progress;
      renderStudentProgress(data.progress);
    } else {
      cardsContainer.innerHTML = `
        <div class="empty-state" style="grid-column: 1/-1; border-color: var(--error)">
          <p style="color: var(--error)">Failed to retrieve student statistics.</p>
        </div>
      `;
    }
  } catch (error) {
    cardsContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1/-1; border-color: var(--error)">
        <p style="color: var(--error)">Error connecting to server.</p>
      </div>
    `;
  }
}

document.getElementById("chapter-select-progress").addEventListener("change", () => {
  renderStudentProgress(studentProgressData);
});

// ==========================================
// ADMIN EDITING & MANAGEMENT CAPABILITIES
// ==========================================

// Edit Topic Content Modal Handlers
window.openEditContentModal = async function(topicId, topicTitle) {
  const editContentTopicId = document.getElementById("edit-content-topic-id");
  const editContentTopicTitle = document.getElementById("edit-content-topic-title");
  const editContentTextarea = document.getElementById("edit-content-textarea");

  editContentTopicId.value = topicId;
  editContentTopicTitle.textContent = topicTitle;
  editContentTextarea.value = "Loading study notes...";

  document.getElementById("modal-edit-content").classList.add("active");

  try {
    const response = await fetch(`${API_BASE_URL}/admin/study-materials/${topicId}`);
    const data = await response.json();
    if (response.ok && data.success && data.materials && data.materials.length > 0) {
      editContentTextarea.value = data.materials[0].content || "";
    } else {
      editContentTextarea.value = "";
      showToast("No study notes found to edit.", "warning");
    }
  } catch (error) {
    showToast("Failed to fetch study notes.", "error");
    editContentTextarea.value = "";
  }
};

document.getElementById("form-edit-content").addEventListener("submit", async (e) => {
  e.preventDefault();
  const topicId = Number(document.getElementById("edit-content-topic-id").value);
  const content = document.getElementById("edit-content-textarea").value;
  const submitBtn = document.getElementById("btn-save-content");

  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loader"></span> Saving...';

  try {
    const response = await fetch(`${API_BASE_URL}/admin/update-study-material-content`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic_id: topicId, content: content })
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showToast("Study notes updated successfully.", "success");
      closeModal("modal-edit-content");
      fetchTopics(); // refresh topic list counts
    } else {
      showToast(data.detail || "Failed to save study notes.", "error");
    }
  } catch (error) {
    showToast("Failed to connect to the server.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
});

// Manage Quiz Modal Handlers
window.openManageQuizModal = async function(topicId, topicTitle) {
  const container = document.getElementById("quiz-questions-editor-container");
  document.getElementById("manage-quiz-topic-title").textContent = topicTitle;
  container.innerHTML = `
    <div style="text-align: center; padding: 2rem;">
      <div class="loader"></div>
      <p style="margin-top: 0.5rem; color: var(--text-muted);">Fetching quiz questions...</p>
    </div>
  `;
  document.getElementById("modal-manage-quiz").classList.add("active");

  try {
    const response = await fetch(`${API_BASE_URL}/admin/topic-quiz/${topicId}`);
    const data = await response.json();
    if (response.ok && data.success) {
      renderQuizQuestionsEditor(data.questions);
    } else {
      container.innerHTML = `<p style="color: var(--error)">Failed to fetch quiz questions.</p>`;
    }
  } catch (error) {
    container.innerHTML = `<p style="color: var(--error)">Error connecting to server.</p>`;
  }
};

function renderQuizQuestionsEditor(questions) {
  const container = document.getElementById("quiz-questions-editor-container");
  if (!questions || questions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p>No quiz questions exist for this topic yet. Seeding a curriculum DOCX creates them automatically.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  questions.forEach((q, idx) => {
    const isMCQ = q.question_type === "mcq" || q.question_type === "true_false";
    const card = document.createElement("div");
    card.className = "student-card";
    card.style.borderLeft = "4px solid var(--primary)";
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; margin-bottom: 1rem;">
        <h4 style="font-family: var(--font-display);">Question ${idx + 1} (${q.question_type.toUpperCase()})</h4>
        <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted)">QID: #${q.id}</span>
      </div>
      <form id="form-quiz-q-${q.id}" onsubmit="saveQuizQuestion(event, ${q.id})">
        <div class="form-group">
          <label class="form-label">Question Text</label>
          <input type="text" name="question" class="form-input" value="${escapeHtml(q.question)}" required>
        </div>
        
        <div style="display: ${isMCQ ? 'grid' : 'none'}; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Option A</label>
            <input type="text" name="option_a" class="form-input" value="${escapeHtml(q.option_a || '')}">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Option B</label>
            <input type="text" name="option_b" class="form-input" value="${escapeHtml(q.option_b || '')}">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Option C</label>
            <input type="text" name="option_c" class="form-input" value="${escapeHtml(q.option_c || '')}">
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Option D</label>
            <input type="text" name="option_d" class="form-input" value="${escapeHtml(q.option_d || '')}">
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-bottom: 1rem;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Correct Answer / Option</label>
            <input type="text" name="correct_option" class="form-input" value="${escapeHtml(q.correct_option || '')}" placeholder="A, B, C, or exact text" required>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Expected Answer (For short / fill-blank)</label>
            <input type="text" name="expected_answer" class="form-input" value="${escapeHtml(q.expected_answer || '')}">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; align-items: flex-end;">
          <div class="form-group" style="margin-bottom: 0;">
            <label class="form-label">Marks</label>
            <input type="number" name="marks" class="form-input" value="${q.marks}" min="1" required>
          </div>
          <button type="submit" class="btn btn-sm" style="height: 40px;">Save Question</button>
        </div>
      </form>
    `;
    container.appendChild(card);
  });
}

window.saveQuizQuestion = async function(event, questionId) {
  event.preventDefault();
  const form = event.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span class="loader" style="width:14px;height:14px;"></span>';

  const body = {
    question_id: questionId,
    question: form.elements["question"].value.trim(),
    option_a: form.elements["option_a"] ? form.elements["option_a"].value.trim() : "",
    option_b: form.elements["option_b"] ? form.elements["option_b"].value.trim() : "",
    option_c: form.elements["option_c"] ? form.elements["option_c"].value.trim() : "",
    option_d: form.elements["option_d"] ? form.elements["option_d"].value.trim() : "",
    correct_option: form.elements["correct_option"].value.trim(),
    expected_answer: form.elements["expected_answer"].value.trim(),
    marks: Number(form.elements["marks"].value)
  };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/update-topic-quiz-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showToast(`Question #${questionId} saved successfully.`, "success");
    } else {
      showToast(data.detail || "Failed to save question.", "error");
    }
  } catch (error) {
    showToast("Network request failed.", "error");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
};

// Chapter Tests Section Handlers
let chapterTestsData = [];

async function fetchChapterTests() {
  const container = document.getElementById("tests-questions-list");
  const selectedChapter = document.getElementById("chapter-select-tests").value;
  
  container.innerHTML = `
    <div class="empty-state">
      <div class="loader"></div>
      <p style="margin-top: 1rem; color: var(--text-muted);">Fetching test questions...</p>
    </div>
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/chapter-test/${selectedChapter}`);
    const data = await response.json();
    if (response.ok && data.success) {
      chapterTestsData = data.questions;
      renderChapterTests(data.questions);
    } else {
      container.innerHTML = `
        <div class="empty-state" style="border-color: var(--error)">
          <p style="color: var(--error)">Failed to retrieve chapter test questions.</p>
        </div>
      `;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state" style="border-color: var(--error)">
        <p style="color: var(--error)">Error connecting to server.</p>
      </div>
    `;
  }
}

function renderChapterTests(questions) {
  const container = document.getElementById("tests-questions-list");
  if (!questions || questions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📋</div>
        <p class="empty-state-text">No test questions seeded for this chapter yet. Seeding study materials creates them.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = "";
  questions.forEach((q, idx) => {
    const card = document.createElement("div");
    card.className = "student-card";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "0.5rem";
    card.style.position = "relative";
    
    let detailsHtml = "";
    if (q.question_type === "mcq") {
      detailsHtml = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 0.5rem; font-size: 0.85rem; color: var(--text-muted);">
          <div><strong>A:</strong> ${escapeHtml(q.option_a)}</div>
          <div><strong>B:</strong> ${escapeHtml(q.option_b)}</div>
          <div><strong>C:</strong> ${escapeHtml(q.option_c)}</div>
          <div><strong>D:</strong> ${escapeHtml(q.option_d)}</div>
        </div>
      `;
    }

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 0.5rem; margin-bottom: 0.5rem;">
        <div>
          <span class="chapter-status-badge badge-active">${q.bloom_level}</span>
          <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); margin-left: 0.5rem;">ID: #${q.id}</span>
        </div>
        <button class="btn btn-sm btn-secondary" style="width: auto;" onclick="openEditTestQuestionModal(${q.id})">Edit Question</button>
      </div>
      <div style="font-weight: 500; font-size: 1.05rem;">Q${idx + 1}: ${escapeHtml(q.question)}</div>
      ${q.scenario_context ? `<div style="font-size: 0.85rem; font-style: italic; color: var(--text-muted); margin-top: 0.25rem;">Context: ${escapeHtml(q.scenario_context)}</div>` : ''}
      ${detailsHtml}
      <div style="margin-top: 0.5rem; font-size: 0.85rem; display: flex; gap: 2rem;">
        <div><strong>Correct Option/Answer:</strong> <span style="color: var(--success); font-weight: 600;">${escapeHtml(q.correct_option || '')}</span></div>
        ${q.expected_answer ? `<div><strong>Expected Answer:</strong> ${escapeHtml(q.expected_answer)}</div>` : ''}
        <div><strong>Marks:</strong> ${q.marks}</div>
      </div>
    `;
    container.appendChild(card);
  });
}

window.openEditTestQuestionModal = function(qid) {
  const q = chapterTestsData.find(item => item.id === qid);
  if (!q) return;

  document.getElementById("edit-test-qid").value = q.id;
  document.getElementById("edit-test-question-text").value = q.question;
  document.getElementById("edit-test-scenario").value = q.scenario_context || "";
  document.getElementById("edit-test-opt-a").value = q.option_a || "";
  document.getElementById("edit-test-opt-b").value = q.option_b || "";
  document.getElementById("edit-test-opt-c").value = q.option_c || "";
  document.getElementById("edit-test-opt-d").value = q.option_d || "";
  document.getElementById("edit-test-correct-option").value = q.correct_option || "";
  document.getElementById("edit-test-expected-answer").value = q.expected_answer || "";
  document.getElementById("edit-test-marks").value = q.marks;
  document.getElementById("edit-test-bloom").value = q.bloom_level;

  const isMCQ = q.question_type === "mcq";
  document.getElementById("edit-test-options-container").style.display = isMCQ ? "block" : "none";
  document.getElementById("edit-test-scenario-container").style.display = q.question_type === "scenario" ? "block" : "none";

  document.getElementById("modal-edit-test-question").classList.add("active");
};

document.getElementById("form-edit-test-question").addEventListener("submit", async (e) => {
  e.preventDefault();
  const qid = Number(document.getElementById("edit-test-qid").value);
  const q = chapterTestsData.find(item => item.id === qid);
  if (!q) return;

  const body = {
    question_id: qid,
    question: document.getElementById("edit-test-question-text").value.trim(),
    scenario_context: document.getElementById("edit-test-scenario").value.trim(),
    option_a: document.getElementById("edit-test-opt-a").value.trim(),
    option_b: document.getElementById("edit-test-opt-b").value.trim(),
    option_c: document.getElementById("edit-test-opt-c").value.trim(),
    option_d: document.getElementById("edit-test-opt-d").value.trim(),
    correct_option: document.getElementById("edit-test-correct-option").value.trim(),
    expected_answer: document.getElementById("edit-test-expected-answer").value.trim(),
    marks: Number(document.getElementById("edit-test-marks").value),
    bloom_level: document.getElementById("edit-test-bloom").value
  };

  try {
    const response = await fetch(`${API_BASE_URL}/admin/update-chapter-test-question`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (response.ok && data.success) {
      showToast("Chapter test question updated successfully.", "success");
      closeModal("modal-edit-test-question");
      fetchChapterTests(); // reload tab list
    } else {
      showToast(data.detail || "Failed to update test question.", "error");
    }
  } catch (error) {
    showToast("Network request failed.", "error");
  }
});

document.getElementById("chapter-select-tests").addEventListener("change", () => {
  fetchChapterTests();
});

// Student Evaluation History Handler
async function fetchEvaluationHistory() {
  const tableBody = document.getElementById("evaluations-table-body");
  tableBody.innerHTML = `
    <tr>
      <td colspan="4" style="text-align: center; padding: 2rem;">
        <div class="loader"></div>
        <p style="margin-top: 1rem; color: var(--text-muted);">Fetching evaluation logs...</p>
      </td>
    </tr>
  `;

  try {
    const response = await fetch(`${API_BASE_URL}/admin/results`);
    const data = await response.json();
    
    if (response.ok && data.success) {
      renderEvaluationsTable(data.results);
    } else {
      tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--error)">Failed to fetch evaluation records.</td></tr>`;
    }
  } catch (error) {
    tableBody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--error)">Error connecting to server.</td></tr>`;
  }
}

function renderEvaluationsTable(results) {
  const tableBody = document.getElementById("evaluations-table-body");
  if (!results || results.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; padding: 3rem; color: var(--text-muted)">
          <div style="font-size: 2rem; margin-bottom: 0.5rem">📝</div>
          No evaluation records found. Evaluations are created when students submit chapter test essay questions.
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = "";
  results.forEach(res => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="font-family: var(--font-mono); color: var(--text-muted)">#${res.id}</td>
      <td style="font-weight: 500">${escapeHtml(res.student_name)}</td>
      <td>
        <div style="margin-bottom: 0.5rem;"><strong>Question:</strong> ${escapeHtml(res.question)}</div>
        <div style="background: rgba(0,0,0,0.15); padding: 0.5rem; border-radius: 6px; border: 1px solid rgba(255,255,255,0.05); font-family: var(--font-sans); font-size: 0.85rem;">
          <strong>Answer:</strong> ${escapeHtml(res.student_answer)}
        </div>
      </td>
      <td>
        <div style="white-space: pre-wrap; font-size: 0.85rem; color: var(--success); font-family: var(--font-sans); max-height: 200px; overflow-y: auto; line-height: 1.4;">${escapeHtml(res.evaluation)}</div>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Initial Bootup
checkAuth();
