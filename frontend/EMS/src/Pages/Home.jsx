import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'; // Import useSelector along with useDispatch
import { setLoading } from '../redux/LoadSlice'; // Adjust the import path as needed
import Header from '../components/Header';
import Home2 from '../components/Home2';
import Home3 from '../components/Home3';
import Home4 from '../components/Home4';
import Home5 from '../components/Home5';
import Footer from '../components/Footer';
import Loading from '../components/Loading'; 

const Home = () => {
  const dispatch = useDispatch(); 
  const isLoading = useSelector(state => state.load.isLoading); 

  useEffect(() => {
    dispatch(setLoading(true)); 

    const timer = setTimeout(() => {
      dispatch(setLoading(false)); 
    }, 1000);

    return () => clearTimeout(timer); 
  }, [dispatch]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <Header />
      <Home2 />
      <Home3 />
      <Home4 />
      <Home5 />
      <Footer />
    </div>
  );
};

export default Home;
