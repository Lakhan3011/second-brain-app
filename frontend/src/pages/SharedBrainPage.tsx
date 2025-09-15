import { useQuery } from "@tanstack/react-query";
import { Card } from "../components/ui/Card";
import { useParams } from "react-router-dom";
import { fetchShareContents } from "../services/posts";

export function SharedBrainPage() {

    const { hash } = useParams();

    if (!hash) {
        return <p>Invalid link</p>
    }

    const { data: contents, isLoading, error } = useQuery({
        queryKey: ['shared-contents', hash],
        queryFn: () => fetchShareContents(hash),
        enabled: !!hash
    })

    if (isLoading) {
        return <p>Loading shared brain...</p>
    }

    if (error)
        return <p>Link expired or invalid</p>

    return (
        <div className="p-2 min-h-screen bg-[#eeeeef]">
            <div className="flex flex-wrap pt-4 gap-4">
                {
                    contents.map(({ title, link, type }: any) =>
                        <Card type={type} title={title} link={link} />
                    )
                }
            </div>
        </div>

    )
}