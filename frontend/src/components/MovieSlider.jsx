import { useEffect, useState } from "react";
import { useContentStore } from "../store/content"
import axios from "axios";
import { Link } from "react-router-dom";

const MovieSlider = ({category}) => {
  
  const {contentType}=useContentStore();
  const[content,setContent]=useState([])
  const formattedCategoryName =category.replaceAll("_", " ")[0].toUpperCase() + category.replaceAll("_", " ").slice(1);
  const formattedContentType=contentType==="movie" ? "Movies" : "TV Shows";

  
  useEffect(()=>{
    const getContent= async() =>{
      const res=await axios.get(`/api/v1/search/${contentType}/${category}`)
      setContent(res.data.content) 
    }
    getContent()
  },[contentType,category]);
  return (
  <div className=" bg-black text-white relative px-5 md:px-20">
    <h2 className="mb-4 text-2xl font-bold">
      {formattedCategoryName} {formattedContentType}
    </h2>
    <div className="flex space-x-4 overflow-x-scroll">
      {content.map((item)=>(
       <Link to={`/watch/${item.id}`} className='min-w-[250px] relative group' key={item.id}>
              <div className="rounded-lg overflow-hidden">
                  <img src={item.Poster} alt="MOVIE IMAGE" className="transition-transform duration-300 ease-in-out group-hover:scale-125" />
              </div>
        </Link>
      ))}
       

    </div>
  </div>
);
};

export default MovieSlider