// =========================================
//  35 YEARS OF LOVE — app.js
// =========================================

document.addEventListener("DOMContentLoaded", () => {
  // ——————————————————————————
  //  1. FLOATING PETALS
  // ——————————————————————————
  const petalEmojis = ["🌸", "🌺", "✿", "❀", "꩜", "✦"];
  const container = document.getElementById("petals");

  function spawnPetal() {
    const el = document.createElement("span");
    el.className = "petal";
    el.textContent =
      petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

    const left = Math.random() * 100;
    const duration = 9 + Math.random() * 12; // 9–21 seconds
    const delay = Math.random() * 6;
    const size = 0.6 + Math.random() * 0.8;

    el.style.left = `${left}%`;
    el.style.fontSize = `${size}rem`;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;
    el.style.opacity = "0";

    container.appendChild(el);

    // Remove petal when animation ends to keep DOM clean
    el.addEventListener("animationend", () => el.remove());
  }

  // Spawn first batch immediately, then drip every 1.4s
  for (let i = 0; i < 12; i++) spawnPetal();
  setInterval(spawnPetal, 1400);

  // ——————————————————————————
  //  2. SCROLL REVEAL
  // ——————————————————————————
  const hiddenEls = document.querySelectorAll(".hidden");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  hiddenEls.forEach((el) => revealObserver.observe(el));

  // ——————————————————————————
  //  3. LIGHTBOX
  // ——————————————————————————
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCap = document.getElementById("lb-caption");

  // Called from inline onclick on each .image-thumb
  window.openLightbox = function (thumbEl) {
    const img = thumbEl.querySelector("img");
    if (!img || thumbEl.classList.contains("no-img")) return;

    lbImg.src = img.src;
    lbImg.alt = img.alt;

    // Pull caption from the card's h2
    const card = thumbEl.closest(".memory-card");
    const title = card ? card.querySelector("h2")?.textContent : "";
    const date = card ? card.querySelector(".card-date")?.textContent : "";
    lbCap.textContent = date ? `${date}  ·  ${title}` : title;

    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  };

  window.closeLightbox = function (e) {
    // If called from clicking the backdrop, only close if click is ON the backdrop
    if (
      e &&
      e.target !== lightbox &&
      e.target !== lightbox.querySelector(".lightbox-inner")
    ) {
      // clicked inside the image — do nothing (allow normal bubbling to stop)
      return;
    }
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    // Small delay so close animation plays before clearing src
    setTimeout(() => {
      lbImg.src = "";
    }, 450);
  };

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
      setTimeout(() => {
        lbImg.src = "";
      }, 450);
    }
  });

  // Prevent clicks on the image itself from closing the lightbox
  document.querySelector(".lightbox-inner").addEventListener("click", (e) => {
    e.stopPropagation();
  });

  // ——————————————————————————
  //  4. PARALLAX HERO
  // ——————————————————————————
  const hero = document.querySelector(".hero");
  window.addEventListener(
    "scroll",
    () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        // Subtle parallax on hero background
        hero.style.backgroundPositionY = `calc(50% + ${scrollY * 0.25}px)`;
      }
    },
    { passive: true },
  );

  // ——————————————————————————
  //  5. CARD HOVER TILT (subtle 3-D lift)
  // ——————————————————————————
  document.querySelectorAll(".memory-card").forEach((card) => {
    const inner = card.querySelector(".card-inner");

    card.addEventListener("mousemove", (e) => {
      const rect = inner.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      inner.style.transform = `perspective(1000px) rotateY(${x * 4}deg) rotateX(${-y * 3}deg) scale(1.005)`;
    });

    card.addEventListener("mouseleave", () => {
      inner.style.transform = "";
    });
  });

  // ——————————————————————————
  //  6. STATS NUMBER ROLLER (CALENDAR DROP EFFECT)
  // ——————————————————————————
  const statsSection = document.querySelector(".stats-bar");
  const statNums = document.querySelectorAll(".stat-num");
  let statsAnimated = false;

  if (statsSection && statNums.length > 0) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsAnimated) {
          statsAnimated = true;

          statNums.forEach((numContainer, index) => {
            const targetStr = numContainer.getAttribute("data-target");
            const formattedTarget = Number(targetStr).toLocaleString();

            // Clean out the container and set up flexbox layout
            numContainer.innerHTML = "";
            numContainer.style.display = "inline-flex";
            numContainer.style.lineHeight = "1";

            // Split the target into individual digits/commas
            formattedTarget.split("").forEach((char, charIndex) => {
              if (isNaN(char)) {
                // It's a comma — keep it static
                const comma = document.createElement("span");
                comma.textContent = char;
                comma.style.display = "inline-flex";
                comma.style.height = "1em";
                comma.style.alignItems = "center";
                numContainer.appendChild(comma);
              } else {
                // It's a number — create the rolling calendar window
                const digitWrap = document.createElement("span");
                digitWrap.style.display = "inline-flex";
                digitWrap.style.flexDirection = "column";
                digitWrap.style.height = "1em";
                digitWrap.style.overflow = "hidden"; // Hides the extra numbers
                digitWrap.style.verticalAlign = "top";

                const track = document.createElement("span");
                track.style.display = "flex";
                track.style.flexDirection = "column";

                // "Fall from above" means the track moves DOWN.
                // So the final target number goes at the very TOP of the track.
                const spins = 12 + charIndex * 2; // Later digits roll for longer
                let trackHTML = `<span style="height: 1em; display: flex; align-items: center; justify-content: center;">${char}</span>`;

                // Add random dummy numbers underneath it to create the "roll"
                for (let i = 0; i < spins; i++) {
                  const rand = Math.floor(Math.random() * 10);
                  trackHTML += `<span style="height: 1em; display: flex; align-items: center; justify-content: center;">${rand}</span>`;
                }

                track.innerHTML = trackHTML;
                digitWrap.appendChild(track);
                numContainer.appendChild(digitWrap);

                // Start position: shifted all the way UP, viewing the bottom of the track
                track.style.transform = `translateY(-${spins}em)`;

                // Force the browser to register this start position
                track.getBoundingClientRect();

                // Animate pulling the track DOWN to zero, letting numbers fall from above
                setTimeout(
                  () => {
                    // Custom 'heavy roll' easing curve: starts fast, lands very softly
                    track.style.transition = `transform ${3.5 + charIndex * 0.3}s cubic-bezier(0.16, 1, 0.3, 1)`;
                    track.style.transform = `translateY(0)`;
                  },
                  150 + index * 150,
                ); // Stagger each whole block (35, then 12,784, then 1)
              }
            });
          });
        }
      },
      { threshold: 0.4 },
    );

    statsObserver.observe(statsSection);
  }
});
