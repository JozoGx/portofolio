gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener("DOMContentLoaded", () => {
    // Set profile image
    const profileImg = document.getElementById("profile-img");
    profileImg.src = personalData.profilePhoto;
  
    // Populate portfolio projects
    const portfolioContainer = document.getElementById("portfolio-container");
    portfolioContainer.innerHTML = ""; // Clear existing content if any
  
    personalData.portfolioProjects.forEach(proj => {
      const card = document.createElement("div");
      card.className = "portfolio-card group";
      if(proj.featured) card.classList.add("featured-project");
  
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-label", proj.title);
  
      // Build the inner HTML
      card.innerHTML = `
        <img src="${proj.image}" alt="${proj.title}" class="w-full h-48 object-cover rounded-t-lg transition-transform duration-500 group-hover:scale-110" loading="lazy" />
        <div class="p-5">
          <h3 class="text-xl font-semibold mb-2 text-indigo-400 group-hover:text-indigo-300 transition-colors">${proj.title}</h3>
          <p class="text-sm" style="color: var(--text-color)">${proj.description}</p>
        </div>
        ${proj.featured ? `<div class="absolute top-4 right-4 bg-indigo-600 px-2 py-1 text-xs rounded-md text-indigo-100 font-bold opacity-90 shadow-md">Featured</div>` : ""}
      `;
      portfolioContainer.appendChild(card);
    });
  
    // Update social links URLs
    document.getElementById("cv-link").href = personalData.socialLinks.cv;
    document.getElementById("github-link").href = personalData.socialLinks.github;
    document.getElementById("linkedin-link").href = personalData.socialLinks.linkedIn;
  });

// Animate skill bars on scroll
gsap.utils.toArray('.skill-bar-fill').forEach(bar => {
  ScrollTrigger.create({
    trigger: bar,
    start: "top 80%",
    onEnter: () => bar.classList.add('visible'),
    onLeaveBack: () => bar.classList.remove('visible'),
  });
});

// Animate each section with fade from below and slight 3D tilt
gsap.utils.toArray('main section').forEach(section => {
  gsap.fromTo(section.children, 
    { y: 60, opacity: 0, rotateX: 10, transformOrigin: "center bottom" }, 
    { y: 0, opacity: 1, rotateX: 0, duration: 1.3, ease: "power3.out", stagger: 0.3,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 40%",
        toggleActions: "play none none reverse",
        markers: false
      }
    }
  );
});

// Portfolio images subtle parallax on scroll
gsap.utils.toArray('.portfolio-card img').forEach(img => {
  gsap.to(img, {
    yPercent: -15,
    ease: "power1.out",
    scrollTrigger: {
      trigger: img,
      start: "top bottom",
      end: "bottom top",
      scrub: true
    }
  });
});

// Profile picture 3D tilt on mouse hover
const profileImg = document.querySelector('#about img');
profileImg.addEventListener('mousemove', e => {
  const rect = profileImg.getBoundingClientRect();
  const x = e.clientX - rect.left - rect.width/2;
  const y = e.clientY - rect.top - rect.height/2;
  gsap.to(profileImg, {
    rotationY: x * 0.15,
    rotationX: -y * 0.15,
    duration: 0.35,
    ease: "power2.out",
    transformOrigin: "center center",
    transformPerspective: 800
  });
});
profileImg.addEventListener('mouseleave', () => {
  gsap.to(profileImg, {rotationY: 0, rotationX: 0, duration: 0.8, ease: "power3.out"});
});

// Starry background canvas effect
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];
const maxStars = 120;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 1.2;
    this.alpha = 0;
    this.alphaSpeed = 0.01 + Math.random()*0.015;
  }
  update() {
    this.alpha += this.alphaSpeed;
    if(this.alpha >= 1 || this.alpha <= 0) this.alphaSpeed *= -1;
  }
  draw(){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = `rgba(200,200,255,${this.alpha.toFixed(2)})`;
    ctx.shadowColor = 'rgba(200,200,255,0.7)';
    ctx.shadowBlur = this.size*3;
    ctx.fill();
  }
}

function initStars() {
  stars = [];
  for(let i=0; i<maxStars; i++){
    stars.push(new Star());
  }
}

function animateStars() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  stars.forEach(star =>{
    star.update();
    star.draw();
  });
  requestAnimationFrame(animateStars);
}

initStars();
animateStars();

// Back to top button control
const backToTopBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if(window.scrollY > 300){
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});
backToTopBtn.addEventListener('click', () => {
  gsap.to(window, {scrollTo:0, duration: 1, ease: "power2.out"});
});

// Light/Dark mode toggle
const modeToggleBtn = document.getElementById('mode-toggle');
const iconSun = document.getElementById('icon-sun');
const iconMoon = document.getElementById('icon-moon');

function initMode() {
  const savedMode = localStorage.getItem('mode');
  if(savedMode === 'light'){
    document.body.classList.add('light');
    iconSun.classList.remove('hidden');
    iconMoon.classList.add('hidden');
  } else if(savedMode === 'dark'){
    document.body.classList.remove('light');
    iconSun.classList.add('hidden');
    iconMoon.classList.remove('hidden');
  } else {
    if(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches){
      document.body.classList.add('light');
      iconSun.classList.remove('hidden');
      iconMoon.classList.add('hidden');
    } else {
      document.body.classList.remove('light');
      iconSun.classList.add('hidden');
      iconMoon.classList.remove('hidden');
    }
  }
}
initMode();

modeToggleBtn.addEventListener('click', () => {
  if(document.body.classList.contains('light')) {
    document.body.classList.remove('light');
    localStorage.setItem('mode', 'dark');
    iconSun.classList.add('hidden');
    iconMoon.classList.remove('hidden');
  } else {
    document.body.classList.add('light');
    localStorage.setItem('mode', 'light');
    iconSun.classList.remove('hidden');
    iconMoon.classList.add('hidden');
  }
});
