// Lógica principal del slider - /src/scripts/slider.js

class SliderManager {
  constructor(sliderData) {
    this.data = sliderData;
    this.order = [0, 1, 2, 3, 4, 5];
    this.detailsEven = true;
    this.clicks = 0;
    
    // Configuraciones del slider
    this.config = {
      offsetTop: 200,
      offsetLeft: 700,
      cardWidth: 200,
      cardHeight: 300,
      gap: 40,
      numberSize: 50,
      ease: "sine.inOut",
      startDelay: 0.6
    };
    
    this.init();
  }

  // Utilidades DOM
  getElementById(id) {
    return document.getElementById(id);
  }

  getCard(index) {
    return `#card${index}`;
  }

  getCardContent(index) {
    return `#card-content-${index}`;
  }

  getSliderItem(index) {
    return `#slide-item-${index}`;
  }

  // Función de animación promisificada
  animate(target, duration, properties) {
    return new Promise((resolve) => {
      gsap.to(target, {
        ...properties,
        duration: duration,
        onComplete: resolve,
      });
    });
  }

  // Generar HTML del slider
  generateSliderHTML() {
    const cards = this.data.map((item, index) => 
      `<div class="card" id="card${index}" style="background-image:url(${item.image})"></div>`
    ).join('');

    const cardContents = this.data.map((item, index) => `
      <div class="card-content" id="card-content-${index}">
        <div class="content-start"></div>
        <div class="content-place">${item.place}</div>
        <div class="content-title-1 uppercase line-clamp-3">${item.title}</div>
      </div>
    `).join('');

    const slideNumbers = this.data.map((_, index) => 
      `<div class="item" id="slide-item-${index}">${index + 1}</div>`
    ).join('');

    this.getElementById('slider').innerHTML = cards + cardContents;
    this.getElementById('slide-numbers').innerHTML = slideNumbers;
  }

  // Configuración inicial del slider
  init() {
    this.generateSliderHTML();
    
    const [active, ...rest] = this.order;
    const detailsActive = this.detailsEven ? "#details-even" : "#details-odd";
    const detailsInactive = this.detailsEven ? "#details-odd" : "#details-even";
    const { innerHeight: height, innerWidth: width } = window;
    
    this.config.offsetTop = height - 430;
    this.config.offsetLeft = width - 830;

    this.setupInitialPositions(active, rest, detailsActive, detailsInactive, width);
    this.startAnimationSequence(rest, detailsActive);
    this.setupEventListeners(detailsActive);
  }

  setupInitialPositions(active, rest, detailsActive, detailsInactive, width) {
    // Configurar posiciones iniciales
    gsap.set("#pagination", {
      top: this.config.offsetTop + 330,
      left: this.config.offsetLeft,
      y: 200,
      opacity: 0,
      zIndex: 60,
    });

    gsap.set("nav", { y: -200, opacity: 0 });

    gsap.set(this.getCard(active), {
      x: 0, y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      position: 'absolute'
    });

    gsap.set(this.getCardContent(active), { x: 0, y: 0, opacity: 0 });
    gsap.set(detailsActive, { opacity: 0, zIndex: 22, x: -200 });
    gsap.set(detailsInactive, { opacity: 0, zIndex: 12 });
    gsap.set(`${detailsInactive} .text`, { y: 100 });
    gsap.set(`${detailsInactive} .title-1`, { y: 100 });
    gsap.set(`${detailsInactive} .title-2`, { y: 100 });
    gsap.set(`${detailsInactive} .desc`, { y: 50 });
    gsap.set(`${detailsInactive} .cta`, { y: 60 });

    gsap.set(".progress-sub-foreground", {
      width: 500 * (1 / this.order.length) * (active + 1),
    });

    // Configurar cartas del resto
    rest.forEach((i, index) => {
      gsap.set(this.getCard(i), {
        x: this.config.offsetLeft + 400 + index * (this.config.cardWidth + this.config.gap),
        y: this.config.offsetTop,
        width: this.config.cardWidth,
        height: this.config.cardHeight,
        zIndex: 30,
        borderRadius: 10,
        position: 'absolute'
      });
      gsap.set(this.getCardContent(i), {
        x: this.config.offsetLeft + 400 + index * (this.config.cardWidth + this.config.gap),
        zIndex: 40,
        y: this.config.offsetTop + this.config.cardHeight - 100,
      });
      gsap.set(this.getSliderItem(i), { x: (index + 1) * this.config.numberSize });
    });

    gsap.set(".indicator", { x: -window.innerWidth });
  }

  startAnimationSequence(rest, detailsActive) {
    gsap.to(".cover", {
      x: window.innerWidth + 400,
      delay: 0.5,
      ease: this.config.ease,
      onComplete: () => {
        setTimeout(() => {
          this.loop();
        }, 1500);
      },
    });

    rest.forEach((i, index) => {
      gsap.to(this.getCard(i), {
        x: this.config.offsetLeft + index * (this.config.cardWidth + this.config.gap),
        zIndex: 30,
        ease: this.config.ease,
        delay: this.config.startDelay,
      });
      gsap.to(this.getCardContent(i), {
        x: this.config.offsetLeft + index * (this.config.cardWidth + this.config.gap),
        zIndex: 40,
        ease: this.config.ease,
        delay: this.config.startDelay,
      });
    });

    gsap.to("#pagination", { y: 0, opacity: 1, ease: this.config.ease, delay: this.config.startDelay });
    gsap.to("nav", { y: 0, opacity: 1, ease: this.config.ease, delay: this.config.startDelay });
    gsap.to(detailsActive, { opacity: 1, x: 0, ease: this.config.ease, delay: this.config.startDelay });
  }

  setupEventListeners(detailsActive) {
    setTimeout(() => {
      // Configurar botón inicial
      const initialDiscoverBtn = document.querySelector(`${detailsActive} .discover`);
      if (initialDiscoverBtn) {
        initialDiscoverBtn.onclick = () => {
          window.location.href = `/experiencia/${this.data[this.order[0]].expNumber}`;
        };
      }

      // Configurar botón del servidor también
      const serverDiscoverBtn = document.querySelector('#details-even .discover');
      if (serverDiscoverBtn) {
        serverDiscoverBtn.onclick = () => {
          window.location.href = `/experiencia/${this.data[this.order[0]].expNumber}`;
        };
      }

      // Configurar navegación
      const nextBtn = document.querySelector('.arrow-right');
      const prevBtn = document.querySelector('.arrow-left');
      
      if (nextBtn) {
        nextBtn.onclick = () => {
          if (this.clicks === 0) {
            this.clicks = 1;
            this.step();
          }
        };
      }

      if (prevBtn) {
        prevBtn.onclick = () => {
          if (this.clicks === 0) {
            this.clicks = 1;
            this.stepBack();
          }
        };
      }
    }, this.config.startDelay * 1000 + 200);
  }

  updateDetailsContent(detailsActive) {
    const activeData = this.data[this.order[0]];
    document.querySelector(`${detailsActive} .place-box .text`).textContent = activeData.place;
    document.querySelector(`${detailsActive} .title-1`).textContent = activeData.title;
    document.querySelector(`${detailsActive} .title-2`).textContent = activeData.title2;
    document.querySelector(`${detailsActive} .desc`).textContent = activeData.description;

    // Configurar botón para dirigir a la experiencia
    const discoverBtn = document.querySelector(`${detailsActive} .discover`);
    if (discoverBtn) {
      discoverBtn.onclick = () => {
        window.location.href = `/experiencia/${activeData.expNumber}`;
      };
    }
  }

  stepBack() {
    return new Promise((resolve) => {
      // Mover el último elemento al principio
      this.order.unshift(this.order.pop());
      this.detailsEven = !this.detailsEven;

      const detailsActive = this.detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = this.detailsEven ? "#details-odd" : "#details-even";

      this.updateDetailsContent(detailsActive);
      this.animateTransition(detailsActive, detailsInactive, resolve, true);
    });
  }

  step() {
    return new Promise((resolve) => {
      this.order.push(this.order.shift());
      this.detailsEven = !this.detailsEven;

      const detailsActive = this.detailsEven ? "#details-even" : "#details-odd";
      const detailsInactive = this.detailsEven ? "#details-odd" : "#details-even";

      this.updateDetailsContent(detailsActive);
      this.animateTransition(detailsActive, detailsInactive, resolve, false);
    });
  }

  animateTransition(detailsActive, detailsInactive, resolve, isBackward = false) {
    // Animaciones de los detalles
    gsap.set(detailsActive, { zIndex: 22 });
    gsap.to(detailsActive, { opacity: 1, delay: 0.4, ease: this.config.ease });
    gsap.to(`${detailsActive} .text`, { y: 0, delay: 0.1, duration: 0.7, ease: this.config.ease });
    gsap.to(`${detailsActive} .title-1`, { y: 0, delay: 0.15, duration: 0.7, ease: this.config.ease });
    gsap.to(`${detailsActive} .title-2`, { y: 0, delay: 0.15, duration: 0.7, ease: this.config.ease });
    gsap.to(`${detailsActive} .desc`, { y: 0, delay: 0.3, duration: 0.4, ease: this.config.ease });
    gsap.to(`${detailsActive} .cta`, {
      y: 0, delay: 0.35, duration: 0.4, ease: this.config.ease,
      onComplete: () => {
        this.clicks = 0;
        resolve();
      }
    });
    
    this.animateCards(isBackward);
  }

  animateCards(isBackward) {
    const [active, ...rest] = this.order;
    const targetCard = isBackward ? rest[0] : rest[rest.length - 1];

    gsap.set(this.getCard(targetCard), { zIndex: 10, position: 'absolute' });
    gsap.set(this.getCard(active), { zIndex: 20, position: 'absolute' });
    gsap.to(this.getCard(targetCard), { scale: 1.5, ease: this.config.ease, position: 'absolute' });

    gsap.to(this.getCardContent(active), {
      y: this.config.offsetTop + this.config.cardHeight - 10, 
      opacity: 0, 
      duration: 0.3, 
      ease: this.config.ease
    });
    
    gsap.to(this.getSliderItem(active), { x: 0, ease: this.config.ease });
    gsap.to(this.getSliderItem(targetCard), { 
      x: isBackward ? this.config.numberSize : -this.config.numberSize, 
      ease: this.config.ease 
    });
    
    gsap.to(".progress-sub-foreground", {
      width: 500 * (1 / this.order.length) * (active + 1), 
      ease: this.config.ease
    });

    this.animateCardPositions(active, rest, targetCard, isBackward);
  }

  animateCardPositions(active, rest, targetCard, isBackward) {
    gsap.to(this.getCard(active), {
      x: 0, y: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      borderRadius: 0,
      position: 'absolute',
      ease: this.config.ease,
      onComplete: () => {
        const xNew = this.config.offsetLeft + (rest.length - 1) * (this.config.cardWidth + this.config.gap);
        
        gsap.set(this.getCard(targetCard), {
          x: xNew, y: this.config.offsetTop,
          width: this.config.cardWidth, height: this.config.cardHeight,
          zIndex: 30, borderRadius: 10, scale: 1, position: 'absolute'
        });

        gsap.set(this.getCardContent(targetCard), {
          x: xNew, y: this.config.offsetTop + this.config.cardHeight - 100,
          opacity: 1, zIndex: 40
        });
        
        gsap.set(this.getSliderItem(targetCard), { 
          x: rest.length * this.config.numberSize 
        });

        this.resetInactiveDetails();
        this.animateRestCards(rest, targetCard);
      },
    });
  }

  resetInactiveDetails() {
    const detailsInactive = this.detailsEven ? "#details-odd" : "#details-even";
    gsap.set(detailsInactive, { opacity: 0 });
    gsap.set(`${detailsInactive} .text`, { y: 100 });
    gsap.set(`${detailsInactive} .title-1`, { y: 100 });
    gsap.set(`${detailsInactive} .title-2`, { y: 100 });
    gsap.set(`${detailsInactive} .desc`, { y: 50 });
    gsap.set(`${detailsInactive} .cta`, { y: 60 });
  }

  animateRestCards(rest, excludeCard) {
    rest.forEach((i, index) => {
      if (i !== excludeCard) {
        const xNew = this.config.offsetLeft + index * (this.config.cardWidth + this.config.gap);
        gsap.set(this.getCard(i), { zIndex: 30, position: 'absolute' });
        gsap.to(this.getCard(i), {
          x: xNew, y: this.config.offsetTop,
          width: this.config.cardWidth, height: this.config.cardHeight,
          ease: this.config.ease, delay: 0.1 * (index + 1), position: 'absolute'
        });

        gsap.to(this.getCardContent(i), {
          x: xNew, y: this.config.offsetTop + this.config.cardHeight - 100,
          opacity: 1, zIndex: 40, ease: this.config.ease, delay: 0.1 * (index + 1)
        });
        gsap.to(this.getSliderItem(i), { 
          x: (index + 1) * this.config.numberSize, 
          ease: this.config.ease 
        });
      }
    });
  }

  async loop() {
    await this.animate(".indicator", 2, { x: 0 });
    await this.animate(".indicator", 0.8, { x: window.innerWidth, delay: 0.3 });
    gsap.set(".indicator", { x: -window.innerWidth });
    await this.step();
    this.loop();
  }
}

// Función para inicializar el slider
export function initializeSlider(sliderData) {
  console.log('=== DATOS DESDE SERVIDOR (YA RANDOMIZADOS) ===');
  console.log(`Total experiencias randomizadas: ${sliderData.length}`);
  console.log('Primera experiencia (debe coincidir con HTML inicial):');
  console.log(`- ${sliderData[0].title} ${sliderData[0].title2} - ${sliderData[0].place} [EXP-${sliderData[0].expNumber}]`);
  
  sliderData.forEach((exp, i) => {
    console.log(`${i + 1}. ${exp.title} ${exp.title2} - ${exp.place} [EXP-${exp.expNumber}]`);
  });

  return new SliderManager(sliderData);
}