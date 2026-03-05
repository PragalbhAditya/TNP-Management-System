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
        const file = formData.get("photo") as File;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        // Check if file is an image
        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "File must be an image" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), "public", "uploads", "photos");
        await mkdir(uploadDir, { recursive: true });

        const filename = `${(session.user as any).id}-${Date.now()}-${file.name}`;
        const path = join(uploadDir, filename);
        await writeFile(path, buffer);

        const photoUrl = `/uploads/photos/${filename}`;

        await dbConnect();
        await User.findByIdAndUpdate((session.user as any).id, {
            image: photoUrl,
        });

        return NextResponse.json({ message: "Photo uploaded successfully", url: photoUrl });
    } catch (error) {
        console.error("Photo upload error:", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
