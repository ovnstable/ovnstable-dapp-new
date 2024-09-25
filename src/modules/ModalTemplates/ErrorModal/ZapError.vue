<template>
  <div
    class="error-content"
  >
    <BaseIcon
      class="error-content__icon"
      name="ComputerClock"
    />

    <h1>
      {{ errorTitle }}
    </h1>

    <div class="divider" />
    <div
      v-if="errorMsg"
      class="error-text-container"
    >
      <div class="error-content__msg">
        <div class="error-message">
          {{ errorMsg }}
        </div>
      </div>
      <ButtonComponent
        class="btn-clipboard"
        btn-styles="link"
        @click="copyError()"
        @keypress="copyError()"
      >
        Copy error to clipboard
        <!-- <BaseIcon
          name="Copy"
        /> -->
      </ButtonComponent>
    </div>

    <div class="error-content__submit">
      <p>Please, make a ticket in our Discord</p>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://discord.com/channels/933003627444969552/967813123149033542/967813482684760135/"
      >
        <ButtonComponent btn-styles="link">
          # | submit-ticket
        </ButtonComponent>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';
import ButtonComponent from '@/components/Button/Index.vue';

export default {
  name: 'ZapError',
  components: {
    BaseIcon,
    ButtonComponent,
  },
  props: {
    errorTitle: {
      type: String,
      required: false,
      default: 'Oops! Smart contract error',
    },
    copyError: {
      type: Function,
      required: true,
    },
    errorMsg: {
      type: String,
      required: false,
      default: 'No error description provided',
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
  .error-message {
  max-height: 100px;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  line-height: normal;
}
.btn-clipboard {
  svg {
    path {
      color: var(--color-17);
    }
  }
}
.error-text-container {
  display: flex;
    width: 100%;
    flex-direction: column;
    margin: 20px 0;
    gap: 15px;
}
  </style>
