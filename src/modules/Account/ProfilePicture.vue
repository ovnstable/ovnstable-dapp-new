<template>
  <div class="account__modal-profile">
    <div class="account__modal-profile-name">
      <BaseIcon
        name="MetaMask"
      />
      <div
        class="account__modal-profile-text"
        btn-styles="secondary"
      >
        <span>
          {{ cutString(account, 4, 4)?.toUpperCase() }}
        </span>
      </div>
      <ButtonComponent
        class="account__modal-profile-copy"
        @click="copyAccount"
      >
        <BaseIcon
          name="Copy"
        />
      </ButtonComponent>

    </div>
    <div class="account__modal-profile-photo">
      <BaseIcon
        name="Pencil"
        @click="toggleColorPicker"
      />
      <div
        v-if="showColorPicker"
        class="color-picker"
      >
        <div
          v-for="color in colors"
          :key="color"
          :style="{ backgroundColor: color }"
          class="color-option"
          @click="selectColor(color)"
          @keypress="selectColor(color)"
        />
      </div>
      <div
        :style="{ backgroundColor: selectedColor }"
        class="account__modal-profile-photo-change"
      />
    </div>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';
import { mapGetters } from 'vuex';
import { cutString } from '@/utils/strings.ts';

export default {
  name: 'ProfilePicture',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  data() {
    return {
      colors: ['#0497EC', '#91B845', '#FFBA00', '#FF6B6C', '#BAC0CB'],
      selectedColor: '',
      showColorPicker: false,
    };
  },
  mounted() {
    this.loadSelectedColor();
  },
  computed: {
    ...mapGetters('accountData', ['account']),
  },
  methods: {
    cutString,
    copyAccount() {
      if (this.account) {
        navigator.clipboard.writeText(this.account).then(() => {
        }).catch((err) => {
          console.error('Could not copy text: ', err);
        });
      }
    },
    toggleColorPicker() {
      this.showColorPicker = !this.showColorPicker;
    },
    selectColor(color: any) {
      this.selectedColor = color;
      this.showColorPicker = false;
      localStorage.setItem('selectedProfileColor', color);
    },
    loadSelectedColor() {
      const color = localStorage.getItem('selectedProfileColor');
      if (color) {
        this.selectedColor = color;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.account__modal-profile,
.account__modal-profile-name,
.account__modal-profile-photo {
  display: flex;
  flex-direction: row;
}
.account__modal-profile-photo-change {
  position: relative;
  margin-left: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: var(--color-3);
}

.account__modal-profile {
  justify-content: space-between;
}

.account__modal-profile-name,
.account__modal-profile-photo {
  align-items: center;
}
.account__modal-profile-text {
  display: flex;
  align-items: center;
  padding: 5px 14px;
  background-color: var(--color-5);
  border: 1px solid var(--color-1);
  border-radius: 30px;
  color: var(--color-1);
  margin-left: 12px;
  margin-right: 12px;
  font-weight: 500;

  [data-theme="dark"] & {
    background-color: var(--color-17);
    color: var(--color-4);
  }

  span {
    position: relative;
    top: 1px;
  }
}

.account__modal-profile-copy {
  background: none;
  box-shadow: none;
  border: none;
  padding: 0;
}

.color-picker {
  display: flex;
  margin-left: 12px;
}

.color-option {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;
  margin-right: 10px;
}

.color-option:hover {
  opacity: 0.7;
}

</style>
