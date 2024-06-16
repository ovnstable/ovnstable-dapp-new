<template>
  <div class="bridge-component">
    <Transition name="slide-fade">
      <div
        v-if="!isIframeLoaded"
        class="bridge-component__loader"
      >
        <Spinner />
      </div>
    </Transition>
    <iframe
      id="iframe"
      style="border: none;"
      title="squid_widget"
      height="690"
      width="400"
      :src="link"
      @load="handleIframeLoad()"
    />
  </div>
</template>

<!-- eslint-disable no-promise-executor-return -->
<script lang="ts">
import { mapGetters } from 'vuex';
import { chainContractsMap } from '@/utils/contractsMap.ts';
import Spinner from '@/components/Spinner/Index.vue';

export default {
  name: 'BridgeComponent',
  components: {
    Spinner,
  },

  data: () => ({
    isIframeLoaded: false,
    link: '',
    allConfigs: {
      widgetConfig: {
        integratorId: 'overnight-swap-widget',
        companyName: 'Overnight',
        style: {
          neutralContent: '#29323e',
          baseContent: '#29323e',
          base100: '#e5e7ea',
          base200: '#f5f5f5',
          base300: '#ffffff',
          error: '#ED6A5E',
          warning: '#FFB155',
          success: '#2EAEB0',
          primary: '#e5e7ea',
          secondary: '#ffffff',
          secondaryContent: '#ffffff',
          neutral: '#ffffff',
          roundedBtn: '26px',
          roundedCornerBtn: '999px',
          roundedBox: '1rem',
          roundedDropDown: '20rem',
        },
        slippage: 0.5,
        infiniteApproval: false,
        enableExpress: true,
        apiUrl: 'https://apiplus.squidrouter.com',
        comingSoonChainIds: [],
        titles: {
          swap: 'Bridge',
          settings: 'Settings',
          wallets: 'Wallets',
          tokens: 'Select Token',
          chains: 'Select Chains',
          history: 'History',
          transaction: 'Transaction',
          allTokens: 'Select Token',
          destination: 'Destination address',
        },
        priceImpactWarnings: {
          warning: 3,
          critical: 5,
        },
        showOnRampLink: true,
        initialFromChainId: '8453',
        initialToChainId: '10',
        defaultTokens: [
          {
            chainId: '8453',
            address: chainContractsMap.base.ovn,
            symbol: 'OVN',
            name: 'OVN',
          },
          {
            chainId: '10',
            address: chainContractsMap.optimism.ovn,
            symbol: 'OVN',
            name: 'OVN',
          },
        ],
      },
      widgetConfigForDarkTheme: {
        integratorId: 'overnight-swap-widget',
        companyName: 'Overnight',
        style: {
          neutralContent: '#ffffff',
          baseContent: '#ffffff',
          base100: '#3d4657',
          base200: '#29323e',
          base300: '#1d2029',
          error: '#ED6A5E',
          warning: '#FFB155',
          success: '#2EAEB0',
          primary: '#3d4657',
          secondary: '#d9d8e4',
          secondaryContent: '#F6F7FB',
          neutral: '#1d2029',
          roundedBtn: '8px',
          roundedCornerBtn: '999px',
          roundedBox: '12px',
          roundedDropDown: '8px',
        },
        slippage: 0.5,
        infiniteApproval: false,
        enableExpress: true,
        apiUrl: 'https://apiplus.squidrouter.com',
        comingSoonChainIds: [],
        titles: {
          swap: 'Bridge',
          settings: 'Settings',
          wallets: 'Wallets',
          tokens: 'Select Token',
          chains: 'Select Chain',
          history: 'History',
          transaction: 'Transaction',
          allTokens: 'Select Token',
          destination: 'Destination address',
        },
        priceImpactWarnings: {
          warning: 3,
          critical: 5,
        },
        showOnRampLink: true,
        initialFromChainId: '8453',
        initialToChainId: '10',
        defaultTokens: [
          {
            chainId: '8453',
            address: chainContractsMap.base.ovn,
            symbol: 'OVN',
            name: 'OVN',
          },
          {
            chainId: '10',
            address: chainContractsMap.optimism.ovn,
            symbol: 'OVN',
            name: 'OVN',
          },
        ],
        collectFees: {
          // dev test wallet
          integratorAddress: '0xEd446C56F89e84b3dC9ACec060154eC6BC6bB299',
          fee: 0,
        },
      },
    },
  }),

  computed: {
    ...mapGetters('theme', ['light']),
  },

  mounted() {
    this.updateLink();
  },

  watch: {
    light() {
      this.updateLink();
    },
  },

  methods: {
    updateLink() {
      if (this.light) {
        // Light theme link config
        this.link = this.generateIframeURL(this.allConfigs.widgetConfig);
      } else {
        // Dark theme link config
        this.link = this.generateIframeURL(
          this.allConfigs.widgetConfigForDarkTheme,
        );
      }
    },

    generateIframeURL(config: any) {
      const encodedConfig = encodeURIComponent(JSON.stringify(config));

      return `https://v2.widget.squidrouter.com/iframe?config=${encodedConfig}`;
    },

    async handleIframeLoad() {
      await new Promise((resolve) => setTimeout(() => resolve(0), 2000));
      this.isIframeLoaded = true;
    },
  },
};
</script>

<style scoped>
.bridge-component {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
}

.bridge-component iframe {
  margin: 0 auto;
}

#squid-widget {
  background-color: #000!important;
}

.bridge-component__loader {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  background-color: var(--color-4);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}
</style>
