<template>
  <div
    class="box-wrap"
  >
    <div id="cube">
      <div class="cube back" />
      <div class="cube top" />
      <div class="cube left" />
      <div class="cube right" />
      <div class="powerup absolute" />
    </div>

    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="box-wrap__modal"
      >
        <div clas="cube">
          <div class="cube back" />
          <div class="cube top" />
          <div class="cube left" />
          <div class="cube right" />
          <div class="powerup absolute" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<!-- eslint-disable no-unused-vars -->
<script lang="ts">
import { type PropType } from 'vue';

// eslint-disable-next-line no-shadow
export enum QUEST_TYPES {
  FIRST,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH
}

export default {
  name: 'QuestCube',
  props: {
    questType: {
      type: Number as PropType<QUEST_TYPES>,
      default: QUEST_TYPES.FIRST,
    },
    openBox: {
      type: Boolean,
      default: false,
    },
    prizeValue: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  watch: {
    openBox(currVal: boolean) {
      this.isOpen = currVal;

      if (currVal) this.triggerOpen();
    },
  },
  methods: {
    triggerOpen() {
      const cube: any = document.querySelector('#cube');
      const cback: any = document.querySelector('.back');
      const ctop: any = document.querySelector('.top');
      const cleft: any = document.querySelector('.left');
      const cright: any = document.querySelector('.right');
      const glow: any = document.querySelector('.hexagon');
      const powerup: any = document.querySelector('.powerup');
      const transitionTime = '750ms';
      const c = 0;

      if (!powerup) return;
      if (!ctop || !cleft || !cright) return;

      ctop.style.transition = `all ${transitionTime}`;
      cleft.style.transition = `all ${transitionTime}`;
      cright.style.transition = `all ${transitionTime}`;
      cube.style.transition = `all ${transitionTime}`;
      powerup.style.transition = `all ${transitionTime}`;
      glow.style.transition = `all ${transitionTime}`;
      cback.style.transition = `all ${transitionTime}`;

      function changeVar(glowVal: string) {
        document.documentElement.style.setProperty('--glow', glowVal);
      }

      ctop.style.transform = 'translateY(0)';
      cleft.style.transform = 'translateX(0)';
      cright.style.transform = 'translateX(0)';
      cube.style.opacity = 1;
      this.isOpen = false;
      ctop.style.opacity = 1;
      cleft.style.opacity = 1;
      cright.style.opacity = 1;
      cback.style.opacity = 1;
      glow.style.opacity = 1;
      powerup.style.opacity = 0;
      powerup.style.zIndex = 0;
      cube.style.animationPlayState = 'running';
      powerup.style.height = '48px';
      powerup.style.width = '48px';
      changeVar('rgba(255,195,26,0.4)');

      // function award() {
      //   if (c % 2 === 0) {
      //     // pp
      //     powerup.style.backgroundImage = "url('https://cf.quizizz.com/game/img/powerups/lg/power-play.png')";
      //     changeVar('rgba(69,185,251,0.33)');
      //   } else {
      //     // glitch
      //     powerup.style.backgroundImage = "url('https://cf.quizizz.com/game/img/powerups/lg/glitch.png')";
      //     changeVar('rgba(246,6,120,0.4)');
      //   }
      //   c++;
      // }
    },
  },
};
</script>

<style>
:root {
  --glow: rgba(255, 195, 26, 0.4);
}

.box-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  width: 200px;
  height: 200px;
  border-radius: 30px;
  padding: 20px;
  background-color: var(--color-5);
  border: 1px solid var(--colo-6);
  margin: 20px 0;
}

.box-wrap__modal {
  position: fixed;
  width: 100vw;
  height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 30px;
  padding: 20px;
  background-color: var(--color-5);
  border: 1px solid var(--colo-6);
  margin: 20px 0;
}

#cube {
  display: flex;
  justify-content: center;
  align-items: center;
}

#cube {
  animation: hover 1.5s ease-in-out infinite alternate;
  transition: transform 300ms;
  animation-play-state: running;
}

.back {
  position: absolute;
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxBackground_2x_b2espr.png");
  background-size: cover;
  background-position: center;
  z-index: -1;
  width: 200px;
  height: 200px;
}
.top {
  position: absolute;
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxTopFlap_2x_f9cb8g.png");
  background-size: cover;
  background-position: center;
  z-index: 1;
  width: 200px;
  height: 200px;
}
.left {
  position: absolute;
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxLeftFlap_2x_y8u4gz.png");
  background-size: cover;
  background-position: center;
  z-index: 1;
  width: 200px;
  height: 200px;
}
.right {
  position: absolute;
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxRightFlap_2x_abexhh.png");
  background-size: cover;
  background-position: center;
  z-index: 1;
  width: 200px;
  height: 200px;
}
@keyframes hover {
  from {
    transform: translateY(-0.2rem);
  }
  to {
    transform: translateY(0.2rem);
  }
}
.powerup {
  background-image: url("");
  background-size: cover;
  border-radius: 50%;
  z-index: 100;
  overflow: hidden;
  height: 48px;
  width: 48px;
  z-index: -5;
}

</style>
