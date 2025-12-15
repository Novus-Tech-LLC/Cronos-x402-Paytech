import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  try {
    const { requestId } = params

    // In production, this would query the contract or AI Agent SDK
    // to get the actual payment status

    return NextResponse.json({
      requestId,
      status: 'pending',
      recipient: '0x0000000000000000000000000000000000000000',
      amount: '0',
      executed: false,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

