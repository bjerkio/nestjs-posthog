import { DynamicModule, Module, Provider } from '@nestjs/common';
import PostHog from 'posthog-node';
import {
  POSTHOG_CLIENT,
  POSTHOG_MODULE_OPTIONS,
  POSTHOG_MODULE_USER_OPTIONS,
} from './constants';
import { PosthogService } from './posthog.service';
import {
  PosthogAsyncConfig,
  PosthogConfig,
  PosthogConfigFactory,
  PosthogSyncConfig,
} from './types';
import { invariant } from './utils';

@Module({
  providers: [PosthogService],
  exports: [PosthogService],
})
export class PosthogModule {
  static forRoot(opts: Partial<PosthogSyncConfig> = {}): DynamicModule {
    const providers = [
      {
        provide: POSTHOG_MODULE_USER_OPTIONS,
        useValue: opts,
      },
      this.createAsyncConfig(),
      this.createAsyncClient(),
    ];
    return {
      global: opts.isGlobal,
      module: PosthogModule,
      providers,
      exports: providers,
    };
  }

  static forRootAsync(opts: PosthogAsyncConfig): DynamicModule {
    const providers = [
      this.createAsyncOptionsProvider(opts),
      this.createAsyncConfig(),
      this.createAsyncClient(),
    ];
    return {
      global: opts.isGlobal,
      module: PosthogModule,
      imports: opts.imports,
      providers,
      exports: providers,
    };
  }

  private static createAsyncOptionsProvider(
    opts: PosthogAsyncConfig,
  ): Provider {
    if (opts.useFactory) {
      return {
        provide: POSTHOG_MODULE_USER_OPTIONS,
        useFactory: opts.useFactory,
        inject: opts.inject || [],
      };
    }
    invariant(opts.useClass);
    return {
      provide: POSTHOG_MODULE_USER_OPTIONS,
      useFactory: async (
        optionsFactory: PosthogConfigFactory,
      ): Promise<PosthogConfig> => optionsFactory.posthogConfigModuleOptions(),
      inject: [opts.useClass],
    };
  }

  private static createAsyncConfig(): Provider {
    return {
      provide: POSTHOG_CLIENT,
      inject: [POSTHOG_MODULE_USER_OPTIONS],
      useFactory: async (opts: PosthogConfig) => {
        return {
          type: 'stdout',
          output: /* istanbul ignore next */ (out: unknown) =>
            process.stdout.write(`${JSON.stringify(out)}\n`),
          ...opts,
        };
      },
    };
  }

  private static createAsyncClient(): Provider {
    return {
      provide: POSTHOG_CLIENT,
      inject: [POSTHOG_MODULE_OPTIONS],
      useFactory: async (config: PosthogConfig) => {
        return new PostHog(config.apiKey, config.options);
      },
    };
  }
}
