<template>
  <table class="tg">
    <thead>
      <tr>
        <th
          v-for="item in arrayList"
          :key="item"
          class="tg-cly1"
        >
          <div
            key="item"
            class="line"
          />
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="item in arrayList"
        :key="item"
      >
        <td
          v-for="item in arrayList"
          :key="item"
          class="tg-cly1"
        >
          <div
            key="item"
            class="line"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
export default {
  name: 'TableSkeleton',
  computed: {
    arrayList(): number[] {
      return Array.from({ length: 8 }).map((_, key) => key);
    },
  },
};
</script>

<style lang="scss">
// forked from https://codepen.io/viktorstrate/pen/yoBRLy

$base-color: var(--color-5);
$shine-color: var(--color-4);
$animation-duration: 2.0s;
$avatar-offset: 52 + 16;

@mixin background-gradient {
  background-image: linear-gradient(90deg, $base-color 0px, $shine-color 40px, $base-color 80px);
  background-size: 600px;
}

.tg{
  width: 100%;
  border-collapse:collapse;
  border-spacing:0;
  border-color: var(--color-3);

  thead {
    th:first-child {
      border-radius: 30px 0 0 0;
    }
    th:last-child {
      border-radius: 0 30px 0 0;
    }
  }

  tbody {
    tr:last-child {
      td:first-child {
        border-radius: 0 0 0 30px;
      }
      td:last-child {
        border-radius: 0 0 30px 0;
      }
    }
  }
}
.tg td{
  font-size:14px;
  padding:10px 5px;
  border-style:solid;
  border-width:0px;
  overflow:hidden;
  word-break:normal;
  border-color:#ccc;
  color:#333;
  background-color: var(--color-8);
  [data-theme="dark"] & {
    background-color: var(--color-6);
  }

  div {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
}
.tg th{
  font-family:Arial, sans-serif;
  font-size:14px;
  font-weight:normal;
  padding:10px 5px;
  border-style:solid;
  border-width:0px;
  overflow:hidden;
  word-break:normal;
  border-color:#ccc;
  color:#333;
  background-color: #f0f0f0;

  div {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }
  [data-theme="dark"] & {
    background-color: var(--color-17);
  }
}

.line{
    float: left;
    width: 100px;
    height: 16px;
    margin-top: 12px;
    border-radius: 7px;

    @include background-gradient;
    animation: shine-lines $animation-duration infinite ease-out;
}

@keyframes shine-lines{
    0% { background-position: -100px;}
    40%, 100% {background-position: 140px;}
}

</style>
