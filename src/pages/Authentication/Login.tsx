import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import Logo from '../../images/logo/timedoor-logo-2.png';
import SignInImage from '../../images/signIn.png';
import { CiMail, CiLock } from "react-icons/ci";
import app, { auth } from '../../services/firebase';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import { collectionNames } from '../../services/collections';

const Login: React.FC<{ user: any; setUser: (user: any) => void }> = ({ user, setUser }) => {
  if (user) {
    return <Navigate to="/" replace />;
  }

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Loading started...");

      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      console.log('authhhh : ' + auth.currentUser?.email);
      
      const db = getFirestore(app);
      const userRef = doc(db, collectionNames.users, userId);
      const snapshot = await getDoc(userRef);
      
      // Check if the document exists
      if (!snapshot.exists()) {
        setError('User not found.'); // Handle the case where the user document does not exist
        return; // Exit the function early
      }

      const userData = snapshot.data();
      const userRole = userData.role;
      const userStatus = userData.isActive;

      if (userRole === 'super.admin' || userRole === 'admin') {
        if (userStatus) {
          console.log("Loading navigate...");
          const userData = { id: userId, role: userRole }
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
          navigate('/'); // Redirect to dashboard
        } else {
          setError('You do not have permission to access this application.');
        }
      } else {
        setError('You do not have permission to access this application.');
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError('Incorrect username or password.');
    } finally {
      setLoading(false);
      console.log("Loading ended.");
    }
  };




  return (
    <div className="flex items-center justify-center rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark h-screen">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full md:block md:w-1/2">
          <div className="py-12 px-26 text-center">
            <div className="inline-block">
              <img className="h-30" src={Logo} alt="Logo" />
            </div>
            <p className="2xl:px-20 font-bold text-md whitespace-nowrap mb-5">
              Login to your admin account
            </p>
            <p className="2xl:px-20">
              Enter your super admin or admin division account
            </p>

            <div className="mb-5.5 inline-block">
              <img className="h-50  mb-5.5" src={SignInImage} alt="SignInImage" />
            </div>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="w-full border-stroke dark:border-strokedark md:w-1/2 md:border-l-2">
          <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              Login to TimedoorTIA
            </h2>

            <div className="mb-4">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-green-4 focus-visible:shadow-none"
                />
                <span className="absolute right-4 top-4">
                  <CiMail size={20} />
                </span>
              </div>
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="6+ Characters, 1 Capital letter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-green-4 focus-visible:shadow-none"
                />
                <span className="absolute right-4 top-4">
                  <CiLock size={20} />
                </span>
              </div>
            </div>

            <div className='h-8'>
              {error && <p className="text-red-500">{error}</p>}
            </div>

            <div className="mb-5">
              <input
                type="submit"
                value={loading ? 'Logging In..' : 'Login'}
                className="w-full cursor-pointer rounded-lg border border-green-3 bg-green-4 p-4 text-white transition hover:bg-green-5 disabled:bg-ash-2 disabled:border-ash-3"
                disabled={loading}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
