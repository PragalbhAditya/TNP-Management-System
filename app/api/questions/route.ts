import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Question from "@/models/Question";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const topic = searchParams.get("topic");

        await dbConnect();
        const query = topic ? { topic } : {};
        const questions = await Question.find(query);

        return NextResponse.json(questions);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        await dbConnect();
        const question = await Question.create(data);
        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create question" }, { status: 500 });
    }
}
