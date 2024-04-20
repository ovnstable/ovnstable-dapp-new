<template>
  <div
    class="box-wrap"
  >
    <div class="box-wrap__cube">
      <div class="cube cube--top">
        <img
          alt="side"
          :src="boxType(BOX_TYPES.TOP, false)"
        />
      </div>
      <div class="cube cube--left">
        <img
          alt="side"
          :src="boxType(BOX_TYPES.LEFT, false)"
        />
      </div>
      <div class="cube cube--right">
        <img
          alt="side"
          :src="boxType(BOX_TYPES.RIGHT, false)"
        />
      </div>
      <div class="powerup" />
    </div>

    <Transition name="slide-fade">
      <div
        v-if="isOpen"
        class="box-wrap__modal"
        @click="triggerClose"
        @keypress="triggerClose"
      >
        <div
          :id="`cube-open-${boxId}`"
          class="box-wrap__modal-cube"
          :class="{ 'shake-active': isShakeActive }"
        >
          <div class="hexagon" />
          <div class="cube cube--back" />
          <div class="cube cube--top">
            <img
              alt="side"
              :src="boxType(BOX_TYPES.TOP, false)"
            />
          </div>
          <div class="cube cube--left">
            <img
              alt="side"
              :src="boxType(BOX_TYPES.LEFT, false)"
            />
          </div>
          <div class="cube cube--right">
            <img
              alt="side"
              :src="boxType(BOX_TYPES.RIGHT, false)"
            />
          </div>
          <div
            v-if="!isShakeActive"
            class="box-wrap__modal-prize"
          >
            {{ prizeValue }}
            {{ viewBox === questType.DIAMOND ? 'GOLD' : 'POINTS' }} <span class="point" />
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<!-- eslint-disable no-unused-vars -->
<script lang="ts">
import { uniqueId } from 'lodash';
import { type PropType } from 'vue';
import { awaitDelay, getImageUrl } from '@/utils/const.ts';

// eslint-disable-next-line no-shadow
export enum BOX_TYPES {
  LEFT,
  TOP,
  RIGHT,
}

// eslint-disable-next-line no-shadow
export enum TypeofQuest {
  BRONZE,
  SILVER,
  GOLD,
  DIAMOND
}

export default {
  name: 'QuestCube',
  props: {
    viewBox: {
      type: Number as PropType<TypeofQuest>,
      required: true,
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
  emits: ['close'],
  data() {
    return {
      isOpen: false,
      isShakeActive: false,
      boxId: uniqueId(),
      BOX_TYPES,
      questType: TypeofQuest,
    };
  },
  watch: {
    async openBox(currVal: boolean) {
      if (!currVal) {
        this.isOpen = currVal;
        this.isShakeActive = false;
        return;
      }

      this.isOpen = currVal;

      this.isShakeActive = true;
      await awaitDelay(600);

      this.isShakeActive = false;

      await awaitDelay(10);
      if (currVal) this.triggerOpen();
    },
  },
  // async mounted() {
  //   this.isOpen = this.viewBox === TypeofQuest.BRONZE;

  //   this.isShakeActive = true;
  //   await awaitDelay(600);

  //   this.isShakeActive = false;

  //   await awaitDelay(10);
  //   this.triggerOpen();
  // },
  computed: {
    boxType() {
      return (side: BOX_TYPES, svg: boolean) => {
        if (typeof this.viewBox === 'undefined') return '';
        if (svg && side === BOX_TYPES.LEFT) return `box-left-${this.viewBox}`;
        if (svg && side === BOX_TYPES.TOP) return `box-top-${this.viewBox}`;
        if (svg && side === BOX_TYPES.RIGHT) return `box-right-${this.viewBox}`;

        if (side === BOX_TYPES.TOP) {
          return getImageUrl(`assets/icons/blastQuest/box-top-${this.viewBox}.svg`);
        }
        if (side === BOX_TYPES.LEFT) {
          return getImageUrl(`assets/icons/blastQuest/box-left-${this.viewBox}.svg`);
        }
        if (side === BOX_TYPES.RIGHT) {
          return getImageUrl(`assets/icons/blastQuest/box-right-${this.viewBox}.svg`);
        }

        return '';
      };
    },
  },
  methods: {
    triggerClose() {
      this.$emit('close');
    },
    triggerOpen() {
      console.log('triggerOpen');
      const cube: any = document.querySelector(`#cube-open-${this.boxId}`);
      // const cback: any = document.querySelector(`#cube-open-${this.boxId} .cube--back`);
      const ctop: any = document.querySelector(`#cube-open-${this.boxId} .cube--top`);
      const cleft: any = document.querySelector(`#cube-open-${this.boxId} .cube--left`);
      const cright: any = document.querySelector(`#cube-open-${this.boxId} .cube--right`);
      const powerup: any = document.querySelector(`#cube-open-${this.boxId} .box-wrap__modal-prize`);
      const glow: any = document.querySelector(`#cube-open-${this.boxId} .hexagon`);
      const transitionTime = '750ms';
      let c = 0;

      if (!powerup || !cube) return;
      if (!ctop || !cleft || !cright) return;

      ctop.style.transition = `all ${transitionTime}`;
      cleft.style.transition = `all ${transitionTime}`;
      cright.style.transition = `all ${transitionTime}`;
      cube.style.transition = `all ${transitionTime}`;
      powerup.style.transition = `all ${transitionTime}`;
      // cback.style.transition = `all ${transitionTime}`;

      function changeVar(glowVal: string) {
        document.documentElement.style.setProperty('--glow', glowVal);
      }

      ctop.style.transform = 'translateY(-55%)';
      cleft.style.transform = 'translateY(-50%) translateX(-20%)';
      cright.style.transform = 'translateY(-50%) translateX(20%)';
      ctop.style.opacity = 0.1;
      cleft.style.opacity = 0.1;
      cright.style.opacity = 0.1;
      // cback.style.opacity = 0.1;
      powerup.style.opacity = 1;
      glow.style.opacity = 0.5;
      this.isOpen = true;
      cube.style.animationPlayState = changeVar('rgba(255,195,26,0.4)');
      powerup.style.zIndex = 10;

      function award() {
        if (c % 2 === 0) changeVar('rgba(69,185,251,0.33)');
        else changeVar('rgba(246,6,120,0.4)');
        c++;
      }

      award();
    },
  },
};
</script>

<style lang="scss">
:root {
  --glow: rgba(255, 195, 26, 0.2);
}

.hexagon {
  z-index: -2;
  position: relative;
  width: 30vw;
  height: 30vh;
  background-color: var(--glow);
  margin: 46.19px 0;
  transform: translateX(-50%);
  left: 50%;
  filter: blur(50px);
}
.hexagon:before,
.hexagon:after {
  content: "";
  position: absolute;
  width: 0;
  border-left: 80px solid transparent;
  border-right: 80px solid transparent;
}
.hexagon:before {
  bottom: 100%;
  border-bottom: 46.19px solid var(--glow);
}
.hexagon:after {
  top: 100%;
  width: 0;
  border-top: 46.19px solid var(--glow);
}

.box-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  width: 100%;
  max-width: 200px;
  min-height: 110px;
  border-radius: 30px;
}

.box-wrap__modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.box-wrap__modal-cube {
  position: relative;
  width: 500px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.box-wrap__cube {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: hover 1.5s ease-in-out infinite alternate;
  transition: transform 300ms;
  animation-play-state: running;
}

.cube--back {
  position: absolute;
  background-image: url("https://res.cloudinary.com/dbrwtwlwl/image/upload/v1580369339/cube/mysteryBoxBackground_2x_b2espr.png");
  background-size: cover;
  background-position: center;
  z-index: -1;
  width: 91px;
  height: 101px;
  top: 60%;
  transform: translateY(-50%);

  .box-wrap__modal-cube & {
    width: 350px;
    height: 355px;
    top: 47%;
    left: 122px;
  }
}
.cube--top {
  position: absolute;
  z-index: 1;
  top: 39%;
  transform: translateY(-50%);

  svg, img {
    width: 80px;
    height: 80px;
  }

  .box-wrap__modal-cube & {
    left: 155px;
    top: 50vh;
    bottom: 100px;

    svg, img {
      position: relative;
      top: -128px;
      width: 287px;
      height: 100%;
    }
  }
}

.cube--left {
  position: absolute;
  z-index: 1;
  left: 48px;
  top: 70%;
  transform: translateY(-50%);

  svg, img {
    width: 64px;
    height: 70px;
  }

  .box-wrap__modal-cube & {
    top: 50vh;
    left: 100px;

    svg, img {
      width: 250px;
      height: 250px;
    }
  }
}

.cube--right {
  position: absolute;
  z-index: 1;
  right: 48px;
  top: 70%;
  transform: translateY(-50%);

  svg, img {
    width: 64px;
    height: 70px;
  }

  .box-wrap__modal-cube & {
    top: 50vh;
    right: 0;

    svg, img {
      width: 250px;
      height: 250px;
    }
  }
}

.shake-active {
  animation-name: shake-box;
  animation-duration: 0.8s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  transform-origin: 50% 100%;
}

@keyframes hover {
  from {
    transform: translateY(-0.1rem);
  }
  to {
    transform: translateY(0.1rem);
  }
}

.box-wrap__modal-prize {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36px;
  font-weight: 500;
  z-index: 100;
  text-wrap: nowrap;
  color: var(--color-4);
  left: 41%;

  span {
    position: absolute;
    top: -13px;
    right: -15px;
    background-color: rgb(252, 252, 3);
    border-radius: 50%;
    width: 12px;
    height: 12px;
  }
}

@keyframes shake-box {
  0%  { transform:     translate(2px, 1px) rotate(0deg); }
  10% { transform:     translate(-1px, -2px) rotate(-2deg); }
  20% { transform:     translate(-3px, 0px) rotate(3deg); }
  30% { transform:     translate(0px, 2px) rotate(0deg); }
  40% { transform:     translate(1px, -1px) rotate(1deg); }
  50% { transform:     translate(-1px, 2px) rotate(-1deg); }
  60% { transform:     translate(-3px, 1px) rotate(0deg); }
  70% { transform:     translate(2px, 1px) rotate(-2deg); }
  80% { transform:     translate(-1px, -1px) rotate(4deg); }
  90% { transform:     translate(2px, 2px) rotate(0deg); }
  100%{ transform:     translate(1px, -2px) rotate(-1deg); }
 }
</style>
