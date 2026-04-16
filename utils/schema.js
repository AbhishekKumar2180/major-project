import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const GRADES = sqliteTable('grades', {
    id: integer('id').primaryKey(),
    grade: text('grade').notNull()
});

export const USERS = sqliteTable('users', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    email: text('email').unique().notNull(),
    name: text('name').notNull(),
    role: text('role').notNull().default('student'), // admin, teacher, student
    picture: text('picture'),
    emailNotifications: integer('emailNotifications', { mode: 'boolean' }).default(true),
    pushNotifications: integer('pushNotifications', { mode: 'boolean' }).default(false),
    systemAlerts: integer('systemAlerts', { mode: 'boolean' }).default(true),
});

export const SUBJECTS = sqliteTable('subjects', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    gradeId: integer('gradeId').notNull(), // Links to GRADES
    teacherId: integer('teacherId').notNull(), // Links to USERS (Teacher)
});

export const TIMETABLE = sqliteTable('timetable', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    subjectId: integer('subjectId').notNull(),
    dayOfWeek: text('dayOfWeek').notNull(), // 'Monday', 'Tuesday', etc.
    startTime: text('startTime').notNull(),
    endTime: text('endTime').notNull(),
    room: text('room'),
});

export const STUDENTS = sqliteTable('students', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    name: text('name').notNull(),
    grade: text('grade').notNull(),
    address: text('address'),
    contact: text('contact'),
    userId: integer('userId'), // Optional link to USERS
})

export const ATTENDANCE = sqliteTable('attendance', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    studentId: integer('studentId').notNull(),
    subjectId: integer('subjectId'),
    present: integer('present', { mode: 'boolean' }).default(false),
    day: integer('day').notNull(),
    date: text('date').notNull(),
    verificationMethod: text('verificationMethod').default('manual'), // manual, qr, geo, face
    location: text('location'), // coordinates or room if geo verified
});

export const LEAVES = sqliteTable('leaves', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    studentId: integer('studentId').notNull(),
    startDate: text('startDate').notNull(),
    endDate: text('endDate').notNull(),
    reason: text('reason').notNull(),
    status: text('status').default('pending'), // pending, approved, rejected
});

export const NOTIFICATIONS = sqliteTable('notifications', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: integer('userId').notNull(),
    message: text('message').notNull(),
    type: text('type').default('info'), // info, warning, success
    isRead: integer('isRead', { mode: 'boolean' }).default(false),
    createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`CURRENT_TIMESTAMP`),
});
