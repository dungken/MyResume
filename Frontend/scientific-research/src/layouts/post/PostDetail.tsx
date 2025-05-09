import { useParams } from "react-router-dom";
import ScrollToTopButton from "../../utils/scroll/ScrollToTopButton";
import { useEffect, useState } from "react";
import PostModel from "../../models/PostModel";
import { getPostById } from "../../api/PostAPI";
import UserModel from "../../models/UserModel";
import { getUserByPostId } from "../../api/UserAPI";
import PostCatModel from "../../models/PostCatModel";
import { getPostCatByPostId } from "../../api/PostCatAPI";
import formatDateTimeUserVer2 from "../../utils/datetime/FormatDateTimeUserVer2";

function PostDetail() {
    const { postIdParam } = useParams();
    const [post, setPost] = useState<PostModel | null>(null);
    const [postCat, setPostCat] = useState<PostCatModel | null>(null);
    const [user, setUser] = useState<UserModel | null>(null);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    let postId = 0;
    try {
        postId = parseInt(postIdParam + '');
    } catch (error) {
        postId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(postId))
        postId = 0;

    useEffect(() => {
        getPostById(postId)
            .then(
                result => {
                    setPost(result);
                    setLoadingData(false);
                }
            ).catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message);
            });
    }, [postId]);

    useEffect(() => {
        getUserByPostId(postId)
            .then(
                result => {
                    setUser(result);
                    setLoadingData(false);
                }
            ).catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message);
            });
    }, [postId]);

    useEffect(() => {
        getPostCatByPostId(postId)
            .then(
                result => {
                    setPostCat(result);
                    setLoadingData(false);
                }
            ).catch(error => {
                console.error('Error fetching user data:', error);
                setError(error.message);
            });
    }, [postId]);

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
            <div id="layoutSidenav" className="container-fluid mt-4" style={{ minHeight: '700px', textAlign: 'center' }}>
                <div>{error}</div>
            </div>
        )
    }

    return (
        <section className="py-4 text-start">
            <ScrollToTopButton />
            <div className="container px-4" style={{ minHeight: '700px' }}>
                <div className="row gx-5" id="post-detail">
                    <article style={{ minHeight: '500px' }}>
                        <header className="mb-4 text-center">
                            <h1 className="fw-bolder mb-1">{post?.title}</h1>
                            <div className="text-muted fst-italic mb-2">{post && formatDateTimeUserVer2(post?.createdAt)}</div>
                            <a className="badge bg-secondary text-decoration-none link-light" href="#">{postCat?.postCatName}</a>
                        </header>
                        <section className="mb-5">
                            {post && <div dangerouslySetInnerHTML={{ __html: post?.detail }} />}
                        </section>

                    </article>
                    <section>
                        <div className="card bg-light">
                            <div className="card-body">
                                <form className="mb-4">
                                    <textarea className="form-control" placeholder="Join the discussion and leave a comment!"></textarea>
                                    <div className="d-grid gap-2 d-md-flex justify-content-md-start mt-4">
                                        <button className="btn btn-primary me-md-2 w-100" type="button">Comment</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </section>
    )
}

export default PostDetail;