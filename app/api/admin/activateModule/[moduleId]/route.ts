import { NextResponse } from "next/server";
import { prismadb } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, props: { params: Promise<{ moduleId: string }> }) {
  const params = await props.params;
  const session = await getServerSession(authOptions);

  console.log("POST function started for moduleId:", await params.moduleId);

  if (!session) {
    console.log("User not authenticated.");
    return new NextResponse("Unauthenticated", { status: 401 });
  }

  console.log("User authenticated.");
  console.log("Attempting to connect to the database...");

  try {
    const user = await prismadb.system_Modules_Enabled.update({
      where: {
        id: await params.moduleId,
      },
      data: {
        enabled: true,
      },
    });

    console.log("Database interaction successful. Module activated.");
    console.log("Sending response...");

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in POST function:", error);
    return new NextResponse("Initial error", { status: 500 });
  }
}
