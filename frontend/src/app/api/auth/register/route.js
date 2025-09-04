import connect from '@/utils/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await connect();
    const { name, email, password } = await request.json();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "User already exists!" }), { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ 
      name, 
      email, 
      password: hashedPassword,
      provider: 'credentials'
    });
    
    await user.save();
    return new Response(JSON.stringify({ message: "User registered successfully!" }), { status: 201 });
  } catch (err) {
    console.log("error in /api/auth/register 😔 ", err);
    return new Response(JSON.stringify({ error: "Something went wrong while registering!" }), { status: 500 });
  }
}
