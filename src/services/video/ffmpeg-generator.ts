import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

export class FFmpegGenerator {
  private static getTempDir(): string {
    const dir = path.join(process.cwd(), 'temp-renders');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return dir;
  }

  // Grava uma imagem base64 ou baixa uma URL para o disco
  private static async prepareImage(imageUrl: string, id: string): Promise<string> {
    const dir = this.getTempDir();
    const filePath = path.join(dir, `image-${id}.jpg`);

    if (imageUrl.startsWith('data:')) {
      const base64Data = imageUrl.split(',')[1];
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      return filePath;
    }

    // Se for URL HTTP
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`Falha ao baixar imagem: ${imageUrl}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return filePath;
  }

  // Grava um áudio base64 ou baixa uma URL para o disco
  private static async prepareAudio(audioUrl: string, id: string): Promise<string> {
    const dir = this.getTempDir();
    const filePath = path.join(dir, `audio-${id}.mp3`);

    if (audioUrl.startsWith('data:')) {
      const base64Data = audioUrl.split(',')[1];
      fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
      return filePath;
    }

    // Se for URL HTTP
    const res = await fetch(audioUrl);
    if (!res.ok) throw new Error(`Falha ao baixar áudio: ${audioUrl}`);
    const buffer = await res.arrayBuffer();
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return filePath;
  }

  /**
   * Gera um clipe de vídeo para uma cena individual animando a imagem estática (zoompan)
   * e fundindo o áudio da narração ElevenLabs gerada.
   */
  public static async generateSceneClip(
    imageUrl: string,
    audioUrl: string,
    id: string,
    durationMs: number
  ): Promise<string> {
    const tempDir = this.getTempDir();
    const localImg = await this.prepareImage(imageUrl, id);
    const localAudio = await this.prepareAudio(audioUrl, id);
    const outputPath = path.join(tempDir, `scene-${id}.mp4`);

    const durationSec = durationMs / 1000;
    const numFrames = Math.ceil(durationSec * 30); // 30 FPS

    // Filtro zoompan suave (Efeito Ken Burns)
    const filter = `scale=1620:2880:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='min(zoom+0.0008,1.3)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${numFrames}:s=1080x1920`;

    // Comando FFmpeg seguro com shortest para encerrar no fim do áudio
    const command = `ffmpeg -y -loop 1 -i "${localImg}" -i "${localAudio}" -vf "${filter}" -c:v libx264 -tune stillimage -pix_fmt yuv420p -c:a aac -b:a 192k -shortest "${outputPath}"`;

    console.log(`[FFmpegGenerator] Executando comando para cena ${id} (${durationSec}s): ${command}`);
    await execAsync(command);

    return outputPath;
  }

  /**
   * Concatena os clipes de cenas gerados de forma ultra-rápida (copy codec)
   * e faz a mixagem final com a trilha sonora de fundo aplicando o ducking de volume.
   */
  public static async composeFinalVideo(
    sceneClipPaths: string[],
    musicUrl: string | undefined,
    musicVolume = 0.08
  ): Promise<string> {
    const tempDir = this.getTempDir();
    const listFilePath = path.join(tempDir, 'concat_list.txt');
    const outputPath = path.join(tempDir, `final_reels_${Date.now()}.mp4`);

    // Cria o arquivo de texto com caminhos de entrada para o concat demuxer
    const fileContent = sceneClipPaths.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(listFilePath, fileContent);

    let command = '';

    if (musicUrl) {
      const localMusic = await this.prepareAudio(musicUrl, 'bgmusic');
      // Concatena e mixa com a música de fundo ajustando volumes (narração alta, música baixa)
      const filter = `[0:a]volume=1.0[voice]; [1:a]volume=${musicVolume}[music]; [voice][music]amix=inputs=2:duration=first[aout]`;
      command = `ffmpeg -y -f concat -safe 0 -i "${listFilePath}" -i "${localMusic}" -filter_complex "${filter}" -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k "${outputPath}"`;
    } else {
      // Concatena direto mantendo áudio das narrações originais
      command = `ffmpeg -y -f concat -safe 0 -i "${listFilePath}" -c:v copy -c:a copy "${outputPath}"`;
    }

    console.log(`[FFmpegGenerator] Concatenação final: ${command}`);
    await execAsync(command);

    return outputPath;
  }

  /**
   * Limpa todos os arquivos intermediários temporários do disco
   */
  public static cleanTempFiles(): void {
    try {
      const dir = path.join(process.cwd(), 'temp-renders');
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          fs.unlinkSync(path.join(dir, file));
        }
      }
      console.log('[FFmpegGenerator] Arquivos temporários limpos com sucesso');
    } catch (err) {
      console.error('[FFmpegGenerator] Erro ao limpar arquivos temporários:', err);
    }
  }
}
