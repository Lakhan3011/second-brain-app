import { CrossIcon } from "../../icons/CrossIcon"
import { Button } from "./Button";
import React, { useEffect, useState } from "react";
import { Input } from "./Input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addContent } from "../../services/posts";


interface ModalProps {
    open: boolean;
    onClose: () => void;
}

enum ContentType {
    Youtube = "youtube",
    Twitter = "tweet"
}

export const Modal = ({ open, onClose }: ModalProps) => {
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [type, setType] = useState(ContentType.Youtube);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: addContent,
        onSuccess: (data) => {
            alert(data.message);
            queryClient.invalidateQueries({ queryKey: ["contents"] });
            setTitle('');
            setLink('');
            onClose();
        },
        onError: (error: any) => {
            alert(error.response?.data?.error || "Content not added")
        }
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ title, link, type });
    }

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEsc);

        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!open) return null;

    return (
        <div>
            {open && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 "
                    onClick={onClose}
                >
                    <div
                        className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-4"
                        role="dialog"
                        aria-modal="true"
                        onClick={(e) => e.stopPropagation()} // prevent closing when click inside
                    >
                        <div className="m-5">
                            <button
                                className="absolute top-2 right-2 p-1 rounded hover:bg-gray-500"
                                onClick={onClose}
                                aria-label="close modal"
                            >
                                <CrossIcon />
                            </button>
                        </div>
                        <div className="p-2 space-y-3">
                            <Input placeholder="Title" value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <Input placeholder="Link" value={link}
                                onChange={(e) => setLink(e.target.value)}
                            />
                        </div>
                        <div className="p-1">
                            <h1 className="font-mono text-center text-xl pb-2">Select type</h1>
                            <div className="flex gap-4 justify-center">
                                <Button text="Youtube" variant={type === ContentType.Youtube ? "secondary" : "primary"} onClick={() => setType(ContentType.Youtube)}></Button>
                                <Button text="Tweet" variant={type === ContentType.Twitter ? "secondary" : "primary"} onClick={() => setType(ContentType.Twitter)}></Button>
                            </div>
                        </div>
                        <form
                            onSubmit={handleSubmit}
                            className="flex justify-center mt-6 ">
                            <Button isLoading={mutation.isPending} variant={"secondary"} text="Add Content" />
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

