import { db } from "@/utils";
import { ATTENDANCE, TIMETABLE, SUBJECTS } from "@/utils/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import moment from "moment";

export async function POST(req) {
    const data = await req.json();
    const { studentId, grade, timestamp, token, location, method } = data;

    // 1. Validate Expiry (QR code expires after 5 minutes)
    const now = Date.now();
    const qrAge = now - timestamp;
    if (qrAge > 300000) { // 5 minutes
        return NextResponse.json({ success: false, message: "QR Code has expired" }, { status: 400 });
    }

    // 2. Validate Geolocation (Mocking Classroom at Lat: 12.9716, Lng: 77.5946 - Bangalore)
    // In a real app, classroom coordinates would come from a ROOMS or TIMETABLE table
    const targetLat = 12.9716;
    const targetLng = 77.5946;
    const distanceThreshold = 0.5; // ~50 meters tolerance (very rough estimation for demo)

    const distance = Math.sqrt(
        Math.pow(location.lat - targetLat, 2) + 
        Math.pow(location.lng - targetLng, 2)
    );

    // If student is too far (simplified check for demo)
    // Note: In real production, use Haversine formula
    if (distance > 0.001) { // Roughly 100 meters
        return NextResponse.json({ 
            success: false, 
            message: "You are too far from the classroom to mark attendance." 
        }, { status: 403 });
    }

    // 3. Record Attendance
    try {
        const today = parseInt(moment().format('D'));
        const monthYear = moment().format('MM/YYYY');

        const result = await db.insert(ATTENDANCE).values({
            studentId,
            present: true,
            day: today,
            date: monthYear,
            verificationMethod: method,
            location: JSON.stringify(location)
        })
        .onConflictDoUpdate({
            target: [ATTENDANCE.studentId, ATTENDANCE.day, ATTENDANCE.date],
            set: { present: true, location: JSON.stringify(location), verificationMethod: method }
        });

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("Verification error:", error);
        return NextResponse.json({ success: false, message: "Credential node out of sync" }, { status: 500 });
    }
}
