/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { ComponentCustomProperties } from 'vue';
import { Store } from 'vuex';

declare module '@vue/runtime-core' {
  // Declare your own store states.
  interface State {
    count: number
  }

  interface ComponentCustomProperties {
    // eslint-disable-next-line no-undef
    $store: Store<T>
  }
}

declare module 'dayjs' {
  interface Dayjs {
      duration(val: string): any;
  }
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

declare module '*.svg' {
  import type { DefineComponent } from 'vue';

  const component: DefineComponent;
  export default component;
}
