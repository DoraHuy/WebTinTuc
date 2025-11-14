"use client";

import { usePosts } from "@/app/CustomHook/UsePosts";
import Paginations from "@/app/manage/components/Paginations";
import PostQuery from "@/app/manage/posts/PostQuery";
import PostsTable from "@/app/manage/posts/PostsTable";

const PostPage = () => {
    const { posts, error, isLoading } = usePosts();
    const renderContent = () => {

        if (isLoading) {
            return (
                <>
                    <div className="m-auto">
                        Đang tải dữ liệu
                    </div>
                </>
            )
        }

        if (error) {
            return (
                <>
                    <div className="m-auto">
                        Lỗi
                    </div>
                </>
            )
        }

        return (
            <PostsTable
                data={posts}
            />
        );
    };

    return (
        <div className="flex flex-col gap-5">
            <PostQuery data={posts} />
            {renderContent()}
            <Paginations />
        </div>
    );
};

export default PostPage;