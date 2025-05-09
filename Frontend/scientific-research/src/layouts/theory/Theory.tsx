import { useParams } from "react-router-dom";
import ScrollToTopButton from "../../utils/scroll/ScrollToTopButton";
import SidebarMenu from "./SidebarTheory";
import { useEffect, useState } from "react";
import TheoryModel from "../../models/TheoryModel";
import { getTheoryByCatId } from "../../api/TheoryAPI";
import { getTheoryByKeyword, getTheoryByKeywordExample } from "../../api/TheoryKeywordAPI";
import TheoryExampleModel from "../../models/TheoryExampleModel";

function Theory() {
    const { theoryCatIdParam } = useParams();
    const [theory, setTheory] = useState<TheoryModel | null>(null);
    const [keyword, setKeyword] = useState<string>('');
    const [searchResult, setSearchResult] = useState<TheoryModel | null>(null);
    const [searchExampleResult, setSearchExampleResult] = useState<TheoryExampleModel | null>(null);
    const [statusSearch, setStatusSearch] = useState<boolean>(false);
    const [checkSearchExercise, setCheckSearchExercise] = useState<number>(0);

    let theoryCatId = 0;
    try {
        theoryCatId = parseInt(theoryCatIdParam + '');
    } catch (error) {
        theoryCatId = 0;
        console.log('Error', error);
    }
    if (Number.isNaN(theoryCatId))
        theoryCatId = 18;

    useEffect(() => {
        getTheoryByCatId(theoryCatId)
            .then((result) => {
                if (result != null) {
                    setTheory(result);
                    setStatusSearch(false);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    }, [theoryCatId]);

    const handleClickBtnSearch = async () => {
        if (checkSearchExercise)
            setSearchExampleResult(await getTheoryByKeywordExample(keyword.toLowerCase()));
        else
            setSearchResult(await getTheoryByKeyword(keyword.toLowerCase()));
        setStatusSearch(true);
    }

    const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Ngăn chặn hành động mặc định của phím Enter trên form
            handleClickBtnSearch();
        }
    };

    const handleCheckSearchExercise = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setCheckSearchExercise(parseInt(event.target.value));
    }

    
    return (
        <div id="layoutSidenav" className="my-2">
            <ScrollToTopButton />
            <div className="container mt-4">
                <div className="row">
                    <div className="col-md-3 mb-2">
                        <div className="form-group">
                            <select className="form-control" id=""
                                value={checkSearchExercise}
                                onChange={handleCheckSearchExercise}
                            >
                                <option value={0}>Tìm kiếm theo lý thuyết</option>
                                <option value={1}>Giải bài tập</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-9">
                        <div className="row">
                            <form className="d-flex" onSubmit={handleClickBtnSearch}>
                                <textarea
                                    className="form-control me-2" style={{ height: '40px' }}
                                    placeholder="Enter your keyword?"
                                    aria-label="Search"
                                    value={keyword}
                                    onChange={(e) => setKeyword(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                />
                                <button
                                    className="btn btn-outline-success w-25"
                                    type="button"
                                    onClick={handleClickBtnSearch}
                                >Search</button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="row mt-4">
                    <div className="col-md-3" style={{ marginBottom: '20px' }}>
                        <SidebarMenu />
                    </div>
                    <div className="col-md-9">
                        <div id="content" style={{
                            textAlign: 'left', background: '#f4f4f4',
                            borderRadius: '10px',
                            padding: '20px',
                            minHeight: '700px',
                            marginBottom: '40px',
                            fontFamily: 'Roboto',
                        }} className="">

                            {
                                theory && !statusSearch
                                    ?
                                    <div dangerouslySetInnerHTML={{ __html: theory?.content }} />
                                    :
                                    (statusSearch && (searchResult || searchExampleResult))
                                        ?
                                        <div>
                                            {
                                                !checkSearchExercise ?
                                                    searchResult &&
                                                    <div dangerouslySetInnerHTML={{ __html: searchResult?.content }} />
                                                    :
                                                    searchExampleResult &&
                                                    <div dangerouslySetInnerHTML={{ __html: searchExampleResult?.answer }} />
                                            }
                                        </div>
                                        :
                                        <div>There are no results!</div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Theory;