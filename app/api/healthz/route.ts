import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple health check - just return OK status
    return NextResponse.json(
      { 
        status: "ok", 
        timestamp: new Date().toISOString(),
        service: "VillageVibe API"
      }, 
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { 
        status: "error", 
        message: "Health check failed",
        timestamp: new Date().toISOString()
      }, 
      { status: 500 }
    );
  }
}
