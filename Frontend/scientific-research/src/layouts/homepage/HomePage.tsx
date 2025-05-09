import Quote from './components/Quote';
import Banner from './components/Banner';
import Post from '../post/Post';
import ScrollToTopButton from '../../utils/scroll/ScrollToTopButton';
import Forum from '../forum/Forum';


function HomePage() {
    return (
        <div>
            <header className="bg-dark">
                <Banner />
            </header>
            <Quote />
            <Forum/>
            <Post />
            <ScrollToTopButton />
        </div >
    )
}

export default HomePage;