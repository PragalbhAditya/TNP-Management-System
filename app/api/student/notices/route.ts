import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Notice from "@/models/Notice";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const notices = await Notice.find({}).sort({ createdAt: -1 });
        return NextResponse.json(notices, { status: 200 });
    } catch (error) {
        console.error("Error fetching notices:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
