export const types = [
  {
    name: 'theme',
    type: 'document',
    title: 'Theme',
    fields: [
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'source',
        title: 'Source',
        description:
          'Generate a Studio theme based on the palette of vibrant and dominant colors found within',
        type: 'image',
      },
    ],
  },
  {
    name: 'studio',
    type: 'document',
    title: 'Studio',
    preview: {
      select: {
        title: 'title',
        subtitle: 'theme.title',
        media: 'logo',
      },
    },
    fields: [
      {
        name: 'basePath',
        title: 'basePath',
        type: 'string',
        readonly: true,
      },
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'logo',
        title: 'Logo',
        description:
          'Generate a Studio theme based on the palette of vibrant and dominant colors found within',
        type: 'image',
        options: {
          hotspot: true,
        },
      },
      {
        name: 'theme',
        title: 'Theme',
        description: 'Or re-use an existing theme',
        type: 'reference',
        to: [{ type: 'theme' }],
      },
    ],
  },
]
