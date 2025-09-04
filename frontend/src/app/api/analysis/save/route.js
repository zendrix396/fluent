import connect from '@/utils/db';
import Analysis from '@/models/Analysis';
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connect();
    const analysisData = await request.json();
    
    const analysis = new Analysis({
      userId: session.user.id,
      ...analysisData
    });
    
    await analysis.save();

    return new Response(JSON.stringify({ 
      message: "Analysis saved successfully",
      analysisId: analysis._id
    }), { status: 201 });
  } catch (err) {
    console.log("error in /api/analysis/save 😔 ", err);
    return new Response(JSON.stringify({ error: "Something went wrong while saving analysis!" }), { status: 500 });
  }
}
