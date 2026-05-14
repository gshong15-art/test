const canvas = document.getElementById('glowCanvas');
const ctx = canvas.getContext('2d');

// Canvas 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// 마우스 위치 저장
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// 파티클 배열
let particles = [];

// 파티클 클래스
class Particle {
    constructor(x, y) {
        this.x = x + (Math.random() - 0.5) * 50;
        this.y = y + (Math.random() - 0.5) * 50;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4 - 2;
        this.life = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.size = Math.random() * 3 + 1;
        this.hue = Math.random() * 60 + 120; // 녹색 범위
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // 중력 효과
        this.life -= this.decay;
    }

    draw(ctx) {
        if (this.life <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowColor = `hsl(${this.hue}, 100%, 50%)`;
        ctx.shadowBlur = 15;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    isAlive() {
        return this.life > 0;
    }
}

// 마우스 이동 감지
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // 마우스 움직임에 따라 파티클 생성
    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouseX, mouseY));
    }
});

// 터치 이벤트 (모바일)
document.addEventListener('touchmove', (e) => {
    mouseX = e.touches[0].clientX;
    mouseY = e.touches[0].clientY;

    for (let i = 0; i < 3; i++) {
        particles.push(new Particle(mouseX, mouseY));
    }
});

// 윈도우 리사이징
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// 애니메이션 루프
function animate() {
    // 배경 투명하게 유지
    ctx.fillStyle = 'rgba(10, 14, 39, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 중심 글로우 효과
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
    gradient.addColorStop(0, 'rgba(0, 255, 136, 0.4)');
    gradient.addColorStop(0.5, 'rgba(0, 255, 136, 0.1)');
    gradient.addColorStop(1, 'rgba(0, 255, 136, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(mouseX - 300, mouseY - 300, 600, 600);

    // 강한 코어 글로우
    ctx.save();
    ctx.shadowColor = 'rgba(0, 255, 136, 1)';
    ctx.shadowBlur = 30;
    ctx.fillStyle = 'rgba(0, 255, 136, 0.6)';
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 파티클 업데이트 및 드로우
    particles.forEach((particle, index) => {
        particle.update();
        particle.draw(ctx);

        // 생명주기 끝난 파티클 제거
        if (!particle.isAlive()) {
            particles.splice(index, 1);
        }
    });

    requestAnimationFrame(animate);
}

// 애니메이션 시작
animate();
