import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { UserRole } from "@/types/user";
import mongoose from "mongoose";
import { writeAuditLog } from "@/lib/auditLogger";

export async function PATCH(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || ((session.user as any).role !== UserRole.SUPER_ADMIN && (session.user as any).role !== UserRole.ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        const updateData = await req.json();
        await dbConnect();

        // Fetch current state for logging context
        const before = await User.findById(id);
        if (!before) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Determine audit action
        const actor = session.user as any;
        const performedBy = { id: actor.id, name: actor.name ?? "", email: actor.email ?? "", role: actor.role };
        const targetUser = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };

        if (updateData.isVerified !== undefined) {
            await writeAuditLog({
                action: updateData.isVerified ? "USER_APPROVED" : "USER_REVOKED",
                performedBy,
                targetUser,
                details: updateData.isVerified
                    ? `Approved ${user.role} account: ${user.email}`
                    : `Revoked approval for ${user.role} account: ${user.email}`,
            });
        } else if (updateData.isBlocked !== undefined) {
            await writeAuditLog({
                action: updateData.isBlocked ? "USER_BLOCKED" : "USER_UNBLOCKED",
                performedBy,
                targetUser,
                details: updateData.isBlocked
                    ? `Blocked account: ${user.email}`
                    : `Unblocked account: ${user.email}`,
            });
        } else if (updateData.role !== undefined) {
            await writeAuditLog({
                action: updateData.role === UserRole.ADMIN ? "USER_PROMOTED" : "USER_DEMOTED",
                performedBy,
                targetUser,
                details: updateData.role === UserRole.ADMIN
                    ? `Promoted ${before.email} from student → admin`
                    : `Demoted ${before.email} from admin → student`,
                metadata: { previousRole: before.role, newRole: updateData.role },
            });
        } else if (updateData.placementStatus !== undefined) {
            await writeAuditLog({
                action: "PLACEMENT_STATUS_CHANGED",
                performedBy,
                targetUser,
                details: `Changed placement status to "${updateData.placementStatus}" for ${user.email}`,
                metadata: { previous: before.placementStatus, updated: updateData.placementStatus },
            });
        } else {
            await writeAuditLog({
                action: "USER_UPDATED",
                performedBy,
                targetUser,
                details: `Updated profile for ${user.email}`,
                metadata: { fields: Object.keys(updateData) },
            });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to update user:", error);
        return NextResponse.json({ error: "Failed to update user status" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== UserRole.SUPER_ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await context.params;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const actor = session.user as any;
        await writeAuditLog({
            action: "USER_DELETED",
            performedBy: { id: actor.id, name: actor.name ?? "", email: actor.email ?? "", role: actor.role },
            targetUser: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
            details: `Permanently deleted ${user.role} account: ${user.email}`,
        });

        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Failed to delete user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
