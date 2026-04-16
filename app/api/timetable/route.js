import { db } from "@/utils";
import { TIMETABLE, SUBJECTS } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const gradeId = searchParams.get('gradeId');

    try {
        // Joining Timetable with Subjects to get subject names
        const result = await db.select({
            id: TIMETABLE.id,
            day: TIMETABLE.dayOfWeek,
            start: TIMETABLE.startTime,
            end: TIMETABLE.endTime,
            room: TIMETABLE.room,
            subjectName: SUBJECTS.name
        })
        .from(TIMETABLE)
        .innerJoin(SUBJECTS, eq(TIMETABLE.subjectId, SUBJECTS.id))
        .where(gradeId ? eq(SUBJECTS.gradeId, gradeId) : undefined);
        
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch timetable" }, { status: 500 });
    }
}
