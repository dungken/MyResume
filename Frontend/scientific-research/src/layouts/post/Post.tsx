import { useEffect, useState } from "react";
import PostModel from "../../models/PostModel";
import { getPostsByPostCatId } from "../../api/PostAPI";
import ScrollToTopButton from "../../utils/scroll/ScrollToTopButton";
import PostItem from "./PostItem";
import PostCatModel from "../../models/PostCatModel";
import { getPostCats } from "../../api/PostCatAPI";

interface Props {
    postCat: PostCatModel;
}

function Post() {
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [postCats, setPostCats] = useState<PostCatModel[] | []>([]);

    useEffect(() => {
        getPostCats()
            .then((result) => {
                setPostCats(result);
            })
            .catch((error) => {
                setLoadingData(true);
                setError(error.message);
            })
    }, [])


    const RenderPostsByPostCat: React.FC<Props> = ({ postCat }) => {
        const [posts, setPosts] = useState<PostModel[]>([]);
        useEffect(() => {
            const fetchData = async () => {
                try {
                    const result = await getPostsByPostCatId(postCat.postCatId);
                    if (result !== null)
                        setPosts(result);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            };
            fetchData();
        }, [postCat.postCatId]);

        return (
            <div className="container text-start my-4 rounded-2">
                <h2 className="fw-bolder mb-4 text-center"
                    style={{
                        background: '#f0f0f0',
                        padding: '10px',
                        borderRadius: '8px'
                    }}>
                    {postCat.postCatName}</h2>
                <div className="row gx-5 mx-2">
                    {posts?.map((post) => (
                        <PostItem key={post.postId} post={post} />
                    ))}
                </div>
            </div>
        );
    };

    if (loadingData) {
        return (
            <div id="layoutSidenav" className="container-fluid mt-4" style={{ minHeight: '700px', textAlign: 'center' }}>
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div>{error}</div>
        )
    }

    return (
        <div className="text-start">
            <ScrollToTopButton />
            <section className="py-3">
                {
                    postCats.map((post) => (
                        (post.postCatParentId === 1) ? <RenderPostsByPostCat postCat={post} /> : null
                    ))
                }
            </section>
        </div>
    )
}

export default Post;