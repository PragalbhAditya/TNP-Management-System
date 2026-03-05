import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { UserRole } from "@/types/user";
import { writeAuditLog } from "@/lib/auditLogger";

export async function POST(req: Request) {
    try {
        const { name, email, password, role, rollNumber, dateOfBirth } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        await dbConnect();

        let parsedDOB = undefined;
        if (dateOfBirth) {
            parsedDOB = new Date(dateOfBirth);
            if (isNaN(parsedDOB.getTime())) {
                return NextResponse.json(
                    { error: "Invalid Date of Birth" },
                    { status: 400 }
                );
            }

            // Optional: Minimum age validation (e.g., 15 years)
            const minAgeDate = new Date();
            minAgeDate.setFullYear(minAgeDate.getFullYear() - 15);
            if (parsedDOB > minAgeDate) {
                return NextResponse.json(
                    { error: "Minimum age required is 15 years" },
                    { status: 400 }
                );
            }
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role as UserRole,
            rollNumber: rollNumber || undefined,
            dateOfBirth: parsedDOB,
        });

        await writeAuditLog({
            action: "USER_REGISTERED",
            performedBy: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
            details: `New ${user.role} account registered: ${user.email}`,
        });

        return NextResponse.json(
            { message: "User registered successfully", userId: user._id },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
