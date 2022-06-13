import { useEffect, useState } from 'react'
import { useClient } from 'sanity'

export default function BlogPreviewWrapper({
  // @ts-expect-error
  document: { displayed },
  // @ts-expect-error
  Component,
}) {
  const { title, date, slug, excerpt, coverImage, author, content } = displayed

  const client = useClient()

  const [resolvedAuthor, setResolvedAuthor] = useState()

  useEffect(() => {
    const getAuthor = async () => {
      const newAuthor = await client.fetch(
        '*[ _id == $authorId ]{name, picture}[0]',
        { authorId: author?._ref }
      )
      setResolvedAuthor(newAuthor)
    }
    getAuthor()
  }, [author, client])

  return (
    <div className="container p-5 mx-auto">
      <Component
        title={title}
        slug={slug?.current}
        date={date}
        excerpt={excerpt}
        coverImage={coverImage}
        author={resolvedAuthor}
        content={content}
      />
    </div>
  )
}
