// canvasLocal.ts
export class CanvasLocal {
  protected graphics: CanvasRenderingContext2D;
  protected rWidth: number;
  protected rHeight: number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;

  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    this.graphics = g;
    this.rWidth = 6;
    this.rHeight = 4;
    this.maxX = canvas.width - 1;
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX / 2;
    this.centerY = this.maxY / 2;
  }

  
  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.closePath();
    this.graphics.stroke();
  }

  
  paint() {
    
  }
}


export class Bar {
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    index: number;

    constructor(x: number, y: number, width: number, height: number, color: string, index: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.index = index;
    }

    
    update(micInput: number) {
        const sound = micInput * 1000;
        if (sound > this.height) {
            this.height = sound;
        } else {
            this.height = this.height * 0.9; 
        }
    }

    
    draw(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color;
        context.lineWidth = this.width;
        context.save();
        context.rotate(this.index * 0.043); 
        context.beginPath();

        
        context.bezierCurveTo(this.x / 2, this.y / 2, this.height * -0.5 - 150,
            this.height + 50, this.x, this.y);
        context.stroke();

        
        if (this.index > 150) {
            context.beginPath();
            context.arc(this.x, this.y + 10 + this.height / 2 + this.height * 0.1,
                        this.height * 0.05, 0, Math.PI * 2);
            context.stroke();

            context.beginPath();
            context.moveTo(this.x, this.y + 10);
            context.lineTo(this.x, this.y + 10 + this.height / 2);
            context.stroke();
        }

        context.restore();
    }
}


export class Microphone {
    initialized: boolean;
    audioContext: AudioContext | null;
    microphone: MediaStreamAudioSourceNode | null;
    analyser: AnalyserNode | null;
    dataArray: Uint8Array | null;

    constructor(fftSize: number) {
        this.initialized = false;
        this.audioContext = null;
        this.microphone = null;
        this.analyser = null;
        this.dataArray = null;

        
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then((stream) => {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                this.microphone = this.audioContext.createMediaStreamSource(stream);
                this.analyser = this.audioContext.createAnalyser();
                this.analyser.fftSize = fftSize;
                const bufferLength = this.analyser.frequencyBinCount;
                this.dataArray = new Uint8Array(bufferLength);

                this.microphone.connect(this.analyser);
                this.initialized = true;
                console.log("Micrófono inicializado correctamente.");
            })
            .catch((err) => {
                console.error("Error al acceder al micrófono:", err);
                
                const errorMessage = document.createElement('div');
                errorMessage.textContent = 'Acceso al micrófono denegado o error: ' + err.name + '. Por favor, habilítelo en la configuración de su navegador.';
                errorMessage.className = 'error-message';
                document.body.appendChild(errorMessage);
            });
    }

    
    getSamples(): number[] {
        if (!this.initialized || !this.analyser || !this.dataArray) return [];
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e / 128 - 1); 
        return normSamples;
    }

    
    getVolume(): number {
        if (!this.initialized || !this.analyser || !this.dataArray) return 0;
        this.analyser.getByteTimeDomainData(this.dataArray);
        let normSamples = [...this.dataArray].map(e => e / 128 - 1);
        let sum = 0;
        for (let i = 0; i < normSamples.length; i++) {
            sum += normSamples[i] * normSamples[i];
        }
        let volume = Math.sqrt(sum / normSamples.length); 
        return volume;
    }
}
