<p align="center">
    <img src="./.github/logo.svg" alt="Logo" width="150px">
</p>

<p align="center">
    <h3 align="center">nestjs-posthog</h3>
</p>

<p align="center">
    Lightweight library to use Posthog in NestJS applications.
    <br />
    <br />
    <a href="#space_invader--usage">Quick Start Guide</a>
    ·
    <a href="https://github.com/bjerkio/nestjs-posthog/issues">Request Feature</a>
    ·
    <a href="https://github.com/bjerkio/nestjs-posthog/issues">Report Bug</a>
  </p>
</p>

---

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)
![Release](https://github.com/bjerkio/nestjs-posthog/workflows/Release/badge.svg)

[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/bjerkio/nestjs-posthog.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/bjerkio/nestjs-posthog/context:javascript)
[![codecov](https://codecov.io/gh/bjerkio/nestjs-posthog/branch/main/graph/badge.svg)](https://codecov.io/gh/bjerkio/nestjs-posthog)

**Posthog for Nestjs** makes it easier to implement analytics with [Posthog][]
into your Nestjs application.

[nestjs]: https://github.com/nestjs/nest
[posthog]: https://posthog.com/

### :space_invader: &nbsp; Usage

```shell
▶ yarn add nestjs-posthog
```

```typescript
import { Module } from '@nestjs/common';
import { PosthogModule } from 'nestjs-posthog';

@Module({
  imports: [
    PosthogModule.forRoot({
      apiKey: '<ph_project_api_key>',
      options: {
        host: '<ph_instance_address>',
      },
    }),
  ],
})
export class AppModule {}
```

### Example

You can easily inject `PosthogService` to be used in your services, controllers,
etc.

```typescript
import { Injectable } from '@nestjs/common';
import { PosthogService } from 'nestjs-posthog';

@Injectable()
export class AuthService {
  constructor(private service: PosthogService) {}

  helloWorldMethod() {
    this.service.capture({
      distinctId: 'distinct id',
      event: 'movie played',
      properties: {
        movieId: '123',
        category: 'romcom',
      },
    });
    return 'hello world';
  }
}
```

Read more about the methods in [Posthogs Node.js client
documentation][posthog-node].

[posthog-node]: https://posthog.com/docs/integrate/server/node

## Contribute & Disclaimer

We love to get help 🙏 Read more about how to get started in
[CONTRIBUTING](CONTRIBUTING.md) 🌳
