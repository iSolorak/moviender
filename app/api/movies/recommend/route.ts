import { NextResponse } from "next/server";

import { recommendMovies } from "@/lib/providers";

type RecommendBody = {
  items?: string[];
  selectedTitles?: string[];
  genres?: string[];
  limit?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecommendBody;
    const items = (body.selectedTitles ?? body.items ?? []).map((item) => item.trim()).filter(Boolean);
    const genres = body.genres?.map((genre) => genre.trim()).filter(Boolean) ?? [];
    const limit = typeof body.limit === "number" ? body.limit : 20;
    const response = await recommendMovies(items, genres, limit);

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load recommendations right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
