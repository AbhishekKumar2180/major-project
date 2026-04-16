import { db } from "@/utils";
import { USERS } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const result = await db.select()
            .from(USERS)
            .where(eq(USERS.role, 'teacher'));
        
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch faculty" }, { status: 500 });
    }
}
