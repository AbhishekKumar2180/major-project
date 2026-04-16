import { db } from "@/utils";
import { NOTIFICATIONS } from "@/utils/schema";
import { eq, desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get('userId');

    try {
        const result = await db.select()
            .from(NOTIFICATIONS)
            .where(userId ? eq(NOTIFICATIONS.userId, userId) : undefined)
            .orderBy(desc(NOTIFICATIONS.id));
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
    }
}
