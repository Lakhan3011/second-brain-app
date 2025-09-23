import { useState } from "react"
import { Button } from "../components/ui/Button"
import { Card } from "../components/ui/Card"
import { Modal } from "../components/ui/Modal"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { Sidebar } from "../components/ui/Sidebar"
import { useMutation, useQuery } from "@tanstack/react-query"
import { fetchContents, shareContents } from "../services/posts"


export function Dashboard() {
    const [modalOpen, setModalOpen] = useState(false);
    const [contentFilter, setContentFilter] = useState<"tweet" | "youtube" | "all">("all");

    const shareMutation = useMutation({
        mutationFn: shareContents,
        onSuccess: (data) => {
            navigator.clipboard.writeText(`second-brain-app-kappa.vercel.app/share/${data.shareableUrl}`);
            alert("Share link copied to clipboard! 🚀");
        },
        onError: (error: any) => {
            alert(error.response?.data?.error || 'Failed to generate share link')
        }
    })

    const { data: contents, isLoading, error } = useQuery({
        queryKey: ["contents"],
        queryFn: fetchContents,
    });

    const filteredContents = contentFilter === "all"
        ? contents
        : contents.filter((c: any) => c.type === contentFilter);

    if (isLoading) {
        return <p className="text-3xl">Loading....</p>
    }

    if (error) {
        return <p className="text-3xl">Error loading contents</p>
    }



    function generateLink() {
        shareMutation.mutate();
    }

    return (
        <div>
            <Sidebar onFilterChange={setContentFilter} />
            <div className="p-4 ml-72 min-h-screen bg-[#eeeeef]">
                <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
                <div className="flex justify-end gap-2 ">
                    <Button onClick={generateLink} variant={"primary"} size={"medium"} text="Share Brain" startIcon={<ShareIcon />} />
                    <Button variant={"secondary"} size={"medium"} text="Add Content" startIcon={<PlusIcon />}
                        onClick={() => setModalOpen(true)}
                    />
                </div>
                <div className="flex flex-wrap pt-4 gap-4">
                    {
                        filteredContents.map(({ _id, title, link, type }: any) =>
                            <Card id={_id} type={type} title={title} link={link} />
                        )
                    }
                </div>
            </div>
        </div>
    )
}


