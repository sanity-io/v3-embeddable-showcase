// Re-export getInitialProps if any
export {getInitialProps} from 'pages/manage/[[...workspace]]'

import  ManageWorkspace, {type Props} from 'pages/manage/[[...workspace]]'

export default function WP(props: Props) {
  return (
   <ManageWorkspace {...props} />
  )
}
