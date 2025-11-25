<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import Banner1 from '../assets/Banner/Banner_1.png';
    import Banner2 from '../assets/Banner/Banner_2.png';
    import Banner3 from '../assets/Banner/Banner_3.png'

    let currentImageIndex = 0;
    const images = [Banner1, Banner2, Banner3];
    let intervalId: ReturnType<typeof setInterval> | undefined;
    let currentText = '';
    const fullText = 'Dapatkan diskon hingga 50% hanya hari ini!';
    let index = 0;

    function changeImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    onMount(() => {
        intervalId = setInterval(changeImage, 3000); 
    });

    onDestroy(() => {
        clearInterval(intervalId);
    });

  let typeInterval: ReturnType<typeof setInterval> | undefined;
  let resetTimeout: ReturnType<typeof setTimeout> | undefined;

  function startTyping() {
    typeInterval = setInterval(() => {
      if (index < fullText.length) {
        currentText += fullText[index++];
      } else {
        if (typeInterval) clearInterval(typeInterval);
        resetTimeout = setTimeout(() => {
          currentText = '';
          index = 0;
          startTyping();               // ← ulangi lagi
        }, 3000);
      }
    }, 50);
  }

  onMount(startTyping);

  onDestroy(() => {
    if (typeInterval) clearInterval(typeInterval);
    if (resetTimeout) clearTimeout(resetTimeout);
  });
</script>

<style>
    .banner-container {
        position: relative;
        width: 100%;
        overflow: hidden;
    }

    .banner {
        display: flex;
        transition: transform 1s ease-in-out;
    }

    .banner img {
        min-width: 100%;
    }

    .typing::after {
    content: '|';
    animation: blink 1s infinite;
  }

  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
</style>

<!-- Desktop: Banner Slider -->
<div class="hidden md:block banner-container">
  <div
    class="banner"
    style={currentImageIndex !== undefined ? `transform: translateX(${-currentImageIndex * 100}%)` : ''}
  >
    {#each images as image}
      <img
        src={image}
        alt="Promo Banner"
        class="w-full h-auto max-h-[400px] object-cover rounded"
      />
    {/each}
  </div>
</div>

<!-- Mobile Only: Full Width Gradient Hero -->
 <div class="md:hidden min-w-full h-[220px] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
   <div
     class="relative h-[220px] bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 flex items-center justify-center text-white overflow-hidden"
   >
     <!-- Background image (blurred) -->
     <div
       class="absolute inset-0 bg-cover bg-center filter blur-md scale-110 opacity-30"
       style="background-image: url({Banner1})"
     ></div>
   
     <!-- Content -->
     <div class="relative z-10 text-center px-4">
       <h2 class="text-2xl font-bold mb-2">Promo Spesial!</h2>
       <p class="text-base typing">{currentText}</p>
     </div>
   </div>
 </div>
