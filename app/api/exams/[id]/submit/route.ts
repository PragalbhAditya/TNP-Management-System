import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import dbConnect from "@/lib/dbConnect";
import Exam from "@/models/Exam";
import User from "@/models/User";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "student") {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    try {
        const { answers } = await req.json();
        const examId = params.id;

        const exam = await Exam.findById(examId).populate("questions");

        if (!exam) {
            return NextResponse.json({ message: "Exam not found" }, { status: 404 });
        }

        // Calculate score
        let correctCount = 0;
        const detailedAnswers: Array<{
            questionId: string;
            questionText: string;
            type: string;
            userAnswer: string;
            correctAnswer: string;
            isCorrect: boolean;
            options?: string[];
        }> = [];

        for (const question of exam.questions) {
            const userAnswer = answers[question._id.toString()];
            const isCorrect =
                question.type === "mcq"
                    ? userAnswer === question.correctAnswer
                    : userAnswer &&
                      userAnswer.toLowerCase().trim() ===
                          question.correctAnswer.toLowerCase().trim();

            if (isCorrect) correctCount++;

            detailedAnswers.push({
                questionId: question._id,
                questionText: question.text,
                type: question.type,
                userAnswer,
                correctAnswer: question.correctAnswer,
                isCorrect,
                options: question.options,
            });
        }

        // Store submission in database (optional - can create a Submission model if needed)
        const score = (correctCount / exam.questions.length) * 100;

        // Update user's exam completion status
        const userEmail = (session.user as { email?: string }).email;
        if (userEmail) {
            await User.findOneAndUpdate(
                { email: userEmail },
                {
                    $push: {
                        examsCompleted: {
                            examId,
                            score,
                            completedAt: new Date(),
                        },
                    },
                },
                { new: true }
            );
        }


        return NextResponse.json(
            {
                score,
                correctAnswers: correctCount,
                totalQuestions: exam.questions.length,
                percentage: Math.round(score),
                detailedAnswers,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error submitting exam:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
