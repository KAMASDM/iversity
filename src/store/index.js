import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      userData: null,
      loading: false,
      error: null,

      setUser: (user) => set({ user }),
      setUserData: (userData) => set({ userData }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      clearAuth: () => set({ user: null, userData: null, error: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

export const useCourseStore = create((set, get) => ({
  courses: [],
  selectedCourse: null,
  loading: false,
  error: null,

  setCourses: (courses) => set({ courses }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addCourse: (course) => set((state) => ({
    courses: [...state.courses, course],
  })),

  updateCourse: (courseId, updates) => set((state) => ({
    courses: state.courses.map(course =>
      course.id === courseId ? { ...course, ...updates } : course
    ),
  })),

  deleteCourse: (courseId) => set((state) => ({
    courses: state.courses.filter(course => course.id !== courseId),
  })),
}));

export const useEnrollmentStore = create((set) => ({
  enrollments: [],
  currentEnrollment: null,
  curriculum: null,
  loading: false,
  error: null,

  setEnrollments: (enrollments) => set({ enrollments }),
  setCurrentEnrollment: (enrollment) => set({ currentEnrollment: enrollment }),
  setCurriculum: (curriculum) => set({ curriculum }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  updateEnrollment: (enrollmentId, updates) => set((state) => ({
    enrollments: state.enrollments.map(enrollment =>
      enrollment.id === enrollmentId ? { ...enrollment, ...updates } : enrollment
    ),
    currentEnrollment: state.currentEnrollment?.id === enrollmentId
      ? { ...state.currentEnrollment, ...updates }
      : state.currentEnrollment,
  })),
}));

export const useBuddyStore = create((set) => ({
  chatHistory: [],
  isOpen: false,
  loading: false,
  courseContext: null, // { courseName, currentChapter, currentLesson, currentLessonContent, progressPercentage }

  setChatHistory: (history) => set({ chatHistory: history }),
  
  addMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, message],
  })),

  toggleBuddy: () => set((state) => ({ isOpen: !state.isOpen })),
  
  setLoading: (loading) => set({ loading }),

  setCourseContext: (ctx) => set({ courseContext: ctx }),

  clearChat: () => set({ chatHistory: [] }),
}));

export const useProgressStore = create((set) => ({
  quizResults: [],
  assignments: [],
  currentModule: null,
  progressPercentage: 0,

  setQuizResults: (results) => set({ quizResults: results }),
  setAssignments: (assignments) => set({ assignments }),
  setCurrentModule: (module) => set({ currentModule: module }),
  setProgressPercentage: (percentage) => set({ progressPercentage: percentage }),

  addQuizResult: (result) => set((state) => ({
    quizResults: [...state.quizResults, result],
  })),

  addAssignment: (assignment) => set((state) => ({
    assignments: [...state.assignments, assignment],
  })),
}));

export const useNotificationStore = create((set) => ({
  notifications: [],

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, { id: Date.now(), ...notification }],
  })),

  removeNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id),
  })),

  clearNotifications: () => set({ notifications: [] }),
}));
