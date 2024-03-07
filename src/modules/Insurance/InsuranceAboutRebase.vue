<template>
  <div class="insurane__about-rebase">
    <p :class="['insurane__about-rebase-title', { positive_text: type === 'positive', negative_text: type !== 'positive' }]">
      {{ type === 'positive' ? 'Positive' : 'Negative' }} rebase
    </p>
    <div class="insurane__about-rebase-images">
      <div class="insurane__about-rebase-images-provider">
        <BaseIcon
          name="InsuranceSloth"
        />
        <p>Insurance<br>
          provider</p>
      </div>
      <div class="insurane__about-rebase-images-capital">
        <p>Capital in OVN</p>
        <BaseIcon
          name="InsuranceCurveArrowRight"
        />
        <BaseIcon
          name="InsuranceCurveArrowLeft"
        />
        <p :class="{ positive_text: type === 'positive', negative_text: type !== 'positive' }">
          {{ type === 'positive' ? 'Positive' : 'Negative' }}<br>
          yield in OVN</p>
      </div>
      <div class="insurane__about-rebase-images-vault">
        <BaseIcon
          name="InsuranceVault"
        />
        <p>Insurance Vault</p>
      </div>
      <div class="insurane__about-rebase-images-premiums">
        <BaseIcon
          :name="type === 'positive' ? 'InsuranceAboutArrowLeft' : 'InsuranceAboutArrowRight'"
        />
        <p :class="{ positive_text: type === 'positive', negative_text: type !== 'positive' }">
          {{ type === 'positive' ? 'Premiums' : 'Coverage' }}</p>
      </div>
      <div class="insurane__about-rebase-images-tokens-plus">
        <BaseIcon
          name="InsuranceTokensPlus"
        />
        <p>Tokens+</p>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'AboutInsurance',
  components: {
    BaseIcon,
  },
  props: {
    type: {
      type: String,
      default: 'positive',
    },
  },
};
</script>

<style lang="scss" scoped>

.insurane__about-rebase {
  display:flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.insurane__about-rebase-images {
  display:flex;
  flex-direction: row;
  p {
    font-size: 12px;
  }
}
.positive_text {
  color: var(--color-12);
}
.negative_text {
  color: var(--color-9);
}
.insurane__about-rebase-images-provider,
.insurane__about-rebase-images-capital,
.insurane__about-rebase-images-vault,
.insurane__about-rebase-images-premiums,
.insurane__about-rebase-images-tokens-plus {
  display:flex;
  flex-direction: column;
}

.insurane__about-rebase-images-capital :nth-child(1) {
  color: var(--color-3);
  margin-bottom: 8px;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}
.insurane__about-rebase-images-capital :nth-child(2) {
  margin-bottom: 34px;
}
.insurane__about-rebase-images-capital :nth-child(3) {
  margin-bottom: 6px;
}
.insurane__about-rebase-title {
  font-size: 15px;
  text-align: center;
  margin-bottom: 30px;
}

.insurane__about-rebase-images-provider {
  margin-right: 6px;
  p {
    color: var(--color-3);
    margin-top: 14px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}
.insurane__about-rebase-images-vault {
  margin-left: 6px;
  margin-right: 8px;
  p {
    color: var(--color-3);
    margin-top: 6px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}

.insurane__about-rebase-images-tokens-plus {
  p {
    color: var(--color-3);
    margin-top: 10px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}

.insurane__about-rebase-images-premiums {
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-right: 10px;

  svg {
    align-self: center;
    margin-bottom: 4px;
  }

  p {
    margin-bottom: 16px;
  }
}

</style>
