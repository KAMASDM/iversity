import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  arrayUnion,
  arrayRemove,
  increment,
} from 'firebase/firestore';
import { db } from '../config/firebase';

// ============= COURSE OPERATIONS =============

export const createCourse = async (courseData, adminId) => {
  try {
    const courseRef = doc(collection(db, 'courses'));
    const course = {
      id: courseRef.id,
      ...courseData,
      createdBy: adminId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      enrolledStudents: 0,
      published: false,
    };

    await setDoc(courseRef, course);
    return courseRef.id;
  } catch (error) {
    console.error('Error creating course:', error);
    throw error;
  }
};

export const getCourse = async (courseId) => {
  try {
    const courseDoc = await getDoc(doc(db, 'courses', courseId));
    if (courseDoc.exists()) {
      return { id: courseDoc.id, ...courseDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting course:', error);
    throw error;
  }
};

export const getAllCourses = async () => {
  try {
    const coursesSnapshot = await getDocs(collection(db, 'courses'));
    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting courses:', error);
    throw error;
  }
};

export const getPublishedCourses = async () => {
  try {
    const q = query(collection(db, 'courses'), where('published', '==', true));
    const coursesSnapshot = await getDocs(q);
    return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting published courses:', error);
    throw error;
  }
};

export const updateCourse = async (courseId, updates) => {
  try {
    await updateDoc(doc(db, 'courses', courseId), {
      ...updates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating course:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId) => {
  try {
    await deleteDoc(doc(db, 'courses', courseId));
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

// ============= ENROLLMENT OPERATIONS =============

export const enrollStudent = async (courseId, studentId, questionnaireResponses) => {
  try {
    const enrollmentRef = doc(collection(db, 'enrollments'));
    const enrollment = {
      id: enrollmentRef.id,
      courseId,
      studentId,
      questionnaireResponses,
      enrolledAt: serverTimestamp(),
      progress: 0,
      status: 'active',
      currentModule: null,
      completedModules: [],
      quizResults: [],
      assignmentSubmissions: [],
    };

    await setDoc(enrollmentRef, enrollment);

    // Update course enrolled students count
    await updateDoc(doc(db, 'courses', courseId), {
      enrolledStudents: increment(1),
    });

    // Update user enrollments
    await updateDoc(doc(db, 'users', studentId), {
      enrolledCourses: arrayUnion(courseId),
    });

    return enrollmentRef.id;
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw error;
  }
};

export const getStudentEnrollments = async (studentId) => {
  try {
    const q = query(
      collection(db, 'enrollments'),
      where('studentId', '==', studentId)
    );
    const enrollmentsSnapshot = await getDocs(q);
    return enrollmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting enrollments:', error);
    throw error;
  }
};

export const getEnrollment = async (enrollmentId) => {
  try {
    const enrollmentDoc = await getDoc(doc(db, 'enrollments', enrollmentId));
    if (enrollmentDoc.exists()) {
      return { id: enrollmentDoc.id, ...enrollmentDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting enrollment:', error);
    throw error;
  }
};

export const updateEnrollmentProgress = async (enrollmentId, progressData) => {
  try {
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      ...progressData,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating enrollment progress:', error);
    throw error;
  }
};

// ============= CURRICULUM OPERATIONS =============

export const savePersonalizedCurriculum = async (enrollmentId, curriculum) => {
  try {
    const curriculumRef = doc(db, 'curriculums', enrollmentId);
    await setDoc(curriculumRef, {
      enrollmentId,
      curriculum,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error saving curriculum:', error);
    throw error;
  }
};

export const getCurriculum = async (enrollmentId) => {
  try {
    const curriculumDoc = await getDoc(doc(db, 'curriculums', enrollmentId));
    if (curriculumDoc.exists()) {
      return curriculumDoc.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting curriculum:', error);
    throw error;
  }
};

// ============= QUIZ OPERATIONS =============

export const saveQuizResult = async (enrollmentId, quizData) => {
  try {
    const quizRef = doc(collection(db, 'quizResults'));
    const quizResult = {
      id: quizRef.id,
      enrollmentId,
      ...quizData,
      submittedAt: serverTimestamp(),
    };

    await setDoc(quizRef, quizResult);

    // Update enrollment with quiz result
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      quizResults: arrayUnion({
        quizId: quizRef.id,
        moduleId: quizData.moduleId,
        score: quizData.score,
        submittedAt: new Date().toISOString(),
      }),
    });

    return quizRef.id;
  } catch (error) {
    console.error('Error saving quiz result:', error);
    throw error;
  }
};

export const getQuizResults = async (enrollmentId) => {
  try {
    const q = query(
      collection(db, 'quizResults'),
      where('enrollmentId', '==', enrollmentId),
      orderBy('submittedAt', 'desc')
    );
    const quizSnapshot = await getDocs(q);
    return quizSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting quiz results:', error);
    throw error;
  }
};

// ============= ASSIGNMENT OPERATIONS =============

export const submitAssignment = async (enrollmentId, assignmentData) => {
  try {
    const assignmentRef = doc(collection(db, 'assignments'));
    const assignment = {
      id: assignmentRef.id,
      enrollmentId,
      ...assignmentData,
      submittedAt: serverTimestamp(),
      status: 'submitted',
    };

    await setDoc(assignmentRef, assignment);

    // Update enrollment
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      assignmentSubmissions: arrayUnion({
        assignmentId: assignmentRef.id,
        moduleId: assignmentData.moduleId,
        submittedAt: new Date().toISOString(),
      }),
    });

    return assignmentRef.id;
  } catch (error) {
    console.error('Error submitting assignment:', error);
    throw error;
  }
};

export const gradeAssignment = async (assignmentId, grade, feedback) => {
  try {
    await updateDoc(doc(db, 'assignments', assignmentId), {
      grade,
      feedback,
      gradedAt: serverTimestamp(),
      status: 'graded',
    });
  } catch (error) {
    console.error('Error grading assignment:', error);
    throw error;
  }
};

// ============= EXAM OPERATIONS =============

export const submitExam = async (enrollmentId, examData) => {
  try {
    const examRef = doc(collection(db, 'exams'));
    const exam = {
      id: examRef.id,
      enrollmentId,
      ...examData,
      submittedAt: serverTimestamp(),
      status: 'submitted',
    };

    await setDoc(examRef, exam);
    return examRef.id;
  } catch (error) {
    console.error('Error submitting exam:', error);
    throw error;
  }
};

export const saveExamEvaluation = async (examId, evaluation) => {
  try {
    await updateDoc(doc(db, 'exams', examId), {
      evaluation,
      evaluatedAt: serverTimestamp(),
      status: 'evaluated',
    });
  } catch (error) {
    console.error('Error saving exam evaluation:', error);
    throw error;
  }
};

// ============= CERTIFICATE OPERATIONS =============

export const generateCertificate = async (enrollmentId, studentData, courseData, examResult) => {
  try {
    const certificateRef = doc(collection(db, 'certificates'));
    const certificate = {
      id: certificateRef.id,
      enrollmentId,
      studentId: studentData.id,
      studentName: studentData.displayName,
      courseId: courseData.id,
      courseName: courseData.title,
      issueDate: serverTimestamp(),
      examScore: examResult.overallScore,
      certificateNumber: `IVERSITY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };

    await setDoc(certificateRef, certificate);

    // Update enrollment status
    await updateDoc(doc(db, 'enrollments', enrollmentId), {
      status: 'completed',
      completedAt: serverTimestamp(),
      certificateId: certificateRef.id,
    });

    return certificate;
  } catch (error) {
    console.error('Error generating certificate:', error);
    throw error;
  }
};

export const getCertificate = async (certificateId) => {
  try {
    const certDoc = await getDoc(doc(db, 'certificates', certificateId));
    if (certDoc.exists()) {
      return { id: certDoc.id, ...certDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting certificate:', error);
    throw error;
  }
};

// ============= VIRTUAL BUDDY CHAT =============

export const saveChatMessage = async (enrollmentId, message) => {
  try {
    const chatRef = doc(collection(db, 'chats'));
    const chatMessage = {
      id: chatRef.id,
      enrollmentId,
      ...message,
      timestamp: serverTimestamp(),
    };

    await setDoc(chatRef, chatMessage);
    return chatRef.id;
  } catch (error) {
    console.error('Error saving chat message:', error);
    throw error;
  }
};

export const getChatHistory = async (enrollmentId) => {
  try {
    const q = query(
      collection(db, 'chats'),
      where('enrollmentId', '==', enrollmentId),
      orderBy('timestamp', 'asc'),
      limit(50)
    );
    const chatSnapshot = await getDocs(q);
    return chatSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting chat history:', error);
    throw error;
  }
};

// ============= ANALYTICS =============

export const getStudentAnalytics = async (studentId) => {
  try {
    const enrollments = await getStudentEnrollments(studentId);
    
    const analytics = {
      totalCourses: enrollments.length,
      activeCourses: enrollments.filter(e => e.status === 'active').length,
      completedCourses: enrollments.filter(e => e.status === 'completed').length,
      averageProgress: enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length || 0,
      totalQuizzes: enrollments.reduce((sum, e) => sum + (e.quizResults?.length || 0), 0),
    };

    return analytics;
  } catch (error) {
    console.error('Error getting student analytics:', error);
    throw error;
  }
};

export const getCourseAnalytics = async (courseId) => {
  try {
    const q = query(collection(db, 'enrollments'), where('courseId', '==', courseId));
    const enrollmentsSnapshot = await getDocs(q);
    const enrollments = enrollmentsSnapshot.docs.map(doc => doc.data());

    const analytics = {
      totalEnrollments: enrollments.length,
      activeStudents: enrollments.filter(e => e.status === 'active').length,
      completedStudents: enrollments.filter(e => e.status === 'completed').length,
      averageProgress: enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / enrollments.length || 0,
      completionRate: (enrollments.filter(e => e.status === 'completed').length / enrollments.length * 100) || 0,
    };

    return analytics;
  } catch (error) {
    console.error('Error getting course analytics:', error);
    throw error;
  }
};

// ============= NOTES OPERATIONS =============

export const saveNote = async (noteData) => {
  try {
    const noteRef = doc(collection(db, 'notes'));
    await setDoc(noteRef, {
      id: noteRef.id,
      ...noteData,
      createdAt: serverTimestamp(),
    });
    return noteRef.id;
  } catch (error) {
    console.error('Error saving note:', error);
    throw error;
  }
};

export const getNotes = async (userId, courseId, chapterId = null, lessonId = null) => {
  try {
    let q = query(
      collection(db, 'notes'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );

    if (chapterId) {
      q = query(q, where('chapterId', '==', chapterId));
    }
    if (lessonId) {
      q = query(q, where('lessonId', '==', lessonId));
    }

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
};

export const deleteNote = async (noteId) => {
  try {
    await deleteDoc(doc(db, 'notes', noteId));
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// ============= TODO OPERATIONS =============

export const saveTodo = async (todoData) => {
  try {
    const todoRef = doc(collection(db, 'todos'));
    await setDoc(todoRef, {
      id: todoRef.id,
      ...todoData,
      createdAt: serverTimestamp(),
    });
    return todoRef.id;
  } catch (error) {
    console.error('Error saving todo:', error);
    throw error;
  }
};

export const getTodos = async (userId, courseId) => {
  try {
    const q = query(
      collection(db, 'todos'),
      where('userId', '==', userId),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting todos:', error);
    throw error;
  }
};

export const updateTodo = async (todoId, updates) => {
  try {
    await updateDoc(doc(db, 'todos', todoId), updates);
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (todoId) => {
  try {
    await deleteDoc(doc(db, 'todos', todoId));
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

// ============= GAMIFICATION OPERATIONS =============

export const getStudentGamification = async (userId, courseId) => {
  try {
    const q = query(
      collection(db, 'gamification'),
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      // Create initial gamification record
      const gamificationRef = doc(collection(db, 'gamification'));
      const initialData = {
        id: gamificationRef.id,
        userId,
        courseId,
        level: 1,
        points: 0,
        streak: 0,
        badges: [],
        achievements: [],
        lessonsCompleted: 0,
        quizzesPassed: 0,
        createdAt: serverTimestamp(),
      };
      await setDoc(gamificationRef, initialData);
      return initialData;
    }
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error('Error getting gamification:', error);
    throw error;
  }
};

export const updateGamification = async (userId, courseId, updates) => {
  try {
    const q = query(
      collection(db, 'gamification'),
      where('userId', '==', userId),
      where('courseId', '==', courseId)
    );
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const docId = snapshot.docs[0].id;
      await updateDoc(doc(db, 'gamification', docId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    }
  } catch (error) {
    console.error('Error updating gamification:', error);
    throw error;
  }
};

export const awardPoints = async (userId, courseId, points, achievementTitle, achievementDescription) => {
  try {
    const gamification = await getStudentGamification(userId, courseId);
    const newPoints = (gamification.points || 0) + points;
    const newLevel = Math.floor(newPoints / 100) + 1;
    
    const updates = {
      points: newPoints,
      level: newLevel,
      achievements: arrayUnion({
        title: achievementTitle,
        description: achievementDescription,
        points,
        timestamp: new Date().toISOString(),
      }),
    };
    
    await updateGamification(userId, courseId, updates);
  } catch (error) {
    console.error('Error awarding points:', error);
    throw error;
  }
};

export const awardBadge = async (userId, courseId, badgeId) => {
  try {
    await updateGamification(userId, courseId, {
      badges: arrayUnion(badgeId),
    });
  } catch (error) {
    console.error('Error awarding badge:', error);
    throw error;
  }
};

export const updateStreak = async (userId, courseId) => {
  try {
    const gamification = await getStudentGamification(userId, courseId);
    const lastActivity = gamification.lastActivityDate;
    const today = new Date().toDateString();
    
    let newStreak = gamification.streak || 0;
    
    if (!lastActivity || lastActivity !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (lastActivity === yesterday.toDateString()) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
      
      await updateGamification(userId, courseId, {
        streak: newStreak,
        lastActivityDate: today,
      });
      
      // Award streak badges
      if (newStreak === 7) {
        await awardBadge(userId, courseId, 'streak_7');
        await awardPoints(userId, courseId, 50, '7 Day Streak!', 'Learned for 7 days straight');
      }
    }
  } catch (error) {
    console.error('Error updating streak:', error);
    throw error;
  }
};

export default {
  createCourse,
  getCourse,
  getAllCourses,
  getPublishedCourses,
  updateCourse,
  deleteCourse,
  enrollStudent,
  getStudentEnrollments,
  getEnrollment,
  updateEnrollmentProgress,
  savePersonalizedCurriculum,
  getCurriculum,
  saveQuizResult,
  getQuizResults,
  submitAssignment,
  gradeAssignment,
  submitExam,
  saveExamEvaluation,
  generateCertificate,
  getCertificate,
  saveChatMessage,
  getChatHistory,
  getStudentAnalytics,
  getCourseAnalytics,
  saveNote,
  getNotes,
  deleteNote,
  saveTodo,
  getTodos,
  updateTodo,
  deleteTodo,
  getStudentGamification,
  updateGamification,
  awardPoints,
  awardBadge,
  updateStreak,
};
