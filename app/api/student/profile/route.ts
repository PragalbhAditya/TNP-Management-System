import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { writeAuditLog } from "@/lib/auditLogger";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById((session.user as any).id).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to fetch profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const updateData = await req.json();
        const userId = (session.user as any).id;

        // Prevent changing sensitive fields
        delete updateData.role;
        delete updateData.password;
        delete updateData.email;
        delete updateData.isVerified;
        delete updateData.isBlocked;

        await dbConnect();
        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Log the profile update
        await writeAuditLog({
            action: "USER_UPDATED",
            performedBy: {
                id: userId,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            targetUser: {
                id: userId,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            details: `Updated profile details: ${Object.keys(updateData).join(", ")}`,
            metadata: { updatedFields: Object.keys(updateData) }
        });

        return NextResponse.json(user);
    } catch (error) {
        console.error("Failed to update profile:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
