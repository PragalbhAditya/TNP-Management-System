import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Interview from "@/models/Interview";
import { UserRole } from "@/types/user";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await dbConnect();
        const query = (session.user as any).role === UserRole.STUDENT
            ? { student: (session.user as any).id }
            : {}; // Admins see all

        const interviews = await Interview.find(query).populate("student drive").sort({ startTime: 1 });
        return NextResponse.json(interviews);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch interviews" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || ((session.user as any).role !== UserRole.ADMIN && (session.user as any).role !== UserRole.SUPER_ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await dbConnect();

        const interview = await Interview.create(data);
        return NextResponse.json(interview, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to schedule interview" }, { status: 500 });
    }
}
