<template>
  <div class="performance__graphics">
    <div class="performance__graphics-APY-graphic">
      <div class="performance__graphics-time-interval">
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
    </div>
    <div class="performance__graphics-TVL-graphic">
      <div class="performance__graphics-time-interval">
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
    </div>
  </div>
</template>
<script lang="ts">

export default {
  name: 'GraphicsPerformance',
};
</script>

<style scoped>
  .performance__graphics {
  display: flex;
  flex-direction: row;
  justify-content: space-between; /* Updated this line */
  align-items: center; /* This ensures that the items are aligned vertically in the center */
  border-radius: 20px;
  border: 1px solid var(--color-black);
  background: var(--color-white);
  box-shadow: 0px 1px 0px 0px var(--color-black);
  padding: 14px 20px;
  width: 100%; /* This will make sure the container takes the full width */
  box-sizing: border-box; /* Includes padding and border in the width */
}

</style>
