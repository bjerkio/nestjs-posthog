import { Inject, Injectable, Logger } from '@nestjs/common';
import PostHog, { GroupKey, GroupType } from 'posthog-node';
import { POSTHOG_CLIENT, POSTHOG_MODULE_OPTIONS } from './constants';
import type {
  PosthogAliasArgs,
  PosthogCaptureArgs,
  PosthogConfig,
  PosthogGroupIdentifyArgs,
  PosthogIdentifyArgs,
} from './types';

@Injectable()
export class PosthogService {
  private readonly logger = new Logger(PosthogService.name);
  constructor(
    @Inject(POSTHOG_MODULE_OPTIONS) private readonly config: PosthogConfig,
    @Inject(POSTHOG_CLIENT) private readonly client: PostHog,
  ) {}

  /**
   * Capture allows you to capture anything a user does within your system,
   * which you can later use in PostHog to find patterns in usage,
   * work out which features to improve or where people are giving up.
   */
  capture(args: PosthogCaptureArgs): void {
    this.logger.debug(args, 'received Posthog capture event');
    if (!this.config.mock) {
      return this.client.capture(args);
    }
  }

  /**
   * To marry up whatever a user does before they sign up or log in with what they do after you need to make an alias call.
   * This will allow you to answer questions like "Which marketing channels leads to users churning after a month?"
   * or "What do users do on our website before signing up?"
   * In a purely back-end implementation, this means whenever an anonymous user does something, you'll want to send a session ID with the capture call.
   * Then, when that users signs up, you want to do an alias call with the session ID and the newly created user ID.
   * The same concept applies for when a user logs in. If you're using PostHog in the front-end and back-end,
   *  doing the identify call in the frontend will be enough.:
   */
  alias(args: PosthogAliasArgs): void {
    this.logger.debug(args, 'ran Posthog alias method');
    if (!this.config.mock) {
      return this.client.alias(args);
    }
  }

  /**
   * Identify lets you add metadata on your users so you can more easily identify who they are in PostHog,
   * and even do things like segment users by these properties.
   */
  identify(args: PosthogIdentifyArgs) {
    this.logger.debug(args, 'ran Posthog identify method');
    if (!this.config.mock) {
      return this.client.identify(args);
    }
  }

  /**
   * Sets a groups properties, which allows asking questions like "Who are the most active companies"
   * using my product in PostHog.
   */
  groupIdentify(args: PosthogGroupIdentifyArgs) {
    this.logger.debug(args, 'ran Posthog groupIdentify method');
    if (!this.config.mock) {
      return this.client.groupIdentify(args);
    }
  }

  /**
   * PostHog feature flags (https://posthog.com/docs/features/feature-flags)
   * allow you to safely deploy and roll back new features. Once you've created
   * a feature flag in PostHog, you can use this method to check if the flag is
   * on for a given user, allowing you to create logic to turn features on and
   * off for different user groups or individual users.
   *
   * IMPORTANT: To use this method, you need to specify `personalApiKey`
   * in your config!
   *
   * More info: https://posthog.com/docs/api/overview
   *
   * @param key the unique key of your feature flag
   * @param distinctId the current unique id
   * @param defaultResult optional - default value to be returned if the feature flag is not on for the user
   * @param groups optional - what groups are currently active (group analytics)
   * @returns whether feature is enabled or not
   */
  async isFeatureEnabled(
    key: string,
    distinctId: string,
    defaultResult?: boolean,
    groups?: Record<GroupType, GroupKey>,
  ): Promise<boolean> {
    this.logger.debug(
      { key, distinctId, defaultResult, groups },
      'ran Posthog isFeatureEnabled method',
    );
    if (this.config.mock) {
      return true;
    }

    return this.client.isFeatureEnabled(key, distinctId, defaultResult, groups);
  }

  reloadFeatureFlags() {
    this.logger.debug('ran Posthog reloadFeatureFlags method');
    if (!this.config.mock) {
      return this.client.reloadFeatureFlags();
    }
  }

  /**
   * Flushes the events still in the queue and clears the feature flags poller to allow for
   * a clean shutdown.
   */
  shutdown() {
    this.logger.debug('ran Posthog shutdown method');
    if (!this.config.mock) {
      return this.client.shutdown();
    }
  }
}
