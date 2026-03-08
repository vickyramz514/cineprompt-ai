# Brand Copy Usage Guide

## Import

```tsx
// Full copy object
import copy from "@/lib/brand-copy";

// Or specific sections
import { homepage, dashboard, pricing } from "@/lib/brand-copy";
```

## Usage Examples

### Homepage Hero
```tsx
import { homepage } from "@/lib/brand-copy";

<h1>{homepage.hero.headline}</h1>
<p>{homepage.hero.subheadline}</p>
<button>{homepage.hero.cta.primary}</button>
```

### Dashboard Create Form
```tsx
import { dashboard } from "@/lib/brand-copy";

<input placeholder={dashboard.create.promptPlaceholder} />
<p className="helper">{dashboard.create.promptHelper}</p>
<button>{dashboard.create.cta}</button>
```

### Dynamic Emotional Messages
```tsx
import { useEmotionalMessage } from "@/hooks/useBrandCopy";

function VideoStatus({ status }) {
  const message = useEmotionalMessage(status); // "queued" | "rendering" | "completed"
  return <p>{message}</p>;
}
```

### Toast Notifications
```tsx
import { microInteractions } from "@/lib/brand-copy";

toast.success(microInteractions.toasts.videoCompleted);
toast.error(microInteractions.errors.insufficientCredits);
```

### Empty States
```tsx
import { dashboard } from "@/lib/brand-copy";

{documents.length === 0 && (
  <EmptyState
    title={dashboard.emptyStates.noVideos.title}
    description={dashboard.emptyStates.noVideos.description}
    cta={dashboard.emptyStates.noVideos.cta}
  />
)}
```
