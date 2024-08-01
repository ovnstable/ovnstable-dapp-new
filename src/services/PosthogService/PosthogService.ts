import posthog, { type PostHog, type Properties } from 'posthog-js';
import { debounce } from 'lodash';
import type {
  IPosthogService,
  TIdentyfyByWalletTriggerProps,
  TLinkWalletTriggerProps,
  TMintRedeemSuccessTriggerProps,
  TSwapSuccessTriggerProps,
  TZapinSuccessTriggerProps,
} from '@/types/posthog';
import POSTHOG_CONFIG from './posthogConfig.ts';

const { POSTHOG_API_KEY } = process.env;
const EVENT_DISPATCH_OFFSET = 5000;

class PosthogService {
  private static instance: IPosthogService;

  private posthog: PostHog;

  private constructor() {
    this.posthog = posthog.init(POSTHOG_API_KEY!, POSTHOG_CONFIG)!;
  }

  public static getInstance(): IPosthogService {
    if (!PosthogService.instance) {
      PosthogService.instance = new PosthogService();
    }
    return PosthogService.instance;
  }

  private dispatchToPosthog = debounce((eventName: string, props: Properties) => this.posthog
    .capture(eventName, props), EVENT_DISPATCH_OFFSET, { leading: true, trailing: false });

  private identifyUser = (address: string) => this.posthog.identify(address);

  private linkWallets = (address0: string, address1: string) => this.posthog
    .alias(address0, address1);

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

  identyfyByWalletTrigger({ address }: TIdentyfyByWalletTriggerProps): void {
    this.identifyUser(address);
  }

  linkWalletsTrigger({ address0, address1 }: TLinkWalletTriggerProps): void {
    this.linkWallets(address0, address1);
  }
}

export default PosthogService;
