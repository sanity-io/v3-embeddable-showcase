import { Card, Code, Grid, ThemeProvider, Box } from '@sanity/ui'

import { ControlsIcon, MasterDetailIcon } from '@sanity/icons'
import { useMemo } from 'react'
import {
  type Config,
  createConfig,
  Studio,
  type StudioProviderProps,
  type WorkspaceOptions,
  type SchemaType,
  type SanityDocument,
  StudioProvider,
  StudioLayout,
  useColorScheme,
} from 'sanity'
import { createStudioConfig as getWordpressConfig } from 'components/studios/wordpress'
import { projectId } from 'hooks/useSanityClient'

import { deskTool, type PaneView } from 'sanity/desk'

import {
  getColorConfigsFromImagePalette,
  useBasePath,
  useCustomStudioTheme,
  useMagicRouter,
} from 'hooks'

import useListeningQuery from 'hooks/useListeningQuery'
import ImagePalettePreview from 'components/ImagePalettePreview'

export const dataset = 'themes'
const studios = ['wordpress', 'drupal', 'joomla', 'spotify', 'theme-studio']
type PreviewPaneProps = {
  documentId: string
  // options?: TOptions
  schemaType: SchemaType
  document: {
    draft: SanityDocument | null
    displayed: Partial<SanityDocument>
    historical: Partial<SanityDocument> | null
    published: SanityDocument | null
  }
}

function getStudioConfig(id: string) {
  switch (id) {
    case 'theme-studio':
      return getConfig
    case 'wordpress':
    default:
      return getWordpressConfig
    //throw new Error('Unable to find studio config for ' + id)
  }
}

function PreviewStudio(props: PreviewPaneProps) {
  console.log('PreviewStudio', props)
  const history = useMagicRouter()
  const { scheme } = useColorScheme()
  const { data } = useListeningQuery(
    `{
      "themes": *[_type == "theme" || _type == "logo"]{_id, "palette": source.asset->metadata.palette},
      "logos": *[_type == "studio"]{"_ref": logo.asset._ref, "palette": logo.asset->metadata.palette},
    }`
  )
  const themes = data?.themes
  const logos = data?.logos
  const theme = useMemo(() => {
    if (!themes) return null
    // First attempt to find a shared theme
    const theme = themes.find(
      // @ts-expect-error
      (theme) => theme._id === props.document.displayed.theme?._ref
    )
    if (theme) {
      return theme
    }
    // Next attempt to get it from the logo
    return logos.find(
      // @ts-expect-error
      (logo) => logo._ref === props.document.displayed.logo?.asset?._ref
    )
  }, [
    themes,
    logos,
    // @ts-expect-error
    props.document.displayed.theme?._ref,
    // @ts-expect-error
    props.document.displayed.logo?.asset?._ref,
  ])
  console.warn('logos', logos)
  // console.warn({ themes, theme, logo: props.document.displayed.logo })
  const config = useMemo(
    () =>
      getStudioConfig(props.documentId)({
        basePath: '/',
        // @ts-expect-error
        title: props.document.displayed?.title,
        // icon: props.document.displayed?.icon,
      }),
    [props.documentId, props.document.displayed?.title]
  )
  const themeConfig = useMemo(() => {
    return theme?.palette
      ? getColorConfigsFromImagePalette({ palette: theme?.palette })
      : ({} as any)
  }, [theme?.palette])
  const previewStudioTheme = useCustomStudioTheme({ config: themeConfig })
  return (
    <Card data-studio-preview height="fill">
      <StudioProvider
        unstable_history={history}
        config={config}
        unstable_noAuthBoundary
      >
        <ThemeProvider theme={previewStudioTheme} scheme={scheme}>
          <Box padding={4} height="fill">
            <Card height="fill" radius={1} shadow={2}>
              <StudioLayout />
            </Card>
          </Box>
        </ThemeProvider>
      </StudioProvider>
      {theme?.palette && (
        <Card padding={4}>
          <Grid gap={5} columns={[1, 1, 2, 3, 5, 7]}>
            <ImagePalettePreview value={theme?.palette} />
          </Grid>
        </Card>
      )}
    </Card>
  )
}

function PreviewStudios(props: PreviewPaneProps) {
  console.log('PreviewStudios', props)
  return (
    <Card
      padding={4}
      sizing="border"
      style={{ minHeight: '100%' }}
      tone="transparent"
    >
      <Code language="json">
        {JSON.stringify(props.document.displayed, null, 2)}
      </Code>
    </Card>
  )
}

export function getConfig({
  basePath,
  ...other
}: Pick<WorkspaceOptions, 'basePath'> &
  Partial<Omit<WorkspaceOptions, 'basePath'>>): Config {
  return createConfig({
    basePath,
    projectId,
    dataset,
    plugins: [
      deskTool({
        title: 'Themes',
        defaultDocumentNode: (S, { schemaType }) => {
          if (schemaType === 'studio') {
            return S.document().views([
              S.view.form(),
              S.view.component(PreviewStudio).title('Preview'),
            ])
          }
          if (schemaType === 'theme') {
            return S.document().views([
              S.view.form(),
              S.view.component(PreviewStudios).title('Preview'),
            ])
          }
        },
        structure: (S, source) => {
          return S.list()
            .id('root')
            .title('Studios')
            .items([
              ...studios.map((studio) =>
                S.documentListItem().id(studio).schemaType('studio')
              ),
              S.divider(),
              S.documentTypeListItem('theme')
                .title('Themes')
                .icon(ControlsIcon),
            ])
        },
      }),
    ],
    name: 'moccason-kouprey',
    title: 'Customizer',
    schema: {
      types: [
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
      ],
      ...other,
    },
  })
}

export default function StudioPage(
  props: Omit<Partial<StudioProviderProps>, 'children'>
) {
  const basePath = useBasePath()
  const config = useMemo(
    () =>
      getConfig({
        basePath,
      }),
    [basePath]
  )

  return <Studio config={config} {...props} unstable_noAuthBoundary />
}
