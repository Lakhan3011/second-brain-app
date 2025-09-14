import type { ReactElement } from "react";

interface SidebarItemProps {
    text: string;
    icon: ReactElement;
    onClick?: () => void;
}

export function SidebarItem({ text, icon, onClick }: SidebarItemProps) {
    return (
        <div className="transition-all duration-150 flex gap-4 items-center p-2 m-6 hover:bg-gray-200 cursor-pointer rounded-md"
            onClick={onClick}
        >
            <div>
                {icon}
            </div>
            <div>
                {text}
            </div>
        </div>
    )
}   