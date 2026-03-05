import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { UserRole } from "@/types/user";
import fs from "fs/promises";
import path from "path";

// Extremely simple keyword-based parser for demonstration
// In a real app, use a library like 'pdf-parse' or an AI service
const KEYWORDS = ["React", "Next.js", "TypeScript", "Node.js", "Python", "Java", "SQL", "Docker", "AWS"];

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== UserRole.STUDENT) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findById((session.user as any).id);
        if (!user || !user.resumeUrl) {
            return NextResponse.json({ error: "No resume found" }, { status: 404 });
        }

        // Read the file and search for keywords (very naive)
        const filePath = path.join(process.cwd(), "public", user.resumeUrl);
        const content = await fs.readFile(filePath, "utf-8").catch(() => "");

        const detectedSkills = KEYWORDS.filter(skill =>
            content.toLowerCase().includes(skill.toLowerCase())
        );

        // Update user skills if new ones found
        if (detectedSkills.length > 0) {
            await User.findByIdAndUpdate(user._id, {
                $addToSet: { skills: { $each: detectedSkills } }
            });
        }

        return NextResponse.json({
            skills: detectedSkills,
            message: detectedSkills.length > 0 ? "Skills extracted from resume" : "No new skills detected"
        });
    } catch (error) {
        return NextResponse.json({ error: "Parsing failed" }, { status: 500 });
    }
}
