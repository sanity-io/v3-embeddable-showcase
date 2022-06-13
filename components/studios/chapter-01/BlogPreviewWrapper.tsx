import { useEffect, useState } from "react";
import { useClient } from "sanity";

export default function BlogPreviewWrapper({ document: { displayed: { title, date, slug, excerpt, coverImage, author}}, Component }) {
    const client = useClient();

    const [resolvedAuthor, setResolvedAuthor] = useState();

    useEffect(() => {
        const getAuthor = async () => {
            const newAuthor = await client.fetch('*[ _id == $authorId ]{name, picture}[0]', {authorId: author?._ref})
            setResolvedAuthor(newAuthor)
        };
        getAuthor();
    }, [author, client])
    
    console.log(resolvedAuthor)
    return <Component title={title} slug={slug.current} date={date} excerpt={excerpt} coverImage={coverImage} author={resolvedAuthor} />
}