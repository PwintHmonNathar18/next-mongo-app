import dbConnect from "@/lib/db";

export async function register() {
  console.log("Connecting to database...");
  await dbConnect();
}
