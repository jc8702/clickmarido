import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createGoogleEvent, updateGoogleEvent } from '@/lib/google-calendar';

export async function POST(req: Request) {
  try {
    const session: { user?: { accessToken?: string } } | null = await getServerSession(authOptions);
    if (!session?.user?.accessToken) {
      return NextResponse.json(
        { error: 'Você não está conectado ao Google Agenda' },
        { status: 401 },
      );
    }

    const body = await req.json();
    const { title, startTime, endTime, isEdit, eventId } = body;

    let googleEvent;

    if (isEdit && eventId) {
      googleEvent = await updateGoogleEvent(session.user.accessToken, eventId, {
        summary: title,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
      });
    } else {
      googleEvent = await createGoogleEvent(session.user.accessToken, {
        summary: title,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
      });
    }

    return NextResponse.json({ success: true, googleEventId: googleEvent.id });
  } catch (error: unknown) {
    console.error('Erro na API de calendário:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
