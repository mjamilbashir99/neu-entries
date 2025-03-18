import { NextResponse } from "next/server";
import Connection from "@/app/dbconfig/dbconfig";
import User from "../../../../model/UserModel";

export async function GET() {
  //   try {
  await Connection();
  const users = await User.find();
  console.log(users);
  return NextResponse.json({ users }, { status: 200 });
}
