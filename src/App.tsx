import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import Login from './pages/Authentication/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import DefaultLayout from './layout/DefaultLayout';
import TraineeList from './pages/Trainee/TraineeList';
import AdminList from './pages/Admin/AdminList';
import TraineeDetail from './pages/Trainee/TraineeDetail';
import TraineeEdit from './pages/Trainee/TraineeEdit';
import TraineeAdd from './pages/Trainee/TraineeAdd';
import LogbookAdd from './pages/Logbooks/LogbooksAdd';
import LogbookEdit from './pages/Logbooks/LogbooksEdit';
import AdminEdit from './pages/Admin/AdminEdit';
import AdminAdd from './pages/Admin/AdminAdd';
import DivisionList from './pages/Divison/DivisionList';
import DivisionAdd from './pages/Divison/DivisionAdd';
import DivisionEdit from './pages/Divison/DivisionEdit';
import ProtectedRoute from './services/ProtectedRoutes';
import { getAuth, signOut } from 'firebase/auth';
import { useFireStoreDetail } from './hooks/useFireStoreDetail';
import { collectionNames } from './services/collections';
import { auth } from './services/firebase';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  // const [user, setUser] = useState(() => {
  //   const savedUser = localStorage.getItem('user');
  //   return savedUser ? JSON.parse(savedUser) : null;
  // });
  const [user, setUser] = useState({id: 'KuzUiRAE86SpIzPs0UJhuk4FizD3', role: 'super.admin'});
  const navigate = useNavigate()
  const { pathname } = useLocation();
  const { data: admin, loading: adminLoading } = useFireStoreDetail(collectionNames.users, user?.id || "");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  console.log('user role: ' +user?.role);
  console.log('user id: ' +user?.id);


  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);
  
  console.log('auth 1' + admin?.email);


  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      console.log('auth' + auth);

      setUser(null);
      localStorage.removeItem('user');
      console.log("User logged out successfully.");
      console.log(auth.currentUser);
      console.log('role after sign out '+ user.role);
      navigate('/login')
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const noLayoutRoute = ['/login'];
  return loading || adminLoading ? (
    <Loader />
  ) : (
    noLayoutRoute.includes(pathname) ? (
      <>
        {pathname === '/login' && (
          <>
            <PageTitle title='Timedoor TIA | login' />
            <Login user={user} setUser={setUser} />
          </>
        )}
      </>
    ) : (
      <DefaultLayout user={user?.id ?? ''} handleLogout={handleLogout}>
        <Routes>

          {/* Protected Routes */}
          <Route>
            <Route
              index
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Dashboard" />
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Trainee */}
            <Route
              path="/trainee"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Trainee" />
                  <TraineeList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainee/add"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Trainee" />
                  <TraineeAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainee/:id"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Trainee" />
                  <TraineeDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainee/edit/:id"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Trainee" />
                  <TraineeEdit />
                </ProtectedRoute>
              }
            />

            {/* Logbooks */}
            <Route
              path="/trainee/:id/logbooks/add/"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Logbook" />
                  <LogbookAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trainee/:id/logbooks/edit/:logbooksId"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Logbook" />
                  <LogbookEdit />
                </ProtectedRoute>
              }
            />

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Admin" />
                  <AdminList role={admin?.role} />
                </ProtectedRoute>
              }
            />
            {
              user && admin?.role === 'super.admin' && (
                <Route
                  path="/admin/add"
                  element={
                    <ProtectedRoute user={user}>
                      <PageTitle title="Timedoor TIA | Admin" />
                      <AdminAdd />
                    </ProtectedRoute>
                  }
                />
              )
            }
            {
              user && admin?.role === 'super.admin' && (
                <Route
                  path="/admin/edit/:id"
                  element={
                    <ProtectedRoute user={user}>
                      <PageTitle title="Timedoor TIA | Admin" />
                      <AdminEdit />
                    </ProtectedRoute>
                  }
                />

              )
            }

            {/* Division */}
            <Route
              path="/division"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Division" />
                  <DivisionList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/division/add"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Division" />
                  <DivisionAdd />
                </ProtectedRoute>
              }
            />
            <Route
              path="/division/edit/:id"
              element={
                <ProtectedRoute user={user}>
                  <PageTitle title="Timedoor TIA | Division" />
                  <DivisionEdit />
                </ProtectedRoute>
              }
            />
          </Route>


          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </DefaultLayout>
    )
  );
}

export default App;
