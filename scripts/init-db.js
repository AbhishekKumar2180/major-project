const { db } = require('../utils/index');
const { GRADES, STUDENTS, USERS, SUBJECTS, TIMETABLE } = require('../utils/schema');

const initDb = async () => {
    console.log("📦 Initializing advanced database...");

    try {
        // 1. Seed Grades
        const gradesData = [
            { id: 1, grade: '1st' }, { id: 2, grade: '2nd' }, { id: 3, grade: '3rd' },
            { id: 4, grade: '4th' }, { id: 5, grade: '5th' }, { id: 6, grade: '6th' },
            { id: 7, grade: '7th' }, { id: 8, grade: '8th' }, { id: 9, grade: '9th' },
            { id: 10, grade: '10th' }
        ];
        await db.insert(GRADES).values(gradesData).onConflictDoNothing();
        console.log("✅ Grades seeded");

        // 2. Seed Users (Teachers & Admin)
        const usersData = [
            { id: 1, email: 'admin@school.edu', name: 'System Admin', role: 'admin' },
            { id: 2, email: 'math.teacher@school.edu', name: 'Dr. John Smith', role: 'teacher' },
            { id: 3, email: 'science.teacher@school.edu', name: 'Ms. Sarah Connor', role: 'teacher' }
        ];
        await db.insert(USERS).values(usersData).onConflictDoNothing();
        console.log("✅ Basic Users seeded");

        // 3. Seed Subjects
        const subjectsData = [
            { id: 1, name: 'Advanced Mathematics', gradeId: 5, teacherId: 2 },
            { id: 2, name: 'Quantum Physics', gradeId: 5, teacherId: 3 }
        ];
        await db.insert(SUBJECTS).values(subjectsData).onConflictDoNothing();
        console.log("✅ Subjects seeded");

        // 4. Seed Timetable
        const timetableData = [
            { id: 1, subjectId: 1, dayOfWeek: 'Monday', startTime: '09:00', endTime: '10:00', room: 'Room 101' },
            { id: 2, subjectId: 2, dayOfWeek: 'Monday', startTime: '10:15', endTime: '11:15', room: 'Lab 1' }
        ];
        await db.insert(TIMETABLE).values(timetableData).onConflictDoNothing();
        console.log("✅ Timetable seeded");

        // 5. Seed Students
        const studentsData = [
            { id: 1, name: 'Emily Davis', grade: '5th', address: '123 Maple St', contact: '555-0101' },
            { id: 2, name: 'Jacob Wilson', grade: '5th', address: '456 Oak Ave', contact: '555-0102' },
            { id: 3, name: 'Olivia Brown', grade: '4th', address: '789 Pine Rd', contact: '555-0103' },
            { id: 4, name: 'Ethan Taylor', grade: '4th', address: '321 Elm St', contact: '555-0104' }
        ];
        await db.insert(STUDENTS).values(studentsData).onConflictDoNothing();
        console.log("✅ Students seeded");

        console.log("\n🎉 Advanced Database ready!");
    } catch (error) {
        console.error("❌ Initialization failed:", error);
    }
    process.exit(0);
};

initDb();
