import PostHog from 'posthog-react-native';

export let posthog: PostHog | undefined = undefined;

export const posthogAsync: Promise<PostHog> = PostHog.initAsync(
  'phc_aKoOjaJ000GS1jCmdQC4eMuXf33NnngU5EKn3E63kJK',
  {
    // PostHog API host (https://app.posthog.com by default)
    host: 'https://app.posthog.com',
  }
);

posthogAsync.then((client) => {
  posthog = client;
});
