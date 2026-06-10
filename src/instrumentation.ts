export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startWorkers } = await import('@/workers');
    await startWorkers();
    console.log('[Instrumentation] Workers registered');
  }
}
