import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { generatePersonalityCommentary } from "@/features/personality-commentary/lib/generate-personality-commentary";
import { personalityCommentaryRequestSchema } from "@/features/personality-commentary/schemas/personality-commentary-schema";
import type {
  PersonalityCommentaryApiError,
  PersonalityCommentaryApiResponse,
} from "@/types/personality-commentary";

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json<PersonalityCommentaryApiError>(
        {
          error:
            "伺服器未設定 OPENAI_API_KEY，儀表板仍可瀏覽；設定後可產生 AI 文案。",
        },
        { status: 503 },
      );
    }

    const body: unknown = await request.json();
    const profile = personalityCommentaryRequestSchema.parse(body);
    const data = await generatePersonalityCommentary(profile);

    return NextResponse.json<PersonalityCommentaryApiResponse>({ data });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json<PersonalityCommentaryApiError>(
        { error: error.issues[0]?.message ?? "請求參數格式錯誤" },
        { status: 400 },
      );
    }

    console.error("[personality-commentary]", error);

    const message =
      error instanceof Error ? error.message : "產生人格評論時發生未知錯誤";

    return NextResponse.json<PersonalityCommentaryApiError>(
      { error: message },
      { status: 500 },
    );
  }
}
