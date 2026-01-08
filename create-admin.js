// Temporary script to create admin user - DELETE THIS FILE AFTER USE
const { initializeApp } = require('firebase/app');
const { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } = require('firebase/auth');
const { getFirestore, doc, setDoc, getDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyD-TFXXUvEEzTkkBLeITkmnAqsq9MB4oAc",
  authDomain: "ayceebuilder.firebaseapp.com",
  projectId: "ayceebuilder",
  storageBucket: "ayceebuilder.firebasestorage.app",
  messagingSenderId: "88628301513",
  appId: "1:88628301513:web:d5937cf430c7b0fe4b8718",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function createOrUpdateAdminUser() {
  try {
    const adminEmail = 'aaycee54@gmail.com';
    const adminPassword = 'AYCEEBUILDER';
    let user;
    
    try {
      // Try to create new user
      //console.log('Trying to create new admin user...');
      const result = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
      user = result.user;
      //console.log('New admin user created with UID:', user.uid);
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        // User already exists, sign them in to get the UID
        //console.log('User already exists, signing in to get UID...');
        const result = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
        user = result.user;
        //console.log('Existing user signed in with UID:', user.uid);
      } else {
        throw error;
      }
    }
    
    // Check if user document already exists
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      //console.log('User document already exists. Checking role...');
      const userData = userDoc.data();
      if (userData.role === 'admin') {
        //console.log('User is already an admin!');
      } else {
        //console.log('Updating user role to admin...');
        await setDoc(userDocRef, { 
          ...userData, 
          role: 'admin',
          updatedAt: new Date()
        });
        //console.log('User role updated to admin!');
      }
    } else {
      // Create new user document with admin role
      //console.log('Creating admin user document in Firestore...');
      const adminUserDoc = {
        uid: user.uid,
        email: adminEmail,
        name: 'Admin User',
        role: 'admin', // This is crucial!
        addresses: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      await setDoc(userDocRef, adminUserDoc);
      //console.log('Admin user document created successfully!');
    }
    
    //console.log('\n=== ADMIN USER DETAILS ===');
    //console.log('Admin UID:', user.uid);
    //console.log('Admin Email:', adminEmail);
    //console.log('Password:', adminPassword);
    //console.log('\nDELETE THIS FILE AFTER USE FOR SECURITY!');
    
  } catch (error) {
    console.error('Error with admin user setup:', error);
  }
}

createOrUpdateAdminUser();