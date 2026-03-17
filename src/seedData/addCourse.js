import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { promptEngineeringCourse } from './promptEngineeringCourse.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_k938j9YuO0vI12u2zYMCBBcXaWlxgIU",
  authDomain: "iversity-99ee3.firebaseapp.com",
  projectId: "iversity-99ee3",
  storageBucket: "iversity-99ee3.firebasestorage.app",
  messagingSenderId: "142392345895",
  appId: "1:142392345895:web:982ebccd4d6c8381e29502",
  measurementId: "G-ES5ZWDCGCV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addPromptEngineeringCourse() {
  try {
    console.log('Adding Prompt Engineering course to Firestore...');
    
    const courseData = {
      ...promptEngineeringCourse,
      createdBy: 'system',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      enrolledStudents: 0,
    };

    const docRef = await addDoc(collection(db, 'courses'), courseData);
    
    console.log('✅ Course added successfully!');
    console.log('Course ID:', docRef.id);
    console.log('\nCourse Details:');
    console.log('- Title:', courseData.title);
    console.log('- Level:', courseData.level);
    console.log('- Duration:', courseData.duration, 'weeks');
    console.log('- Chapters:', courseData.chapters.length);
    console.log('- Total Lessons:', courseData.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0));
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding course:', error);
    process.exit(1);
  }
}

addPromptEngineeringCourse();
