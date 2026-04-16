import { db } from "@/utils";
import { USERS } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    try {
        const result = await db.select().from(USERS).where(eq(USERS.email, email));
        if (result.length > 0) {
            return NextResponse.json(result[0]);
        } else {
            // If user doesn't exist, we might want to create them or return a default
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }
}

export async function POST(req) {
    const data = await req.json();
    const { email, name, emailNotifications, pushNotifications, systemAlerts } = data;

    try {
        const result = await db.insert(USERS)
        .values({
            email,
            name,
            emailNotifications,
            pushNotifications,
            systemAlerts,
            role: 'admin' // Default for this project's current user
        })
        .onConflictDoUpdate({
            target: USERS.email,
            set: {
                name,
                emailNotifications,
                pushNotifications,
                systemAlerts
            }
        });
        
        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 });
    }
}
