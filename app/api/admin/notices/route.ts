import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Notice from "@/models/Notice";
import User from "@/models/User";
import auditLogger from "@/lib/auditLogger";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session || !["admin", "super-admin"].includes(session.user.role)) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const { title, content } = await req.json();

        if (!title || !content) {
            return NextResponse.json({ message: "Title and content are required" }, { status: 400 });
        }

        const notice = await Notice.create({
            title,
            content,
            author: session.user.id,
        });

        await auditLogger({
            entityName: "Notice",
            entityId: notice._id.toString(),
            action: "create",
            newData: notice.toObject(),
            userId: session.user.id,
        });

        return NextResponse.json({ message: "Notice created successfully", notice }, { status: 201 });
    } catch (error) {
        console.error("Error creating notice:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
