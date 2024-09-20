import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useContentStore } from "../store/content";
import axios from "axios";
import Navbar from "../components/Navbar";

const WatchPage = () => {
  const { id } = useParams();
  
  const [trailerUrl, setTrailerUrl] = useState(''); 
  const [loading, setLoading] = useState(true);
  const { contentType } = useContentStore();

  useEffect(() => {
    const getTrailer = async () => {
      try {
        const res = await axios.get(`/api/v1/${contentType}/${id}/trailers`);
        
        if (res.data && res.data.trailerUrl) {
          setTrailerUrl(res.data.trailerUrl);  
        } else {
          setTrailerUrl(''); 
        }

        setLoading(false); 
      } catch (error) {
        console.error("Error fetching trailer:", error.message);
        setTrailerUrl('');  
        setLoading(false);
      }
    };

    getTrailer(); 
  }, [contentType, id]);

  console.log("Trailer URL:", trailerUrl);

  return (
    <div className="bg-black min-h-screen flex flex-col text-white">
    
      <Navbar />

     
      <div className="flex-1 relative">
        <h1 style={{ display: 'none' }}>Watch Page</h1>
        {!loading && trailerUrl ? (
          <iframe 
            width="100%" 
            height="100%" 
            src={trailerUrl.replace("watch?v=", "embed/")} 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        ) : (
          <p className="text-center mt-4">{loading ? 'Loading trailer...' : 'No trailer available.'}</p>
        )}
      </div>
    </div>
  );
}

export default WatchPage;
