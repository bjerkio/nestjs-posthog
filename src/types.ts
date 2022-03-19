import { ModuleMetadata, Type } from '@nestjs/common';
import {
  EventMessage,
  GroupIdentifyMessage,
  GroupKey,
  GroupType,
  IdentifyMessage,
  Option,
} from 'posthog-node';

export interface PosthogConfig {
  apiKey: string;

  options?: Option;

  /**
   * When mock is used, none of the events
   * are captured, only dumped to console.
   *
   * Useful for local development.
   *
   * @default false
   */
  mock: boolean;
}

export interface PosthogSyncConfig {
  // If true, registers `PosthogModule` as a global module.
  isGlobal?: boolean;
}

export interface PosthogAsyncConfig extends Pick<ModuleMetadata, 'imports'> {
  useClass?: Type<PosthogConfigFactory>;
  useFactory?: (...args: any[]) => Promise<PosthogConfig> | PosthogConfig;
  inject?: any[];
  useExisting?: Type<PosthogConfigFactory>;

  // If true, registers `PosthogModule` as a global module.
  isGlobal?: boolean;
}

export interface PosthogConfigFactory {
  posthogConfigModuleOptions(): Promise<PosthogConfig> | PosthogConfig;
}

export interface PosthogCaptureArgs extends EventMessage {
  /**
   * Uniquely identifies your user
   */
  distinctId: string;
  /**
   * which can be a object with any information you'd like to add
   */
  properties?: Record<string | number, any>;
  /**
   * We recommend using [verb] [noun], like movie played or movie
   * updated to easily identify what your events mean later on.
   */
  event: string;
  /**
   * object of what groups are related to this event, example:
   * { company: 'id:5' }. Can be used to analyze companies
   * instead of users.
   */
  groups?: Record<string, string | number>;
}

export interface PosthogIdentifyArgs extends IdentifyMessage {
  /**
   * Uniquely identifies your user
   */
  distinctId: string;

  /**
   * which can be a object with any information you'd like to add
   */
  properties?: Record<string | number, any>;
}

export interface PosthogAliasArgs {
  /**
   * The current unique id
   */
  distinctId: string;

  /**
   * the unique ID of the user before
   */
  alias: string;
}

export interface PosthogGroupIdentifyArgs extends GroupIdentifyMessage {
  /**
   * Type of group (ex: 'company'). Limited to 5 per project
   */
  groupType: GroupType;
  /**
   * Unique identifier for that type of group (ex: 'id:5')
   */
  groupKey: GroupKey; // Unique identifier for the group
  /**
   * Which can be a object with any information you'd like to add
   */
  properties?: Record<string | number, any>;
}
