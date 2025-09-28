import { useMicrophoneContext } from '@/app/components/microphone/microphoneContextProvider';
import { FC, useCallback, useEffect, useRef, useState } from 'react';

type Props = {
  className?: string;
};

export const TinyAudioVisualizer: FC<Props> = ({ className = '' }) => {
  const { microphone } = useMicrophoneContext();

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  const initializeVisualizer = useCallback(() => {
    const audioContext = new globalThis.AudioContext();

    const analyser = audioContext.createAnalyser();

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    setAnalyser(analyser);
    setDataArray(dataArray);
    setAudioContext(audioContext);
  }, []);
  useEffect(() => {
    initializeVisualizer();
  }, [initializeVisualizer]);

  const draw = useCallback((): void => {
    if (!microphone || !audioContext || !analyser || !dataArray) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const context = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    requestAnimationFrame(draw);

    // @ts-expect-error slkjdflksjf
    analyser.getByteFrequencyData(dataArray);

    if (!context) return;

    context.clearRect(0, 0, width, height);

    const barWidth = 4;
    let x = 0;

    for (const value of dataArray) {
      const barHeight = (value / 255) * height * 2;

      context.fillStyle = `black`;
      context.fillRect(x, height - barHeight, barWidth, barHeight);
      x += barWidth;
    }
  }, [analyser, audioContext, dataArray, microphone]);

  useEffect(() => {
    if (!microphone || !audioContext || !analyser || !dataArray) return;

    const source = audioContext.createMediaStreamSource(microphone.stream);
    source.connect(analyser);

    draw();
  }, [microphone, audioContext, analyser, dataArray, draw]);

  if (!microphone) return null;

  return <canvas ref={canvasRef} width={60} height={60} className={className}></canvas>;
};
