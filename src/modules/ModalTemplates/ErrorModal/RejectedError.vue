<template>
  <div
    class="error-content"
  >
    <BaseIcon
      class="error-content__icon"
      name="ChartCandles"
    />

    <h1>
      {{ errorTitle }}
    </h1>

    <div class="divider" />
    <div
      class="error-content__msg"
    >
      <div class="error-message">
        Rejected by user
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
// import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'RejectedError',
  components: {
    BaseIcon,
    // ButtonComponent,
  },
  props: {
    errorTitle: {
      type: String,
      required: false,
      default: 'Transaction reverted',
    },
  },
};
</script>

    <style lang="scss" scoped>
    .error-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      h1 {
        [data-theme="dark"] & {
          color: var(--color-4);
        }
      }
    }
    .divider {
      height: 1px;
      width: 100%;
      background-color: var(--color-7);
      margin-bottom: 20px;
    }

    .error-content__icon {
      width: 90px;
      height: 90px;
      margin: 0 auto 20px auto;
    }

    h1 {
      font-size: 24px;
      font-weight: 600;
      color: var(--color-1);
      margin-bottom: 20px;
    }

    .error-content__msg {
      max-width: 100%;
      word-break: break-all;
      font-size: 20px;
      margin-bottom: 20px;
      color: var(--color-7);
    }

    .error-content__submit {
      button {
        margin: 0 auto;
        [data-theme="dark"] & {
          color: var(--color-4);
          background-color: var(--color-17);
        }
      }

      button:hover {
        [data-theme="dark"] & {
          color: var(--color-17);
          background-color: var(--color-4);
        }
      }

      p {
        font-size: 16px;
        font-weight: 600;
        color: var(--color-1);
        margin-bottom: 40px;
        [data-theme="dark"] & {
          color: var(--color-18);
        }
      }
    }
    </style>
