import { db } from "@/utils";
import { LEAVES } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');

    try {
        const result = await db.select()
            .from(LEAVES)
            .where(studentId ? eq(LEAVES.studentId, studentId) : undefined);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch leaves" }, { status: 500 });
    }
}

export async function POST(req) {
    const data = await req.json();
    try {
        const result = await db.insert(LEAVES).values({
            studentId: data.studentId,
            startDate: data.startDate,
            endDate: data.endDate,
            reason: data.reason,
            status: 'pending'
        });
        return NextResponse.json({ success: true, result });
    } catch (error) {
        return NextResponse.json({ error: "Failed to submit leave" }, { status: 500 });
    }
}
