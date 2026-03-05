import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Drive from "@/models/Drive";
import { UserRole } from "@/types/user";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const drive = await Drive.findById(params.id);
        if (!drive) return NextResponse.json({ error: "Drive not found" }, { status: 404 });
        return NextResponse.json(drive);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch drive" }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || ((session.user as any).role !== UserRole.ADMIN && (session.user as any).role !== UserRole.SUPER_ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await dbConnect();

        const drive = await Drive.findByIdAndUpdate(params.id, data, { new: true });
        return NextResponse.json(drive);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update drive" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || ((session.user as any).role !== UserRole.ADMIN && (session.user as any).role !== UserRole.SUPER_ADMIN)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        await Drive.findByIdAndDelete(params.id);
        return NextResponse.json({ message: "Drive deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete drive" }, { status: 500 });
    }
}
