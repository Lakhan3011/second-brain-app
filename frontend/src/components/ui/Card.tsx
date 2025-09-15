import { Tweet } from "react-tweet";
import DeleteIcon from "../../icons/DeleteIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteContent } from "../../services/posts";

interface CardProps {
    id?: string;
    title: string;
    link: string;
    type: "tweet" | "youtube" | "link"
}

export function Card({ id, title, link, type }: CardProps) {

    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: deleteContent,
        onSuccess: () => {
            alert("Content deleted successfully");
            queryClient.invalidateQueries({ queryKey: ['contents'] });
        },

        onError: (error: any) => {
            alert(error.response?.data?.message || "Failed to deleted content")
        }
    });

    const handleDelete = () => {
        deleteMutation.mutate(id as string);
    }

    const renderContent = () => {
        switch (type) {
            case "tweet": {
                const tweetId = link.split('/').pop()?.split('?')[0];
                return (
                    tweetId ? <Tweet id={tweetId} /> : <p>Invalid Tweet link</p>
                )
            }
            case "youtube": {
                const videoId = new URL(link).searchParams.get('v');
                return videoId ? (
                    <iframe
                        className=" w-full rounded-lg"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                    />
                ) : <p>Ivalid youtube link</p>
            }
            case "link":
            default:
                return (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {link}
                    </a>
                );
        }
    };
    return (
        <div className="max-w-72 h-fit p-2 space-y-6 rounded-md shadow-sm border-2 border-slate-300">
            <div className="flex text-slate-800 justify-between ">
                <div className="flex items-center gap-3 font-medium text-xl  ">
                    {
                        type === 'youtube' ? <YoutubeIcon /> : <TwitterIcon />
                    }
                    <span>{title}</span>
                </div>
                <div className="flex items-center cursor-pointer"
                    onClick={handleDelete}
                >
                    <DeleteIcon />
                </div>
            </div>
            <div className="">
                {renderContent()}
            </div>
        </div >
    )
}