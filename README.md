# TODO

Docs are coming.

## Demos

### Studio mounted under a NextJS route

Setup as a ` pages/studio/[[...tool]].tsx`` route in Next. It's loaded by giving  `<Studio/>`the same code as you have in`sanity.config.ts` as a prop:

```tsx
import {Studio} from 'sanity'

export default function StudioRoute() {
  return <Studio config={...} />
}
```

[/studio](https://v3-embeddable-showcase.sanity.build/studio)
