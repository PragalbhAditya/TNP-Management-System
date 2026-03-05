import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Notice from "@/models/Notice";
import User from "@/models/User";
import { writeAuditLog } from "@/lib/auditLogger";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["admin", "super-admin"].includes((session.user as any).role)) {
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

        const actor = session.user as any;
        await writeAuditLog({
            action: "NOTICE_CREATED",
            performedBy: {
                id: actor.id,
                name: actor.name ?? "",
                email: actor.email ?? "",
                role: actor.role,
            },
            details: `Created notice: ${title}`,
            metadata: { noticeId: notice._id.toString() },
        });

        return NextResponse.json({ message: "Notice created successfully", notice }, { status: 201 });
    } catch (error) {
        console.error("Error creating notice:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
