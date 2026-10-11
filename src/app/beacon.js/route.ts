import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const file = path.join(process.cwd(), "src", "beacon.js");
    const js = await readFile(file, "utf8");
    return new NextResponse(js, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch {
    return new NextResponse("// beacon not found", { status: 404 });
  }
}
