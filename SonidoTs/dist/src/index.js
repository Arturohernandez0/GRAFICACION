// index.ts
import { Bar, CanvasLocal, Microphone } from './canvasLocal.js';
let canvas;
let graphics;
let snail;
window.addEventListener('load', function () {
    canvas = document.getElementById('circlechart');
    graphics = canvas.getContext('2d');
    snail = document.getElementById('snail');
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
    const miCanvas = new CanvasLocal(graphics, canvas);
    let fftSize = 512;
    const microphone = new Microphone(fftSize);
    let bars = [];
    let barWidth = 1;
    function createBars() {
        for (let i = 1; i < (fftSize / 2); i++) {
            let color = `hsl(${i * 2}, 100%, 50%)`;
            bars.push(new Bar(0, i * 0.9, barWidth, 0, color, i));
        }
    }
    createBars();
    let softVolume = 0;
    function animate() {
        if (microphone.initialized) {
            graphics.clearRect(0, 0, canvas.width, canvas.height);
            const samples = microphone.getSamples();
            const volume = microphone.getVolume();
            graphics.save();
            graphics.translate(canvas.width / 2 - 70, canvas.height / 2 + 50);
            bars.forEach(function (bar, i) {
                if (samples[i] !== undefined) {
                    bar.update(samples[i]);
                }
                bar.draw(graphics);
            });
            graphics.restore();
            softVolume = softVolume * 0.9 + volume * 0.1;
            snail.style.transform = `translate(-50%, -50%) scale(${1 + softVolume}, ${1 + softVolume})`;
        }
        requestAnimationFrame(animate);
    }
    animate();
    window.addEventListener('resize', function () {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    });
});
