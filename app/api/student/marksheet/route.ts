import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { UserRole } from "@/types/user";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== UserRole.STUDENT) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("marksheet") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public", "uploads", "marksheets");
        await mkdir(uploadDir, { recursive: true });

        const filename = `${(session.user as any).id}-${Date.now()}-${file.name}`;
        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        const marksheetUrl = `/uploads/marksheets/${filename}`;

        await dbConnect();
        await User.findByIdAndUpdate((session.user as any).id, {
            marksheetUrl: marksheetUrl,
        });

        return NextResponse.json({ message: "Marksheet uploaded successfully", url: marksheetUrl });
    } catch (error) {
        console.error("Marksheet upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
