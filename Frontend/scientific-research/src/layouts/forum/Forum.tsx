
import { NavLink } from "react-router-dom";
import ScrollToTopButton from "../../utils/scroll/ScrollToTopButton";
import { useEffect, useState } from "react";
import ThreadModel from "../../models/ThreadModel";
import { Pagination } from "../../utils/pagination/Pagination";
import ThreadItem from "./ThreadItem";
import { getListThread } from "../../api/ThreadAPI";

function Forum() {
    const [threads, setThreads] = useState<ThreadModel[] | null>([]);
    const [loadingData, setLoadingData] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [currPage, setCurrPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        getListThread(currPage - 1)
            .then(
                res => {
                    setThreads(res.result);
                    setTotalPages(res.totalPages);
                    setLoadingData(false);
                }
            )
            .catch((error) => {
                setLoadingData(true);
                setError(error.message);
            })
    }, [currPage])


    const paginate = (currPage: number) => {
        setCurrPage(currPage);
    }


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
        <div className="container text-start rounded-2" id="forum">
            <ScrollToTopButton />
            <div className="row mb-2 px-2" style={{alignItems: 'center'}}>
                <div className="col-md-6 col-sm-4 text-start w-50">
                    <h3 className="">Recent Threads</h3>
                </div>
                <div className="col-md-6 col-sm-4 text-end w-50">
                    <NavLink className="btn btn-success rounded-2  roboto-bold" to="/forum/quesion/add">Ask Question</NavLink>
                </div>
            </div>
            {
                threads?.map((thread) => (
                    <ThreadItem thread={thread} />
                ))
            }

            <nav aria-label="Page navigation example">
                <Pagination currentPage={currPage} totalPages={totalPages} paginate={paginate} />
            </nav>
        </div>
    )
}

export default Forum;