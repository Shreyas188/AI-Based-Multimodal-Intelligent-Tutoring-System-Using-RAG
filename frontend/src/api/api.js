const API_BASE_URL = "http://127.0.0.1:8000";

// Helper for making standard JSON fetch requests
async function apiRequest(endpoint, method = "GET", body = null) {
  const url = `${API_BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`API Error on ${method} ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  baseUrl: API_BASE_URL,
  // Authentication
  registerStudent: async (fullName, email, password) => {
    return apiRequest("/register", "POST", {
      full_name: fullName,
      email,
      password
    });
  },

  loginStudent: async (email, password) => {
    return apiRequest("/login", "POST", {
      email,
      password
    });
  },

  // Chapter & Topics
  getChapters: async (studentId) => {
    const query = studentId ? `?student_id=${studentId}` : "";
    return apiRequest(`/chapters${query}`);
  },

  getTopics: async (chapterId, studentId) => {
    const query = studentId ? `?student_id=${studentId}` : "";
    return apiRequest(`/topics/${chapterId}${query}`);
  },

  // Study Materials
  getStudyMaterials: async (topicId, studentId) => {
    const query = studentId ? `?student_id=${studentId}` : "";
    return apiRequest(`/study-materials/${topicId}${query}`);
  },

  markTopicStudied: async (studentId, topicId) => {
    return apiRequest("/mark-topic-studied", "POST", {
      student_id: Number(studentId),
      topic_id: Number(topicId)
    });
  },

  // Doubt Solver AI
  askDoubt: async (studentId, topicId, question) => {
    return apiRequest("/ask-doubt", "POST", {
      student_id: Number(studentId),
      topic_id: Number(topicId),
      question
    });
  },

  // Quizzes
  getTopicQuiz: async (topicId, studentId) => {
    const query = studentId ? `?student_id=${studentId}` : "";
    return apiRequest(`/topic-quiz/${topicId}${query}`);
  },

  submitTopicQuiz: async (studentId, topicId, answers) => {
    return apiRequest("/submit-topic-quiz", "POST", {
      student_id: Number(studentId),
      topic_id: Number(topicId),
      answers: answers.map(item => ({
        question_id: Number(item.question_id),
        answer: item.answer
      }))
    });
  },

  // Chapter Final Tests
  getChapterTest: async (chapterId, studentId) => {
    const query = studentId ? `?student_id=${studentId}` : "";
    return apiRequest(`/chapter-test/${chapterId}${query}`);
  },

  submitChapterTest: async (studentId, chapterId, answers) => {
    return apiRequest("/submit-chapter-test", "POST", {
      student_id: Number(studentId),
      chapter_id: Number(chapterId),
      answers: answers.map(item => ({
        question_id: Number(item.question_id),
        answer: item.answer
      }))
    });
  },

  // Progress Panel
  getProgress: async (studentId) => {
    return apiRequest(`/progress/${Number(studentId)}`);
  },

  // Offline Speech-to-Text (Whisper via local backend)
  transcribeAudio: async (audioBlob) => {
    const formData = new FormData();
    // Name must have an extension so the backend can detect the audio format
    formData.append("audio", audioBlob, "audio.webm");
    const response = await fetch(`${API_BASE_URL}/transcribe-audio`, {
      method: "POST",
      body: formData
      // NOTE: Do NOT set Content-Type header here.
      // The browser must set it automatically with the correct multipart boundary.
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.detail || `Transcription failed: ${response.status}`);
    }
    return response.json(); // { success: true, text: "..." }
  }
};
