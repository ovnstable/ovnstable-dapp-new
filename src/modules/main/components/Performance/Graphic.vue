<template>
  <div class="performance__graphics-buttons-interval">
    <button
      type="button"
      class="performance__graphics-button-interval"
    >1D</button>
    <button
      type="button"
      class="performance__graphics-button-interval"
    >1W</button>
    <button
      type="button"
      class="performance__graphics-button-interval"
    >1M</button>
    <button
      type="button"
      class="performance__graphics-button-interval"
    >3M</button>
    <button
      type="button"
      class="performance__graphics-button-interval"
    >6M</button>
    <button
      type="button"
      class="performance__graphics-button-interval"
    >1Y</button>
    <button
      type="button"
      class="performance__graphics-button-interval"
    >ALL</button>
  </div>
  <div class="performance__graphic">
    <div class="performance__graphic-data">
      <p class="performance__graphic-title">Average ETH+ APY</p>
      <div class="performance__graphic-data-text">
        <p class="performance__graphic-value">13.5%</p>
        <p class="performance__graphic-date">from ХХ ХХ. ‘23</p>
      </div>
    </div>
    <div class="performance__graphic-display">
      <p>Graphic</p>
    </div>
  </div>
</template>

<script lang="ts">

export default {
  name: 'GraphicComponent',
};
</script>

<style scoped>
.performance__graphic{
    display: flex;
    flex-direction: column;
    padding: 22px 39px;
    justify-content: space-between;
    align-items: flex-start;
    flex-shrink: 0;
    border-radius: 5px;
    border: 1px solid var(--color-black);
    margin-top: 5px;
}

.performance__graphic-data {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
.performance__graphic-data-text {
    margin-left: 167px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}
.performance__graphics-buttons-interval > * {
    color: var(--color-black);
    font-size: 12px;
    font-weight: 600;
    border: none;
    background-color: transparent;
    transition: color 0.3s ease;
}

.performance__graphics-buttons-interval > *:hover {
    cursor: pointer;
    color: var(--color-dark-grey);
}

.performance__graphics-buttons-interval > *:not(:last-child) {
    /* TODO fix this according to future figma file */
    margin-right: 5px;
}

.performance__graphic-title {
    color: var(--color-black);
    font-size: 15px;
    font-weight: 600;
}

.performance__graphic-value {
    color: var(--color-black);
    font-size: 20px;
    font-weight: 600;
}

.performance__graphic-date {
    color: var(--color-black);
    font-size: 12px;
    font-weight: 500;
}

@media (max-width: 768px) {
    .performance__graphic-value {
        font-size: 16px;
    }
    .performance__graphic-title {
        font-size: 12px;
    }
    .performance__graphics-buttons-interval > * {
        font-size: 10px;
    }
    .performance__graphic-date {
         font-size: 10px;
    }
    .performance__graphic{
        padding: 15px 30px;
    }
}
@media (max-width: 576px) {
    .performance__graphic-value {
        font-size: 14px;
    }
    .performance__graphic-title {
        font-size: 10px;
    }
    .performance__graphics-buttons-interval > * {
        font-size: 8px;
    }
    .performance__graphic-date {
         font-size: 8px;
    }
    .performance__graphic{
        padding: 10px 20px;
    }
}
</style>
