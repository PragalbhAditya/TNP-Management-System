import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Exam from "@/models/Exam";
import User from "@/models/User";

interface Question {
    questionText: string;
    type: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    options?: string[];
}

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id: examId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const exam = await Exam.findById(examId).populate("questions");

        if (!exam) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        // Fetch user's exam completion record
        const userEmail = (session.user as { email?: string }).email;
        if (!userEmail) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const user = await User.findOne({ email: userEmail });
        const examCompletion = user?.examsCompleted?.find(
            (e: { examId: { toString(): string } }) => e.examId.toString() === examId
        );

        if (!examCompletion) {
            return NextResponse.json(
                { message: "Exam not completed yet" },
                { status: 404 }
            );
        }

        // For now, return mock results since we're not storing detailed answers
        // In production, create a separate Submission model to store detailed answer logs
        const correctAnswers = Math.round(
            (examCompletion.score / 100) * exam.questions.length
        );

        const mockQuestions: Question[] = exam.questions.map((q: { text: string; options?: string[]; correctAnswer: string; type?: string }, idx: number) => ({
            questionText: q.text,
            type: q.type || "mcq",
            userAnswer: idx % 2 === 0 ? (q.options?.[0] || "Sample answer") : "",
            correctAnswer: q.correctAnswer,
            isCorrect: idx % 2 === 0,
            options: q.options,
        }));

        return NextResponse.json(
            {
                examTitle: exam.title,
                score: examCompletion.score,
                correctAnswers,
                totalQuestions: exam.questions.length,
                completedAt: examCompletion.completedAt,
                questions: mockQuestions,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching exam results:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
