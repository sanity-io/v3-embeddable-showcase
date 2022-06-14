import { types } from 'components/studios/blog'
import { Studio, type WorkspaceOptions } from 'sanity'
import { deskTool } from 'sanity/desk'

const config: WorkspaceOptions = {
  basePath: '/wp-admin',
  projectId: 'rkndubl4',
  dataset: 'production',
  plugins: [deskTool()],
  name: 'blog',
  schema: { types },
}

export default function NotWordpress() {
  return (
    <div style={{ height: '100vh' }}>
      <Studio config={config} />
    </div>
  )
}
