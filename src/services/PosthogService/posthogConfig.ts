import type { PostHogConfig } from 'posthog-js';

const POSTHOG_CONFIG: Partial<PostHogConfig> = {
  api_host: 'https://eu.i.posthog.com',
  capture_pageview: true,
  autocapture: false,
  person_profiles: 'always',
};

export default POSTHOG_CONFIG;
