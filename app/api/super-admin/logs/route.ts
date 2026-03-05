import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import AuditLog from "@/models/AuditLog";
import { UserRole } from "@/types/user";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== UserRole.SUPER_ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");
        const limit = parseInt(searchParams.get("limit") || "100");
        const page = parseInt(searchParams.get("page") || "1");

        await dbConnect();

        const query: any = {};
        if (action && action !== "all") query.action = action;

        const total = await AuditLog.countDocuments(query);
        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return NextResponse.json({ logs, total, page, limit });
    } catch (error) {
        console.error("Failed to fetch audit logs:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
