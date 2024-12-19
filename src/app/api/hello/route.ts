import { NextResponse } from "next/server";

export async function GET(res: Response) {
  return NextResponse.json({ name: "Sushanta Bhowmick" },{status:200});
}
