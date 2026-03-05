import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Exam from "@/models/Exam";

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const exam = await Exam.findById(params.id)
            .populate("questions")
            .populate("createdBy", "name email");

        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        return NextResponse.json(exam);
    } catch (error) {
        console.error("Failed to fetch exam:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user?.role !== "admin" && session.user?.role !== "super-admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updateData = await request.json();

        await dbConnect();

        const exam = await Exam.findByIdAndUpdate(
            params.id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .populate("questions")
            .populate("createdBy", "name email");

        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        return NextResponse.json(exam);
    } catch (error) {
        console.error("Failed to update exam:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user?.role !== "admin" && session.user?.role !== "super-admin")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        const exam = await Exam.findByIdAndDelete(params.id);

        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Exam deleted successfully" });
    } catch (error) {
        console.error("Failed to delete exam:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
