export class CanvasLocal {
  //atributos
  protected graphics: CanvasRenderingContext2D;
  protected rWidth: number;
  protected rHeight: number;
  protected maxX: number;
  protected maxY: number;
  protected pixelSize: number;
  protected centerX: number;
  protected centerY: number;
  
  public constructor(g: CanvasRenderingContext2D, canvas: HTMLCanvasElement){
    this.graphics = g;
    this.rWidth = 12;
    this.rHeight = 8;
    this.maxX = canvas.width - 1;
    this.maxY = canvas.height - 1;
    this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
    this.centerX = this.maxX / 12;
    this.centerY = this.maxY / 8 * 7;
  }

  iX(x: number): number { return Math.round(this.centerX + x / this.pixelSize); }
  iY(y: number): number { return Math.round(this.centerY - y / this.pixelSize); }

  drawLine(x1: number, y1: number, x2: number, y2: number) {
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.closePath();
    this.graphics.stroke();
  }

  drawRmboide(
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    x4: number, y4: number,
    color: string
  ) {
    this.graphics.fillStyle = color;
    this.graphics.beginPath();
    this.graphics.moveTo(x1, y1);
    this.graphics.lineTo(x2, y2);
    this.graphics.lineTo(x3, y3);
    this.graphics.lineTo(x4, y4);
    this.graphics.closePath();
    this.graphics.stroke();
    this.graphics.fill();
  }

  fx(x: number): number {
    return Math.sin(x * 2.5);
  }

  maxH(h: number[]): number {
    let max = h[0];
    for (let i = 1; i < h.length; i++) {
      if (h[i] > max) {
        max = h[i];
      }
    }
    let pot = 10;
    while (pot < max) {
      pot *= 10;
    }
    pot /= 10;
    return Math.ceil(max / pot) * pot;
  }

  barra(x: number, y: number, alt: number): void {
    this.drawLine(this.iX(x),           this.iY(0),         this.iX(x - 0.5), this.iY(0.5));
    this.drawLine(this.iX(x - 0.5),     this.iY(0.5),       this.iX(x - 0.5), this.iY(y + alt));
    this.drawLine(this.iX(x - 0.5),     this.iY(y + alt),   this.iX(x),       this.iY(y + alt - 0.5));
    this.drawLine(this.iX(x),           this.iY(y + alt - 0.5), this.iX(x + 0.5), this.iY(y + alt));
    this.drawLine(this.iX(x + 0.5),     this.iY(y + alt),   this.iX(x + 0.5), this.iY(0.5));
    this.drawLine(this.iX(x + 0.5),     this.iY(0.5),       this.iX(x),       this.iY(0));
    this.drawLine(this.iX(x),           this.iY(0),         this.iX(x),       this.iY(y + alt - 0.5));
    
    this.graphics.strokeStyle = 'gray';
    this.drawLine(this.iX(x - 0.5),     this.iY(y + alt),   this.iX(x - 0.5), this.iY(this.rHeight - 2));
    this.drawLine(this.iX(x),           this.iY(y + alt - 0.5), this.iX(x),     this.iY(this.rHeight - 2.5));
    this.drawLine(this.iX(x + 0.5),     this.iY(y + alt),   this.iX(x + 0.5), this.iY(this.rHeight - 2));
    this.drawLine(this.iX(x - 0.5),     this.iY(this.rHeight - 2), this.iX(x),     this.iY(this.rHeight - 1.5));
    this.drawLine(this.iX(x + 0.5),     this.iY(this.rHeight - 2), this.iX(x),     this.iY(this.rHeight - 1.5));
    this.drawLine(this.iX(x - 0.5),     this.iY(this.rHeight - 2), this.iX(x),     this.iY(this.rHeight - 2.5));
    this.drawLine(this.iX(x + 0.5),     this.iY(this.rHeight - 2), this.iX(x),     this.iY(this.rHeight - 2.5));
    
    this.graphics.strokeStyle = 'black';
  }

  // --------------------------------------------------------------------------
  // SOLO ESTA FUNCIÓN SE MODIFICA:
  // --------------------------------------------------------------------------
  public paint() {
    // Datos de ejemplo
    const heights = [27, 10, 16, 90, 50, 75];
    const colors  = ['magenta', 'red', 'green', 'yellow'];

    // Determinar escala máxima redondeada
    const maxScale = this.maxH(heights);

    // Ancho del dominio en unidades de usuario (se usaba 8 en el código original)
    const domainWidth = this.rHeight; // 8
    const stepX       = domainWidth / heights.length;

    // Dibujar barras 3D
    heights.forEach((value, idx) => {
      const userX     = idx * stepX;
      const barHeight = (value * (this.rHeight - 2)) / maxScale;
      this.graphics.strokeStyle = colors[idx % colors.length];
      this.barra(userX, 0, barHeight);
    });

    // Etiquetar cada barra con su valor
    this.graphics.fillStyle = 'black';
    heights.forEach((value, idx) => {
      const userX = idx * stepX;
      this.graphics.fillText(
        value.toString(),
        this.iX(userX),
        this.iY(-0.5)
      );
    });
  }
}
