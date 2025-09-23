import { useNavigate } from "react-router-dom";
import { Logo } from "../../icons/Logo";
import { TwitterIcon } from "../../icons/TwitterIcon";
import { YoutubeIcon } from "../../icons/YoutubeIcon";
import { Button } from "./Button";
import { SidebarItem } from "./SidebarItem";

interface SidebarProps {
    onFilterChange: (filter: "all" | "tweet" | "youtube") => void;
}

export function Sidebar({ onFilterChange }: SidebarProps) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    }
    return (
        <div className="inset-0 fixed w-72 border-r border-2 flex flex-col justify-between">
            <div>
                <div className="flex gap-2 p-6 items-center justify-start" onClick={() => onFilterChange("all")}>
                    <button className="text-purple-600">
                        <Logo />
                    </button>
                    <span className="text-2xl font-mono cursor-pointer">Second Brain</span>
                </div>
                <div className="text-xl font-mono">
                    <SidebarItem icon={<TwitterIcon />} text="Tweet" onClick={() => onFilterChange("tweet")} />
                    <SidebarItem icon={<YoutubeIcon />} text="Youtube" onClick={() => onFilterChange("youtube")} />
                </div>
            </div>
            <div className="p-4 font-mono">
                <Button
                    variant={"primary"}
                    text="Logout"
                    fullWidth
                    size={"large"}
                    onClick={handleLogout}
                />
            </div>
        </div>
    )
}