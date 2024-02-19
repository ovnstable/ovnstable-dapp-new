<template>
  <div class="carousel-container">
    <h1>Overnight Tips</h1>
    <div>
      <span
        class="list-items"
        v-html="formatDescription(currentItem.description, currentItem.linkWord, currentItem.link)"
        @click="trackLinkClick(currentItem)"
        @keypress="trackLinkClick(currentItem)"
      />
    </div>
  </div>

</template>

<script lang="ts">
export default {
  name: 'CarouselComponent',
  data: () => ({
    items: [
      {
        id: 1,
        description: 'Swap Overnight tokens with MINIMAL FEES, [here]',
        linkWord: 'here',
        link: 'https://app.overnight.fi/swap',
        postfix: 'swap_page',
      },
      {
        id: 2,
        description: 'Find the BEST YIELD on the [All pools] page at a glance',
        linkWord: 'All pools',
        link: 'https://app.overnight.fi/pools',
        postfix: 'all_pools',
      },
      {
        id: 3,
        description: 'Join our pools with one click with ["Zap in" button]',
        linkWord: '"Zap in" button',
        link: 'https://app.overnight.fi/pools',
        postfix: 'zap_to_allpools',
      },
      {
        id: 4,
        description: 'Explore TOP POOLS on the [Featured page]',
        linkWord: 'Featured page',
        link: 'https://app.overnight.fi/featured',
        postfix: 'featured_page',
      },
      {
        id: 5,
        description: 'Audit your risks on the [Collateral page]',
        linkWord: 'Collateral page',
        link: 'https://app.overnight.fi/collateral',
        postfix: 'collateral_page',
      },
      {
        id: 6,
        description: 'Join our [Zealy] to participate in the partner airdrop, token sale',
        linkWord: 'Zealy',
        link: 'https://zealy.io/c/overnight-fi/questboard',
        postfix: 'zealy',
      },
    ],
    currentItemIndex: 0,
  }),

  computed: {
    currentItem() {
      return this.items[this.currentItemIndex];
    },
  },

  mounted() {
    this.items = this.shuffleArray(this.items);
    this.showNextItem();
  },

  methods: {
    shuffleArray(array: any) {
      for (let i = array.length - 1; i > 0; i--) {
        const shuffledArray = Math.floor(Math.random() * (i + 1));
        // eslint-disable-next-line no-param-reassign
        [array[i], array[shuffledArray]] = [array[shuffledArray], array[i]];
      }
      return array;
    },

    showNextItem() {
      if (this.currentItemIndex === this.items.length) {
        this.currentItemIndex = 0;
      }
      setTimeout(() => {
        this.currentItemIndex++;
        this.showNextItem();
      }, 4000); // 3-second delay
    },

    formatDescription(description: any, linkWord: any, link: any) {
      return description.replace(`[${linkWord}]`, `<a class="modal-link" href="${link}" target="_blank">${linkWord}</a>`);
    },

    trackLinkClick(item: any) {
      const action = `carousel_link_clicked_${item.postfix}`;
      console.log('Action:', action);
    },
  },
};
</script>

<style lang="scss" scoped>
.carousel-container {
    padding-bottom: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    max-width: 400px;
    min-width: 400px;
    min-height: 120px;
    width: 100%;

    h1 {
        font-size: 24px;
        line-height: 36px;
        font-weight: 700;
        color: var(--color-1);
        margin-bottom: 8px;
    }
}
.list-items {
    font-size: 16px;
    line-height: 22px;
    font-weight: 400;
    color: var(--color-1);
    text-align: center;
}
</style>
