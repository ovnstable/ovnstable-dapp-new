<template>
  <div class="path-wrap">
    <div
      v-if="isLoadingData || !isAllDataLoaded"
      class="path-wrap__loader"
    >
      <Spinner />
    </div>

    <Transition name="slide-fade">
      <div
        class="path-wrap__animation"
        v-if="!isLoadingData && isAllDataLoaded"
      >
        <h1>
          Routing plan
        </h1>

        <div class="path-wrap__row">
          <span>
            Tokens
          </span>
          <span>
            Transaction type
          </span>
        </div>

        <div
          class="path-wrap__overflow"
          v-if="root"
        >
          <div
            v-for="(branch, index) in (Array.from(root.values()) as any)"
            :key="index"
            class="path-wrap__branch"
          >

            <div class="path-wrap__branch-row">
              <div class="path-wrap__branch-row-tokens">
                <div
                  v-for="(token, tokenIndex) in (branch as any[])"
                  :key="token.id + index + tokenIndex"
                  class="path-wrap__branch-row__item"
                >
                  <img
                    :src="token.logoUrl"
                    :alt="token.symbol"
                  >
                  <BaseIcon
                    v-if="tokenIndex + 1 !== branch.length"
                    name="ArrowRightPath"
                  />
                </div>
              </div>

              <div class="path-wrap__branch-row__type">
                <span
                  v-if="getUniquePools(branch).length <= 1
                    && (getUniquePools(branch).includes('Overnight Wrapper') || getUniquePools(branch).includes('Overnight Exchange'))"
                >
                  MINT
                </span>
                <span
                  v-else
                >
                  SWAP
                </span>
              </div>
            </div>

            <div
              v-if="isPoolOpenMap[index]"
              class="path-wrap__branch-row-pools"
            >
              <div
                v-for="(pool, index) in (getUniquePools(branch) as any)"
                :key="pool"
                class="path-wrap__branch-row__pool"
              >
                <span class="pools-name">
                  {{pool}}
                </span>
                <span
                  v-if="index < getUniquePools(branch).length - 1"
                  class="path-wrap__branch-row__empty"
                >
                  -
                </span>
              </div>
            </div>

            <div class="path-wrap__branch-hr" />
          </div>
        </div>
        <div class="path-wrap__branch-footer">
          <h2>
            The route is preliminary and can be changed before you press swap.
          </h2>
          <div class="path-wrap__branch-footer__info">
            !
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<!-- eslint-disable no-restricted-syntax -->
<!-- eslint-disable no-continue -->
<!-- eslint-disable no-await-in-loop -->
<script lang="ts">
import { loadTokenImage, loadOvernightTokenImage } from '@/utils/tokenLogo.ts';
import Spinner from '@/components/Spinner/Index.vue';
import BaseIcon from '@/components/Icon/BaseIcon.vue';

export default {
  name: 'PathView',
  components: {
    Spinner,
    BaseIcon,
  },
  props: {
    pathObject: {
      type: Object,
      required: false,
      default: null,
    },
    inputTokens: {
      type: Array,
      required: true,
      default: () => [],
    },
    outputTokens: {
      type: Array,
      required: true,
      default: () => [],
    },
    isLoadingData: {
      type: Boolean,
      required: true,
      default: true,
    },

  },
  data() {
    return {
      root: null as any,
      pathViz: null as any,
      isRootLoading: true,
      isImagesLoading: true,
      poolLabelsMap: {}, // key = set() (unique values)

      ovnMarkers: ['USD+', 'DAI+', 'USDT+', 'wUSD+', 'OVN', 'ETH+'],
      isPoolOpenMap: {} as any,
    };
  },

  mounted() {
    this.init();
  },
  computed: {
    isAllDataLoaded() {
      return !this.isImagesLoading && !this.isRootLoading;
    },

  },
  watch: {
    pathObject(val) {
      if (val) {
        this.init();
      }
    },
  },
  methods: {
    async init() {
      this.isRootLoading = true;
      this.isImagesLoading = true;

      this.pathViz = null;
      this.pathViz = this.pathObject;
      this.root = null;
      await this.initLogos(this.pathViz);
      this.isImagesLoading = false;

      this.root = this.getInitedRoot(this.pathViz);
      this.isRootLoading = false;

      this.$forceUpdate();
    },
    async initLogos(pathViz: any) {
      for (let i = 0; i < pathViz.nodes.length; i++) {
        const node = pathViz.nodes[i];
        if (this.ovnMarkers.includes(node.symbol)) {
          node.logoUrl = loadOvernightTokenImage(node?.symbol);
          continue;
        }

        node.logoUrl = loadTokenImage(node?.symbol);
      }
    },
    getInitedRoot(pathViz: any) {
      const root = new Map();
      for (let i = 0; i < pathViz.links.length; i++) {
        const link = pathViz.links[i];
        let branch = root.get(link.source);
        if (!branch) {
          branch = [];
          let id = (Math.random() + 1).toString(36).substring(2);
          branch.push({
            id,
            poolLabel: link.label,
            ...pathViz.nodes[link.source],
          });

          id = (Math.random() + 1).toString(36).substring(2);
          branch.push({
            id,
            poolLabel: link.label,
            ...pathViz.nodes[link.target],
          });
          root.set(link.source, branch);
          continue;
        }

        const id = (Math.random() + 1).toString(36).substring(2);
        branch.push({
          id,
          poolLabel: link.label,
          ...pathViz.nodes[link.target],
        });

        root.set(link.source, branch);
        // root.delete(link.source);
        // console.log("Root: ", root);
      }

      // console.log("Inited root: ", root);
      // return root;
      const mergedRoot = this.getMergedBranches(root);
      // return mergedRoot;
      return this.getDuplicateClearedRoot(mergedRoot);
      // return this.getFilteredRoot(mergedRoot, inputTokens, outputTokens);
    },

    getDuplicateClearedRoot(root: any) {
      if (!root) return root;

      const existsPathMap = new Map(); // write full path by queue of symbol

      const newRoot = new Map();
      const branches = Array.from(root.values());
      const keys = Array.from(root.keys());
      for (let i = 0; i < branches.length; i++) {
        const branch: any = branches[i];
        const key = keys[i];

        const branchWithoutDuplicate: any[] = [];
        const setBranchWithoutDuplicate = new Set();

        let pathName = '';
        branch.forEach((item: any) => {
          const fieldValue = item.symbol; // Replace 'name' with the field you want to filter by

          if (!setBranchWithoutDuplicate.has(fieldValue)) {
            setBranchWithoutDuplicate.add(fieldValue);
            branchWithoutDuplicate.push(item);
            pathName = `${pathName}_${fieldValue}`;
          }
        });

        // remove single
        if (!branchWithoutDuplicate || branchWithoutDuplicate.length <= 1) {
          continue;
        }

        // duplicate path
        if (existsPathMap.get(pathName)) {
          continue;
        }

        existsPathMap.set(pathName, true);
        newRoot.set(key, branchWithoutDuplicate);
      }

      return newRoot;
    },
    getFilteredRoot(root: any, inputTokens: any, outputTokens: any) {
      if (!root) {
        return root;
      }

      const newRoot = new Map();
      const branches = Array.from(root.values());
      for (let i = 0; i < inputTokens.length; i++) {
        const token = inputTokens[i].selectedToken;
        const branchInfo = this.findBranchWithFirstToken(root, branches, token);
        if (branchInfo && branchInfo.branch.length < 6) {
          newRoot.set(branchInfo.key, branchInfo.branch);
        }
      }

      for (let i = 0; i < outputTokens.length; i++) {
        const token = outputTokens[i].selectedToken;
        const branchInfo = this.findBranchWithLastToken(root, branches, token);
        if (branchInfo && branchInfo.branch.length < 6) {
          newRoot.set(branchInfo.key, branchInfo.branch);
        }
      }

      return newRoot;
    },
    getMergedBranches(root: any) {
      if (!root) {
        return root;
      }

      const keysToDeleteList = [];
      for (let i = 0; i < 5; i++) {
        const branches = Array.from(root.values());
        let anyConnect = false;
        for (let j = 0; j < branches.length; j++) {
          const tokens: any = branches[j];
          const lastToken = tokens[tokens.length - 1];
          const branchInfo = this.findBranchWithFirstToken(root, branches, lastToken);
          if (branchInfo && branchInfo.key) {
            keysToDeleteList.push(branchInfo.key);
            anyConnect = true;
          }

          let additionalTokens = branchInfo ? ([...branchInfo.branch]) : [];
          if (additionalTokens.length) {
            additionalTokens = additionalTokens.slice(1);
          }

          this.isPoolOpenMap[j] = true;

          tokens.push(...additionalTokens);
        }

        if (!anyConnect) {
          // stop
          break;
        }
      }
      // while (processConnect)

      // clear map
      for (let i = 0; i < keysToDeleteList.length; i++) {
        const key = keysToDeleteList[i];
        if (root.get(key)) {
          root.delete(key);
        }
      }

      return root;
    },
    getKeyByValue(map: any, value: any) {
      for (const [key, val] of map) {
        if (val === value) {
          return key;
        }
      }
      return null; // If the value is not found in the Map
    },
    findBranchWithFirstToken(root: any, branches: any, searchToken: any) {
      for (let i = 0; i < branches.length; i++) {
        const tokens = branches[i];
        const token = tokens[0];
        if (token.symbol === searchToken.symbol) {
          const key = this.getKeyByValue(root, tokens);
          return {
            key,
            branch: tokens,
          };
        }
      }

      return null;
    },
    findBranchWithLastToken(root: any, branches: any, searchToken: any) {
      for (let i = 0; i < branches.length; i++) {
        const tokens = branches[i];
        const token = tokens[tokens.length - 1];
        if (token.symbol === searchToken.symbol) {
          const key = this.getKeyByValue(root, tokens);
          return {
            key,
            branch: tokens,
          };
        }
      }

      return null;
    },
    getUniquePools(branch: any) {
      const uniqueSet = new Set();
      for (let i = 0; i < branch.length; i++) {
        const token = branch[i];
        const stringValue = token.poolLabel;
        uniqueSet.add(stringValue);
      }
      return Array.from(uniqueSet);
    },
  },
};

</script>

<style lang="scss" scoped>
.path-wrap {
  position: relative;
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding: 40px 20px;
  max-height: 100%;

  h1 {
    font-size: 16px;
    color: var(--color-1);
    font-weight: 600;
    margin-bottom: 20px;
    text-transform: uppercase;
  }
}

.path-wrap__animation {
  display: flex;
  flex-direction: column;
  height: 100%;
  h1 {
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.path-wrap__row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  padding-right: 4px;

  span {
    color: var(--color-2);
    font-size: 14px;
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}

.path-wrap__branch-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  h2 {
    color: var(--color-2);
    font-size: 14px;
  }
}

.path-wrap__branch-row-pools {
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  span {
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}

.path-wrap__branch-row-tokens {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.path-wrap__branch-row__item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;

  img {
    width: 22px;
    height: 22px;
  }

  svg {
    margin: 0 10px;
  }
}

.path-wrap__branch-row__type {
  color: var(--color-1);
  font-weight: 600;
  margin-left: auto;
  span {
    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }
}

.path-wrap__branch-row__empty {
  margin: 0 10px;
}

.path-wrap__branch-hr {
  display: block;
  height: 1px;
  background-color: var(--color-2);
  width: 100%;
  margin: 5px 0 15px 0;
}

.path-wrap__branch-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;

  h2 {
    [data-theme="dark"] & {
      color: var(--color-18);
    }
  }
}

.path-wrap__branch-footer__info {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  min-height: 24px;
  font-size: 20px;
  font-weight: 500;
  color: var(--color-2);
  border: 1px solid var(--color-2);
  border-radius: 50%;
  margin-left: 15px;
  [data-theme="dark"] & {
    color: var(--color-4);
    border-color: var(--color-2);
  }
}

.path-wrap__loader {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.path-wrap__overflow {
  max-height: 400px;
  overflow-y: auto;
  padding-right: 4px;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 3px;
}

::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background-color: rgba(0,0,0,.5);
  -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
</style>
@/utils/tokenLogo
