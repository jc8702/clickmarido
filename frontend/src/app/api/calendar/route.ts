import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { createGoogleEvent, updateGoogleEvent } from '@/lib/google-calendar';

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions);
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Você não está conectado ao Google Agenda' }, { status: 401 });
    }

    const body = await req.json();
    const { title, startTime, endTime, isEdit, eventId } = body;

    let googleEvent;
    
    if (isEdit && eventId) {
      googleEvent = await updateGoogleEvent(session.accessToken, eventId, {
        summary: title,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
      });
    } else {
      googleEvent = await createGoogleEvent(session.accessToken, {
        summary: title,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
      });
    }

    return NextResponse.json({ success: true, googleEventId: googleEvent.id });
  } catch (error: any) {
    console.error('Erro na API de calendário:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
