import posthog, { type PostHog, type Properties } from 'posthog-js';
import { debounce } from 'lodash';
import type {
  IPosthogService,
  TMintRedeemSuccessTriggerProps,
  TSwapSuccessTriggerProps,
  TZapinSuccessTriggerProps,
} from '@/types/posthog';
import POSTHOG_CONFIG from './posthogConfig.ts';

const POSTHOG_API_KEY = 'phc_3j1RLYhLiTP6PLl6KCrWBXNJQbIL3G7LSifB9JeiZZF';
const EVENT_DISPATCH_OFFSET = 10000;

class PosthogService {
  private static instance: IPosthogService;

  private posthog: PostHog;

  private constructor() {
    this.posthog = posthog.init(POSTHOG_API_KEY, POSTHOG_CONFIG)!;
  }

  public static getInstance(): IPosthogService {
    if (!PosthogService.instance) {
      PosthogService.instance = new PosthogService();
    }
    return PosthogService.instance;
  }

  private dispatchToPosthog = debounce((eventName: string, props: Properties) => this.posthog
    .capture(eventName, props), EVENT_DISPATCH_OFFSET, { leading: true, trailing: false });

  captureEvent(eventName: string, props: Properties) {
    console.log('__PosthogEventCapture', eventName, props);
    this.dispatchToPosthog(eventName, props);
  }

  swapSuccessTrigger(props: TSwapSuccessTriggerProps): void {
    this.captureEvent('Swap success event', props);
  }

  mintredeemSuccessTrigger(props: TMintRedeemSuccessTriggerProps): void {
    this.captureEvent('Mintredeem success event', props);
  }

  wrapUnwrapSuccessTrigger(props: TMintRedeemSuccessTriggerProps): void {
    this.captureEvent('WrapUnwrap success event', props);
  }

  zapinSuccessTrigger(props: TZapinSuccessTriggerProps): void {
    this.captureEvent('Zapin success event', props);
  }

  rebalanceSuccessTrigger(props: TZapinSuccessTriggerProps): void {
    this.captureEvent('Rebalance success event', props);
  }
}

export default PosthogService;
