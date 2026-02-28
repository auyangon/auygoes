// scripts/exam/setupDatabase.js
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://auy-exam-default-rtdb.firebaseio.com"
});

const db = admin.database();

async function setupDatabase() {
  console.log(' Setting up exam database...');

  // Create indexes and initial structure
  const updates = {};

  // Sample exam for testing
  const sampleExam = {
    title: "Sample Midterm Exam",
    description: "This is a sample exam to test the system",
    courseId: "CS101",
    duration: 60,
    totalPoints: 100,
    passingScore: 60,
    status: "published",
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "q1",
        text: "What is the capital of France?",
        type: "multiple-choice",
        options: ["London", "Paris", "Berlin", "Madrid"],
        correctAnswer: "Paris",
        points: 10
      },
      {
        id: "q2",
        text: "JavaScript is a compiled language.",
        type: "true-false",
        options: ["True", "False"],
        correctAnswer: "False",
        points: 5
      },
      {
        id: "q3",
        text: "What does HTML stand for?",
        type: "short-answer",
        correctAnswer: "HyperText Markup Language",
        points: 15
      }
    ],
    settings: {
      shuffleQuestions: true,
      shuffleOptions: true,
      allowReview: false,
      showResults: true,
      maxAttempts: 1,
      timeLimit: 60,
      antiCheating: {
        fullscreen: true,
        preventTabSwitch: true,
        preventCopyPaste: true,
        preventRightClick: true,
        faceDetection: false,
        randomizeQuestions: true,
        ipTracking: true
      }
    }
  };

  updates['/exams/sample-exam'] = sampleExam;

  await db.ref().update(updates);
  console.log(' Database setup complete!');
}

setupDatabase().catch(console.error);
