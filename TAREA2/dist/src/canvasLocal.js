export class CanvasLocal {
    constructor(g, canvas) {
        this.graphics = g;
        this.rWidth = 12;
        this.rHeight = 8;
        this.maxX = canvas.width - 1;
        this.maxY = canvas.height - 1;
        this.pixelSize = Math.max(this.rWidth / this.maxX, this.rHeight / this.maxY);
        this.centerX = this.maxX / 12;
        this.centerY = this.maxY / 8 * 7;
    }

    iX(x) {
        return Math.round(this.centerX + x / this.pixelSize);
    }

    iY(y) {
        return Math.round(this.centerY - y / this.pixelSize);
    }

    drawLine(x1, y1, x2, y2) {
        this.graphics.beginPath();
        this.graphics.moveTo(x1, y1);
        this.graphics.lineTo(x2, y2);
        this.graphics.closePath();
        this.graphics.stroke();
    }

    drawRmboide(x1, y1, x2, y2, x3, y3, x4, y4, color) {
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

    drawCaraLateral(x1, y1, x2, y2, x3, y3, x4, y4, color) {
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

    fx(x) {
        return Math.sin(x * 2.5);
    }

    maxH(h) {
        let m = h[0];
        for (let i = 1; i < h.length; i++) {
            if (h[i] > m) m = h[i];
        }
        let p = 10;
        while (p < m) p *= 10;
        p /= 10;
        return Math.ceil(m / p) * p;
    }

    barra(x, y, alt, color) {
        const iX = this.iX.bind(this);
        const iY = this.iY.bind(this);

        this.graphics.strokeStyle = 'black';
        this.drawLine(iX(x), iY(0), iX(x - 0.5), iY(0.5));
        this.drawLine(iX(x - 0.5), iY(0.5), iX(x - 0.5), iY(y + alt));
        this.drawLine(iX(x - 0.5), iY(y + alt), iX(x), iY(y + alt - 0.5));
        this.drawLine(iX(x), iY(y + alt - 0.5), iX(x + 0.5), iY(y + alt));
        this.drawLine(iX(x + 0.5), iY(y + alt), iX(x + 0.5), iY(0.5));
        this.drawLine(iX(x + 0.5), iY(0.5), iX(x), iY(0));
        this.drawLine(iX(x), iY(0), iX(x), iY(y + alt - 0.5));

        this.graphics.strokeStyle = 'white';
        this.drawLine(iX(x - 0.5), iY(y + alt), iX(x - 0.5), iY(this.rHeight - 2));
        this.drawLine(iX(x), iY(y + alt - 0.5), iX(x), iY(this.rHeight - 2.5));
        this.drawLine(iX(x + 0.5), iY(y + alt), iX(x + 0.5), iY(this.rHeight - 2));
        this.drawLine(iX(x - 0.5), iY(this.rHeight - 2), iX(x), iY(this.rHeight - 1.5));
        this.drawLine(iX(x + 0.5), iY(this.rHeight - 2), iX(x), iY(this.rHeight - 1.5));
        this.drawLine(iX(x - 0.5), iY(this.rHeight - 2), iX(x), iY(this.rHeight - 2.5));
        this.drawLine(iX(x + 0.5), iY(this.rHeight - 2), iX(x), iY(this.rHeight - 2.5));

        this.drawRmboide(
            iX(x - 0.5), iY(y + alt),
            iX(x), iY(y + alt - 0.5),
            iX(x + 0.5), iY(y + alt),
            iX(x), iY(y + alt + 0.5),
            color
        );

        this.drawCaraLateral(
            iX(x - 0.5), iY(0.5),
            iX(x - 0.5), iY(y + alt),
            iX(x), iY(y + alt - 0.5),
            iX(x), iY(0),
            color
        );

        this.drawCaraLateral(
            iX(x), iY(0),
            iX(x), iY(y + alt - 0.5),
            iX(x + 0.5), iY(y + alt),
            iX(x + 0.5), iY(0.5),
            color
        );

        let grad = this.graphics.createLinearGradient(iX(x - 0.5), iY(y + alt), iX(x - 0.5), iY(0));
        grad.addColorStop(0, "rgba(255, 255, 255, 0.3)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        this.graphics.fillStyle = grad;
        this.graphics.beginPath();
        this.graphics.moveTo(iX(x - 0.5), iY(0.5));
        this.graphics.lineTo(iX(x - 0.5), iY(y + alt));
        this.graphics.lineTo(iX(x), iY(y + alt - 0.5));
        this.graphics.lineTo(iX(x + 0.5), iY(y + alt));
        this.graphics.lineTo(iX(x + 0.5), iY(0.5));
        this.graphics.lineTo(iX(x), iY(0));
        this.graphics.closePath();
        this.graphics.fill();
    }

    paint() {
        const bg = this.graphics.createLinearGradient(0, 0, 0, this.maxY);
        bg.addColorStop(0, "rgba(255,255,255,0.2)");
        bg.addColorStop(1, "rgba(255,255,255,0.05)");
        this.graphics.fillStyle = bg;
        this.graphics.fillRect(0, 0, this.maxX, this.maxY);

        const values = [10, 30, 80, 50];
        const palette = ['pink', 'red', 'green', 'yellow'];
        const top = this.maxH(values);
        const fullW = 8;
        const space = fullW / values.length;

        values.forEach((v, i) => {
            const x = i * space;
            const h = (v * (this.rHeight - 2)) / top;
            const c = palette[i % palette.length];
            this.barra(x, 0, h, c);
        });

        this.graphics.fillStyle = 'white';
        values.forEach((v, i) => {
            const x = i * space;
            this.graphics.fillText(v.toString(), this.iX(x), this.iY(-0.5));
        });
    }
}
