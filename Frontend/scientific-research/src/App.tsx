import './App.css';
import Footer from './layouts/footer/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginForm from './layouts/user/LoginForm';
import NavBar from './layouts/header/NavBar';
import HomePage from './layouts/homepage/HomePage';
import RegisterForm from './layouts/user/RegisterForm';
import Post from './layouts/post/Post';
import PostDetail from './layouts/post/PostDetail';
import About from './layouts/page/About';
import Contact from './layouts/page/Contact';
import Forum from './layouts/forum/Forum';
import Theory from './layouts/theory/Theory';
import UserList from './layouts/user/UserList';
import UserForm from './layouts/user/UserForm';
import RoleList from './layouts/role/RoleList';
import RoleForm from './layouts/role/RoleForm';
import ActiveAccount from './layouts/user/ActiveAccount';
import ResetPassword from './layouts/user/ResetPassword';
import ResetPassForm from './layouts/user/ResetPassForm';
import Page401 from './layouts/page/Page401';
import Page404 from './layouts/page/Page404';
import Page500 from './layouts/page/Page500';
import Page403 from './layouts/page/Page403';
import UserFormUpdate from './layouts/user/UserFormUpdate';
import PermissionForm from './layouts/role/PermissionForm';
import PermissionList from './layouts/role/PermissionList';
import PermissionFormUpdate from './layouts/role/PermissionFormUpdate';
import RoleFormUpdate from './layouts/role/RoleFormUpdate';
import PostCatForm from './layouts/post/admin/AdminPostCatForm';
import ThreadCatFormAdmin from './layouts/forum/admin/AdminThreadCatForm';
import ForumFormQuestion from './layouts/forum/ForumFormQuestion';
import ThreadDetail from './layouts/forum/ThreadDetail';
import Account from './layouts/user/Account';
import AdminThreadCatList from './layouts/forum/admin/AdminThreadCatList';
import AdminThreadCatFormUpdate from './layouts/forum/admin/AdminThreadCatFormUpdate';
import AdminThreadList from './layouts/forum/admin/AdminThreadList';
import AdminThreadFormUpdate from './layouts/forum/admin/AdminThreadFormUpdate';
import AdminThreadCommentList from './layouts/forum/admin/AdminThreadCommentList';
import AdminThreadCommentFormUpdate from './layouts/forum/admin/AdminThreadCommentFormUpdate';
import AdminPageForm from './layouts/page/admin/AdminPageForm';
import AdminPageList from './layouts/page/admin/AdminPageList';
import AdminPageFormUpdate from './layouts/page/admin/AdminPageFormUpdate';
import AdminPostList from './layouts/post/admin/AdminPostList';
import AdminPostForm from './layouts/post/admin/AdminPostForm';
import AdminPostFormUpdate from './layouts/post/admin/AdminPostFormUpdate';
import AdminPostCatList from './layouts/post/admin/AdminPostCatList';
import AdminPostCatFormUpdate from './layouts/post/admin/AdminPostCatFormUpdate';
import AdminTheoryForm from './layouts/theory/admin/AdminTheoryForm';
import AdminTheoryList from './layouts/theory/admin/AdminTheoryList';
import AdminTheoryFormUpdate from './layouts/theory/admin/AdminTheoryFormUpdate';
import AdminTheoryCatForm from './layouts/theory/admin/AdminTheoryCatForm';
import AdminTheoryCatList from './layouts/theory/admin/AdminTheoryCatList';
import AdminTheoryCatFormUpdate from './layouts/theory/admin/AdminTheoryCatFormUpdate';
import AdminTheoryExampleForm from './layouts/theory/admin/AdminTheoryExampleForm';
import AdminTheoryExampleList from './layouts/theory/admin/AdminTheoryExampleList';
import AdminTheoryExampleFormUpdate from './layouts/theory/admin/AdminTheoryExampleFormUpdate';
import AdminTheoryKeywordForm from './layouts/theory/admin/AdminTheoryKeywordForm';
import AdminTheoryKeywordList from './layouts/theory/admin/AdminTheoryKeywordList';
import AdminTheoryKeywordFormUpdate from './layouts/theory/admin/AdminTheoryKeywordFormUpdate';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* //////////////////////////////// DASHBOARD ///////////////////////////////// */}
          <Route path="/admin" element={<UserList />} />
          <Route path="/admin/dashboard" element={<UserList />} />

          {/* //////////////////////////////// USER ///////////////////////////////// */}
          <Route path='/' element={<HomePage />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/active/:email/:activeCode' element={<ActiveAccount />} />
          <Route path='/password-recovery' element={<ResetPassForm />} />
          <Route path='/reset-pass/:email/:activeCode' element={<ResetPassword />} />
          <Route path='/admin/user/list' element={<UserList />} />
          <Route path='/admin/user/add' element={<UserForm />} />
          <Route path='/admin/user/edit/:userIdParam' element={<UserFormUpdate />} />
          <Route path='/admin/role/permission/add' element={<PermissionForm />} />
          <Route path='/admin/role/permission/list' element={<PermissionList />} />
          <Route path='/admin/role/permission/edit/:permissionIdParam' element={<PermissionFormUpdate />} />
          <Route path='/admin/role/list' element={<RoleList />} />
          <Route path='/admin/role/add' element={<RoleForm />} />
          <Route path='/admin/role/edit/:roleIdParam' element={<RoleFormUpdate />} />
          <Route path='/user/account' element={<Account />} />

          {/* //////////////////////////////// PAGE ///////////////////////////////// */}
          <Route path="*" element={<Page404 />} />
          <Route path='/admin/page/add' element={<AdminPageForm />} />
          <Route path='/admin/page/list' element={<AdminPageList />} />
          <Route path='/admin/page/edit/:pageIdParam' element={<AdminPageFormUpdate />} />
          <Route path='/page/about' element={<About />} />
          <Route path='/page/contact' element={<Contact />} />
          <Route path="/page/401" element={<Page401 />} />
          <Route path="/page/403" element={<Page403 />} />
          <Route path="/page/404" element={<Page404 />} />
          <Route path="/page/500" element={<Page500 />} />


          {/* //////////////////////////////// POST ///////////////////////////////// */}
          <Route path='/post' element={<Post />} />
          <Route path='/post/:postIdParam' element={<PostDetail />} />
          <Route path='/admin/post/list' element={<AdminPostList />} />
          <Route path='/admin/post/add' element={<AdminPostForm />} />
          <Route path='/admin/post/edit/:postIdParam' element={<AdminPostFormUpdate />} />
          <Route path='/admin/post/cat/add' element={<PostCatForm />} />
          <Route path='/admin/post/cat/list' element={<AdminPostCatList />} />
          <Route path='/admin/post/cat/edit/:postCatIdParam' element={<AdminPostCatFormUpdate />} />

          {/* //////////////////////////////// FORUM ///////////////////////////////// */}
          <Route path='/forum' element={<Forum />} />
          <Route path='/forum/quesion/add' element={<ForumFormQuestion />} />
          <Route path='/thread/:threadIdParam' element={<ThreadDetail />} />


          <Route path='/admin/thread/cat/list' element={<AdminThreadCatList />} />
          <Route path='/admin/thread/cat/add' element={<ThreadCatFormAdmin />} />
          <Route path='/admin/thread/cat/edit/:threadCatIdParam' element={<AdminThreadCatFormUpdate />} />

          <Route path='/admin/thread/list' element={<AdminThreadList />} />
          <Route path='/admin/thread/edit/:threadIdParam' element={<AdminThreadFormUpdate />} />

          <Route path='/admin/thread/comment/list' element={<AdminThreadCommentList />} />
          <Route path='/admin/thread/comment/edit/:commentIdParam' element={<AdminThreadCommentFormUpdate />} />

          {/* //////////////////////////////// THEORY ///////////////////////////////// */}
          <Route path='/theory' element={<Theory />} />
          <Route path='/theory/:theoryCatIdParam' element={<Theory />} />
          <Route path='/admin/theory/add' element={<AdminTheoryForm />} />
          <Route path='/admin/theory/list' element={<AdminTheoryList />} />
          <Route path='admin/theory/edit/:theoryIdParam' element={<AdminTheoryFormUpdate />} />
          <Route path='/admin/theory/topic/add' element={<AdminTheoryCatForm />} />
          <Route path='/admin/theory/topic/list' element={<AdminTheoryCatList />} />
          <Route path='admin/theory/topic/edit/:theoryCatIdParam' element={<AdminTheoryCatFormUpdate />} />
          <Route path='/admin/theory/example/add' element={<AdminTheoryExampleForm />} />
          <Route path='/admin/theory/example/list' element={<AdminTheoryExampleList />} />
          <Route path='/admin/theory/example/edit/:theoryExampleIdParam' element={<AdminTheoryExampleFormUpdate />} />
          <Route path='/admin/theory/keyword/add' element={<AdminTheoryKeywordForm />} />
          <Route path='/admin/theory/keyword/list' element={<AdminTheoryKeywordList />} />
          <Route path='/admin/theory/keyword/edit/:theoryKeywordIdParam' element={<AdminTheoryKeywordFormUpdate />} />

        </Routes>
        <Footer />
      </BrowserRouter>

    </div>
  );
}

export default App;
