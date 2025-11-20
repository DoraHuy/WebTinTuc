import {
    Newspaper,
    Users,
    Eye,
    ThumbsUp,
    FileText,
    BarChart3,
    Settings,
    type LucideIcon
} from 'lucide-react';
export interface SidebarItem {
    href: string;
    label: string;
    icon: LucideIcon;
}[]

export interface SidebarGroup {
    title: string;
    items: SidebarItem[];
}

export const SidebarConfig: SidebarGroup[] = [
    {
        title: "Thống kê",
        items: [
            {
                href: "/manage/tong-bai-viet",
                label: "Tổng số bài viết",
                icon: Newspaper,
            },
            {
                href: "/manage/nguoi-dung",
                label: "Người dùng",
                icon: Users
            },
            {
                href: "/manage/luot-xem",
                label: "Lượt xem trang",
                icon: Eye,
            },
        ],
    },
    {
        title: "Tương tác",
        items: [
            {
                href: "/manage/luot-thich",
                label: "Số lượt thích",
                icon: ThumbsUp,
            },
            {
                href: "/manage/article",
                label: "Bài Viết",
                icon: FileText,
            },
        ],
    },
    {
        title: "Hệ thống",
        items: [
            {
                href: "/manage/analytics",
                label: "Phân tích",
                icon: BarChart3,
            },
            {
                href: "/manage/settings",
                label: "Cài đặt",
                icon: Settings,
            },
        ],
    },
]