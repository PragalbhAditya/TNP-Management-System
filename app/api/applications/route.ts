import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import Drive from "@/models/Drive";
import User from "@/models/User";
import { UserRole } from "@/types/user";

// POST apply to a drive
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== UserRole.STUDENT) {
            return NextResponse.json({ error: "Only students can apply" }, { status: 401 });
        }

        const { driveId } = await req.json();
        await dbConnect();

        // 1. Check if drive exists and is eligible for application
        const drive = await Drive.findById(driveId);
        if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 });

        const isPastDeadline = new Date() > new Date(drive.applicationDeadline);
        if (isPastDeadline || ['expired', 'cancelled', 'completed'].includes(drive.status)) {
            return NextResponse.json({ error: "Application deadline passed or drive is no longer active" }, { status: 400 });
        }

        // 2. Check student eligibility
        const student = await User.findById((session.user as any).id);
        if (!student) return NextResponse.json({ error: "Student not found" }, { status: 404 });

        if (student.cgpa < drive.eligibility.minCgpa) {
            return NextResponse.json({ error: "Min CGPA requirement not met" }, { status: 400 });
        }
        if (student.backlogs > drive.eligibility.maxBacklogs) {
            return NextResponse.json({ error: "Backlog limit exceeded" }, { status: 400 });
        }
        if (drive.eligibility.allowedBranches.length > 0 && !drive.eligibility.allowedBranches.includes(student.branch)) {
            return NextResponse.json({ error: "Branch not eligible" }, { status: 400 });
        }

        // 3. Create application
        const application = await Application.create({
            student: (session.user as any).id,
            drive: driveId,
        });

        return NextResponse.json(application, { status: 201 });
    } catch (error: any) {
        if (error.code === 11000) {
            return NextResponse.json({ error: "Already applied to this drive" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
    }
}

// GET student's applications
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();

        let applications;
        if ((session.user as any).role === UserRole.STUDENT) {
            applications = await Application.find({ student: (session.user as any).id }).populate("drive");
        } else {
            // Admin/Recruiter might want to see all applications (or filtered by drive)
            applications = await Application.find({}).populate("student drive");
        }

        return NextResponse.json(applications);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
    }
}
