<template>
  <nav :class="classObject">
    <div
      v-show="pagesCount > 1"
      class="pagination-left"
    >
      <div
        v-if="pagesCount > 5"
        :class="{ disabled: page === 1 }"
        class="pagination-item prev"
        @keypress="$emit('changePage', page - 1)"
        @click.prevent="$emit('changePage', page - 1)"
      />

      <div
        v-for="(pageItem, pageIndex) in paginationItems"
        :key="`${pageItem}-${pageIndex}`"
        :class="{ active: pageItem === page, disabled: pageItem === '...' }"
        class="pagination-item"
        @click="$emit('changePage', pageItem)"
        @keypress="$emit('changePage', pageItem)"
        v-text="pageItem"
      />

      <div
        :class="{ disabled: page + 1 > pagesCount }"
        class="pagination-item next"
        @click.prevent="$emit('changePage', page + 1)"
        @keypress="$emit('changePage', page + 1)"
      />
    </div>

    <div
      v-if="compactCount && !hideCount"
      class="pagination-center"
    >
      {{ itemsShownFrom }}-{{ itemsShownTo }} из {{ total }}
    </div>

    <div
      v-else-if="hideCount"
      class="pagination-center"
    />

    <div
      v-else
      class="pagination-center"
    >
      Showing {{ itemsShownFrom }}
      - {{ itemsShownTo }}
      of {{ total }} results
    </div>

    <div
      v-if="!hidePerPage"
      class="pagination-right"
    >
      <span>Rows: </span>
      <select-component
        :value="perPage"
        :list="perPageOptions"
        :clearable="false"
        select-styles="transparent"
        small
        default-pos-top
        @change="changePerPage"
      />
    </div>
  </nav>
</template>

<script>
import SelectComponent from '@/components/Select/Index.vue';

export default {
  name: 'PaginationComponent',
  components: {
    SelectComponent,
  },
  props: {
    page: {
      type: Number,
      default: 1,
    },
    total: {
      type: Number,
      default: null,
    },
    perPage: {
      type: Number,
      default: 10,
    },
    perPageOptions: {
      type: Array,
      default: () => [
        10,
        25,
        50,
        100,
      ],
    },
    hidePerPage: {
      type: Boolean,
      default: false,
    },
    compactCount: {
      type: Boolean,
      default: false,
    },
    hideCount: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['changePage', 'changePerPage'],

  computed: {
    classObject() {
      return [
        this.$options.name,
        { small: this.small },
      ];
    },

    pagesCount() {
      return Math.ceil(this.total / this.perPage, 10);
    },

    paginationItems() {
      const current = this.page;
      const total = this.pagesCount;
      const delta = 4;
      const limit = 9;
      let left = current - delta;
      let right = current + delta + 1;

      // Если выбраны страницы от 1 до 5
      if (total > limit && limit - current >= 4) {
        right = limit + 1;
        left = limit - current - delta - 3;
      }

      // Если выбраны страницы от total-4 до total
      if (total > limit && total - current <= 4) {
        right = current + (total - current) + 1;
        left = current - limit + (total - current) + 1;
      }

      // if total < limit
      let result = Array.from({
        length: total,
      }, ((v, index) => index + 1));

      // otherwise use delta
      if (total > limit) {
        result = Array.from({
          length: total,
        }, ((v, index) => index + 1))
          .filter((_) => _ && _ >= left && _ < right);
      }

      // Если доступно более одной страницы
      if (result.length > 1) {
        if (result[0] > 1) {
          if (result[1] > 2) {
            result[1] = '...';
          }
          result[0] = 1;
        }

        if (result[result.length - 1] < total) {
          if (result[result.length - 2] !== total - 1) {
            result[result.length - 2] = '...';
          }
          result[result.length - 1] = total;
        }
      }

      return result;
    },

    itemsShownFrom() {
      if (!this.total) return 0;

      return (this.page - 1) * this.perPage + 1;
    },

    itemsShownTo() {
      if (this.total < this.perPage) return this.total;
      if (this.total < this.page * this.perPage) return this.total;

      return this.page * this.perPage;
    },
  },

  methods: {
    changePerPage(num) {
      this.$emit('changePerPage', num);
    },
  },
};
</script>

<style lang="scss" scoped>
$pagination-background-active: #edf1f7;
$pagination-text: #555a63;

.PaginationComponent {
  display: flex;
  align-items: center;
}

.pagination-left {
  display: flex;
  align-items: center;
  margin-right: auto;
  padding-right: 4px;
}

.pagination-item {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 32px;
  padding: 4px;
  background-color: white;
  transition: background-color 0.25s;
  font-size: 15px;
  color: $pagination-text;
  cursor: pointer;
  min-width: 32px;

  &.active {
    font-weight: 500;
    color: var(--color-4);
    background-color: var(--color-3);
    cursor: default;
    pointer-events: none;
  }

  &.disabled {
    pointer-events: none;
  }

  &:hover {
    background-color:  var(--color-4);
    color:  var(--color-3);
  }

  &.next,
  &.prev{
    position: relative;

    &:before {
      position: absolute;
      background-color: #000;
      content: "";
    }

    &:hover::before {
      background-color: var(--color-3);
    }

    &.disabled::before {
      background-color: #aaa;
    }
  }

  &.next,
  &.prev {
    &:before {
      width: 6px;
      height: 10px;
      -webkit-mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNi42NzkiIGhlaWdodD0iMjgiPjxwYXRoIGQ9Ik0xNi4zNzEgMTQuNzQ0TDMuNTI4IDI3LjY5MmExLjA1MSAxLjA1MSAwIDAxLTEuNDg3IDBMLjMwOSAyNS45NmExLjA1MSAxLjA1MSAwIDAxMC0xLjQ4N0wxMC42NzUgMTQgLjMwOCAzLjUyOGExLjA1MSAxLjA1MSAwIDAxMC0xLjQ4N0wyLjA0LjMwOWExLjA1MSAxLjA1MSAwIDAxMS40ODcgMGwxMi44NDQgMTIuOTQ3YTEuMDUxIDEuMDUxIDAgMDEwIDEuNDg4eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==") no-repeat 0 0 / 100% 100%;
      mask: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNi42NzkiIGhlaWdodD0iMjgiPjxwYXRoIGQ9Ik0xNi4zNzEgMTQuNzQ0TDMuNTI4IDI3LjY5MmExLjA1MSAxLjA1MSAwIDAxLTEuNDg3IDBMLjMwOSAyNS45NmExLjA1MSAxLjA1MSAwIDAxMC0xLjQ4N0wxMC42NzUgMTQgLjMwOCAzLjUyOGExLjA1MSAxLjA1MSAwIDAxMC0xLjQ4N0wyLjA0LjMwOWExLjA1MSAxLjA1MSAwIDAxMS40ODcgMGwxMi44NDQgMTIuOTQ3YTEuMDUxIDEuMDUxIDAgMDEwIDEuNDg4eiIgZmlsbD0iI2ZmZiIvPjwvc3ZnPg==") no-repeat 0 0 / 100% 100%;
    }
  }

  &.prev {
    &:before {
      transform: rotate(180deg);
    }
  }
}

.pagination-center {
  line-height: 16px;
  // margin: 0 auto;
  font-size: 15px;
  font-weight: 500;
}

.pagination-right {
  display: inline-flex;
  align-items: center;
  margin-left: auto;
  padding-left: 4px;

  span {
    line-height: 16px;
    font-size: 15px;
    font-weight: 500;
    margin-right: 10px;
  }
}

// Small
.pagination.small {
  .pagination-item {
    height: 24px;
    padding: 4px;
    min-width: 24px;
  }
}
</style>
