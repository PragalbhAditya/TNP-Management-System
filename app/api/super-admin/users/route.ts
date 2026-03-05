import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { UserRole } from "@/types/user";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || ((session.user as any).role !== UserRole.SUPER_ADMIN && (session.user as any).role !== UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const users = await User.find({ role: { $ne: UserRole.SUPER_ADMIN } }).sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
