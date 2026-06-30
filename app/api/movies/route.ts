import { NextResponse } from "next/server";

import { getMovies } from "@/lib/providers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const genres = searchParams
      .get("genres")
      ?.split(",")
      .map((genre) => genre.trim())
      .filter(Boolean) ?? [];

    const response = await getMovies(genres);

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load movies right now.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
