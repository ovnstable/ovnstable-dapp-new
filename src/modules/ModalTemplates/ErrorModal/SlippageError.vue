<template>
  <div
    class="main-container px-5 pt-5"
  >
    <div class="error-label pb-5">
      Slippage error
    </div>

    <div
      v-if="errorMsg"
      class="error-message-container"
    >
      <div class="error-message">
        Odos Error: {{errorMsg}}
      </div>
    </div>

    <div
      class="info-container pa-5"
    >
      <div
        class="info-item"
      >
        <div class="pb-4">
          Check slippage tolerance. Recommended:
        </div>
        <div>
          <span style="font-weight: bold">0.05%</span> - for stablecoins only.
        </div>
        <div>
          <span style="font-weight: bold">0.1%</span> - for mix of stablecoins and volatile assets.
        </div>
        <div>
          <span style="font-weight: bold">1%</span> - for volatile assets.
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'SlippageError',
  props: ['errorMsg'],
};
</script>

<style scoped>

/* mobile */
@media only screen and (max-width: 960px) {

    .info-container {
        min-width: 300px;
        min-height: 140px;
    }

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

    .copy-container {
        right: 40px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
    }

    .loading-img {
        width: 80px;
    }

    .error-message-container {
        min-width: 300px;
        max-height: 100px;

        padding-left: 5px;
        margin-bottom: 10px;
    }

    .info-item {
        font-size: 14px;
        line-height: 18px;
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

    .copy-container {
        right: 65px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
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

    .info-item {
        font-size: 16px;
        line-height: 24px;
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

    .copy-container {
        right: 65px;
    }

    .copied-message {
        top: -5px;
        right: 25px; /* Adjust the position as per your design */
        height: 30px;
        min-width: 145px;
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

    .info-item {
        font-size: 16px;
        line-height: 24px;
    }
}

.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: left;
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
    font-size: 16px;
    line-height: 24px;
    cursor: pointer;
    text-decoration: none;

    color: #1C95E7;

}

.error-label {
    color: var(--secondary-gray-text);
}

.discord-link {
    cursor: pointer;
    color: var(--links-blue);
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
}

.discord-link:hover {
    text-decoration: underline;
}

.discord-label {
    color: var(--secondary-gray-text);
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 18px;
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

</style>
