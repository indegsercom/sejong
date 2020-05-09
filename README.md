# sejong

# Architecture

```tsx
interface Story {
  id string
  title string
  excerpt string
  content string
  cover string
}

```

# Flow

1. /write -> create story. [id.md]
2. /write/[id] -> update title, excerpt, content

# Frontend

/story/[title] -> story.title
