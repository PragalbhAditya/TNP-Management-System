import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Application from "@/models/Application";
import Interview from "@/models/Interview";
import Drive from "@/models/Drive";
import { UserRole } from "@/types/user";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const session = await getServerSession(authOptions);
        if (!session || ((session.user as any).role !== UserRole.SUPER_ADMIN && (session.user as any).role !== UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch applications with drive details
        const applications = await Application.find({ student: id })
            .populate({
                path: 'drive',
                model: Drive,
                select: 'companyName role package status'
            })
            .sort({ appliedAt: -1 });

        // Fetch interviews for these applications
        const interviews = await Interview.find({ student: id })
            .populate({
                path: 'drive',
                model: Drive,
                select: 'companyName role'
            })
            .sort({ startTime: -1 });

        return NextResponse.json({
            applications,
            interviews
        });
    } catch (error) {
        console.error("Failed to fetch student history:", error);
        return NextResponse.json({ error: "Failed to fetch student history" }, { status: 500 });
    }
}
