import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { aiFoundationCourse } from './aiFoundationCourse.js';
import { promptEngineeringCourse } from './promptEngineeringCourse.js';
import { aiApiAppsCourse } from './aiApiAppsCourse.js';
import { ragVectorDbCourse } from './ragVectorDbCourse.js';
import { langchainAgentsCourse } from './langchainAgentsCourse.js';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const courses = [
  aiFoundationCourse,
  promptEngineeringCourse,
  aiApiAppsCourse,
  ragVectorDbCourse,
  langchainAgentsCourse,
];

async function addAllCourses() {
  try {
    const email = process.env.SEED_EMAIL;
    const password = process.env.SEED_PASSWORD;
    if (!email || !password) {
      throw new Error('Set SEED_EMAIL and SEED_PASSWORD in your .env file');
    }

    console.log(`Signing in as ${email}...`);
    await signInWithEmailAndPassword(auth, email, password);
    console.log('✅ Signed in\n');

    console.log('Adding all courses to Firestore...\n');

    for (const course of courses) {
      const courseData = {
        ...course,
        createdBy: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        enrolledStudents: 0,
      };

      const docRef = await addDoc(collection(db, 'courses'), courseData);

      console.log(`✅ Added: ${course.title}`);
      console.log(`   Course ID: ${docRef.id}`);
      console.log(`   Level: ${course.level} | Duration: ${course.duration} weeks`);
      console.log(`   Chapters: ${course.chapters.length} | Lessons: ${course.chapters.reduce((sum, ch) => sum + ch.lessons.length, 0)}\n`);
    }

    console.log('🎉 All courses added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding courses:', error);
    process.exit(1);
  }
}

addAllCourses();
