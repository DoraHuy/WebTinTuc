

import { SidebarConfig } from "@/app/manage/(wrapper-sidebar)/Sidebar/SidebarField";
import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";

interface ToggleSidebar {
    isCollapsed: boolean;
}

export function Sidebar({ isCollapsed }: ToggleSidebar) {
    return (
        <nav className={clsx(
            "space-y-6 h-screen flex-col justify-start py-4 bg-[#bcac93] text-white transition-all duration-300",
            "hidden md:flex",
            isCollapsed ? "w-20 px-2" : "w-64 px-4"
        )}>
            <div className="flex flex-col justify-center items-center mt-5">
                <Image src={"/images/logo2.jpg"} alt="Logo" width={50} height={50} className="w-[80%] h-auto"></Image>
                <h2 className={clsx("text-xl mt-2", isCollapsed && "hidden")}>
                    News Anime
                </h2>
            </div>
            {
                SidebarConfig.map((group) => (
                    <div key={group.title}>
                        <h3 className={clsx("px-3 text-base font-semibold uppercase", isCollapsed && "text-xs text-center")}>
                            {group.title}
                        </h3>
                        <div className="mt-2 space-y-1">
                            {group.items.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={clsx(
                                            "flex items-center gap-3 rounded-lg",
                                            isCollapsed ? "bg-[#5f4d30] justify-center p-2" : "hover:bg-[#503c1d] px-3 py-2",
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span className={clsx(isCollapsed && "hidden")}>{item.label}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))
            }
        </nav >
    );
}