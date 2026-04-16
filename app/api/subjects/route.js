import { db } from "@/utils";
import { SUBJECTS } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const gradeId = searchParams.get('gradeId');

    try {
        const result = await db.select()
            .from(SUBJECTS)
            .where(gradeId ? eq(SUBJECTS.gradeId, gradeId) : undefined);
        
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
    }
}
