// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAF66MKaDZOX7-xlXsW-YA0qV_Z617uDfE",
    authDomain: "isaa-559ef.firebaseapp.com",
    databaseURL: "https://isaa-559ef-default-rtdb.firebaseio.com",
    projectId: "isaa-559ef",
    storageBucket: "isaa-559ef.firebasestorage.app",
    messagingSenderId: "1017838932952",
    appId: "1:1017838932952:web:8796cfdc74b1ab3343d8ad",
    measurementId: "G-CP77K3P2YZ"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

console.log('✅ Firebase initialized with Analytics');

// Initialize IBAN data in Firebase (run once)
function initializeBankData() {
    const bankDataRef = database.ref('bankAccounts');
    
    // Check if data exists
    bankDataRef.once('value').then(function(snapshot) {
        if (!snapshot.exists()) {
            // Set initial IBAN data
            const initialData = {
                bank1: {
                    owner: 'GRANDPASHABET LTD',
                    iban: 'TR33 0001 0012 3456 7890 1234 56',
                    bankName: 'Ziraat Bankası',
                    branch: '1234',
                    accountNo: '98765432'
                },
                bank2: {
                    owner: 'GRANDPASHABET LTD',
                    iban: 'TR44 0006 2000 1234 5678 9012 34',
                    bankName: 'Garanti BBVA',
                    branch: '2000',
                    accountNo: '12345678'
                },
                bank3: {
                    owner: 'GRANDPASHABET LTD',
                    iban: 'TR55 0006 4000 0011 2233 4455 66',
                    bankName: 'İş Bankası',
                    branch: '4000',
                    accountNo: '11223344'
                }
            };
            
            bankDataRef.set(initialData).then(function() {
                console.log('✅ Bank data initialized in Firebase');
            }).catch(function(error) {
                console.error('❌ Error initializing bank data:', error);
            });
        } else {
            console.log('✅ Bank data already exists in Firebase');
        }
    });
}

// Auto-initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBankData);
} else {
    initializeBankData();
}
