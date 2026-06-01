import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generateLifeCommentary } from "@/features/life-commentary/lib/generate-life-commentary";
import { lifeCommentaryRequestSchema } from "@/features/life-commentary/schemas/life-commentary-schema";
import type {
  LifeCommentaryApiError,
  LifeCommentaryApiResponse,
} from "@/types/life-commentary";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<LifeCommentaryApiError>(
        { error: "伺服器未設定 OPENAI_API_KEY，請於 .env.local 新增後重試。" },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();
    const scores = lifeCommentaryRequestSchema.parse(body);
    const data = await generateLifeCommentary(scores);

    return NextResponse.json<LifeCommentaryApiResponse>({ data });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json<LifeCommentaryApiError>(
        { error: error.issues[0]?.message ?? "請求參數格式錯誤" },
        { status: 400 },
      );
    }

    console.error("[life-commentary]", error);

    const message =
      error instanceof Error ? error.message : "產生人生評論時發生未知錯誤";

    return NextResponse.json<LifeCommentaryApiError>(
      { error: message },
      { status: 500 },
    );
  }
}
