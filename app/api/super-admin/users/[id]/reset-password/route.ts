import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { UserRole } from "@/types/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { writeAuditLog } from "@/lib/auditLogger";

export async function POST(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== UserRole.SUPER_ADMIN) {
            return NextResponse.json({ error: "Unauthorized. Super-admin only." }, { status: 401 });
        }

        const { id } = await context.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const { newPassword } = await req.json();

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        const actor = session.user as any;
        await writeAuditLog({
            action: "PASSWORD_RESET",
            performedBy: { id: actor.id, name: actor.name ?? "", email: actor.email ?? "", role: actor.role },
            targetUser: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
            details: `Super-admin reset password for: ${user.email}`,
        });

        return NextResponse.json({ message: "Password reset successful" });
    } catch (error) {
        console.error("Failed to reset password:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
