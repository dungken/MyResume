

function SearchForm() {
    return (
        <div className="container m-auto">
            <form className="d-flex">
                <input
                    className="form-control me-2" style={{ height: '60px' }}
                    type="search"
                    placeholder="Enter your keyword?"
                    aria-label="Search"
                />
                <button className="btn btn-outline-success w-25" type="submit">Search</button>
            </form>
        </div>
    )
}

export default SearchForm;