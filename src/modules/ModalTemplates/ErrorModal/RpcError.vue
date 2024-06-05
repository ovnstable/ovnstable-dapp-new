<template>
  <div
    class="main-container px-5 pt-5"
  >
    <div class="error-label pb-5">
      Error in your wallet
    </div>

    <div
      v-if="errorMsg"
      class="error-message-container"
    >
      <div class="error-message">
        [ rpc error: code: {{errorCode}}. {{errorMsg}} ]
      </div>
    </div>

    <div
      class="info-container pa-5"
    >
      <div
        class="info-item"
      >
        1. Check information in your wallet
      </div>
      <div
        class="info-item"
      >
        2. Try to repeat the transaction after some time
      </div>

      <div
        class="info-item pt-4"
      >
        Useful articles:
      </div>
      <div>
        <a
          href="https://overnight.fi/blog/2022/10/28/what-to-do-if-your-transaction-is-still-stuck/"
          class="info-item-link pl-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          • What to do if your transaction is still stuck
        </a>
      </div>
      <div>
        <a
          href="https://docs.alchemy.com/docs/how-to-add-alchemy-rpc-endpoints-to-metamask"
          class="info-item-link pl-2"
          target="_blank"
          rel="noopener noreferrer"
        >
          • How to Add Alchemy RPC Endpoints to Metamask
        </a>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
export default {
  name: 'RpcError',
  props: {
    errorMsg: {
      type: String,
      default: '',
    },
    errorCode: {
      type: Number,
      default: 0,
    },
    copyError: {
      type: Function,
      default: () => null,
    },
  },

  data: () => ({
    isCopied: false, // Initialize it as false
  }),

  methods: {
    copyErrorToClipboard(copyTooltip: any, errorMsg: any) {
      if (typeof this.copyError === 'function') {
        this.copyError(copyTooltip, errorMsg);

        this.isCopied = true;

        setTimeout(() => {
          this.isCopied = false;
        }, 2000); // 2000 milliseconds (2 seconds)
      }
    },
  },
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 20px;
        line-height: 30px;
    }

    .error-message {
        font-size: 14px;
        line-height: 24px;
    }

    .info-item {
        font-size: 14px;
        line-height: 18px;
    }

    .info-item-link {
        font-size: 14px;
        line-height: 18px;
    }

    .loading-img {
        width: 80px;
    }

    .info-container {
        min-width: 300px;
        min-height: 164px;
    }

    .error-message-container {
        max-width: 300px;
        max-height: 100px;

        padding-left: 5px;
        margin-bottom: 10px;
    }

    .copy-container {
        right: 40px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
    }
}

/* tablet */
@media only screen and (min-width: 960px) and (max-width: 1400px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 24px;
        line-height: 34px;
    }

    .info-container {
        min-width: 550px;
        min-height: 164px;
    }

    .error-message {
        font-size: 16px;
        line-height: 24px;
    }

    .info-item {
        font-size: 16px;
        line-height: 24px;
    }

    .info-item-link {
        font-size: 16px;
        line-height: 24px;
    }

    .loading-img {
        width: 100px;
    }

    .error-message-container {
        max-width: 534px;
        max-height: 160px;

        padding: 5px;
        margin-bottom: 10px;
    }

    .copy-container {
        right: 65px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
    }
}

/* full */
@media only screen and (min-width: 1400px) {

    .error-label {
        font-style: normal;
        font-weight: 400;
        font-size: 26px;
        line-height: 36px;
    }

    .info-container {
        min-width: 550px;
        min-height: 164px;
    }

    .error-message {
        font-size: 16px;
        line-height: 24px;
    }

    .info-item {
        font-size: 16px;
        line-height: 24px;
    }

    .info-item-link {
        font-size: 16px;
        line-height: 24px;
    }

    .loading-img {
        width: 100px;
    }

    .error-message-container {
        max-width: 534px;
        max-height: 160px;

        padding: 5px;
        margin-bottom: 10px;
    }

    .copy-container {
        right: 65px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
    }
}

.error-message-container {
    white-space: unset;
    overflow-x: hidden;
    overflow-y: auto;

    margin-bottom: 10px;
    text-align: left;
}

.error-message {
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.info-container {
    background: var(--card-info-background);
    border-radius: 4px;
}

.info-item {
    font-style: normal;
    font-weight: 400;
    color: var(--secondary-gray-text);
}

.info-item-link {
    font-style: normal;
    font-weight: 400;
    cursor: pointer;
    text-decoration: none;

    color: #1C95E7;
}

.error-label {
    color: var(--secondary-gray-text);
}

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: left;
}

.copy-container {
    background-color: transparent;
    height: 25px;
    width: 25px;

    margin-left: auto;

    position: absolute;
}

.copy-container:hover {
    background-color: var(--card-banner-status-container);
}

.copied-message {
    position: absolute;
    color: #FFFFFF;
    opacity: 1;
    transition: opacity 0.3s;

    background-color: var(--links-blue);
    padding: 5px 10px;
    border-radius: 10px;

    font-size: 14px;
    font-weight: 500;
}

@media (max-width: 640px) {
  .main-container {
    padding: 0;
  }
 }

</style>
