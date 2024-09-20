import { User } from "../models/user.model.js";

export async function searchPerson(req, res) {
    const { query } = req.params;

    try {
        const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=3367e218&type=movie`);
        const data = await response.json();
        if (!data.Search || data.Search.length === 0) {
            return res.status(404).json({ success: false, message: "No movies found for this actor" });
        }
        
        const movieTitles = data.Search.map(movie => movie.Title);
        await User.findByIdAndUpdate(req.user._id, {
            $push: {
                searchHistory: {
                    id: data.Search[0].imdbID, 
                    image: data.Search[0].Poster, 
                    title: data.Search[0].Title, 
                    searchType: "actor",
                    createdAt: new Date(),
                },
            },
        });
        res.status(200).json({ success: true, content:data});
    } catch (error) {
        console.log("Error in searchPerson controller:", error.message);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
export async function searchMovie(req,res) {
    const {query}=req.params;
    console.log(query);
    console.log("seaarch controller")
    const firstLetter= query.charAt(0).toUpperCase();
    console.log("Query first letter:", firstLetter);
    try{
        const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=3367e218`);
        const data = await response.json();
        if (!data.Search || data.Search.length === 0) {
            return res.status(404).json({ success: false, message: "No movies found" });
        }
        const filteredMovies = data.Search.filter(item => item.Type === 'movie');

        if (filteredMovies.length === 0) {
            return res.status(404).json({ success: false, message: "No movies found for this query" });
        }
        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory: {
                    id:filteredMovies[0].imdbID, 
                    image: filteredMovies[0].Poster, 
                    title: filteredMovies[0].Title, 
                    searchType: "movie",
                    createdAt: new Date(),
                },
            },
        });
        res.status(200).json({success:true,content:filteredMovies });
    }catch(error){
        console.log("Error in searchMovie controller:",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
export async function searchTv(req,res) {
    const {query}=req.params;
    try{
        const response = await fetch(`http://www.omdbapi.com/?s=${query}&apikey=3367e218`);
        const data = await response.json();
        if (!data.Search || data.Search.length === 0) {
            return res.status(404).json({ success: false, message: "No Tv series found" });
        }
        const filteredMovies = data.Search.filter(item => item.Type === 'series');

        if (filteredMovies.length === 0) {
            return res.status(404).json({ success: false, message: "No Tv series found for this query" });
        }
        await User.findByIdAndUpdate(req.user._id,{
            $push:{
                searchHistory: {
                    id:filteredMovies[0].imdbID, 
                    image: filteredMovies[0].Poster, 
                    title: filteredMovies[0].Title, 
                    searchType: "series",
                    createdAt: new Date(),
                },
            },
        });
        res.status(200).json({success:true,content:filteredMovies });
    }catch(error){
        console.log("Error in searchTv controller:",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
export async function getSearchHistory(req,res) {
    try{
        res.status(200).json({success:true,content: req.user.searchHistory});
    }catch(error){
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
export async function removeItemFromSearchHistory(req,res) {
    const{id}=req.params;
    try{
        await User.findByIdAndUpdate(req.user._id,{
            $pull:{
                searchHistory:{id:id},
            },
        });
        res.status(200).json({success:true,message:"Item removed from search history"});
    }catch(error){
        console.log("error in removeItemFromSearchHistory controller",error.message);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}