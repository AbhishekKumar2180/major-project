import { db } from "@/utils";
import { ATTENDANCE, STUDENTS } from "@/utils/schema";
import { and, asc, eq, isNull, or } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {

    const searchParams = req.nextUrl.searchParams;
    const grade = searchParams.get('grade');
    const month = searchParams.get('month')

    const result = await db.select({
        name: STUDENTS.name,
        present: ATTENDANCE.present,
        day: ATTENDANCE.day,
        date: ATTENDANCE.date,
        grade: STUDENTS.grade,
        studentId: STUDENTS.id,
        attendanceId: ATTENDANCE.id
    }).from(STUDENTS)
        .leftJoin(ATTENDANCE, and(eq(STUDENTS.id, ATTENDANCE.studentId), eq(ATTENDANCE.date, month)))
        .where(eq(STUDENTS.grade, grade))
        .orderBy(asc(STUDENTS.id))
        

    return NextResponse.json(result);
}

export async function POST(req, res) {
    const data = await req.json();
    
    try {
        const result = await db.insert(ATTENDANCE)
            .values({
                studentId: parseInt(data.studentId),
                present: data.present,
                day: parseInt(data.day),
                date: data.date
            })
            .onConflictDoUpdate({
                target: [ATTENDANCE.studentId, ATTENDANCE.day, ATTENDANCE.date],
                set: { present: data.present }
            });

        return NextResponse.json(result);
    } catch (e) {
        // Fallback if the database doesn't have the unique index yet
        const result = await db.insert(ATTENDANCE)
            .values({
                studentId: parseInt(data.studentId),
                present: data.present,
                day: parseInt(data.day),
                date: data.date
            });
        return NextResponse.json(result);
    }
}

export async function DELETE(req) {

    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');
    const day = searchParams.get('day');


    const result = await db.delete(ATTENDANCE)
        .where(
            and(
                eq(ATTENDANCE.studentId, parseInt(studentId)),
                eq(ATTENDANCE.day, parseInt(day)),
                eq(ATTENDANCE.date, date)
            )
        )


    return NextResponse.json(result);
}