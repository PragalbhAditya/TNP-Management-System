import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Exam from "@/models/Exam";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        let exams;

        // Super admin and admin can see all exams
        if (session.user?.role === "super-admin" || session.user?.role === "admin") {
            exams = await Exam.find()
                .populate("questions")
                .populate("createdBy", "name email")
                .sort({ startTime: -1 });
        } else {
            // Students can only see exams
            exams = await Exam.find({ isLive: true })
                .populate("questions")
                .sort({ startTime: -1 });
        }

        return NextResponse.json(exams);
    } catch (error) {
        console.error("Failed to fetch exams:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user?.role !== "admin" && session.user?.role !== "super-admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const examData = await req.json();

        await dbConnect();

        const newExam = new Exam({
            ...examData,
            createdBy: (session.user as { email?: string }).email,
            isLive: false,
        });

        await newExam.save();
        await newExam.populate("questions");
        await newExam.populate("createdBy", "name email");

        // Remove audit log as it's optional

        return NextResponse.json(newExam, { status: 201 });
    } catch (error) {
        console.error("Failed to create exam:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
