import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Drive from "@/models/Drive";
import { UserRole } from "@/types/user";

// GET all drives
export async function GET() {
    try {
        await dbConnect();

        // Auto-expire drives where deadline has passed
        await Drive.updateMany(
            {
                applicationDeadline: { $lt: new Date() },
                status: { $in: ['upcoming', 'ongoing'] }
            },
            { $set: { status: 'expired' } }
        );

        const drives = await Drive.find({}).sort({ createdAt: -1 });
        return NextResponse.json(drives);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch drives" }, { status: 500 });
    }
}

// POST create a drive (Admin/Recruiter only)
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || ((session.user as any).role !== UserRole.ADMIN && (session.user as any).role !== UserRole.SUPER_ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await dbConnect();

        const drive = await Drive.create({
            ...data,
            createdBy: (session.user as any).id,
        });

        return NextResponse.json(drive, { status: 201 });
    } catch (error: any) {
        console.error("Create drive error:", error);
        return NextResponse.json({ error: error.message || "Failed to create drive" }, { status: 500 });
    }
}
