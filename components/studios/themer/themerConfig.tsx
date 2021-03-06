// A super-charged studio capable of editing the color scheme of other studios and previewing them live

import { DashboardIcon } from '@sanity/icons'
import { Card, Code, Grid, ThemeProvider, Box } from '@sanity/ui'

import { config as blogConfig } from 'components/studios/blog'
import { config as proBlogConfig } from 'components/studios/blog-pro'
import { config as maxProBlogConfig } from 'components/studios/blog-pro-max'
import { config as themerConfig } from 'components/studios/themer'
import { ControlsIcon, MasterDetailIcon, CogIcon } from '@sanity/icons'
import { useMemo } from 'react'
import {
  type SchemaType,
  type SanityDocument,
  StudioProvider,
  StudioLayout,
  useColorScheme,
  defaultTheme,
  useWorkspaces,
} from 'sanity'

// import workspaces from 'sanity.config'

import {
  getColorConfigsFromImagePalette,
  useBasePath,
  createStudioTheme,
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

type StudioTheme = typeof defaultTheme

function PreviewStudio(
  props: PreviewPaneProps & { scheme?: 'light' | 'dark'; split?: boolean }
) {
  const { scheme: _scheme } = useColorScheme()
  const scheme = props.scheme || _scheme
  const { split } = props
  const { data } = useListeningQuery(/* groq */ `{
      "themes": *[_type == "theme" || _type == "logo"]{_id, "palette": source.asset->metadata.palette},
      "logos": *[_type == "workspace"]{"_ref": logo.asset._ref, "palette": logo.asset->metadata.palette},
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
  const workspaces = useWorkspaces()

  // console.warn({ themes, theme, logo: props.document.displayed.logo })
  const previewConfig = useMemo(() => {
    // TODO show a not found message, or maybe there's a component alraedy we can ready for rendering the workspace
    switch (props.documentId) {
      case 'blog':
        return blogConfig
      case 'blog-pro':
        return proBlogConfig
      case 'blog-pro-max':
        return maxProBlogConfig
      case 'themer':
        return themerConfig
      default:
        return workspaces
    }
  }, [props.documentId, workspaces])
  const themeConfig = useMemo(() => {
    return theme?.palette
      ? getColorConfigsFromImagePalette({ palette: theme?.palette })
      : ({} as any)
  }, [theme?.palette])
  const previewStudioTheme = createStudioTheme({ config: themeConfig })
  const splitScreenTheme = useMemo<StudioTheme>(() => {
    const superTheme: Partial<StudioTheme> = {}

    // Split screen, emulates what happens if they were wrapped in iframes
    superTheme.media = previewStudioTheme.media.map((media) => media / 2)

    return { ...previewStudioTheme, ...superTheme }
  }, [previewStudioTheme])
  const history = useMagicRouter('/')

  if (split) {
    return (
      <Grid columns={2} padding={4} gap={2} height="fill">
        <StudioProvider
          unstable_history={history}
          // @ts-expect-error
          config={previewConfig}
          unstable_noAuthBoundary
        >
          <ThemeProvider key="light" scheme="light" theme={splitScreenTheme}>
            <Card height="fill" radius={1} shadow={2}>
              <StudioLayout />
            </Card>
          </ThemeProvider>
          <ThemeProvider key="dark" scheme="dark" theme={splitScreenTheme}>
            <Card height="fill" radius={1} shadow={2}>
              <StudioLayout />
            </Card>
          </ThemeProvider>
        </StudioProvider>
      </Grid>
    )
  }

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

console.log(
  'ThemeConfig',
  process.env.NEXT_PUBLIC_SANITY_THEMER_DATASET || dataset
)

export const config: WorkspaceOptions = {
  basePath: '/manage/themer',
  icon: DashboardIcon,
  projectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_THEMER_DATASET || dataset,
  name: 'themer',
  title: 'Themer',
  schema: { types },
  plugins: [
    deskTool({
      title: 'Appearance',
      icon: CogIcon,
      // /*
      defaultDocumentNode: (S, { schemaType }) => {
        if (schemaType === 'workspace') {
          // @TODO: icons!
          return S.document().views([
            S.view.form(),
            S.view
              .component((props) => <PreviewStudio {...props} scheme="light" />)
              .id('light')
              .title('Light'),
            S.view
              .component((props) => <PreviewStudio {...props} scheme="dark" />)
              .id('dark')
              .title('Dark'),
            S.view
              .component((props) => <PreviewStudio {...props} split />)
              .id('split')
              .title('Split'),
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
            ...['blog', 'blog-pro', 'blog-pro-max', 'themer'].map((id) =>
              S.documentListItem()
                .id(id)
                .icon(MasterDetailIcon)
                .schemaType('workspace')
            ),
            S.divider(),
            S.documentTypeListItem('theme').title('Themes').icon(ControlsIcon),
          ])
      },
      // */
    }),
  ],
}
