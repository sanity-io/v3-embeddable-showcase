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
    name: 'workspace',
    type: 'document',
    title: 'Workspace',
    preview: {
      select: {
        title: 'title',
        subtitle: 'theme.title',
        media: 'logo',
      },
    },
    fields: [
      // The name is used to identify the Studio
      /*  {
        name: 'name',
        title: 'Name',
        type: 'string',
        readOnly: true,
        hidden: true,
      },
      // Based on `type WorkspaceOptions from sanity`
      {
        name: 'basePath',
        title: 'basePath',
        type: 'string',
        readOnly: true,
        hidden: true,
      }, */
      {
        name: 'title',
        title: 'Title',
        type: 'string',
      },
      {
        name: 'description',
        title: 'Description',
        type: 'string',
      },
      /* {
        name: 'subtitle',
        title: 'subtitle',
        type: 'string',
        readOnly: true,
      }, */
      /*
      navbar?: {
        components?: {
          ToolMenu: React.ComponentType<ToolMenuProps>
        }
      }
      // */
      {
        name: 'theme',
        title: 'Theme',
        description:
          'Customize the look of your Sanity Studio . . . from the comfort of a Sanity Studio',
        type: 'reference',
        to: [{ type: 'theme' }],
      },
      // unstable_sources?: SourceOptions[]

      //projectId: string
      //dataset: string
      //auth?: AuthStore

      /**
       * @alpha
       */
      //unstable_clientFactory?: (options: SanityClientConfig) => SanityClient

      // plugins?: PluginOptions[]
      // schema?: SchemaPluginOptions
      // TODO:
      // components?: ComponentPluginOptions
      // document?: DocumentPluginOptions
      // tools?: Tool[] | ComposableOption<Tool[], ConfigContext>
      // form?: SanityFormConfig
    ],
  },
]
