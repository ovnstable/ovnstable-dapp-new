<template>
  <div>
    <div class="pools-table">
      <div class="pools-header">
        <div class="pools-header__item">Place</div>
        <div class="pools-header__item">Address</div>
        <div class="pools-header__item">Blast Points</div>
        <div class="pools-header__item">Blast Gold</div>
        <div class="pools-header__item">Amount of Jackpot, %</div>
      </div>

      <div class="pools-table__content">
        <template v-if="users.length > 0">
          <div
            v-for="(user, key) in (users as any)"
            :key="key"
            class="pools-table__row"
          >
            <div>
              {{ key + 1 }}
            </div>
            <div>
              {{ user.address }}
            </div>
            <div>
              {{ user.claimed }}
            </div>
            <div>
              {{ user.claimedGolds }}
            </div>
            <div>
              {{ user.jackpotShare }} %
            </div>
          </div>
        </template>
        <div
          v-else
          class="pools-table__empty"
        >
          users not found
        </div>
      </div>
    </div>
  </div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts">

export default {
  name: 'DashboardTable',
  props: {
    users: {
      type: Array,
      required: true,
    },
    jackpot: {
      type: String,
      required: false,
      default: '0',
    },
  },
};
</script>

<style lang="scss" scoped>
.pools-table {
  position: relative;
  width: 100%;
  background-color: var(--color-8);
  color: var(--color-1);
  font-weight: 500;
  font-size: 14px;
  border-radius: 30px;
  margin-bottom: 50px;
  [data-theme="dark"] & {
    background-color: var(--color-19);
  }
}

.card-label {
  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.pools-table__content {
  padding: 20px;
}
.pools-table__row,
.pools-table__new {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
  justify-content: space-between;
  width: 100%;
  padding: 15px 0;
  border-bottom: 1px solid var(--color-17);
  button {
    border-radius: 30px;
  }

  @media (max-width: 1024px) {
    button {
      border-radius: 16px;
      white-space: nowrap;
    }
  }

  [data-theme="dark"] & {
    border-bottom-color: var(--color-7);
  }
}
.pools-table__new {
  border-bottom: 1px solid var(--color-2);
  margin-bottom: 10px;
  [data-theme="dark"] & {
    border-color: var(--color-18);
  }
}

.pools-header {
  display: grid;
  grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
  width: 100%;
  color: var(--color-2);
  margin-top: 20px;
  padding: 0 20px;
  padding-top: 15px;
  overflow-y: hidden;
  [data-theme="dark"] & {
    background-color: none;
    color: var(--color-18);
  }
}

.pools-header__item {
  font-size: 15px;

  &:nth-child(2) {
    padding-left: 10px;
  }
}

.pools-filters {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 20px 0;
}

.pools-table__chain {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 30px;
  min-height: 30px;
  height: 30px;
  width: 30px;
  border-radius: 50%;
  padding: 4px;
  background-color: var(--color-4);
  border: 1px solid var(--color-17);
  [data-theme="dark"] & {
    background-color: var(--color-17);
    border-color: var(--color-2);
  }

  svg {
    width: 80%;
    height: 80%;
  }
}

.pools-table__tokens-wrap {
  position: relative;
  width: fit-content;
}

.pools-table__tokens {
  position: relative;
  display: flex;
  align-items: center;
  width: fit-content;
  border-radius: 30px;
  [data-theme="dark"] & {
    border: none;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid var(--color-17);
    background-color: var(--color-4);
    padding: 5px;
    border-radius: 10px;
    [data-theme="dark"] & {
      background: none;
    }
  }
}

.pools-table__tokens-item {
  position: relative;
  display: flex;
  align-items: center;
  padding: 2px 30px 2px 9px;
  border: 1px solid var(--color-17);
  background-color: var(--color-4);
  border-radius: 30px;
  right: 26px;
  [data-theme="dark"] & {
    border-color: var(--color-2);
    background-color: var(--color-17);
    color: var(--color-4);
  }

  &:first-child {
    right: 0;
  }

  &:last-child {
    padding: 2px 9px;
  }

  &:nth-child(3) {
    right: 52px;

    span {
      display: none;
    }
  }

  img {
    width: 24px;
    height: 24px;
    margin-right: 5px;
    border-radius: 50%;
  }

  @media (max-width: 1024px) {
    right: 0;
    border: unset;
    background-color: unset;
    padding: 2px 9px;

    &:nth-child(3) {
      right: unset;

      span {
        display: block;
      }
    }
  }

  @media (max-width: 1024px) {
    right: 0;
    border: unset;
    background-color: unset;
    padding: 2px 9px;
  }
}

.pools-table__platform-row {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-right: 10px;
}

.pools-table__platform {
  width: fit-content;
  display: flex;
  align-items: center;
  cursor: pointer;

  span {
    transition: .2s ease color;

    [data-theme="dark"] & {
      color: var(--color-4);
    }
  }

  &:hover {
    span {
      color: var(--color-3);
    }
    .button-link {
      transform: translate(3px, -3px);
    }
  }
}

.pools-table__platform-icon {
  width: 24px;
  height: 24px;
  margin-right: 8px;
}

.pools-table__tvl {
  display: flex;
  align-items: center;
}

.pools-table__apy {
  display: flex;
  align-items: center;

  sup {
    position: relative;
    font-size: 10px;
    top: -10px;
  }

  .card-label {
    display: flex;
  }
}

.pools-table__empty {
  min-height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  text-transform: uppercase;
  [data-theme="dark"] & {
    color: var(--color-18);
  }
}

.pools-table__footer {
  padding: 0 20px 20px 20px;
}

.button-link {
  position: relative;
  top: -10px;
  box-shadow: none;
  align-items: center;
  border-radius: 10px;
  padding: 0 4px;
  transition: .2s ease transform;

  svg {
    fill: var(--color-2);
    width: 8px;
    height: 8px;
    overflow: visible;
  }

  [data-theme="dark"] & {
    svg {
      fill: var(--color-4)
    }
  }
}

.pools-table__tag,
.pools-table__tag-token-3 {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 10px;
  height: 19px;
  padding: 0 4px;
  border: 1px solid var(--color-6);
  background-color: var(--color-4);

  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.pools-table--new {
  color: var(--color-12);
  animation: pulse-animation-green 3s infinite;

  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.pools-table--hot {
  color: var(--color-10);
  animation: pulse-animation-red 3s infinite;

  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.pools-table--promo {
  color: var(--color-3);
  animation: pulse-animation-blue 3s infinite;

  [data-theme="dark"] & {
    color: var(--color-4);
  }
}

.pools-table__tag {
  top: -12px;
  right: -25px;
}
.pools-table__tag-token-3  {
  top: -12px;
  right: -25px;
}
.pools-header__item--hover {
  transition: transform .2s ease, color .2s ease;
  cursor: pointer;

  &:hover {
    color: var(--color-3);
  }
}
@media (max-width: 1320px) {
  .pools-table {
    overflow: hidden;
    overflow-x: auto
  }

  .pools-table__footer {
    position: sticky;
    min-width: auto;
    left: 0;
    padding-bottom: 30px;
  }
  .pools-header,
  .pools-table__content {
    min-width: 100%;
    overflow-x: scroll;
  }
}
@media (max-width: 1024px) {
  .pools-table__tag,
  .pools-table__tag-token-3 {
    top: -36px;
    right: -35px;
  }
}
@media (max-width: 1000px) {
  .pools-table {
    overflow: hidden;
    overflow-x: auto
  }

  .pools-table__footer {
    position: sticky;
    min-width: auto;
      left: 0;
    padding-bottom: 30px;
  }
  .pools-header,
  .pools-table__content {
    min-width: 1000px;
    overflow-x: scroll;
  }
}
@media (max-width: 640px) {
  .pools-table {
    overflow: hidden;
    overflow-x: auto
  }

  .pools-table__footer {
    position: sticky;
    left: 0;
    padding-bottom: 30px;
  }
  .pools-header,
  .pools-table__content {
    min-width: 750px;
    overflow-x: scroll;
  }
  .pools-table__platform-row {
    flex-wrap: wrap;
  }
  .pools-header__item {
    font-size: 12px;
  }
  .pools-table__row {
    grid-template-columns: 1fr 3fr 1fr 1fr 1fr;
    button {
      font-size: 14px;
    }
  }
  .pools-table__tag {
    top: -40px;
    right: -31px;
  }
  .pools-table__tag-token-3  {
    top: -60px;
    right: -36px;
  }
}

</style>
