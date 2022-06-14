// A super-charged studio capable of editing the color scheme of other studios and previewing them live

import { Card, Code, Grid, ThemeProvider, Box } from '@sanity/ui'

import { ControlsIcon, MasterDetailIcon } from '@sanity/icons'
import { useMemo } from 'react'
import {
  type Config,
  createConfig,
  Studio,
  type StudioProviderProps,
  type SchemaType,
  type SanityDocument,
  StudioProvider,
  StudioLayout,
  useColorScheme,
} from 'sanity'

import workspaces from 'sanity.config'

import {
  getColorConfigsFromImagePalette,
  useBasePath,
  useCustomStudioTheme,
  useMagicRouter,
} from 'hooks'

import useListeningQuery from 'hooks/useListeningQuery'
import ImagePalettePreview from 'components/ImagePalettePreview'

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

function PreviewStudio(props: PreviewPaneProps) {
  console.log('PreviewStudio', props)
  const history = useMagicRouter('/')
  const { scheme } = useColorScheme()
  const { data } = useListeningQuery(/* groq */ `{
      "themes": *[_type == "theme" || _type == "logo"]{_id, "palette": source.asset->metadata.palette},
      "logos": *[_type == "studio"]{"_ref": logo.asset._ref, "palette": logo.asset->metadata.palette},
    }`)
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
  const previewConfig = useMemo(() => {
    // TODO show a not found message, or maybe there's a component alraedy we can ready for rendering the workspace

    const found =
      workspaces.find((workspace) => workspace.name === props.documentId) ||
      workspaces[0]

    return { ...found, title: props.document.displayed?.title }
  }, [props.documentId, props.document.displayed?.title])
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
        // @ts-expect-error
        config={previewConfig}
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
import { type WorkspaceOptions } from 'sanity'
import { projectId, dataset } from 'hooks/useSanityClient'

import { deskTool } from 'sanity/desk'
import { types } from './themerSchema'

export const config: WorkspaceOptions = {
  basePath: '/manage/themer',
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_THEMER_DATASET || dataset,
  plugins: [
    deskTool({
      title: 'Themes',
      // /*
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
          .title('Workspaces')
          .items([
            ...workspaces.map((workspace) =>
              S.documentListItem().id(workspace.name).schemaType('studio')
            ),
            S.divider(),
            S.documentTypeListItem('theme').title('Themes').icon(ControlsIcon),
          ])
      },
      // */
    }),
  ],
  name: 'themer',
  title: 'Themer',
  schema: { types },
}
