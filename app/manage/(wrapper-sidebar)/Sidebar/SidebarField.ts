import {
    Newspaper,
    Users,
    Eye,
    ThumbsUp,
    FileText,
    BarChart3,
    Settings,
    FileCheck,
    LayoutDashboard,
    Gift,
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
        title: "Tổng quan",
        items: [
            {
                href: "/manage",
                label: "Dashboard",
                icon: LayoutDashboard,
            },
        ],
    },
    {
        title: "Quản lý nội dung",
        items: [
            {
                href: "/manage/posts",
                label: "Bài viết",
                icon: FileText,
            },
            {
                href: "/manage/posts/approve",
                label: "Duyệt bài viết",
                icon: FileCheck,
            },
        ],
    },
    {
        title: "Tài chính",
        items: [
            {
                href: "/manage/redeem",
                label: "Mã giảm giá",
                icon: Gift,
            },
        ],
    },
    {
        title: "Thống kê",
        items: [
            {
                href: "/manage/analytics",
                label: "Phân tích",
                icon: BarChart3,
            },
            {
                href: "/manage/users",
                label: "Người dùng",
                icon: Users,
            },
        ],
    },
]