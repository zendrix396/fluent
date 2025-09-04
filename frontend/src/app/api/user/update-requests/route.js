import connect from '@/utils/db';
import User from '@/models/User';
import { getServerSession } from "next-auth";

export async function POST(request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    await connect();
    const user = await User.findOne({ email: session.user.email });
    
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    // Update request count
    user.requestCount += 1;
    user.lastRequest = new Date();
    await user.save();

    return new Response(JSON.stringify({ 
      message: "Request count updated",
      requestCount: user.requestCount,
      isPremium: user.isPremium
    }), { status: 200 });
  } catch (err) {
    console.log("error in /api/user/update-requests 😔 ", err);
    return new Response(JSON.stringify({ error: "Something went wrong!" }), { status: 500 });
  }
}
